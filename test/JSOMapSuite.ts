import 'mocha'
import * as assert from 'assert'
import { JSOMap } from '../core'

const testObj = {
  text: 'Hello world!',
  array: [1, 2],
  objects: [{ item: 1 }, { item: 2 }],
  unexpected: [] as any,
  obj: {
    nested: {
      item: 1
    }
  },
  json: '[1,2]'
}
const testObj2 = {
  line_items: [
    {
      id: 935970,
      title: 'Sunny Fire Pit Cover',
      quantity: 1,
      sku: 'SUNNY-FP-COVER',
      price: '21.63'
    },
    {
      id: 968738,
      title: 'Sunny Fire Pit',
      quantity: 1,
      sku: 'SUNNY-FP',
      price: '155.00'
    }
  ]
}
const testmap = {
  orderItems: [
    {
      siteOrderItemId: '{[line_items][id] | String()}',
      sku: '[line_items][sku]',
      title: '[line_items][title]',
      quantity: '[line_items][quantity]',
      unitPrice: '{[line_items][price] | Number()}'
    }
  ]
}

describe('JSOMap', () => {
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

  it('should map object query type to empty string if undefined', () => {
    const printObj = { print: '[unexpected][0][item][prop]' }

    assert.deepStrictEqual(new JSOMap(testObj, printObj).mapped().print, '')
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

    printObj = {
      print: '{true | Boolean() | not | Boolean() | false | Boolean()}'
    }

    assert.strictEqual(new JSOMap(testObj, printObj).mapped().print, false)

    printObj = { print: '{Test string | Split(/ (.+)/) | Last()}' }

    assert.strictEqual(new JSOMap(testObj, printObj).mapped().print, 'string')

    printObj = { print: '{[array] | Last()}' }

    assert.strictEqual(new JSOMap(testObj, printObj).mapped().print, 2)

    printObj = { print: '{DateString()}' }

    assert.strictEqual(typeof new JSOMap(testObj, printObj).mapped().print, 'string')

    printObj = { print: '{[array] | JsonString()}' }

    assert.strictEqual(new JSOMap(testObj, printObj).mapped().print, '[1,2]')

    printObj = { print: '{[json] | JsonParse()}' }

    assert.strictEqual(new JSOMap(testObj, printObj).mapped().print[0], testObj.array[0])

    printObj = { print: '{Math(2 * 3)}' }

    assert.strictEqual(new JSOMap(testObj, printObj).mapped().print, 6)

    printObj = { print: '{Math([array][0] + [array][1])}' }

    assert.strictEqual(new JSOMap(testObj, printObj).mapped().print, 3)

    printObj = { print: '{If([text], "Hello world!", true)}' }

    assert.strictEqual(new JSOMap(testObj, printObj).mapped().print, true)

    printObj = { print: '{If([text], "1", true, false)}' }

    assert.strictEqual(new JSOMap(testObj, printObj).mapped().print, false)

    printObj = { print: '{If([array][0], 1, true)}' }

    assert.strictEqual(new JSOMap(testObj, printObj).mapped().print, true)

    printObj = { print: '{Concat("I say, ", [text])}' }

    assert.strictEqual(new JSOMap(testObj, printObj).mapped().print, 'I say, Hello world!')
  })

  it('should map object with array to result with array', () => {
    const result = new JSOMap(testObj2, testmap).mapped()

    assert.strictEqual(Array.isArray(result.orderItems), true)

    const orderItems: any[] = result.orderItems

    orderItems.forEach((obj, index) => {
      const original = testObj2.line_items[index]

      assert.strictEqual(obj.siteOrderItemId, original.id.toString())
      assert.strictEqual(obj.sku, original.sku)
      assert.strictEqual(obj.title, original.title)
      assert.strictEqual(obj.quantity, original.quantity)
      assert.strictEqual(obj.unitPrice, parseFloat(original.price))
    })
  })
})
