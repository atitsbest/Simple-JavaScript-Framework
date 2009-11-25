function ListFilter(inputElement, listElement, contentGetter) {
	this.inputElement = inputElement;
	this.listElement = listElement;
	this.timerId = null;
	
	this.contentGetter = contentGetter || function(liElement) {
		return liElement.firstChild.data;
	}
	
	inputElement.onkeyup = delegate(this.onKeyUp, this);
}

ListFilter.prototype = {
	onKeyUp: function(evt) {
		var key = getKeyCode(evt);

		console.log("key = " + key);
		
		clearTimeout(this.timerId);
		
		switch (key) {
			case 27: // ESC
				this.resetFilter();
				break;
				
			default:
				this.timerId = setTimeout(delegate(this.filterList, this), 300,
						this.inputElement.value.toLowerCase());
		}
	},
	
	filterList: function(pattern) {
		var i = 0;
		var children = this.listElement.childNodes;
		var display;
		
		for (i = 0; i < children.length; i++) {
			if (children[i].nodeName == "LI") {
				if (this.contentGetter(children[i])
						.toLowerCase().indexOf(pattern) == -1) {
					
					display = "none";
				} else {
					display = "block";
				}
				
				children[i].style.display = display;
			}
		}
	},
	
	resetFilter: function() {
		this.inputElement.value = "";
		this.filterList("");
	}
}

function delegate(callback, scope, args) {
	return function() {
		callback.apply(scope, Array.prototype.slice.call(arguments).concat(args));
	}
}

(function(f) {
	window.setTimeout = f(window.setTimeout);
	window.setInterval = f(window.setInterval);
})(function(f) {
	return function(c,t) {
		var a = [].slice.call(arguments, 2);
		return f(function() {
			c.apply(this, a)
		}, t)
	}
});

/********************************************************
Helper function to determine the keycode pressed in a 
browser-independent manner.
********************************************************/
function getKeyCode(evt) {
	if(evt) { //Moz
		return evt.keyCode;
	}
	if(window.event) { //IE
		return window.event.keyCode;
	}
};

/********************************************************
Helper function to determine the event source element in a 
browser-independent manner.
********************************************************/
function getEventSource(evt) {
	if(evt) { //Moz
		return evt.target;
	}
	if(window.event) { //IE
		return window.event.srcElement;
	}
};

/********************************************************
Helper function to cancel an event in a 
browser-independent manner.
(Returning false helps too).
********************************************************/
function cancelEvent(evt) {
	if(evt) { //Moz
		evt.preventDefault();
		evt.stopPropagation();
	}
	if(window.event) { //IE
		window.event.returnValue = false;
	}
}