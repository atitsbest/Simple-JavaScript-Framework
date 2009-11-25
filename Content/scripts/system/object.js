/**
 * Übernommen von prototypejs http://www.prototypejs.org/
 * Angepasst.
 */
(function() {
  /**
   * Object.isElement(object) -> Boolean
   * - object (Object): The object to test.
   *
   * Returns `true` if `object` is a DOM node of type 1; `false` otherwise.
   **/
  Object.isElement = function(object) {
    return !!(object && Object.nodeType == 1);
  }

  /**
   * Object.isArray(object) -> Boolean
   * - object (Object): The object to test.
   *
   * Returns `true` if `object` is an array; false otherwise.
   **/
  Object.isArray = function(object) {
    return getClass(object) === "Array";
  }


  /**
   * Object.isHash(object) -> Boolean
   * - object (Object): The object to test.
   *
   * Returns `true` if `object` is an instance of the [[Hash]] class; `false`
   * otherwise.
   **/
  Object.isHash = function(object) {
    return object instanceof Hash;
  }

  /**
   * Object.isFunction(object) -> Boolean
   * - object (Object): The object to test.
   *
   * Returns `true` if `object` is of type `function`; `false` otherwise.
   **/
  Object.isFunction = function(object) {
    return typeof object === "function";
  }

  /**
   * Object.isString(object) -> Boolean
   * - object (Object): The object to test.
   *
   * Returns `true` if `object` is of type `string`; `false` otherwise.
   **/
  Object.isString = function(object) {
    return getClass(object) === "String";
  }

  /**
   * Object.isNumber(object) -> Boolean
   * - object (Object): The object to test.
   *
   * Returns `true` if `object` is of type `number`; `false` otherwise.
   **/
  Object.isNumber = function(object) {
    return getClass(object) === "Number";
  }

  /**
   * Object.isUndefined(object) -> Boolean
   * - object (Object): The object to test.
   *
   * Returns `true` if `object` is of type `string`; `false` otherwise.
   **/
  Object.isUndefined = function(object) {
    return typeof object === "undefined";
  }

})();