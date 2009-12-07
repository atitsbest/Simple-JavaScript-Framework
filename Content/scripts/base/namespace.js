/*jslint evil: true*/
/**
 * @namespace Base
 */
Base = {};

/**
 * Erstellt den angegebenen Namespace. Bestehende Namespaces werden nicht überschrieben.
 * Alle Namespaces setzten auf dem Base Namespace auf.
 * @param path Der Name des Namespaces z.B.: 'Test' oder 'Test.Test2.Test3'.
 * @return {Object} Der erstellt Namespace (bei einem verschachteltetn Namespace der letzte (rechte) Namespace.)
 */
Base.namespace = function(/**String*/path) {
	// Base ist immer der Root.
	var root = null;

	// Ungültigen String ignorieren.
	if (path !== null && path.length !== 0) {
		// Namespace String in die einezelnen Namespaces zerlegen.
		path.split('.').each(function(name, index) {
			// Beim ersten Mal, wenn noch kein Root gesetzt wurde, dann Root erstellen
			// und setzten.
			if (index === 0) {
				root = eval("(typeof {name} === 'object' ? {name} : ({name}={}));".substitute({name: name}));
			}
			else {
				// Namespace zu Root hinzufügen - wenn nicht bereits vorhanden.
				root[name] = root[name] || {};
				// Der aktuelle Namespace wird zu root.
				root = root[name];				
			}
		});
	}
		
	return root;
};