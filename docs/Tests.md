# TOC
   - [JSOMap](#jsomap)
<a name=""></a>
 
<a name="jsomap"></a>
# JSOMap
should map object query type string.

```js
const printObj = { print: '[text]' };
assert.deepStrictEqual(new core_1.JSOMap(testObj, printObj).mapped().print, testObj.text);
```

should map object query type array.

```js
const printObj = { print: '[array]' };
assert.deepStrictEqual(new core_1.JSOMap(testObj, printObj).mapped().print, testObj.array);
```

should map object query type object[].

```js
const printObj = { print: [{ item: '[objects][item]' }] };
assert.deepStrictEqual(new core_1.JSOMap(testObj, printObj).mapped().print, testObj.objects);
```

should map object query nested object.

```js
const printObj = { print: '[obj][nested][item]' };
assert.deepStrictEqual(new core_1.JSOMap(testObj, printObj).mapped().print, testObj.obj.nested.item);
```

should pass plain value back from map.

```js
const printObj = { print: 'unchanged' };
assert.deepStrictEqual(new core_1.JSOMap(testObj, printObj).mapped().print, printObj.print);
```

should return object from parsing map.

```js
const printObj = { print: 'unchanged' };
assert.deepStrictEqual(new core_1.JSOMap(testObj, printObj).mapped(), printObj);
assert.deepStrictEqual(new core_1.JSOMap(testObj, printObj).toObject(), printObj);
assert.deepStrictEqual(new core_1.JSOMap(testObj, printObj).valueOf(), printObj);
assert.deepStrictEqual(new core_1.JSOMap(testObj, printObj)[Symbol.for('nodejs.util.inspect.custom')](), printObj);
```

should map object macro.

```js
const printObj = { print: '{Date()}' };
assert.strictEqual(new core_1.JSOMap(testObj, printObj).mapped().print instanceof Date, true);
```

should map an added object macro.

```js
core_1.JSOMap.addMacro('Test()', () => 'TEST');
const printObj = { print: '{Test()}' };
assert.strictEqual(new core_1.JSOMap(testObj, printObj).mapped().print, 'TEST');
```

should throw an error when breaking macro rules on adding macro.

```js
let error;
try {
    core_1.JSOMap.addMacro({ 'Date()': () => 'TEST' });
}
catch (err) {
    error = err;
}
assert.strictEqual(error instanceof Error, true);
error = null;
try {
    core_1.JSOMap.addMacro('Date', () => 'TEST');
}
catch (err) {
    error = err;
}
assert.strictEqual(error instanceof Error, true);
error = null;
try {
    core_1.JSOMap.addMacro('Nope()', 'TEST');
}
catch (err) {
    error = err;
}
assert.strictEqual(error instanceof Error, true);
```

should pass a non-existent macro name back.

```js
const printObj = { print: '{Nope()}' };
assert.strictEqual(new core_1.JSOMap(testObj, printObj).mapped().print, 'Nope()');
```

should map object pipe macro.

```js
const printObj = { print: '{[text] | Split(/ (.+)/) | First()}' };
assert.strictEqual(new core_1.JSOMap(testObj, printObj).mapped().print, 'Hello');
```

should map object macros.

```js
let printObj = { print: '{[array][0] | String() | Number()}' };
assert.strictEqual(new core_1.JSOMap(testObj, printObj).mapped().print, 1);
printObj = { print: '{true | Boolean() | not | Boolean() | false | Boolean()}' };
assert.strictEqual(new core_1.JSOMap(testObj, printObj).mapped().print, false);
printObj = { print: '{Test string | Split(/ (.+)/) | Last()}' };
assert.strictEqual(new core_1.JSOMap(testObj, printObj).mapped().print, 'string');
printObj = { print: '{[array] | Last()}' };
assert.strictEqual(new core_1.JSOMap(testObj, printObj).mapped().print, 2);
printObj = { print: '{DateString()}' };
assert.strictEqual(typeof (new core_1.JSOMap(testObj, printObj).mapped().print), 'string');
printObj = { print: '{[array] | JsonString()}' };
assert.strictEqual(new core_1.JSOMap(testObj, printObj).mapped().print, '[1,2]');
printObj = { print: '{[json] | JsonParse()}' };
assert.strictEqual(new core_1.JSOMap(testObj, printObj).mapped().print[0], testObj.array[0]);
printObj = { print: '{Math(2 * 3)}' };
assert.strictEqual(new core_1.JSOMap(testObj, printObj).mapped().print, 6);
printObj = { print: '{Math([array][0] + [array][1])}' };
assert.strictEqual(new core_1.JSOMap(testObj, printObj).mapped().print, 3);
```

