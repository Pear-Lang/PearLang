// lexer.js

// Token types
const TokenType = {
    Keyword: 'Keyword',
    Identifier: 'Identifier',
    Number: 'Number',
    String: 'String',
    Operator: 'Operator',
    Punctuation: 'Punctuation',
    EOF: 'EOF',
};

// Keywords in the updated language
const Keywords = [
    'let', 'define', 'const', 'num', 'str', 'bool', 'obj',
    'function', 'return', 'if', 'else',
    'do', 'while', 'for', 'print', 'true', 'false',
    'try', 'catch', 'finally', 'throw', 'class',
    'import', 'from', 'as', 'new',
    'export',
];

// Operators
const Operators = [
    '+', '-', '*', '/', '%', '++', '--',
    '==', '!=', '>', '<', '>=', '<=',
    '=', '&&', '||', '!', '.', '=>',
];

// Punctuation
const Punctuation = [
    '(', ')', '{', '}', ';', ',', '.', '[', ']', ':',
];

// Token class
class Token {
    constructor(type, value, line, column) {
        this.type = type;
        this.value = value;
        this.line = line;
        this.column = column;
    }
}

// Lexer class
class Lexer {
    constructor(input) {
        this.input = input;
        this.pos = 0;
        this.currentChar = this.input[this.pos];
        this.line = 1;
        this.column = 1;
    }

    advance() {
        if (this.currentChar === '\n') {
            this.line++;
            this.column = 0;
        }
        this.pos++;
        this.currentChar = this.pos < this.input.length ? this.input[this.pos] : null;
        this.column++;
    }

    skipWhitespace() {
        while (this.currentChar && /\s/.test(this.currentChar)) {
            this.advance();
        }
    }

    skipComment() {
        if (this.currentChar === '#') {
            if (this.peek() === '#' && this.peek(2) === '#') {
                this.advance(); this.advance(); this.advance();
                while (this.currentChar && !(this.currentChar === '#' && this.peek() === '#' && this.peek(2) === '#')) {
                    this.advance();
                }
                this.advance(); this.advance(); this.advance();
            } else {
                while (this.currentChar && this.currentChar !== '\n') {
                    this.advance();
                }
            }
        }
    }

    peek(ahead = 1) {
        return this.pos + ahead < this.input.length ? this.input[this.pos + ahead] : null;
    }

    getNextToken() {
        while (this.currentChar) {
            if (/\s/.test(this.currentChar)) {
                this.skipWhitespace();
                continue;
            }

            if (this.currentChar === '#') {
                this.skipComment();
                continue;
            }

            if (/\d/.test(this.currentChar)) {
                return this.number();
            }

            if (this.currentChar === '"' || this.currentChar === "'") {
                return this.string();
            }

            if (['=', '!', '>', '<', '&', '|', '+', '-'].includes(this.currentChar)) {
                let op = this.currentChar;
                const nextChar = this.peek();
                if (['=', '&', '|', '+', '-'].includes(nextChar)) {
                    op += nextChar;
                    this.advance();
                }
                const token = new Token(TokenType.Operator, op, this.line, this.column);
                this.advance();
                if (Operators.includes(op)) {
                    return token;
                } else {
                    this.error(`Unknown operator: ${op}`);
                }
            }

            if (Operators.includes(this.currentChar)) {
                const op = this.currentChar;
                const token = new Token(TokenType.Operator, op, this.line, this.column);
                this.advance();
                return token;
            }

            if (/[a-zA-Z_]/.test(this.currentChar)) {
                return this.identifier();
            }

            if (Punctuation.includes(this.currentChar)) {
                const char = this.currentChar;
                const token = new Token(TokenType.Punctuation, char, this.line, this.column);
                this.advance();
                return token;
            }

            this.error(`Unexpected character: ${this.currentChar}`);
        }

        return new Token(TokenType.EOF, null, this.line, this.column);
    }

    number() {
        let result = '';
        const startLine = this.line;
        const startColumn = this.column;
        while (this.currentChar && /\d/.test(this.currentChar)) {
            result += this.currentChar;
            this.advance();
        }

        if (this.currentChar === '.') {
            result += this.currentChar;
            this.advance();

            while (this.currentChar && /\d/.test(this.currentChar)) {
                result += this.currentChar;
                this.advance();
            }
            return new Token(TokenType.Number, parseFloat(result), startLine, startColumn);
        } else {
            return new Token(TokenType.Number, parseInt(result, 10), startLine, startColumn);
        }
    }

    string() {
        const quoteType = this.currentChar;
        let result = '';
        const startLine = this.line;
        const startColumn = this.column;
        this.advance();

        while (this.currentChar && this.currentChar !== quoteType) {
            if (this.currentChar === '\\') {
                this.advance();
                if (this.currentChar === 'n') {
                    result += '\n';
                } else {
                    result += this.currentChar;
                }
            } else {
                result += this.currentChar;
            }
            this.advance();
        }

        if (this.currentChar !== quoteType) {
            this.error('Unterminated string literal', startLine, startColumn);
        }
        this.advance();

        return new Token(TokenType.String, result, startLine, startColumn);
    }

    identifier() {
        let result = '';
        const startLine = this.line;
        const startColumn = this.column;
        while (this.currentChar && /[a-zA-Z0-9_]/.test(this.currentChar)) {
            result += this.currentChar;
            this.advance();
        }

        if (Keywords.includes(result)) {
            return new Token(TokenType.Keyword, result, startLine, startColumn);
        } else {
            return new Token(TokenType.Identifier, result, startLine, startColumn);
        }
    }

    error(message, line = this.line, column = this.column) {
        console.error(`Lexer Error at line ${line}, column ${column}: ${message}`);
        process.exit(1);
    }
}

// Export the necessary components
module.exports = {
    Lexer,
    TokenType,
    Token,
    Keywords,
    Operators,
    Punctuation,
};
