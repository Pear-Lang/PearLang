// main.js

const fs = require('fs');
const path = require('path');
const { Lexer } = require('./lexer.js');
const { Parser } = require('./parser.js');
const { Interpreter } = require('./interpreter.js');

(async () => {
    const inputFile = process.argv[2];
    if (!inputFile) {
        console.error('Usage: pear <filename>');
        process.exit(1);
    }

    const validExtensions = ['.p', '.pear'];
    if (!validExtensions.includes(path.extname(inputFile))) {
        console.error('Error: Input file must have a .p or .pear extension.');
        process.exit(1);
    }

    const code = fs.readFileSync(inputFile, 'utf8');

    const lexer = new Lexer(code);
    let tokens = [];
    let token;

    do {
        token = lexer.getNextToken();
        tokens.push(token);
    } while (token.type !== 'EOF');

    const parser = new Parser(tokens);
    const ast = parser.parse();

    const interpreter = new Interpreter();
    await interpreter.visit(ast);
})();
