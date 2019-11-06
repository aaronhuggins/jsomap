/* eslint "@typescript-eslint/no-extraneous-class": ["error", { "allowStaticOnly": true }] */

export class JSOMacro {
  /**
   * @static
   * @description Macro method Split().
   * @param {any} input - Data to split.
   * @param {string} queryStr - Query string to evaluate.
   * @returns {string[]} Array of strings.
   */
  static ['Split()'] (input: any, queryStr: string): string[] {
    const rx = RegExp((/Split\(\/(.*)\/\)/).exec(queryStr)[1])
    return input.split(rx)
  }

  /**
   * @static
   * @description Macro method String().
   * @param {any} input - A value to convert to type 'string'.
   * @returns {string} The input as type 'string'.
   */
  static ['String()'] (input: any): string {
    return `${input}`
  }

  /**
   * @static
   * @description Macro method Number().
   * @param {any} input - A value to convert to type 'number'.
   * @returns {number} The input as type 'number'.
   */
  static ['Number()'] (input: any): number {
    return parseFloat(input)
  }

  /**
   * @static
   * @description Macro method Boolean().
   * @param {any} input - A value to convert to type 'boolean'.
   * @returns {boolean} The input as type 'boolean'.
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
   * @description Macro method First().
   * @param {string[]} input - Array of strings.
   * @returns {string} First string in array.
   */
  static ['First()'] (input: any): string {
    return input[0]
  }

  /**
   * @static
   * @description Macro method Last().
   * @param {string[]} input - Array of strings.
   * @returns {string} Last string in array.
   */
  static ['Last()'] (input: any): string {
    return input[input.length - 1] === ''
      ? input[input.length - 2]
      : input[input.length - 1]
  }

  /**
   * @static
   * @description Macro method Date().
   * @returns {Date} The date in UTC.
   */
  static ['Date()'] (): Date {
    return new Date()
  }

  /**
   * @static
   * @description Macro method Date().
   * @returns {string} ISO formatted date in UTC.
   */
  static ['DateString()'] (): string {
    return new Date().toISOString()
  }

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
      if (Object.prototype.hasOwnProperty.call(this, keys[i]) as boolean) {
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
