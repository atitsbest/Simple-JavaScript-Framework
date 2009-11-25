/**
 * Sugar Arrays (c) Creative Commons 2006
 * http://creativecommons.org/licenses/by-sa/2.5/
 * Author: Dustin Diaz | http://www.dustindiaz.com
 * Reference: http://www.dustindiaz.com/basement/sugar-arrays.html
 */
if ( !Array.prototype.forEach ) {
  /** @lends Array */
	Array.
		method(
			'forEach',
			function(fn, thisObj) {
				var scope = thisObj || window;
				for ( var i=0, j=this.length; i < j; ++i ) {
					fn.call(scope, this[i], i, this);
				}
			}
		).
		method(
			'every',
			function(fn, thisObj) {
				var scope = thisObj || window;
				for ( var i=0, j=this.length; i < j; ++i ) {
					if ( !fn.call(scope, this[i], i, this) ) {
						return false;
					}
				}
				return true;
			}
		).
		method(
			'some',
			function(fn, thisObj) {
			    var scope = thisObj || window;
				for ( var i=0, j=this.length; i < j; ++i ) {
			        if ( fn.call(scope, this[i], i, this) ) {
			            return true;
			        }
			    }
			    return false;
			}
		).
		method(
			'map',
			function(fn, thisObj) {
			    var scope = thisObj || window;
			    var a = [];
			    for ( var i=0, j=this.length; i < j; ++i ) {
			        a.push(fn.call(scope, this[i], i, this));
			    }
			    return a;
			}
		).
		method(
			'filter',
			function(fn, thisObj) {
			    var scope = thisObj || window;
			    var a = [];
			    for ( var i=0, j=this.length; i < j; ++i ) {
			        if ( !fn.call(scope, this[i], i, this) ) {
			            continue;
			        }
			        a.push(this[i]);
			    }
			    return a;
			}
		).
		method(
			'indexOf',
			function(el, start) {
			    var start = start || 0;
			    for ( var i=start, j=this.length; i < j; ++i ) {
			        if ( this[i] === el ) {
			            return i;
			        }
			    }
			    return -1;
			}
		).
		method(
			'lastIndexOf',
			function(el, start) {
			    var start = start || this.length;
			    if ( start >= this.length ) {
			        start = this.length;
			    }
			    if ( start < 0 ) {
			         start = this.length + start;
			    }
			    for ( var i=start; i >= 0; --i ) {
			        if ( this[i] === el ) {
			            return i;
			        }
			    }
			    return -1;
			}
		);
}

/**
 * Shuffles the Array elements randomly.
 */
Array.prototype.shuffle = function() {
  var i=this.length,j,t;
  while(i--) {
     j=Math.floor((i+1)*Math.random());
     t=arr[i];
     arr[i]=arr[j];
     arr[j]=t;
  }
}
 
/**
 * Removes redundant elements from the array.
 */
Array.prototype.unique = function() {
  var a=[],i;
  this.sort();
  for(i=0;i<this.length;i++) {
     if(this[i]!==this[i+1]) {
         a[a.length]=this[i];
     }
  }
  return a;
}

/**
 * Ist das übergebene Element im Array vorhanden.
 */
Array.prototype.contains = function (element) {
  for (var i = 0; i < this.length; i++) {
      if (this[i] == element) {
        return true;
      }
  }
  return false;
};

/**
 * Array Remove - By John Resig (MIT Licensed)
 */
Array.prototype.remove = function(from, to) {
  var rest = this.slice((to || from) + 1 || this.length);
  this.length = from < 0 ? this.length + from : from;
  return this.push.apply(this, rest);
};

/**
 * Array Find
 */
Array.prototype.find = function(callback) {
  for(var i=0; i<this.length; i+=1) {
    if (callback(this[i])) {
      return this[i];
    }
  }
  
  return null;
};
