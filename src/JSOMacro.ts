/* eslint "@typescript-eslint/no-extraneous-class": ["error", { "allowStaticOnly": true }] */

/**
 * @class
 */
class Macro {
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
}

/**
 * @class
 */
export class JSOMacro extends Macro {
  static get RX (): RegExp {
    return /^{.+}$/
  }

  static get MacroDefRX (): RegExp {
    return /^[A-Z][A-z0-9]+\(\)$/
  }

  static get MacroNameRX (): RegExp {
    return /\(/
  }

  /**
   * @static
   * @description Method for dynamically adding macros to class JSOMacro.
   * Macros must be added before parsing or querying; if not, the macros will not be used.
   * @param {string|object} name - The string name of the macro or an object containing multiple macros.
   * @param {Function} [macro] - If a string name is provided, macro must be a Function.
   * @returns {JSOMacro} The JSOMacro class with the added macro or macros.
   * @throws {Error} Conflicting macro name '\<NAME>'.
   * @throws {Error} Bad macro name '\<NAME>'; must conform to regular expression '/^[A-Z][A-z0-9]+\(\)$/'.
   * @throws {Error} Bad macro type in macro '\<NAME>'; type must be a function.
   */
  static addMacro (name: string | any, macro?: Function | any): JSOMacro {
    if (typeof name === 'string') {
      macro = {
        [name]: macro
      }
    } else {
      macro = name
    }

    const keys = Object.keys(macro)

    for (let i = 0; i < keys.length; i += 1) {
      if (Object.prototype.hasOwnProperty.call(Macro, keys[i]) as boolean) {
        throw new Error(`Conflicting macro name '${keys[i]}'.`)
      }

      if (!this.MacroDefRX.test(keys[i])) {
        throw new Error(`Bad macro name '${keys[i]}'; must conform to regular expression '${this.MacroDefRX}'.`)
      }

      if (!(macro[keys[i]] instanceof Function)) {
        throw new Error(`Bad macro type in macro '${keys[i]}'; type must be a function.`)
      }
    }

    return Object.assign(this, macro)
  }

  /**
   * @static
   * @description Method for looking up a macro by name.
   * @param {string} name - The name of the macro to get, or a macro string with arguments.
   * @returns {Function} The macro function.
   */
  static getMacro (name: string): Function {
    const macro = `${name.split(this.MacroNameRX)[0]}()`

    return this[macro] === undefined
      ? () => macro
      : this[macro]
  }

  /**
   * @description Method for converting a pipe macro to an array of macros.
   * @param {string} macroStr - The macro string to pipe.
   * @returns {string[]|string} An array of macros; if there is nothing to pipe, the plain string will be returned.
   */
  static pipeMacro (macroStr: string): string[] | string {
    const pipeRx = / \| /

    if (pipeRx.test(macroStr)) {
      return macroStr.split(pipeRx)
    } else {
      return macroStr
    }
  }
}
