## Classes

<dl>
<dt><a href="#Macro">Macro</a></dt>
<dd></dd>
<dt><a href="#JSOMacro">JSOMacro</a></dt>
<dd></dd>
<dt><a href="#JSOMap">JSOMap</a></dt>
<dd></dd>
</dl>

<a name="Macro"></a>

## Macro
**Kind**: global class  

* [Macro](#Macro)
    * [.Split()(input, queryStr)](#Macro.Split_new) ⇒ <code>Array.&lt;string&gt;</code>
    * [.String()(input)](#Macro.String_new) ⇒ <code>string</code>
    * [.Number()(input)](#Macro.Number_new) ⇒ <code>number</code>
    * [.Boolean()(input)](#Macro.Boolean_new) ⇒ <code>boolean</code>
    * [.First()(input)](#Macro.First_new) ⇒ <code>string</code>
    * [.Last()(input)](#Macro.Last_new) ⇒ <code>string</code>
    * [.Date()()](#Macro.Date_new) ⇒ <code>Date</code>
    * [.DateString()()](#Macro.DateString_new) ⇒ <code>string</code>

<a name="Macro.Split_new"></a>

### Macro.Split()(input, queryStr) ⇒ <code>Array.&lt;string&gt;</code>
<p>Macro method Split().</p>

**Kind**: static method of [<code>Macro</code>](#Macro)  
**Returns**: <code>Array.&lt;string&gt;</code> - <p>Array of strings.</p>  

| Param | Type | Description |
| --- | --- | --- |
| input | <code>any</code> | <p>Data to split.</p> |
| queryStr | <code>string</code> | <p>Query string to evaluate.</p> |

**Example**  
```js
Template:{ "print": "{This is plain text | Split(/ /)}" }Expected:{ print: ['This', 'is', 'plain', 'text'] }
```
<a name="Macro.String_new"></a>

### Macro.String()(input) ⇒ <code>string</code>
<p>Macro method String().</p>

**Kind**: static method of [<code>Macro</code>](#Macro)  
**Returns**: <code>string</code> - <p>The input as type 'string'.</p>  

| Param | Type | Description |
| --- | --- | --- |
| input | <code>any</code> | <p>A value to convert to type 'string'.</p> |

**Example**  
```js
Input:{ item: 12 }Template:{ "print": "{[item] | String()}" }Expected:{ print: '12' }
```
<a name="Macro.Number_new"></a>

### Macro.Number()(input) ⇒ <code>number</code>
<p>Macro method Number().</p>

**Kind**: static method of [<code>Macro</code>](#Macro)  
**Returns**: <code>number</code> - <p>The input as type 'number'.</p>  

| Param | Type | Description |
| --- | --- | --- |
| input | <code>any</code> | <p>A value to convert to type 'number'.</p> |

**Example**  
```js
Input:{ item: '10' }Template:{ "print": "{[item] | Number()}" }Expected:{ print: 10 }
```
<a name="Macro.Boolean_new"></a>

### Macro.Boolean()(input) ⇒ <code>boolean</code>
<p>Macro method Boolean().</p>

**Kind**: static method of [<code>Macro</code>](#Macro)  
**Returns**: <code>boolean</code> - <p>The input as type 'boolean'.</p>  

| Param | Type | Description |
| --- | --- | --- |
| input | <code>any</code> | <p>A value to convert to type 'boolean'.</p> |

**Example**  
```js
Template:{ "print": "{false | Boolean()}" }Expected:{ print: false }
```
<a name="Macro.First_new"></a>

### Macro.First()(input) ⇒ <code>string</code>
<p>Macro method First().</p>

**Kind**: static method of [<code>Macro</code>](#Macro)  
**Returns**: <code>string</code> - <p>First string in array.</p>  

| Param | Type | Description |
| --- | --- | --- |
| input | <code>Array.&lt;string&gt;</code> | <p>Array of strings.</p> |

**Example**  
```js
Input:{ item: ['This', 'is', 'plain', 'text'] }Template:{ "print": "{[item] | First()}" }Expected:{ print: 'This' }
```
<a name="Macro.Last_new"></a>

### Macro.Last()(input) ⇒ <code>string</code>
<p>Macro method Last().</p>

**Kind**: static method of [<code>Macro</code>](#Macro)  
**Returns**: <code>string</code> - <p>Last string in array.</p>  

| Param | Type | Description |
| --- | --- | --- |
| input | <code>Array.&lt;string&gt;</code> | <p>Array of strings.</p> |

**Example**  
```js
Input:{ item: ['This', 'is', 'plain', 'text'] }Template:{ "print": "{[item] | Last()}" }Expected:{ print: 'text' }
```
<a name="Macro.Date_new"></a>

### Macro.Date()() ⇒ <code>Date</code>
<p>Macro method Date().</p>

**Kind**: static method of [<code>Macro</code>](#Macro)  
**Returns**: <code>Date</code> - <p>The current date as javascript Date instance.</p>  
**Example**  
```js
Template:{ "print": "{Date()}" }Expected:{ print: new Date() }
```
<a name="Macro.DateString_new"></a>

### Macro.DateString()() ⇒ <code>string</code>
<p>Macro method Date().</p>

**Kind**: static method of [<code>Macro</code>](#Macro)  
**Returns**: <code>string</code> - <p>ISO formatted date in UTC.</p>  
**Example**  
```js
Template:{ "print": "{DateString()}" }Expected:{ print: '2018-01-06T22:22:22.022Z' }
```
<a name="JSOMacro"></a>

## JSOMacro
**Kind**: global class  

* [JSOMacro](#JSOMacro)
    * [.addMacro(name, [macro])](#JSOMacro.addMacro) ⇒ [<code>JSOMacro</code>](#JSOMacro)
    * [.getMacro(name)](#JSOMacro.getMacro) ⇒ <code>function</code>
    * [.pipeMacro(macroStr)](#JSOMacro.pipeMacro) ⇒ <code>Array.&lt;string&gt;</code> \| <code>string</code>

<a name="JSOMacro.addMacro"></a>

### JSOMacro.addMacro(name, [macro]) ⇒ [<code>JSOMacro</code>](#JSOMacro)
<p>Method for dynamically adding macros to class JSOMacro.
Macros must be added before parsing or querying; if not, the macros will not be used.</p>

**Kind**: static method of [<code>JSOMacro</code>](#JSOMacro)  
**Returns**: [<code>JSOMacro</code>](#JSOMacro) - <p>The JSOMacro class with the added macro or macros.</p>  
**Throws**:

- <code>Error</code> <p>Conflicting macro name '&lt;NAME&gt;'.</p>
- <code>Error</code> <p>Bad macro name '&lt;NAME&gt;'; must conform to regular expression '/^[A-Z][A-z0-9]+()$/'.</p>
- <code>Error</code> <p>Bad macro type in macro '&lt;NAME&gt;'; type must be a function.</p>


| Param | Type | Description |
| --- | --- | --- |
| name | <code>string</code> \| <code>object</code> | <p>The string name of the macro or an object containing multiple macros.</p> |
| [macro] | <code>function</code> | <p>If a string name is provided, macro must be a Function.</p> |

<a name="JSOMacro.getMacro"></a>

### JSOMacro.getMacro(name) ⇒ <code>function</code>
<p>Method for looking up a macro by name.</p>

**Kind**: static method of [<code>JSOMacro</code>](#JSOMacro)  
**Returns**: <code>function</code> - <p>The macro function.</p>  

| Param | Type | Description |
| --- | --- | --- |
| name | <code>string</code> | <p>The name of the macro to get, or a macro string with arguments.</p> |

<a name="JSOMacro.pipeMacro"></a>

### JSOMacro.pipeMacro(macroStr) ⇒ <code>Array.&lt;string&gt;</code> \| <code>string</code>
<p>Method for converting a pipe macro to an array of macros.</p>

**Kind**: static method of [<code>JSOMacro</code>](#JSOMacro)  
**Returns**: <code>Array.&lt;string&gt;</code> \| <code>string</code> - <p>An array of macros; if there is nothing to pipe, the plain string will be returned.</p>  

| Param | Type | Description |
| --- | --- | --- |
| macroStr | <code>string</code> | <p>The macro string to pipe.</p> |

<a name="JSOMap"></a>

## JSOMap
**Kind**: global class  

* [JSOMap](#JSOMap)
    * [new JSOMap([input], [map])](#new_JSOMap_new)
    * _instance_
        * [.mapped()](#JSOMap+mapped) ⇒ <code>any</code>
    * _static_
        * [.query(input, queryStr)](#JSOMap.query) ⇒ <code>any</code>
        * [.addMacro(name, [macro])](#JSOMap.addMacro)
        * [.parse(input, map)](#JSOMap.parse) ⇒ <code>any</code>

<a name="new_JSOMap_new"></a>

### new JSOMap([input], [map])
<p>Class for safely querying javascript objects, parsing a map object to produce a transformed object.</p>


| Param | Type | Description |
| --- | --- | --- |
| [input] | <code>object</code> | <p>An object to query.</p> |
| [map] | <code>object</code> | <p>An object of key/query pairs.</p> |

**Example**  
```js
console.log(new JSOMap({ text: 'Hello, world!' }, { print: '[text]' }))
```
<a name="JSOMap+mapped"></a>

### jsoMap.mapped() ⇒ <code>any</code>
<p>Get the result of mapping the input and map in this instance.</p>

**Kind**: instance method of [<code>JSOMap</code>](#JSOMap)  
**Returns**: <code>any</code> - <p>The transformed object.</p>  
<a name="JSOMap.query"></a>

### JSOMap.query(input, queryStr) ⇒ <code>any</code>
<p>Method for querying data from Javascript objects and/or primitives.</p>

**Kind**: static method of [<code>JSOMap</code>](#JSOMap)  
**Returns**: <code>any</code> - <p>Returns any value selected or manipulated from the input.</p>  

| Param | Type | Description |
| --- | --- | --- |
| input | <code>object</code> | <p>Object to select or manipulate data from.</p> |
| queryStr | <code>string</code> | <p>Query string for selecting or manipulating input.</p> |

<a name="JSOMap.addMacro"></a>

### JSOMap.addMacro(name, [macro])
<p>Method for dynamically adding macros.
Macros must be added before parsing or querying; if not, the macros will not be used.</p>

**Kind**: static method of [<code>JSOMap</code>](#JSOMap)  

| Param | Type | Description |
| --- | --- | --- |
| name | <code>string</code> \| <code>object</code> | <p>The string name of the macro or an object containing multiple macros.</p> |
| [macro] | <code>function</code> | <p>If a string name is provided, macro must be a Function.</p> |

**Example**  
```js
JSOMap.addMacro('LowerCase()', (input) => input.toLowerCase())
```
**Example**  
```js
JSOMap.addMacro({  'LowerCase()': (input) => input.toLowerCase(),  'UpperCase()': (input) => input.toUpperCase()})
```
<a name="JSOMap.parse"></a>

### JSOMap.parse(input, map) ⇒ <code>any</code>
<p>Method for parsing a JSOMap and transforming the provided input.</p>

**Kind**: static method of [<code>JSOMap</code>](#JSOMap)  
**Returns**: <code>any</code> - <p>The transformed object.</p>  

| Param | Type | Description |
| --- | --- | --- |
| input | <code>object</code> | <p>An object to map data from.</p> |
| map | <code>object</code> | <p>An object of queries to transform input.</p> |

