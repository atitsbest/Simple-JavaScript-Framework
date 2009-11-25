(function() {
  /**
   * Wraps the function in another, locking its execution scope to an object
   * specified by `object`.
   * Vom Prototype Framework auf jQuery angepasst.  
   * @param context Der Context in dem diese Function aufgerufen werden soll.
   **/
  Function.prototype.bind = function(context) {
    if (arguments.length < 2 && Object.isUndefined(arguments[0])) return this;
    var __method = this, args = $.makeArray(arguments).slice(1);
    return function() {
      var a = []
      $.merge(a, args);
      $.merge(a, $.makeArray(arguments));
      return __method.apply(context, a);
    }
  },

  /**
   * Fügt einem Object eine neue Methode hinzu.
   * @param name Name der Methode.
   * @param fn Die Funktion die dem Object hinzugefügt werden soll.
   * @example
   *  Array.method('doIt', function(param1, param2) { ... }
   */  
  Function.prototype.method = function (/**String*/name, /**Function*/fn) /**Function*/ {
	  this.prototype[name] = fn;
	  return this;
  }
  
})();