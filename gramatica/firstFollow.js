var _ = require("underscore");

function getFirst(grammar, production) {
    if(production.match(/([a-z]|&)/)) {
        return production;
    }
    symbols = grammar[production];

    if(!symbols) {
        return "&";
    }

    return _.uniq(_.flatten(symbols.map(function(symbol) {
        //return getFirst(grammar, symbol.substr(0, 1));
        var first, charPosition=0;
        do {
            first = getFirst(grammar, symbol.substr(charPosition, charPosition+1));
            charPosition++;
        } while(JSON.stringify(first) === JSON.stringify(["&"]) && charPosition < symbol.length);
        return first;
    })));
}


function firstHash(grammar) {
    var hash = {};
    _.each(grammar, function(symbols, production) {
        if(production === "_startSymbol") return;
        hash[production] = getFirst(grammar, production);
    });

    return hash;
}

exports.firstHash = firstHash;

exports.firstFollowHash = function(grammar) {
    return {first: firstHash(grammar)};
};
