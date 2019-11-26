/* eslint "@typescript-eslint/no-extraneous-class": ["error", { "allowStaticOnly": true }] */

const BigEval = require('bigeval')
import * as internal from './JSOMap'

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
    const rx = RegExp((/Split\(\/(.*)\/\)/).exec(queryStr)[1])
    return input.split(rx)
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
  static ['String()'] (input: any): string {
    return `${input}`
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
  static ['Number()'] (input: any): number {
    return parseFloat(input)
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
  static ['Boolean()'] (input: any): boolean {
    if (input.toLowerCase() === 'false') {
      return false
    } else if (input.toLowerCase() === 'true') {
      return true
    } else {
      return input
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
  static ['JsonParse()'] (input: any): string {
    return JSON.parse(input)
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
  static ['Math()'] (input: any, queryStr: string): number {
    let queryCache: any = ''
    // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
    const resolvedExpr = (queryStr.match(/([*/+-])|(\[[A-Za-z0-9_\- ]+\])|([0-9]+)/g) || ['0'])
      .reduce((concat: any, value: any, idx: number, arr: any[]) => {
        if (concat.substring(0, 1) === '[') {
          queryCache += concat
          concat = ''
        }

        if (value.substring(0, 1) === '[') {
          queryCache += value

          if (arr.length === idx + 1) {
            concat += internal.JSOMap.query(input, queryCache).toString()
          }
        } else {
          if (queryCache === '') {
            concat += value
          } else {
            concat += internal.JSOMap.query(input, queryCache).toString() + value
            queryCache = ''
          }
        }

        return concat
      })
    const bigeval = new BigEval()

    return bigeval.exec(resolvedExpr) as number
  }
}
