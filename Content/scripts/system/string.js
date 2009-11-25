/**
 * Leerzeichen am Anfang und am Ende des Strings entfernen.
 */
String.prototype.trim = function() { 
  return this.replace(/^\s+|\s+$/g,''); 
}

/**
 * Whitespaces (inkl. return) durch Leerzeichen ersetzen.
 */
String.prototype.normalize = String.prototype.normalise = function() { 
  return this.trim().replace(/\s+/g,' '); 
}

/**
 * Fängt der String mit der übergebenen Zeichenkette an?
 * @param str Zeichenkette
 */
String.prototype.startsWith = function(str,i) { 
  i=(i)?'i':'';
  var re=new RegExp('^'+str,i);
  return (this.normalize().match(re)) 
    ? true 
    : false ; 
}

/**
 * Hört der String mit der übergebenen Zeichenkette auf?
 * @param str Zeichenkette
 */
String.prototype.endsWith = function(str,i) { 
  i=(i)?'gi':'g';
  var re=new RegExp(str+'$',i);
  return (this.normalize().match(re)) 
    ? true 
    : false ; 
}

/**
 * Zufallsstring erzeugen.
 */
String.prototype.rand = function(length) {
	var chars = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXTZabcdefghiklmnopqrstuvwxyz";
	var randomstring = '';
	for (var i=0; i<length; i++) {
		var rnum = Math.floor(Math.random() * chars.length);
		randomstring += chars.substring(rnum,rnum+1);
	}
	return randomstring;
}

/**
 * Format z.b.: var msg = 'Mein Name ist {0}.'.format('Stephan');
 */
String.prototype.format = function() {
  var str = this;

  for(var i=0;i<arguments.length;i++) {
    var re = new RegExp('\\{' + (i) + '\\}','gm');
    str = str.replace(re, arguments[i]);
  }

  return str;
}

/**
 * Capitalizes the first letter of a string and downcases all the others.
 */
String.prototype.capitalize = function() {
  return this.charAt(0).toUpperCase() + this.substring(1).toLowerCase();
}

/**
 * Erstellt ein eine GUID.
 * @static
 */
String.generateGuid = function() {
  var result, i, j;
  result = '';
  for(j=0; j<32; j++) {
    if( j == 8 || j == 12|| j == 16|| j == 20)
      result = result + '-';
    
    i = Math.floor(Math.random()*16).toString(16).toUpperCase();
    result = result + i;
  }
  return result;
} 
