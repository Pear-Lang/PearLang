// parser.js

const {
    TokenType,
    Keywords,
    Operators,
    Punctuation,
    Token,
} = require('./lexer');

// AST Node classes
class ASTNode {
    constructor(type) {
        this.type = type;
    }
}

class Program extends ASTNode {
    constructor(body) {
        super('Program');
        this.body = body;
    }
}

class VariableDeclaration extends ASTNode {
    constructor(kind, varType, id, init) {
        super('VariableDeclaration');
        this.kind = kind;
        this.varType = varType;
        this.id = id;
        this.init = init;
    }
}

class FunctionDeclaration extends ASTNode {
    constructor(id, params, body, isAsync = false) {
        super('FunctionDeclaration');
        this.id = id;
        this.params = params;
        this.body = body;
        this.isAsync = isAsync;
    }
}

class ReturnStatement extends ASTNode {
    constructor(argument, line, column) {
        super('ReturnStatement');
        this.argument = argument;
        this.line = line;
        this.column = column;
    }
}

class Identifier extends ASTNode {
    constructor(name, line, column) {
        super('Identifier');
        this.name = name;
        this.line = line;
        this.column = column;
    }
}

class Literal extends ASTNode {
    constructor(value, line, column) {
        super('Literal');
        this.value = value;
        this.line = line;
        this.column = column;
    }
}

class BinaryExpression extends ASTNode {
    constructor(operator, left, right, line, column) {
        super('BinaryExpression');
        this.operator = operator;
        this.left = left;
        this.right = right;
        this.line = line;
        this.column = column;
    }
}

class AssignmentExpression extends ASTNode {
    constructor(operator, left, right, line, column) {
        super('AssignmentExpression');
        this.operator = operator;
        this.left = left;
        this.right = right;
        this.line = line;
        this.column = column;
    }
}

class PrintStatement extends ASTNode {
    constructor(argument, line, column) {
        super('PrintStatement');
        this.argument = argument;
        this.line = line;
        this.column = column;
    }
}

class IfStatement extends ASTNode {
    constructor(test, consequent, alternate, line, column) {
        super('IfStatement');
        this.test = test;
        this.consequent = consequent;
        this.alternate = alternate;
        this.line = line;
        this.column = column;
    }
}

class WhileStatement extends ASTNode {
    constructor(test, body, line, column) {
        super('WhileStatement');
        this.test = test;
        this.body = body;
        this.line = line;
        this.column = column;
    }
}

class DoWhileStatement extends ASTNode {
    constructor(body, test, line, column) {
        super('DoWhileStatement');
        this.body = body;
        this.test = test;
        this.line = line;
        this.column = column;
    }
}

class ForStatement extends ASTNode {
    constructor(init, test, update, body, line, column) {
        super('ForStatement');
        this.init = init;
        this.test = test;
        this.update = update;
        this.body = body;
        this.line = line;
        this.column = column;
    }
}

class CallExpression extends ASTNode {
    constructor(callee, args, line, column) {
        super('CallExpression');
        this.callee = callee;
        this.arguments = args;
        this.line = line;
        this.column = column;
    }
}

class MemberExpression extends ASTNode {
    constructor(object, property, computed, line, column) {
        super('MemberExpression');
        this.object = object;
        this.property = property;
        this.computed = computed;
        this.line = line;
        this.column = column;
    }
}

class ArrayExpression extends ASTNode {
    constructor(elements, line, column) {
        super('ArrayExpression');
        this.elements = elements;
        this.line = line;
        this.column = column;
    }
}

class ObjectExpression extends ASTNode {
    constructor(properties, line, column) {
        super('ObjectExpression');
        this.properties = properties;
        this.line = line;
        this.column = column;
    }
}

class Property extends ASTNode {
    constructor(key, value, line, column) {
        super('Property');
        this.key = key;
        this.value = value;
        this.line = line;
        this.column = column;
    }
}

class TryStatement extends ASTNode {
    constructor(block, handler, finalizer, line, column) {
        super('TryStatement');
        this.block = block;
        this.handler = handler;
        this.finalizer = finalizer;
        this.line = line;
        this.column = column;
    }
}

class CatchClause extends ASTNode {
    constructor(param, body, line, column) {
        super('CatchClause');
        this.param = param;
        this.body = body;
        this.line = line;
        this.column = column;
    }
}

class ThrowStatement extends ASTNode {
    constructor(argument, line, column) {
        super('ThrowStatement');
        this.argument = argument;
        this.line = line;
        this.column = column;
    }
}

class ClassDeclaration extends ASTNode {
    constructor(id, body, line, column) {
        super('ClassDeclaration');
        this.id = id;
        this.body = body;
        this.line = line;
        this.column = column;
    }
}

class NewExpression extends ASTNode {
    constructor(callee, args, line, column) {
        super('NewExpression');
        this.callee = callee;
        this.arguments = args;
        this.line = line;
        this.column = column;
    }
}

class ImportDeclaration extends ASTNode {
    constructor(specifiers, source, line, column) {
        super('ImportDeclaration');
        this.specifiers = specifiers;
        this.source = source;
        this.line = line;
        this.column = column;
    }
}

class ExportDeclaration extends ASTNode {
    constructor(declaration, line, column) {
        super('ExportDeclaration');
        this.declaration = declaration;
        this.line = line;
        this.column = column;
    }
}

class UnaryExpression extends ASTNode {
    constructor(operator, argument, line, column) {
        super('UnaryExpression');
        this.operator = operator;
        this.argument = argument;
        this.line = line;
        this.column = column;
    }
}

// Parser class
class Parser {
    constructor(tokens) {
        this.tokens = tokens;
        this.pos = 0;
        this.currentToken = this.tokens[this.pos];
    }

    eat(type, value = null) {
        if (this.currentToken.type === type && (value === null || this.currentToken.value === value)) {
            this.currentToken = this.tokens[++this.pos];
        } else {
            this.error(`Expected token type ${type} ${value !== null ? 'with value ' + value : ''}, but got ${this.currentToken.type} ${this.currentToken.value}`);
        }
    }

    parse() {
        const statements = [];

        while (this.currentToken.type !== TokenType.EOF) {
            const stmt = this.statement();
            statements.push(stmt);
        }

        return new Program(statements);
    }

    error(message) {
        console.error(`Parser Error at line ${this.currentToken.line}, column ${this.currentToken.column}: ${message}`);
        process.exit(1);
    }

    statement() {
        if (this.currentToken.type === TokenType.Keyword) {
            switch (this.currentToken.value) {
                case 'define':
                case 'const':
                    return this.variableDeclaration();
                case 'async':
                    return this.asyncFunctionDeclaration();
                case 'function':
                    return this.functionDeclaration();
                case 'if':
                    return this.ifStatement();
                case 'do':
                    return this.doWhileStatement();
                case 'while':
                    return this.whileStatement();
                case 'for':
                    return this.forStatement();
                case 'try':
                    return this.tryStatement();
                case 'throw':
                    return this.throwStatement();
                case 'print':
                    return this.printStatement();
                case 'return':
                    return this.returnStatement();
                case 'class':
                    return this.classDeclaration();
                case 'import':
                    return this.importDeclaration();
                case 'export':
                    return this.exportDeclaration();
                default:
                    this.error(`Unexpected keyword: ${this.currentToken.value}`);
            }
        } else {
            return this.expressionStatement();
        }
    }

    // New method to handle async function declarations
    asyncFunctionDeclaration() {
        const isAsync = this.currentToken.value === 'async';
        if (isAsync) {
            this.eat(TokenType.Keyword, 'async');
        }

        if (this.currentToken.type === TokenType.Keyword && this.currentToken.value === 'function') {
            this.eat(TokenType.Keyword, 'function');
        } else {
            this.error(`Expected 'function' keyword after 'async', but got ${this.currentToken.type} ${this.currentToken.value}`);
        }

        let id = null;
        const line = this.currentToken.line;
        const column = this.currentToken.column;
        if (this.currentToken.type === TokenType.Identifier) {
            id = new Identifier(this.currentToken.value, this.currentToken.line, this.currentToken.column);
            this.eat(TokenType.Identifier);
        } else {
            this.error('Expected function name');
        }

        this.eat(TokenType.Punctuation, '(');
        const params = [];
        while (this.currentToken.type !== TokenType.Punctuation || this.currentToken.value !== ')') {
            if (this.currentToken.type === TokenType.Identifier) {
                params.push(new Identifier(this.currentToken.value, this.currentToken.line, this.currentToken.column));
                this.eat(TokenType.Identifier);

                if (this.currentToken.type === TokenType.Punctuation && this.currentToken.value === ',') {
                    this.eat(TokenType.Punctuation);
                } else if (this.currentToken.type === TokenType.Punctuation && this.currentToken.value === ')') {
                    break;
                } else {
                    this.error('Expected comma or closing parenthesis in parameter list');
                }
            } else {
                this.error('Expected parameter name');
            }
        }
        this.eat(TokenType.Punctuation, ')');

        this.eat(TokenType.Punctuation, '{');
        const body = [];
        while (this.currentToken.type !== TokenType.Punctuation || this.currentToken.value !== '}') {
            body.push(this.statement());
        }
        this.eat(TokenType.Punctuation, '}');

        return new FunctionDeclaration(id, params, body, isAsync);
    }

    variableDeclaration(eatSemicolon = true) {
        const kind = this.currentToken.value;
        const line = this.currentToken.line;
        const column = this.currentToken.column;
        this.eat(TokenType.Keyword);

        let varType = null;
        if (this.currentToken.type === TokenType.Keyword && ['num', 'str', 'bool', 'obj'].includes(this.currentToken.value)) {
            varType = this.currentToken.value;
            this.eat(TokenType.Keyword);
        }

        if (this.currentToken.type !== TokenType.Identifier) {
            this.error('Expected identifier');
        }

        const id = new Identifier(this.currentToken.value, this.currentToken.line, this.currentToken.column);
        this.eat(TokenType.Identifier);

        let init = null;
        if (this.currentToken.type === TokenType.Operator && this.currentToken.value === '=') {
            this.eat(TokenType.Operator);
            init = this.expression();
        }
        if (eatSemicolon) {
            this.eat(TokenType.Punctuation, ';');
        }
        return new VariableDeclaration(kind, varType, id, init);
    }

    functionDeclaration() {
        this.eat(TokenType.Keyword, 'function');

        let id = null;
        const line = this.currentToken.line;
        const column = this.currentToken.column;
        if (this.currentToken.type === TokenType.Identifier) {
            id = new Identifier(this.currentToken.value, this.currentToken.line, this.currentToken.column);
            this.eat(TokenType.Identifier);
        } else {
            this.error('Expected function name');
        }

        this.eat(TokenType.Punctuation, '(');
        const params = [];
        while (this.currentToken.type !== TokenType.Punctuation || this.currentToken.value !== ')') {
            if (this.currentToken.type === TokenType.Identifier) {
                params.push(new Identifier(this.currentToken.value, this.currentToken.line, this.currentToken.column));
                this.eat(TokenType.Identifier);

                if (this.currentToken.type === TokenType.Punctuation && this.currentToken.value === ',') {
                    this.eat(TokenType.Punctuation);
                } else if (this.currentToken.type === TokenType.Punctuation && this.currentToken.value === ')') {
                    break;
                } else {
                    this.error('Expected comma or closing parenthesis in parameter list');
                }
            } else {
                this.error('Expected parameter name');
            }
        }
        this.eat(TokenType.Punctuation, ')');

        this.eat(TokenType.Punctuation, '{');
        const body = [];
        while (this.currentToken.type !== TokenType.Punctuation || this.currentToken.value !== '}') {
            body.push(this.statement());
        }
        this.eat(TokenType.Punctuation, '}');

        return new FunctionDeclaration(id, params, body);
    }

    returnStatement() {
        const line = this.currentToken.line;
        const column = this.currentToken.column;
        this.eat(TokenType.Keyword, 'return');
        const argument = this.expression();
        this.eat(TokenType.Punctuation, ';');
        return new ReturnStatement(argument, line, column);
    }

    printStatement() {
        const line = this.currentToken.line;
        const column = this.currentToken.column;
        this.eat(TokenType.Keyword, 'print');
        const argument = this.expression();
        this.eat(TokenType.Punctuation, ';');
        return new PrintStatement(argument, line, column);
    }

    ifStatement() {
        const line = this.currentToken.line;
        const column = this.currentToken.column;
        this.eat(TokenType.Keyword, 'if');
        this.eat(TokenType.Punctuation, '(');
        const test = this.expression();
        this.eat(TokenType.Punctuation, ')');
        this.eat(TokenType.Punctuation, '{');
        const consequent = [];
        while (this.currentToken.type !== TokenType.Punctuation || this.currentToken.value !== '}') {
            consequent.push(this.statement());
        }
        this.eat(TokenType.Punctuation, '}');

        let alternate = null;
        if (this.currentToken.type === TokenType.Keyword && this.currentToken.value === 'else') {
            this.eat(TokenType.Keyword, 'else');
            this.eat(TokenType.Punctuation, '{');
            alternate = [];
            while (this.currentToken.type !== TokenType.Punctuation || this.currentToken.value !== '}') {
                alternate.push(this.statement());
            }
            this.eat(TokenType.Punctuation, '}');
        }

        return new IfStatement(test, consequent, alternate, line, column);
    }

    whileStatement() {
        const line = this.currentToken.line;
        const column = this.currentToken.column;
        this.eat(TokenType.Keyword, 'while');
        this.eat(TokenType.Punctuation, '(');
        const test = this.expression();
        this.eat(TokenType.Punctuation, ')');
        this.eat(TokenType.Punctuation, '{');
        const body = [];
        while (this.currentToken.type !== TokenType.Punctuation || this.currentToken.value !== '}') {
            body.push(this.statement());
        }
        this.eat(TokenType.Punctuation, '}');
        return new WhileStatement(test, body, line, column);
    }

    doWhileStatement() {
        const line = this.currentToken.line;
        const column = this.currentToken.column;
        this.eat(TokenType.Keyword, 'do');
        this.eat(TokenType.Punctuation, '{');
        const body = [];
        while (this.currentToken.type !== TokenType.Punctuation || this.currentToken.value !== '}') {
            body.push(this.statement());
        }
        this.eat(TokenType.Punctuation, '}');

        this.eat(TokenType.Keyword, 'while');
        this.eat(TokenType.Punctuation, '(');
        const test = this.expression();
        this.eat(TokenType.Punctuation, ')');
        this.eat(TokenType.Punctuation, ';');

        return new DoWhileStatement(body, test, line, column);
    }

    forStatement() {
        const line = this.currentToken.line;
        const column = this.currentToken.column;
        this.eat(TokenType.Keyword, 'for');
        this.eat(TokenType.Punctuation, '(');
        
        let init = null;
        if (!(this.currentToken.type === TokenType.Punctuation && this.currentToken.value === ';')) {
            if (this.currentToken.type === TokenType.Keyword && ['define', 'const'].includes(this.currentToken.value)) {
                init = this.variableDeclaration(false); // Do not eat ';'
            } else {
                init = this.expression();
            }
        }
        this.eat(TokenType.Punctuation, ';');

        let test = null;
        if (!(this.currentToken.type === TokenType.Punctuation && this.currentToken.value === ';')) {
            test = this.expression();
        }
        this.eat(TokenType.Punctuation, ';');

        let update = null;
        if (!(this.currentToken.type === TokenType.Punctuation && this.currentToken.value === ')')) {
            update = this.expression();
        }
        this.eat(TokenType.Punctuation, ')');

        this.eat(TokenType.Punctuation, '{');
        const body = [];
        while (this.currentToken.type !== TokenType.Punctuation || this.currentToken.value !== '}') {
            body.push(this.statement());
        }
        this.eat(TokenType.Punctuation, '}');

        return new ForStatement(init, test, update, body, line, column);
    }

    tryStatement() {
        const line = this.currentToken.line;
        const column = this.currentToken.column;
        this.eat(TokenType.Keyword, 'try');
        this.eat(TokenType.Punctuation, '{');
        const block = [];
        while (this.currentToken.type !== TokenType.Punctuation || this.currentToken.value !== '}') {
            block.push(this.statement());
        }
        this.eat(TokenType.Punctuation, '}');

        let handler = null;
        if (this.currentToken.type === TokenType.Keyword && this.currentToken.value === 'catch') {
            this.eat(TokenType.Keyword, 'catch');
            this.eat(TokenType.Punctuation, '(');
            const param = new Identifier(this.currentToken.value, this.currentToken.line, this.currentToken.column);
            this.eat(TokenType.Identifier);
            this.eat(TokenType.Punctuation, ')');
            this.eat(TokenType.Punctuation, '{');
            const body = [];
            while (this.currentToken.type !== TokenType.Punctuation || this.currentToken.value !== '}') {
                body.push(this.statement());
            }
            this.eat(TokenType.Punctuation, '}');
            handler = new CatchClause(param, body, this.currentToken.line, this.currentToken.column);
        }

        let finalizer = null;
        if (this.currentToken.type === TokenType.Keyword && this.currentToken.value === 'finally') {
            this.eat(TokenType.Keyword, 'finally');
            this.eat(TokenType.Punctuation, '{');
            finalizer = [];
            while (this.currentToken.type !== TokenType.Punctuation || this.currentToken.value !== '}') {
                finalizer.push(this.statement());
            }
            this.eat(TokenType.Punctuation, '}');
        }

        return new TryStatement(block, handler, finalizer, line, column);
    }

    throwStatement() {
        const line = this.currentToken.line;
        const column = this.currentToken.column;
        this.eat(TokenType.Keyword, 'throw');
        const argument = this.expression();
        this.eat(TokenType.Punctuation, ';');
        return new ThrowStatement(argument, line, column);
    }

    classDeclaration() {
        const line = this.currentToken.line;
        const column = this.currentToken.column;
        this.eat(TokenType.Keyword, 'class');
        const id = new Identifier(this.currentToken.value, this.currentToken.line, this.currentToken.column);
        this.eat(TokenType.Identifier);
        this.eat(TokenType.Punctuation, '{');
        const body = [];
        while (this.currentToken.type !== TokenType.Punctuation || this.currentToken.value !== '}') {
            body.push(this.functionDeclaration());
        }
        this.eat(TokenType.Punctuation, '}');
        return new ClassDeclaration(id, body, line, column);
    }

    importDeclaration() {
        const line = this.currentToken.line;
        const column = this.currentToken.column;
        this.eat(TokenType.Keyword, 'import');
        const specifiers = [];
        if (this.currentToken.type === TokenType.Identifier) {
            specifiers.push(new Identifier(this.currentToken.value, this.currentToken.line, this.currentToken.column));
            this.eat(TokenType.Identifier);
        } else if (this.currentToken.type === TokenType.Punctuation && this.currentToken.value === '{') {
            this.eat(TokenType.Punctuation, '{');
            while (this.currentToken.type !== TokenType.Punctuation || this.currentToken.value !== '}') {
                specifiers.push(new Identifier(this.currentToken.value, this.currentToken.line, this.currentToken.column));
                this.eat(TokenType.Identifier);
                if (this.currentToken.type === TokenType.Punctuation && this.currentToken.value === ',') {
                    this.eat(TokenType.Punctuation, ',');
                } else if (this.currentToken.type === TokenType.Punctuation && this.currentToken.value === '}') {
                    break;
                } else {
                    this.error('Expected comma or closing brace in import specifiers');
                }
            }
            this.eat(TokenType.Punctuation, '}');
        }

        this.eat(TokenType.Keyword, 'from');
        const source = new Literal(this.currentToken.value, this.currentToken.line, this.currentToken.column);
        this.eat(TokenType.String);
        this.eat(TokenType.Punctuation, ';');
        return new ImportDeclaration(specifiers, source, line, column);
    }

    exportDeclaration() {
        const line = this.currentToken.line;
        const column = this.currentToken.column;
        this.eat(TokenType.Keyword, 'export');
        let declaration = null;
        if (this.currentToken.type === TokenType.Keyword && this.currentToken.value === 'function') {
            declaration = this.functionDeclaration();
        } else if (this.currentToken.type === TokenType.Keyword && this.currentToken.value === 'class') {
            declaration = this.classDeclaration();
        } else {
            this.error('Expected function or class declaration after export');
        }
        return new ExportDeclaration(declaration, line, column);
    }

    expressionStatement() {
        const expr = this.expression();
        this.eat(TokenType.Punctuation, ';');
        return expr;
    }

    expression() {
        return this.assignmentExpression();
    }

    assignmentExpression() {
        let node = this.logicalOrExpression();

        if (this.currentToken.type === TokenType.Operator && this.currentToken.value === '=') {
            const operator = this.currentToken.value;
            const line = this.currentToken.line;
            const column = this.currentToken.column;
            this.eat(TokenType.Operator);
            const right = this.assignmentExpression();
            node = new AssignmentExpression(operator, node, right, line, column);
        }

        return node;
    }

    logicalOrExpression() {
        let node = this.logicalAndExpression();

        while (this.currentToken.type === TokenType.Operator && this.currentToken.value === '||') {
            const operator = this.currentToken.value;
            const line = this.currentToken.line;
            const column = this.currentToken.column;
            this.eat(TokenType.Operator);
            const right = this.logicalAndExpression();
            node = new BinaryExpression(operator, node, right, line, column);
        }

        return node;
    }

    logicalAndExpression() {
        let node = this.equalityExpression();

        while (this.currentToken.type === TokenType.Operator && this.currentToken.value === '&&') {
            const operator = this.currentToken.value;
            const line = this.currentToken.line;
            const column = this.currentToken.column;
            this.eat(TokenType.Operator);
            const right = this.equalityExpression();
            node = new BinaryExpression(operator, node, right, line, column);
        }

        return node;
    }

    equalityExpression() {
        let node = this.relationalExpression();

        while (this.currentToken.type === TokenType.Operator && ['==', '!='].includes(this.currentToken.value)) {
            const operator = this.currentToken.value;
            const line = this.currentToken.line;
            const column = this.currentToken.column;
            this.eat(TokenType.Operator);
            const right = this.relationalExpression();
            node = new BinaryExpression(operator, node, right, line, column);
        }

        return node;
    }

    relationalExpression() {
        let node = this.additiveExpression();

        while (this.currentToken.type === TokenType.Operator && ['>', '<', '>=', '<='].includes(this.currentToken.value)) {
            const operator = this.currentToken.value;
            const line = this.currentToken.line;
            const column = this.currentToken.column;
            this.eat(TokenType.Operator);
            const right = this.additiveExpression();
            node = new BinaryExpression(operator, node, right, line, column);
        }

        return node;
    }

    additiveExpression() {
        let node = this.multiplicativeExpression();

        while (this.currentToken.type === TokenType.Operator && ['+', '-'].includes(this.currentToken.value)) {
            const operator = this.currentToken.value;
            const line = this.currentToken.line;
            const column = this.currentToken.column;
            this.eat(TokenType.Operator);
            const right = this.multiplicativeExpression();
            node = new BinaryExpression(operator, node, right, line, column);
        }

        return node;
    }

    multiplicativeExpression() {
        let node = this.unaryExpression();

        while (this.currentToken.type === TokenType.Operator && ['*', '/', '%'].includes(this.currentToken.value)) {
            const operator = this.currentToken.value;
            const line = this.currentToken.line;
            const column = this.currentToken.column;
            this.eat(TokenType.Operator);
            const right = this.unaryExpression();
            node = new BinaryExpression(operator, node, right, line, column);
        }

        return node;
    }

    unaryExpression() {
        if (this.currentToken.type === TokenType.Operator && ['+', '-', '!'].includes(this.currentToken.value)) {
            const operator = this.currentToken.value;
            const line = this.currentToken.line;
            const column = this.currentToken.column;
            this.eat(TokenType.Operator);
            const argument = this.unaryExpression();
            return new UnaryExpression(operator, argument, line, column);
        } else if (this.currentToken.type === TokenType.Keyword && this.currentToken.value === 'await') {
            const operator = 'await';
            const line = this.currentToken.line;
            const column = this.currentToken.column;
            this.eat(TokenType.Keyword, 'await');
            const argument = this.unaryExpression();
            return new UnaryExpression(operator, argument, line, column);
        } else {
            return this.memberExpression();
        }
    }

    memberExpression() {
        let node = this.primaryExpression();

        while (true) {
            if (this.currentToken.type === TokenType.Operator && this.currentToken.value === '.') {
                const line = this.currentToken.line;
                const column = this.currentToken.column;
                this.eat(TokenType.Operator);
                const property = new Identifier(this.currentToken.value, this.currentToken.line, this.currentToken.column);
                this.eat(TokenType.Identifier);
                node = new MemberExpression(node, property, false, line, column);
            } else if (this.currentToken.type === TokenType.Punctuation && this.currentToken.value === '[') {
                const line = this.currentToken.line;
                const column = this.currentToken.column;
                this.eat(TokenType.Punctuation, '[');
                const property = this.expression();
                this.eat(TokenType.Punctuation, ']');
                node = new MemberExpression(node, property, true, line, column);
            } else {
                break;
            }
        }

        return node;
    }

    primaryExpression() {
        let node;

        if (this.currentToken.type === TokenType.Number) {
            node = new Literal(this.currentToken.value, this.currentToken.line, this.currentToken.column);
            this.eat(TokenType.Number);
        } else if (this.currentToken.type === TokenType.String) {
            node = new Literal(this.currentToken.value, this.currentToken.line, this.currentToken.column);
            this.eat(TokenType.String);
        } else if (this.currentToken.type === TokenType.Keyword && (this.currentToken.value === 'true' || this.currentToken.value === 'false')) {
            node = new Literal(this.currentToken.value === 'true', this.currentToken.line, this.currentToken.column);
            this.eat(TokenType.Keyword);
        } else if (this.currentToken.type === TokenType.Identifier) {
            const id = new Identifier(this.currentToken.value, this.currentToken.line, this.currentToken.column);
            this.eat(TokenType.Identifier);

            if (this.currentToken.type === TokenType.Punctuation && this.currentToken.value === '(') {
                this.eat(TokenType.Punctuation, '(');
                const args = [];
                while (this.currentToken.type !== TokenType.Punctuation || this.currentToken.value !== ')') {
                    args.push(this.expression());
                    if (this.currentToken.type === TokenType.Punctuation && this.currentToken.value === ',') {
                        this.eat(TokenType.Punctuation, ',');
                    } else if (this.currentToken.type === TokenType.Punctuation && this.currentToken.value === ')') {
                        break;
                    } else {
                        this.error('Expected comma or closing parenthesis in argument list');
                    }
                }
                this.eat(TokenType.Punctuation, ')');
                node = new CallExpression(id, args, id.line, id.column);
            } else {
                node = id;
            }
        } else if (this.currentToken.type === TokenType.Keyword && this.currentToken.value === 'new') {
            const line = this.currentToken.line;
            const column = this.currentToken.column;
            this.eat(TokenType.Keyword, 'new');
            const callee = this.primaryExpression();
            this.eat(TokenType.Punctuation, '(');
            const args = [];
            while (this.currentToken.type !== TokenType.Punctuation || this.currentToken.value !== ')') {
                args.push(this.expression());
                if (this.currentToken.type === TokenType.Punctuation && this.currentToken.value === ',') {
                    this.eat(TokenType.Punctuation, ',');
                } else if (this.currentToken.type === TokenType.Punctuation && this.currentToken.value === ')') {
                    break;
                } else {
                    this.error('Expected comma or closing parenthesis in argument list');
                }
            }
            this.eat(TokenType.Punctuation, ')');
            node = new NewExpression(callee, args, line, column);
        } else if (this.currentToken.type === TokenType.Punctuation && this.currentToken.value === '(') {
            this.eat(TokenType.Punctuation, '(');
            node = this.expression();
            if (this.currentToken.type === TokenType.Punctuation && this.currentToken.value === ')') {
                this.eat(TokenType.Punctuation, ')');
            } else {
                this.error('Expected )');
            }
        } else if (this.currentToken.type === TokenType.Punctuation && this.currentToken.value === '[') {
            return this.arrayExpression();
        } else if (this.currentToken.type === TokenType.Punctuation && this.currentToken.value === '{') {
            return this.objectExpression();
        } else {
            this.error(`Unexpected token: ${this.currentToken.type} ${this.currentToken.value}`);
        }

        return node;
    }

    arrayExpression() {
        const line = this.currentToken.line;
        const column = this.currentToken.column;
        this.eat(TokenType.Punctuation, '[');
        const elements = [];
        while (this.currentToken.type !== TokenType.Punctuation || this.currentToken.value !== ']') {
            elements.push(this.expression());
            if (this.currentToken.type === TokenType.Punctuation && this.currentToken.value === ',') {
                this.eat(TokenType.Punctuation, ',');
            } else if (this.currentToken.type === TokenType.Punctuation && this.currentToken.value === ']') {
                break;
            } else {
                this.error('Expected comma or closing bracket in array literal');
            }
        }
        this.eat(TokenType.Punctuation, ']');
        return new ArrayExpression(elements, line, column);
    }

    objectExpression() {
        const line = this.currentToken.line;
        const column = this.currentToken.column;
        this.eat(TokenType.Punctuation, '{');
        const properties = [];
        while (this.currentToken.type !== TokenType.Punctuation || this.currentToken.value !== '}') {
            const keyToken = this.currentToken;
            if (this.currentToken.type === TokenType.Identifier || this.currentToken.type === TokenType.String) {
                this.eat(this.currentToken.type);
            } else {
                this.error('Expected identifier or string as property key');
            }
            this.eat(TokenType.Punctuation, ':');
            const value = this.expression();
            properties.push(new Property(new Identifier(keyToken.value, keyToken.line, keyToken.column), value, keyToken.line, keyToken.column));
            if (this.currentToken.type === TokenType.Punctuation && this.currentToken.value === ',') {
                this.eat(TokenType.Punctuation, ',');
            } else if (this.currentToken.type === TokenType.Punctuation && this.currentToken.value === '}') {
                break;
            } else {
                this.error('Expected comma or closing brace in object literal');
            }
        }
        this.eat(TokenType.Punctuation, '}');
        return new ObjectExpression(properties, line, column);
    }
}

module.exports = {
    Parser,
    ASTNode,
    Program,
    VariableDeclaration,
    FunctionDeclaration,
    ReturnStatement,
    Identifier,
    Literal,
    BinaryExpression,
    AssignmentExpression,
    PrintStatement,
    IfStatement,
    WhileStatement,
    DoWhileStatement,
    ForStatement,
    TryStatement,
    CatchClause,
    ThrowStatement,
    ClassDeclaration,
    NewExpression,
    ImportDeclaration,
    ExportDeclaration,
    CallExpression,
    MemberExpression,
    ArrayExpression,
    ObjectExpression,
    Property,
    UnaryExpression,
};
