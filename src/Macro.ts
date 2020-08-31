/* eslint "@typescript-eslint/no-extraneous-class": ["error", { "allowStaticOnly": true }] */
/* eslint-disable @typescript-eslint/no-var-requires */

import * as internal from './JSOMap'
const BigEval = require('bigeval')

/**
 * @class
 */
export class Macro {
  /**
   * @static
   * @description Macro method Split().
   * @param {any} input - Data to split.
   * @param {string} queryStr - Query string to evaluate.
   * @returns {string[]} Array of strings.
   * @example
   * Template:
   * { "print": "{This is plain text | Split(/ /)}" }
   * Expected:
   * { print: ['This', 'is', 'plain', 'text'] }
   */
  static ['Split()'] (input: any, queryStr: string): string[] {
    const rx = RegExp(/Split\(\/(.*)\/\)/.exec(queryStr)[1])
    return Array.isArray(input)
      ? input.map(val => Macro['Split()'](val, queryStr))
      : input.split(rx)
  }

  /**
   * @static
   * @type {Macro}
   * @description Macro method String().
   * @param {any} input - A value to convert to type 'string'.
   * @returns {string} The input as type 'string'.
   * @example
   * Input:
   * { item: 12 }
   * Template:
   * { "print": "{[item] | String()}" }
   * Expected:
   * { print: '12' }
   */
  static ['String()'] (input: any): string | string[] {
    return Array.isArray(input)
      ? input.map(val => Macro['String()'](val) as string)
      : `${input as string}`
  }

  /**
   * @static
   * @type {Macro}
   * @description Macro method Number().
   * @param {any} input - A value to convert to type 'number'.
   * @returns {number} The input as type 'number'.
   * @example
   * Input:
   * { item: '10' }
   * Template:
   * { "print": "{[item] | Number()}" }
   * Expected:
   * { print: 10 }
   */
  static ['Number()'] (input: any): number | number[] {
    return Array.isArray(input)
      ? input.map(val => Macro['Number()'](val) as number)
      : parseFloat(input)
  }

  /**
   * @static
   * @type {Macro}
   * @description Macro method Boolean().
   * @param {any} input - A value to convert to type 'boolean'.
   * @returns {boolean} The input as type 'boolean'.
   * @example
   * Template:
   * { "print": "{false | Boolean()}" }
   * Expected:
   * { print: false }
   */
  static ['Boolean()'] (input: any): boolean | boolean[] {
    if (input.toLowerCase() === 'false') {
      return false
    } else if (input.toLowerCase() === 'true') {
      return true
    } else {
      return Array.isArray(input)
        ? input.map(val => Macro['Boolean()'](val) as boolean)
        : input
    }
  }

  /**
   * @static
   * @type {Macro}
   * @description Macro method First().
   * @param {string[]} input - Array of strings.
   * @returns {string} First string in array.
   * @example
   * Input:
   * { item: ['This', 'is', 'plain', 'text'] }
   * Template:
   * { "print": "{[item] | First()}" }
   * Expected:
   * { print: 'This' }
   */
  static ['First()'] (input: any): string {
    return input[0]
  }

  /**
   * @static
   * @type {Macro}
   * @description Macro method Last().
   * @param {string[]} input - Array of strings.
   * @returns {string} Last string in array.
   * @example
   * Input:
   * { item: ['This', 'is', 'plain', 'text'] }
   * Template:
   * { "print": "{[item] | Last()}" }
   * Expected:
   * { print: 'text' }
   */
  static ['Last()'] (input: any): string {
    return input[input.length - 1] === ''
      ? input[input.length - 2]
      : input[input.length - 1]
  }

  /**
   * @static
   * @type {Macro}
   * @description Macro method Date().
   * @returns {Date} The current date as javascript Date instance.
   * @example
   * Template:
   * { "print": "{Date()}" }
   * Expected:
   * { print: new Date() }
   */
  static ['Date()'] (): Date {
    return new Date()
  }

  /**
   * @static
   * @type {Macro}
   * @description Macro method Date().
   * @returns {string} ISO formatted date in UTC.
   * @example
   * Template:
   * { "print": "{DateString()}" }
   * Expected:
   * { print: '2018-01-06T22:22:22.022Z' }
   */
  static ['DateString()'] (): string {
    return new Date().toISOString()
  }

  /**
   * @static
   * @type {Macro}
   * @description Macro method JsonString().
   * @param {any} input - Any Javascript value.
   * @returns {string} The javascript value as a JSON string.
   * @example
   * Input:
   * { item: ['This', 'is', 'plain', 'text'] }
   * Template:
   * { "print": "{[item] | JsonString()}" }
   * Expected:
   * { print: '["This","is","plain","text"]' }
   */
  static ['JsonString()'] (input: any): string {
    return JSON.stringify(input)
  }

  /**
   * @static
   * @type {Macro}
   * @description Macro method JsonParse().
   * @param {string} input - Any JSON string.
   * @returns {any} The JSON string as a javascript value.
   * @example
   * Input:
   * { item: '["This","is","plain","text"]' }
   * Template:
   * { "print": "{[item] | JsonParse()}" }
   * Expected:
   * { print: ['This', 'is', 'plain', 'text'] }
   */
  static ['JsonParse()'] (input: any): string | string[] {
    return Array.isArray(input)
      ? input.map(val => Macro['JsonParse()'](val) as string)
      : JSON.parse(input)
  }

  /**
   * @static
   * @description Macro method Math().
   * @param {any} input - Data to query against.
   * @param {string} queryStr - Query string to evaluate and perform mathematical operations.
   * @returns {number} The result of the math expression.
   * @example
   * Input:
   * { item1: 2, item2: 5 }
   * Template:
   * { "print": "{Math([item1] * [item2])}" }
   * Expected:
   * { print: 10 }
   */
  static ['Math()'] (input: any, queryStr: string): number | number[] {
    if (Array.isArray(input))
      return input.map(val => Macro['Math()'](val, queryStr) as number)
    let queryCache: string = ''
    // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
    const resolvedExpr = (
      queryStr.match(/([*/+-])|(\[[A-Za-z0-9_\- ]+\])|([0-9]+)/g) || ['0']
    ).reduce((concat: string, value: string, idx: number, arr: any[]) => {
      if (concat.substring(0, 1) === '[') {
        queryCache += concat
        concat = ''
      }

      if (value.substring(0, 1) === '[') {
        queryCache += value

        if (arr.length === idx + 1) {
          concat += internal.JSOMap.query(
            input,
            queryCache
          ).toString() as string
        }
      } else {
        if (queryCache === '') {
          concat += value
        } else {
          // eslint-disable-next-line @typescript-eslint/restrict-plus-operands
          concat += internal.JSOMap.query(input, queryCache).toString() + value
          queryCache = ''
        }
      }

      return concat
    })
    const bigeval = new BigEval()

    return bigeval.exec(resolvedExpr) as number
  }

  /**
   * @static
   * @description Macro method If().
   * @param {any} input - Data to query against.
   * @param {string} queryStr - Query string to evaluate and perform operation.
   * @returns {any} The result of the expression.
   * @example
   * Input:
   * { item1: 2 }
   * Template:
   * { "print": "{If([item1], 3, true, false)}" }
   * Expected:
   * { print: false }
   */
  static ['If()'] (input: any, queryStr: string): any | any[] {
    if (Array.isArray(input))
      return input.map(val => Macro['If()'](val, queryStr))
    let result
    let args: any = /If\((.*)\)/.exec(queryStr)[1]
    args = args
      .split(/(["'].*?["']|[^\s"',]+)(?=\s*,|\s*$)/g)
      .map((arg: any) => {
        if (/^["']/.test(arg.trim())) {
          arg = arg.substring(1, arg.length - 1)
        } else if (arg.trim() === ',') {
          arg = ''
        } else if (arg.trim() === 'true') {
          arg = true
        } else if (arg.trim() === 'false') {
          arg = false
        } else if (arg.trim() === 'null') {
          arg = null
        } else if (arg.trim() === 'undefined') {
          arg = undefined
        } else if (/^[0-9.]+$/.test(arg.trim())) {
          arg = parseFloat(arg)
        } else {
          arg = internal.JSOMap.query(input, arg.trim())
        }

        return arg
      })
      .filter((arg: any) => arg !== '')

    if (args[0] === args[1]) {
      result = args[2]
    } else {
      result = args[3]
    }

    return result
  }

  /**
   * @static
   * @description Macro method Concat().
   * @param {any} input - Data to query against.
   * @param {string} queryStr - Query string to evaluate and perform concatenation.
   * @returns {string} The result of the expression.
   * @example
   * Input:
   * { item1: 'one' }
   * Template:
   * { "print": "{Concat('There can be only ', [item1], '.')}" }
   * Expected:
   * { print: 'There can be only one.' }
   */
  static ['Concat()'] (input: any, queryStr: string): string | string[] {
    if (Array.isArray(input))
      return input.map(val => Macro['Concat()'](val, queryStr) as string)
    const args = /Concat\((.*)\)/.exec(queryStr)[1]

    return args
      .split(/(["'].*?["']|[^\s"',]+)(?=\s*,|\s*$)/g)
      .map(item => {
        return /^["']/.test(item.trim())
          ? item.substring(1, item.length - 1)
          : item.trim() === ','
          ? ''
          : internal.JSOMap.query(input, item.trim())
      })
      .join('')
  }
}
