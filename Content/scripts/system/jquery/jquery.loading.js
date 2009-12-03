// ----------------------------------------------
// AJAX load mit angezeigtem Indikator.
//
jQuery.fn.loadWithIndicator = function(address, callback, settings) {
    // Define defaults and override with options, if available
    // by extending the default settings, we don't modify the argument
    //
    settings = jQuery.extend({
        indicator_at: this
    }, settings);

    var self = this;

    // Indicator anzeigen
    settings.indicator_at.block();
 
    this.load(address, function() {
      settings.indicator_at.unblock();
      
      if (callback != null)
        callback();
    });
    
    // Method chaining.
    return this;
};
