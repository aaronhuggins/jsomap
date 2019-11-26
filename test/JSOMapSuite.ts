import 'mocha'
import * as assert from 'assert'
import { JSOMap } from '../core'

describe('JSOMap', () => {
  const testObj = {
    text: 'Hello world!',
    array: [1, 2],
    objects: [
      { item: 1 },
      { item: 2 }
    ],
    obj: {
      nested: {
        item: 1
      }
    },
    json: '[1,2]'
  }

  it('should map object query type string', () => {
    const printObj = { print: '[text]' }

    assert.deepStrictEqual(new JSOMap(testObj, printObj).mapped().print, testObj.text)
  })

  it('should map object query type array', () => {
    const printObj = { print: '[array]' }

    assert.deepStrictEqual(new JSOMap(testObj, printObj).mapped().print, testObj.array)
  })

  it('should map object query type object[]', () => {
    const printObj = { print: [{ item: '[objects][item]' }] }

    assert.deepStrictEqual(new JSOMap(testObj, printObj).mapped().print, testObj.objects)
  })

  it('should map object query nested object', () => {
    const printObj = { print: '[obj][nested][item]' }

    assert.deepStrictEqual(new JSOMap(testObj, printObj).mapped().print, testObj.obj.nested.item)
  })

  it('should pass plain value back from map', () => {
    const printObj = { print: 'unchanged' }

    assert.deepStrictEqual(new JSOMap(testObj, printObj).mapped().print, printObj.print)
  })

  it('should return object from parsing map', () => {
    const printObj = { print: 'unchanged' }

    assert.deepStrictEqual(new JSOMap(testObj, printObj).mapped(), printObj)
    assert.deepStrictEqual(new JSOMap(testObj, printObj).toObject(), printObj)
    assert.deepStrictEqual(new JSOMap(testObj, printObj).valueOf(), printObj)
    assert.deepStrictEqual(new JSOMap(testObj, printObj)[Symbol.for('nodejs.util.inspect.custom')](), printObj)
  })

  it('should map object macro', () => {
    const printObj = { print: '{Date()}' }

    assert.strictEqual(new JSOMap(testObj, printObj).mapped().print instanceof Date, true)
  })

  it('should map an added object macro', () => {
    JSOMap.addMacro('Test()', () => 'TEST')
    const printObj = { print: '{Test()}' }

    assert.strictEqual(new JSOMap(testObj, printObj).mapped().print, 'TEST')
  })

  it('should throw an error when breaking macro rules on adding macro', () => {
    let error

    try {
      JSOMap.addMacro({ 'Date()': () => 'TEST' })
    } catch (err) {
      error = err
    }
    assert.strictEqual(error instanceof Error, true)

    error = null

    try {
      JSOMap.addMacro('Date', () => 'TEST')
    } catch (err) {
      error = err
    }
    assert.strictEqual(error instanceof Error, true)

    error = null

    try {
      JSOMap.addMacro('Nope()', 'TEST' as any)
    } catch (err) {
      error = err
    }
    assert.strictEqual(error instanceof Error, true)
  })

  it('should pass a non-existent macro name back', () => {
    const printObj = { print: '{Nope()}' }

    assert.strictEqual(new JSOMap(testObj, printObj).mapped().print, 'Nope()')
  })

  it('should map object pipe macro', () => {
    const printObj = { print: '{[text] | Split(/ (.+)/) | First()}' }

    assert.strictEqual(new JSOMap(testObj, printObj).mapped().print, 'Hello')
  })

  it('should map object macros', () => {
    let printObj = { print: '{[array][0] | String() | Number()}' }

    assert.strictEqual(new JSOMap(testObj, printObj).mapped().print, 1)

    printObj = { print: '{true | Boolean() | not | Boolean() | false | Boolean()}' }

    assert.strictEqual(new JSOMap(testObj, printObj).mapped().print, false)

    printObj = { print: '{Test string | Split(/ (.+)/) | Last()}' }

    assert.strictEqual(new JSOMap(testObj, printObj).mapped().print, 'string')

    printObj = { print: '{[array] | Last()}' }

    assert.strictEqual(new JSOMap(testObj, printObj).mapped().print, 2)

    printObj = { print: '{DateString()}' }

    assert.strictEqual(typeof (new JSOMap(testObj, printObj).mapped().print), 'string')

    printObj = { print: '{[array] | JsonString()}' }

    assert.strictEqual(new JSOMap(testObj, printObj).mapped().print, '[1,2]')

    printObj = { print: '{[json] | JsonParse()}' }

    assert.strictEqual(new JSOMap(testObj, printObj).mapped().print[0], testObj.array[0])

    printObj = { print: '{Math(2 * 3)}' }

    assert.strictEqual(new JSOMap(testObj, printObj).mapped().print, 6)

    printObj = { print: '{Math([array][0] + [array][1])}' }

    assert.strictEqual(new JSOMap(testObj, printObj).mapped().print, 3)
  })
})
