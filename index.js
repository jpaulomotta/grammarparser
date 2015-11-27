
var parser = require("./gramatica/parser");
var utils = require("./gramatica/utils");
var ff = require("./gramatica/firstFollow");

var gramatica1 = "S -> A | B\n" +
"A-> Aa | B\n" +
"B -> b\n" +
"C -> Dc\n" +
"D -> &";

parsedGrammar = parser.call(gramatica1);

console.log("Gramatica parseada, sem alterações:");
console.log(utils.printGrammar(parsedGrammar));
console.log("\n\n================\nRecursoes removidas:");
parsedGrammar = utils.removeLeftRecursion(parsedGrammar);
console.log(utils.printGrammar(parsedGrammar));

console.log(ff.firstFollowHash(parsedGrammar));



