/**
 * Funktionalität für den Header.
 * @class Header
 */
var Header = Control.extend(/** @lends Header# */{

  /**
   * Sortiment anzeigen
   */
  setProductline: function(productlineDescription){ 
    var elementToChange = this.$element.find('#headline .productline');
    elementToChange.html(productlineDescription);
  }
  
});
