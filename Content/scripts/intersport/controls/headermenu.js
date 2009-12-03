
/**
 * Funktionalität für das Headermenü.
 */
var Headermenu = Control.extend(/** @lends Headermenu# */{

    /**
     * @class Headermenu
     * @constructs
     */
    init: function(element, options) {
        this._super(element, options);
    },

    /**
     * Der Controlbaum ist aufgebaut.
     */
    onReady: function() {
        $('.popuplink').click(function() {
            var that = this;
            window.open(that.href,
                    'title',
                    'height=600,width=1000,top=250,left=100,dependent=yes,location=no,menubar=no,resizeable=yes,status=no,toolbar=no');
            return false;
        });

        this._super();
    }

});