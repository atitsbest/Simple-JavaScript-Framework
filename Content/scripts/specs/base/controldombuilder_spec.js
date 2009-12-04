describe("Base.ControlDOMBuilder", {
	
	'should use document if no root is provided': function() {
		var sut = new Base.ControlDOMBuilder();
		value_of(sut.$rootElement[0]).should_be(document);
	},
	
	'should create a single control': function() {
		// Prepare
		$('body').append('<div class="{ type : \'Base.Control\'}"></div>');	
		var sut = new Base.ControlDOMBuilder('body');
		
		// Execute
		var controls = sut.createControls();
		
		// Assert
		value_of(controls).should_have(1, "items");
	},
	
	'should create multiple non-nested controls': function() {
		value_of(this).should_fail();		
	},
	
	'should create nested controls': function() {
		value_of(this).should_fail();		
	}
	
});