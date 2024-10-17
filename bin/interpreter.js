// interpreter.js

const fs = require('fs');
const path = require('path');
const axios = require('axios');

class Environment {
    constructor(parent = null) {
        this.vars = {};
        this.consts = {};
        this.functions = {};
        this.classes = {};
        this.parent = parent;
    }

    get(name) {
        if (name in this.vars) {
            return this.vars[name];
        } else if (name in this.consts) {
            return this.consts[name];
        } else if (name in this.functions) {
            return this.functions[name];
        } else if (name in this.classes) {
            return this.classes[name];
        } else if (this.parent) {
            return this.parent.get(name);
        } else {
            this.error(`Undefined variable: ${name}`);
        }
    }

    set(name, value) {
        if (name in this.vars) {
            this.vars[name] = value;
        } else if (name in this.consts) {
            this.error(`Cannot reassign to constant variable: ${name}`);
        } else if (this.parent) {
            this.parent.set(name, value);
        } else {
            this.error(`Undefined variable: ${name}`);
        }
    }

    declare(name, value, kind, line, column) {
        if (name in this.vars || name in this.consts || name in this.functions || name in this.classes) {
            this.error(`Variable already declared: ${name}`, line, column);
        }
        if (kind === 'const') {
            this.consts[name] = value;
        } else if (kind === 'function') {
            this.functions[name] = value;
        } else if (kind === 'class') {
            this.classes[name] = value;
        } else {
            this.vars[name] = value;
        }
    }

    error(message, line = null, column = null) {
        if (line !== null && column !== null) {
            console.error(`Runtime Error at line ${line}, column ${column}: ${message}`);
        } else {
            console.error(`Runtime Error: ${message}`);
        }
        process.exit(1);
    }
}

class Interpreter {
    constructor() {
        this.globalEnv = new Environment();
        this.setupBuiltIns();
    }

    setupBuiltIns() {
        this.globalEnv.declare('print', (arg) => {
            console.log(arg);
        }, 'function');

        this.globalEnv.declare('readFile', (filename, line, column) => {
            try {
                const resolvedPath = path.resolve(filename);
                return fs.readFileSync(resolvedPath, 'utf8');
            } catch (e) {
                this.globalEnv.error(`readFile Error: ${e.message}`, line, column);
            }
        }, 'function');

        this.globalEnv.declare('writeFile', (filename, data, line, column) => {
            try {
                // Ensure data is a string
                if (typeof data !== 'string') {
                    data = String(data);
                }
                const resolvedPath = path.resolve(filename);
                fs.writeFileSync(resolvedPath, data);
                console.log(`writeFile: Successfully wrote to ${resolvedPath}`);
                return `File ${resolvedPath} written successfully.`;
            } catch (e) {
                this.globalEnv.error(`writeFile Error: ${e.message}`, line, column);
            }
        }, 'function');

        this.globalEnv.declare('appendFile', (filename, data, line, column) => {
            try {
                // Ensure data is a string
                if (typeof data !== 'string') {
                    data = String(data);
                }
                const resolvedPath = path.resolve(filename);
                fs.appendFileSync(resolvedPath, data);
                console.log(`appendFile: Successfully appended to ${resolvedPath}`);
                return `Data appended to ${resolvedPath} successfully.`;
            } catch (e) {
                this.globalEnv.error(`appendFile Error: ${e.message}`, line, column);
            }
        }, 'function');

        this.globalEnv.declare('deleteFile', (filename, line, column) => {
            try {
                const resolvedPath = path.resolve(filename);
                fs.unlinkSync(resolvedPath);
                console.log(`deleteFile: Successfully deleted ${resolvedPath}`);
                return `File ${resolvedPath} deleted successfully.`;
            } catch (e) {
                this.globalEnv.error(`deleteFile Error: ${e.message}`, line, column);
            }
        }, 'function');

        this.globalEnv.declare('createDirectory', (dirname, line, column) => {
            try {
                const resolvedPath = path.resolve(dirname);
                fs.mkdirSync(resolvedPath, { recursive: true });
                console.log(`createDirectory: Successfully created directory ${resolvedPath}`);
                return `Directory ${resolvedPath} created successfully.`;
            } catch (e) {
                this.globalEnv.error(`createDirectory Error: ${e.message}`, line, column);
            }
        }, 'function');    
        
        this.globalEnv.declare('editFile', (filename, data, line, column) => {
            try {
                // Ensure data is a string
                if (typeof data !== 'string') {
                    data = String(data);
                }
                const resolvedPath = path.resolve(filename);
                fs.writeFileSync(resolvedPath, data);
                console.log(`editFile: Successfully wrote to ${resolvedPath}`);
                return `File ${resolvedPath} overwritten successfully.`;
            } catch (e) {
                this.globalEnv.error(`editFile Error: ${e.message}`, line, column);
            }
        }, 'function');

        this.globalEnv.declare('moveFile', (source, destination, line, column) => {
            try {
                const resolvedSource = path.resolve(source);
                const resolvedDestination = path.resolve(destination);
                fs.renameSync(resolvedSource, resolvedDestination);
                console.log(`moveFile: Successfully moved ${resolvedSource} to ${resolvedDestination}`);
                return `File moved from ${resolvedSource} to ${resolvedDestination} successfully.`;
            } catch (e) {
                this.globalEnv.error(`moveFile Error: ${e.message}`, line, column);
            }
        }, 'function');

        this.globalEnv.declare('fetch', (url, line, column) => {
            try {
                // Simulated synchronous fetch
                // Note: Real HTTP requests are asynchronous
                print("Fetching data from: " + url);
                let data = "Sample data fetched from " + url;
                print("Data fetched successfully.");
                return data;
            } catch (e) {
                this.globalEnv.error(`fetch Error: ${e.message}`, line, column);
            }
        }, 'function');
    }

    error(message, node = null) {
        if (node && node.line !== undefined && node.column !== undefined) {
            console.error(`Interpreter Error at line ${node.line}, column ${node.column}: ${message}`);
        } else {
            console.error(`Interpreter Error: ${message}`);
        }
        process.exit(1);
    }

    async visit(node, env = this.globalEnv) {
        switch (node.type) {
            case 'Program':
                return await this.visitProgram(node, env);
            case 'VariableDeclaration':
                return await this.visitVariableDeclaration(node, env);
            case 'FunctionDeclaration':
                return await this.visitFunctionDeclaration(node, env);
            case 'ReturnStatement':
                return await this.visitReturnStatement(node, env);
            case 'Identifier':
                return await this.visitIdentifier(node, env);
            case 'Literal':
                return await this.visitLiteral(node, env);
            case 'BinaryExpression':
                return await this.visitBinaryExpression(node, env);
            case 'AssignmentExpression':
                return await this.visitAssignmentExpression(node, env);
            case 'PrintStatement':
                return await this.visitPrintStatement(node, env);
            case 'IfStatement':
                return await this.visitIfStatement(node, env);
            case 'WhileStatement':
                return await this.visitWhileStatement(node, env);
            case 'DoWhileStatement':
                return await this.visitDoWhileStatement(node, env);
            case 'ForStatement':
                return await this.visitForStatement(node, env);
            case 'CallExpression':
                return await this.visitCallExpression(node, env);
            case 'MemberExpression':
                return await this.visitMemberExpression(node, env);
            case 'ArrayExpression':
                return await this.visitArrayExpression(node, env);
            case 'ObjectExpression':
                return await this.visitObjectExpression(node, env);
            case 'Property':
                return await this.visitProperty(node, env);
            case 'TryStatement':
                return await this.visitTryStatement(node, env);
            case 'ThrowStatement':
                return await this.visitThrowStatement(node, env);
            case 'ClassDeclaration':
                return await this.visitClassDeclaration(node, env);
            case 'NewExpression':
                return await this.visitNewExpression(node, env);
            case 'ImportDeclaration':
                return await this.visitImportDeclaration(node, env);
            case 'ExportDeclaration':
                return await this.visitExportDeclaration(node, env);
            case 'UnaryExpression':
                return await this.visitUnaryExpression(node, env);
            default:
                this.error(`Unknown node type: ${node.type}`, node);
        }
    }

    async visitProgram(node, env) {
        let result;
        for (const stmt of node.body) {
            result = await this.visit(stmt, env);
        }
        return result;
    }

    async visitVariableDeclaration(node, env) {
        const varName = node.id.name;
        const value = node.init ? await this.visit(node.init, env) : undefined;
        env.declare(varName, value, node.kind, node.id.line, node.id.column);
    }

    async visitFunctionDeclaration(node, env) {
        const func = async (...args) => {
            const localEnv = new Environment(env);
            for (let i = 0; i < node.params.length; i++) {
                localEnv.declare(node.params[i].name, args[i], 'define', node.params[i].line, node.params[i].column);
            }
            let result;
            for (const stmt of node.body) {
                result = await this.visit(stmt, localEnv);
                if (stmt.type === 'ReturnStatement') {
                    return result;
                }
            }
            return result;
        };
        env.declare(node.id.name, func, 'function', node.id.line, node.id.column);
    }

    async visitReturnStatement(node, env) {
        return await this.visit(node.argument, env);
    }

    async visitIdentifier(node, env) {
        return env.get(node.name);
    }

    async visitLiteral(node, env) {
        return node.value;
    }

    async visitBinaryExpression(node, env) {
        const left = await this.visit(node.left, env);
        const right = await this.visit(node.right, env);
        switch (node.operator) {
            case '+':
                return left + right;
            case '-':
                return left - right;
            case '*':
                return left * right;
            case '/':
                return left / right;
            case '%':
                return left % right;
            case '==':
                return left === right;
            case '!=':
                return left !== right;
            case '>':
                return left > right;
            case '<':
                return left < right;
            case '>=':
                return left >= right;
            case '<=':
                return left <= right;
            case '&&':
                return left && right;
            case '||':
                return left || right;
            default:
                this.error(`Unsupported operator: ${node.operator}`, node);
        }
    }

    async visitAssignmentExpression(node, env) {
        let varName;
        if (node.left.type === 'Identifier') {
            varName = node.left.name;
            const value = await this.visit(node.right, env);
            env.set(varName, value);
            return value;
        } else if (node.left.type === 'MemberExpression') {
            const obj = await this.visit(node.left.object, env);
            const prop = node.left.computed ? await this.visit(node.left.property, env) : node.left.property.name;
            const value = await this.visit(node.right, env);
            if (obj && typeof obj === 'object') {
                obj[prop] = value;
                return value;
            } else {
                this.error(`Cannot set property '${prop}' on non-object`, node);
            }
        } else {
            this.error('Left-hand side of assignment must be a variable or property', node);
        }
    }

    async visitPrintStatement(node, env) {
        const value = await this.visit(node.argument, env);
        console.log(value);
    }

    async visitIfStatement(node, env) {
        const test = await this.visit(node.test, env);
        if (test) {
            for (const stmt of node.consequent) {
                await this.visit(stmt, env);
            }
        } else if (node.alternate) {
            for (const stmt of node.alternate) {
                await this.visit(stmt, env);
            }
        }
    }

    async visitWhileStatement(node, env) {
        while (await this.visit(node.test, env)) {
            for (const stmt of node.body) {
                await this.visit(stmt, env);
            }
        }
    }

    async visitDoWhileStatement(node, env) {
        do {
            for (const stmt of node.body) {
                await this.visit(stmt, env);
            }
        } while (await this.visit(node.test, env));
    }

    async visitForStatement(node, env) {
        if (node.init) {
            await this.visit(node.init, env);
        }
        while (node.test ? await this.visit(node.test, env) : true) {
            for (const stmt of node.body) {
                await this.visit(stmt, env);
            }
            if (node.update) {
                await this.visit(node.update, env);
            }
        }
    }

    async visitCallExpression(node, env) {
        const func = await this.visit(node.callee, env);
        const args = [];
        for (const arg of node.arguments) {
            args.push(await this.visit(arg, env));
        }
        if (typeof func !== 'function') {
            this.error(`'${node.callee.name}' is not a function`, node);
        }
        
        // Check if the function is a built-in function by examining its length
        // (assuming built-in functions do not expect line and column)
        if (func.length === args.length) {
            // Built-in function: pass only the arguments
            return await func(...args);
        } else {
            // User-defined function: pass line and column for error reporting
            return await func(...args, node.line, node.column);
        }
    }  

    async visitMemberExpression(node, env) {
        const object = await this.visit(node.object, env);
        const property = node.computed ? await this.visit(node.property, env) : node.property.name;
        if (object && property in object) {
            return object[property];
        } else {
            this.error(`Property '${property}' does not exist on the object`, node);
        }
    }

    async visitArrayExpression(node, env) {
        const elements = [];
        for (const elem of node.elements) {
            elements.push(await this.visit(elem, env));
        }
        return elements;
    }

    async visitObjectExpression(node, env) {
        const obj = {};
        for (const prop of node.properties) {
            const key = prop.key.name;
            const value = await this.visit(prop.value, env);
            obj[key] = value;
        }
        return obj;
    }

    async visitProperty(node, env) {
        const key = node.key.name;
        const value = await this.visit(node.value, env);
        return { key, value };
    }

    async visitTryStatement(node, env) {
        try {
            for (const stmt of node.block) {
                await this.visit(stmt, env);
            }
        } catch (e) {
            if (node.handler) {
                const localEnv = new Environment(env);
                localEnv.declare(node.handler.param.name, e, 'define', node.handler.param.line, node.handler.param.column);
                for (const stmt of node.handler.body) {
                    await this.visit(stmt, localEnv);
                }
            } else {
                this.error(`Unhandled exception: ${e}`, node);
            }
        } finally {
            if (node.finalizer) {
                for (const stmt of node.finalizer) {
                    await this.visit(stmt, env);
                }
            }
        }
    }

    async visitThrowStatement(node, env) {
        const argument = await this.visit(node.argument, env);
        throw argument;
    }

    async visitClassDeclaration(node, env) {
        const cls = class {
            constructor(...args) {
                const localEnv = new Environment(env);
                localEnv.declare('this', this, 'define', node.line, node.column);
                if (this.constructorMethod) {
                    this.constructorMethod(...args);
                }
            }
        };

        for (const method of node.body) {
            if (method.id.name === 'constructor') {
                cls.prototype.constructorMethod = (...args) => {
                    const methodEnv = new Environment(env);
                    methodEnv.declare('this', this, 'define', method.line, method.column);
                    for (let i = 0; i < method.params.length; i++) {
                        methodEnv.declare(method.params[i].name, args[i], 'define', method.params[i].line, method.params[i].column);
                    }
                    for (const stmt of method.body) {
                        this.visit(stmt, methodEnv);
                    }
                };
            } else {
                cls.prototype[method.id.name] = async (...args) => {
                    const methodEnv = new Environment(env);
                    methodEnv.declare('this', this, 'define', method.line, method.column);
                    for (let i = 0; i < method.params.length; i++) {
                        methodEnv.declare(method.params[i].name, args[i], 'define', method.params[i].line, method.params[i].column);
                    }
                    for (const stmt of method.body) {
                        await this.visit(stmt, methodEnv);
                    }
                };
            }
        }

        env.declare(node.id.name, cls, 'class', node.id.line, node.id.column);
    }

    async visitNewExpression(node, env) {
        const cls = await this.visit(node.callee, env);
        const args = [];
        for (const arg of node.arguments) {
            args.push(await this.visit(arg, env));
        }
        return new cls(...args);
    }

    async visitImportDeclaration(node, env) {
        const source = node.source.value;
        const modulePath = path.resolve(path.dirname(process.argv[2]), source);
        if (!fs.existsSync(modulePath)) {
            this.error(`Module not found: ${source}`, node);
        }
        const code = fs.readFileSync(modulePath, 'utf8');
        const Lexer = require('./lexer').Lexer;
        const Parser = require('./parser').Parser;
        const lexer = new Lexer(code);
        let tokens = [];
        let token;
        do {
            token = lexer.getNextToken();
            tokens.push(token);
        } while (token.type !== 'EOF');
        const parser = new Parser(tokens);
        const ast = parser.parse();
        const moduleInterpreter = new Interpreter();
        await moduleInterpreter.visit(ast);
        for (const specifier of node.specifiers) {
            const value = moduleInterpreter.globalEnv.get(specifier.name);
            env.declare(specifier.name, value, 'define', node.line, node.column);
        }
    }

    async visitExportDeclaration(node, env) {
        if (node.declaration.type === 'FunctionDeclaration') {
            await this.visitFunctionDeclaration(node.declaration, env);
            // Exported functions are already declared in the environment
        } else if (node.declaration.type === 'ClassDeclaration') {
            await this.visitClassDeclaration(node.declaration, env);
            // Exported classes are already declared in the environment
        } else {
            this.error('Unsupported export declaration', node);
        }
    }

    async visitUnaryExpression(node, env) {
        const argument = await this.visit(node.argument, env);
        switch (node.operator) {
            case '+':
                return +argument;
            case '-':
                return -argument;
            case '!':
                return !argument;
            default:
                this.error(`Unsupported unary operator: ${node.operator}`, node);
        }
    }
}

module.exports = {
    Interpreter,
    Environment,
};
