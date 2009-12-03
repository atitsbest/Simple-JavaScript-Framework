/**@namespace Intersport.VKLohn*/
Base.namespace('Intersport.VKLohn');

Intersport.VKLohn.Application = new Class(/**@lends Intersport.VKLohn.Application#*/{

	/**@ignore*/
	Extends: Base.Application,

	/**@ignore*/
	Implements: Base.Mvc,
	
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
	 */
	initialize: function() {
		this.parent();
	},
	
	/**
	 * Controlbaum ist fertig aufgebaut.
	 */
	onReady: function() {
		// Controls finden.
		this.message = this.findControl('message');
	}
	
});