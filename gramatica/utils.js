//var extend = require('util')._extend;
var _ = require("underscore");
var EPSILON = "&";

function isProduction(symbol) {
    return /[A-Z]\'?/.test(symbol);
}

function isTerm(symbol) {
    return /[a-z]/.test(symbol);
}

function isEpsilon(symbol) {
    return (symbolsStr===EPISILON);
}



function hasLeftRecursion(symbols, production) {
    var rg = new RegExp("^" + production + "\\w");
    return !!symbols.find( s => s.match(rg));
}

/*
function replaceRecursion(symbols) {
    var newProduction = "", newSymbols = "";
    replaced = symbols.replace(/^([A-Z]\'?)(.+)/, function($0, $1, $2) {
        newProduction = $1 + "\'";
        newSymbols = $2 + newProduction;
        return newProduction;
    });
    return {production: newProduction, newSymbols: newSymbols, replacement: replaced};
}
*/
function replaceRecursion(symbols, production, newProductions) {
    var newProduction = production + "'";

    newProductions[newProduction] = newProductions[newProduction] || [];

    var newSymbols = symbols.map(function(symbol) {
        if(symbol.search("^" + production) >= 0) {
            var rg = new RegExp("^" + production + "(.+)");
            var newSymbol = symbol.replace(rg, function($0, $1) {
                return $1 + newProduction;
            });
            newProductions[newProduction].push(newSymbol);

            return "";
        } else {
            return symbol + newProduction;
        }
    }).filter(s => s!=="");

    newProductions[newProduction] = addEpsilon(newProductions[newProduction]);
    return newSymbols;
}

function addEpsilon(symbols) {
    symbolsWithEpsilon = symbols.filter(e => e !== EPSILON && e !== "");
    symbolsWithEpsilon.push(EPSILON);
    return symbolsWithEpsilon;
}

function removeRecursionOnSymbols(newProductions) {
    return function (symbols, production, grammar) {
        if(production === "_startSymbol") {
            return symbols;
        }

        if(hasLeftRecursion(symbols, production)) {
            grammar[production] = replaceRecursion(symbols, production, newProductions);
        }

        /*
        symbols = symbols.map(function(symbol) {
            if(hasLeftRecursion(symbol, production)) {

                removedRecursion = replaceRecursion(symbol);
                newProductions[removedRecursion.production] = newProductions[removedRecursion.production] || [];

                newProductions[removedRecursion.production].push(removedRecursion.newSymbols);
                newProductions[removedRecursion.production] = addEpsilon(newProductions[removedRecursion.production]);

                symbol = removedRecursion.replacement;
            }
            return symbol;
        });
        */
    }
}

exports.printGrammar = function(grammar) {
    return _.map(grammar, function(symbols, production) {
        if(production === "_startSymbol") return "";
        return production + ": " + symbols.join(" | ");
    }).filter(s => s !== "").join("\n");
}


exports.removeLeftRecursion = function(grammar) {
    var newProductions = {};
    return _.extend({}, _.each(grammar, removeRecursionOnSymbols(newProductions)), newProductions);
}
