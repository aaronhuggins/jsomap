/* eslint "@typescript-eslint/no-extraneous-class": ["error", { "allowStaticOnly": true }] */

import { Macro } from './Macro'

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
