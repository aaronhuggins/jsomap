# JSOMap
JSOMap is yet another mapping and templating library for javascript objects.

## Usage
Install it from the [npm repository](https://www.npmjs.com/package/jsomap):
```console
npm install --save jsomap
```

Then require it in your project:
```js
const { JSOMap } = require('jsomap')

console.log(new JSOMap({ text: 'Hello, world!' }, { print: '[text]' }))
```

## Selectors
Data from the input object can be referred to in macros and properties using square-bracket syntax. For example, if the input has a property `text`, it can be selected in a template like:
```json
{ "print": "[text]" }
```

## Macros
Templating functionality is provided by the JSOMacro class. The class is extensible by directly calling the `JSOMap.addMacro()` function.

### Built-in Macros
Built-in macros are provided by class Macro, which class JSMacro extends. Documentation for all built-in macros are available can be found at [Macro](/docs/API.md#Macro).

### Extending
Function `JSOMap.addMacro()` can be used to directly add more macros at runtime. See [JSOMap](/docs/API.md#JSOMap.addMacro) for examples.

### Using
Macros are referred to by enclosing in curly braces:
```json
{ "print": "{Date()}" }
```

### Piping
Selectors and macros may have their output piped to other macros; this is called a 'pipe macro':
```json
{ "print": "{[text] | Split(/ (.+))}" }
```
Pipe macros must have each selector or macro separated by a space, a pipe, and another space. This is enforced for readability; piped macros not coforming to this standard will break.
