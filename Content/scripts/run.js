__DEBUG__ = false;
var app = null;

function startApp() {
	try {
    // Applikationsinstanz erstellen und starten.
    app = new Intersport.VKLohn.Application();
    // Basis Url (z.B.: /ELDL/) in der die Application läuft.
    app.baseUrl = '/';
    app.actionExtension = '.aspx';
    // Starten...
    app.run();
    app.message.success('Geladen: {debug}'.substitute({debug: __DEBUG__ ? 'DEBUG Mode' : ''}));
  }
  catch(e) {
  	alert('Beim Starten der Applikation ist ein Fehler aufgetreten ({error})'.substitute({error:e}));
  	if (console) {console.log(e);}
  }
}

if (__DEBUG__) {
	// Load init.
	var loader = new JSLoad({
    tags: dependencies,
    path: 'content/scripts/',
    scriptConcatenatorURL: ''
  });

  // JavaScripts laden...
  loader.load(['Intersport.VKLohn'], startApp);
}
else {
	startApp();
}
