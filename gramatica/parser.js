


function getMainExpression(line) {
    var re = /^(.*?)\s?\-\>/;
    return re.exec(line)[1].trim();
}

function getSymbolsStr(line) {
    return line.split("->")[1].split("|").map(el => el.trim());
}

function readLine(line) {
    if(line.trim().length === 0) {
        return null;
    }
    return {
        symbol: getMainExpression(line),
        elements: getSymbolsStr(line)
    };
}

function removeNull(el) {
    return el !== null && el !== undefined;
}

function flatten(array) {
    return Array.prototype.concat.apply([], array);
}

exports.call = function call(str) {
    var parsedGrammar = {};
    var symbolsAndElements = str.split("\n").map(readLine).filter(removeNull);

    symbolsAndElements.forEach(function(line) {
        parsedGrammar[line.symbol] = parsedGrammar[line.symbol] || [];
        parsedGrammar[line.symbol].push(line.elements)
        parsedGrammar[line.symbol] = flatten(parsedGrammar[line.symbol]);
    });

    parsedGrammar._startSymbol = symbolsAndElements[0].symbol;

    return parsedGrammar;
}
