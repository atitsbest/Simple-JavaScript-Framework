describe("Base.Controls.Panel", {

	'before_each': function() {
		$('body').append('<div id="panelTest"></div>');
		// Mocks:
		app = {};
		app.buildUrl = function(url) { return url; }
	},

	'after_each': function() {
		$('#panelTest').remove();
	},
	
	/*==================================================================*/
	
	'should not alter the DOM element if no url is provided': function() {
		var sut = createPanelWithOptions({});
		value_of(sut.$element.html()).should_be_empty();
	},
	
	'should load Html from provided url': function() {
		var htmlContent = '<div class="__testcontent__"></div>';
		
		// Mocking:		
		jack(function() {
			// Ajax-Request Mocking
			jack.expect("jQuery.get")
				.mock(function(url, callback) { callback(htmlContent); });

			// Assert
			var sut = createPanelWithOptions({url:'testurl'});

			// INFO: Der IE verändert den Inhalt beim Einfügen d.h. wir können
			//			 nicht einfach die Strings vergleichen sondern müssen mit einer 
			//			 Annäherung über regex arbeiten.
			value_of(sut.$element.html()).should_match(/^<div.+class.+><\/div>$/i);
		});		
	},
	
	'should fire "finishedLoading" when panel has finished loading': function() {
		var finishedLoadingCalled = false;
		
		// Mocking:
		jack(function() {
			jack.expect("jQuery.get")
				.exactly("2 times")
				.mock(function(url, callback) { callback('<br/>'); });
			
			var sut = createPanelWithOptions({url:'dummy'});
			sut.addEvent('finishedLoading', function() { finishedLoadingCalled = true; });
			sut.load();
			// Assert:
			value_of(finishedLoadingCalled).should_be(true);
		});
	},
	
	'should create Controls of loaded Html': function() {
		var htmlContent = '<div id="message" class="{ type : \'Base.Controls.Message\'}"></div>';

		// Mocking:		
		jack(function() {
			// Ajax-Request Mocking
			jack.expect("jQuery.get")
				.mock(function(url, callback) { callback(htmlContent); });
			
				var sut = createPanelWithOptions({url:'dummy'});
			// Assert:
			value_of(sut.controls).should_have_exactly(1, "items");
			value_of(sut.controls[0].id).should_be("message");
		});			
	}
	
});

/**
 * Ein Helfer um ein Panel einfacher zu erstellen.
 */
function createPanelWithOptions(options) {
	return new Base.Controls.Panel($('#panelTest'), options)
}


