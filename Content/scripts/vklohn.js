VKLohn = new Class(/**@lends VKLohn#*/{

	/**@ignore*/
	Extends: App,

	/**@ignore*/
	Implements: Mvc,
	
	/**
	 * Die Messagekomponente
	 * @type Message
	 */
	message: null,
	
	/**
	 * Die VKLohn Applikation auf dem Client.
	 * @class VKLohn
	 * @constructs
 	 * @extends App
 	 * @extends Mvc
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