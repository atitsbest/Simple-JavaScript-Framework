/**
 * Mit dieser Klasse startet jede Applikation.
 * @class Base.Application
 * @extends Control
 */
Base.Application = new Class(/**@lends Base.Application#*/{

	/**@ignore*/
	Extends: Base.Control,
	
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
		var builder = new Base.ControlDOMBuilder(this.$element);
		this.controls = builder.createControls();
		this.onReady();
	}
	
});
