import {File, Identifier, SourceLocation} from "@babel/types";
import {parse} from "@babel/parser";
import {transformFromAstSync} from "@babel/core";
import traverse, {NodePath} from "@babel/traverse";

const str = "function f() { return {x: 1, y: 2}; }; const {x,y} = f();";

const originalAst: File = parse(str, {
        allowImportExportEverywhere: true,
        allowAwaitOutsideFunction: true,
        allowReturnOutsideFunction: true,
        allowSuperOutsideMethod: true,
        allowUndeclaredExports: true,
        errorRecovery: true,
        attachComment: false,
        createParenthesizedExpressions: true,
    }
);

 

const res = transformFromAstSync(originalAst, str, {
    plugins: [
        ["@babel/plugin-transform-destructuring", {useBuiltIns: true, loose: true}],
    ],
    configFile: false,
    ast: true,
    code: true
});

if (!res)
    throw "Babel transformation failed";


console.log(`BEGIN TRANSFORMED ==================`);
console.log(res.code);
console.log(`END TRANSFORMED ==================`);

traverse(res.ast!, {
    Identifier(path: NodePath<Identifier>) {
        const b = path.scope.getBinding(path.node.name);

        console.log(`${sourceLocationToString(path.node.loc)}: ${path.node.name} ==> ${b ? sourceLocationToString(b.identifier.loc) : "no binding"}`);
    }
});

 

function sourceLocationToString(loc: SourceLocation | undefined | null) {
    return loc ? `${loc.start.line}:${loc.start.column + 1}` : "?";
}

 
