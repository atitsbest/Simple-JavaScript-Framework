describe("Base.Controls.Panel#initialize", {
	
	'before_each': function() {
		$('body').append('<div id="panelTest"></div>');
		sut = new Base.Controls.Panel($('#panelTest'), {})		
	},

	'after_each': function() {
		$('#panelTest').remove();
	},
	
	'should not alter the DOM element if no url is provided': function() {
		value_of(sut.$element.html()).should_be("");
	},
	
	
});