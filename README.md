# babel-missing-ast-scope-bindings-repro

Instructions:

1. `npm install`
2. `npx tsc index.ts`
3. `node index.js`

## Sample Output

For the sample input in: https://github.com/peey/babel-missing-ast-scope-bindings-repro/blob/7b47ab172982fd66554499dee2ee5f6a88d60a94/index.ts#L6

The output:

```
BEGIN TRANSFORMED ==================
function f() {
  return {
    x: 1,
    y: 2
  };
}

;

const _f = f(),
      x = _f.x,
      y = _f.y;
END TRANSFORMED ==================
1:10: f ==> 1:10
1:24: x ==> 1:47
1:30: y ==> 1:49
?: _f ==> no binding
1:54: f ==> 1:10
1:47: x ==> 1:47
?: _f ==> no binding
1:47: x ==> 1:47
1:49: y ==> 1:49
?: _f ==> no binding
1:49: y ==> 1:49

```

## The Issue

In sample output above, scope bindings for the variable `_f` introduced by the transform doesn't have scope bindings.

Likely areas in source code related to the behavior based on a quick (and possibly incorrect) glance at source:

1. https://github.com/babel/babel/blob/f8543735a2895b2b3dc23fe8482b21e5ea7de359/packages/babel-plugin-transform-destructuring/src/index.ts#L161
2. https://github.com/babel/babel/blob/f8543735a2895b2b3dc23fe8482b21e5ea7de359/packages/babel-plugin-transform-destructuring/src/util.ts#L553
