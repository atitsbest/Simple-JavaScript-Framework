/**
 * Mit dieser Klasse startet jede Applikation.
 * @class App
 * @extends Control
 */
App = new Class(/**@lends App#*/{
	
	/**@ignore*/
	Extends: Control,
	
	/**
	 * @contructs
	 */
	initialize: function() {
		this.parent(document);
	},
	
	/**
	 * Applikation starten.
	 */
	run: function() {
    this.initializeChildControls();
    this.onReady();
	}
	
});
