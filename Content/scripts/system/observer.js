/**
 * Observer-Pattern
 * @class Publisher
 */
Publisher = function() {
  this.subscribers = [];
}

Publisher.prototype = {
  
  /**
   * Die Benachrichtigung
   */
  deliver: function(data) {
    var rest = [];
    // REFACTOR
    for(var i=this.subscribers.length-1; i>=0; i-=1) {
      if (this.subscribers[i].first)
        this.subscribers[i].subscriber(data);
      else
        rest.push(this.subscribers[i].subscriber);
    }
    for(var i=0; i<rest.length; i+=1) {
        rest[i](data);
    }
  }
}

/**
 * INFO: Dazu wird das function-Prototype erweitert,
 *       so dass alle Klassen diese Funktionalität
 *       haben werden.
 */
Function.prototype.subscribe = function(publisher, options) {
  // Bereits vohanden?
  for(var i=0; i<publisher.subscribers.length; i+=1) {
    if (publisher.subscribers[i].subscriber == this)
      return this;
  }
  
  // Hinzufügen
  var val = $.extend(options, { subscriber: this });
  publisher.subscribers.push(val);
  return this;
};