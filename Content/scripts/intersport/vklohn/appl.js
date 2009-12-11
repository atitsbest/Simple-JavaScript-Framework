/**@namespace Intersport.VKLohn*/
Base.namespace('Intersport.VKLohn');

Intersport.VKLohn.Application = new Class(/**@lends Intersport.VKLohn.Application#*/{

	/**@ignore*/
	Extends: Base.Application,

	/**@ignore*/
	Implements: [Base.Mvc, Events],
	
	/**
	 * Die Messagekomponente
	 * @type Message
	 */
	message: null,
	
	/**
	 * Die VKLohn Applikation auf dem Client.
	 * @class Intersport.VKLohn.Application
	 * @constructs
 	 * @extends Base.Application
 	 * @extends Base.Mvc
 	 * @extends Events
	 */
	initialize: function() {
		this.parent();

    // Layout Elemente
    this.$main = $('#main');
    this.$header = $('#header');
    this.$sidebar = $('#sidebar');
    this.$sidebarentries = $('#sidebar > .entries');
    this.$contentcontainer = $('.contentcontainer');
    this.$contentheader = $('.contentheader');
    this.$footer = $('#footer');
    this.$window = $(window);
    
    // Fenstergröße hat sich geändert.
    this.$window.resize(function() {this.fireEvent('resize')}.bind(this));
	},
	
	/**
	 * Controlbaum ist fertig aufgebaut.
	 */
	onReady: function() {
		// Controls finden.
		this.message = this.findControl('message');
		
		this.parent();
	}
	
});