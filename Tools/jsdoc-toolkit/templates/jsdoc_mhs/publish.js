function publish(symbolGroup) {
	publish.conf = {  // trailing slash expected for dirs
		ext: ".html",
		outDir: JSDOC.opt.d || SYS.pwd+"../out/jsdoc_mhs/",
		templatesDir: SYS.pwd+"../templates/jsdoc_mhs/",
		symbolsDir: "symbols/",
		srcDir: "symbols/src/"
	};
	
	
	if (JSDOC.opt.s && defined(Link) && Link.prototype._makeSrcLink) {
		Link.prototype._makeSrcLink = function(srcFilePath) {
			return "&lt;"+srcFilePath+"&gt;";
		}
	}
	
	IO.mkPath((publish.conf.outDir+"symbols/src").split("/"));
		
	// used to check the details of things being linked to
	Link.symbolGroup = symbolGroup;

	try {
		var classTemplate = new JSDOC.JsPlate(publish.conf.templatesDir+"class.tmpl");
		var classesTemplate = new JSDOC.JsPlate(publish.conf.templatesDir+"allclasses.tmpl");
	}
	catch(e) {
		print(e.message);
		quit();
	}
	
	// filters
	function hasNoParent($) {return ($.memberOf == "")}
	function isaFile($) {return ($.is("FILE"))}
	function isaClass($) {return ($.is("CONSTRUCTOR") || $.isNamespace)}
	
	var symbols = symbolGroup.getSymbols();
	
	var files = JSDOC.opt.srcFiles;
 	for (var i = 0, l = files.length; i < l; i++) {
 		var file = files[i];
 		var srcDir = publish.conf.outDir + "symbols/src/";
		makeSrcFile(file, srcDir);
 	}
 	
 	var classes = symbols.filter(isaClass).sort(makeSortby("alias"));
	
	Link.base = "../";
 	publish.classesIndex = classesTemplate.process(classes); // kept in memory


 	var allFiles = getAllFilesList(symbols, files, isaFile);


	var symbol;
	var output;
	var fileName;
	
	for (var i = 0, l = classes.length; i < l; i++) {
		symbol = classes[i];
		output = "";
		
		if (symbol.alias == "_global_") {
			
			/* Create one output file containing all global definitions. */
			output = classTemplate.process([symbol]);
			IO.saveFile(publish.conf.outDir + "symbols/", symbol.alias + publish.conf.ext, output);
			
			/* Create an output file for each documented source file that contains
			 * the global definitions made in that source file.
			 */
			for (var j = 0; j < allFiles.length; j++) {
				fileName = FilePath.fileName(allFiles[j].alias);

				output = classTemplate.process([symbol, allFiles[j].alias]);
				IO.saveFile(publish.conf.outDir + "symbols/", symbol.alias + fileName + publish.conf.ext, output);
			}
		} else {
			
			/* Create an output file for a non-global definition, e.g. a class. */
			output = classTemplate.process([symbol]);
			IO.saveFile(publish.conf.outDir + "symbols/", symbol.alias + publish.conf.ext, output);
		}
	}
	
	// regenrate the index with different relative links
	Link.base = "";
	publish.classesIndex = classesTemplate.process(classes);
	
	try {
		var classesindexTemplate = new JSDOC.JsPlate(publish.conf.templatesDir+"index.tmpl");
	}
	catch(e) { print(e.message); quit(); }
		
	var classesIndex = classesindexTemplate.process(classes);
	IO.saveFile(publish.conf.outDir, "index"+publish.conf.ext, classesIndex);
	classesindexTemplate = classesIndex = classes = null;
	
	try {
		var fileindexTemplate = new JSDOC.JsPlate(publish.conf.templatesDir+"allfiles.tmpl");
	}
	catch(e) { print(e.message); quit(); }


	allFiles = getAllFilesList(symbols, files, isaFile);


	var filesIndex = fileindexTemplate.process(allFiles);
	IO.saveFile(publish.conf.outDir, "files"+publish.conf.ext, filesIndex);
	fileindexTemplate = filesIndex = files = null;

	var staticFiles = IO.ls(publish.conf.templatesDir + "static", 10);
	var relOutPath;
	var outPath;
	var filePath;

	for(var i = 0; i < staticFiles.length; i++) {
		relOutPath = staticFiles[i].substring(publish.conf.templatesDir.length);
		outPath = FilePath.dir(publish.conf.outDir + relOutPath);

		if (!IO.exists(outPath)) {
			IO.mkPath(outPath);
		}

		IO.copyFile(staticFiles[i], outPath);
	}
}


/** Returns a list with all documented files. */
function getAllFilesList(symbols, files, isaFileFilter) {
	var documentedFiles = symbols.filter(isaFileFilter);
	var allFiles = [];
	
	for (var i = 0; i < files.length; i++) {
		allFiles.push(new JSDOC.Symbol(files[i], [], "FILE",
				new JSDOC.DocComment("/** */")));
	}
	
	for (var i = 0; i < documentedFiles.length; i++) {
		var offset = files.indexOf(documentedFiles[i].alias);
		allFiles[offset] = documentedFiles[i];
	}

	allFiles = allFiles.sort(makeSortby("name"));
	
	return allFiles;
}


/** Just the first sentence. */
function summarize(desc) {
	if (typeof desc != "undefined")
		return desc.match(/([\w\W]+?\.)[^a-z0-9]/i)? RegExp.$1 : desc;
}

/** make a symbol sorter by some attribute */
function makeSortby(attribute) {
	return function(a, b) {
		if (a[attribute] != undefined && b[attribute] != undefined) {
			a = a[attribute].toLowerCase();
			b = b[attribute].toLowerCase();
			if (a < b) return -1;
			if (a > b) return 1;
			return 0;
		}
	}
}

function include(path) {
	var path = publish.conf.templatesDir+path;
	return IO.readFile(path);
}

function makeSrcFile(path, srcDir, name) {
	if (JSDOC.opt.s) return;
	
	if (!name) {
		name = path.replace(/\.\.?[\\\/]/g, "").replace(/[\\\/]/g, "_");
		name = name.replace(/\:/g, "_");
	}
	
	var src = {path: path, name:name, charset: IO.encoding, hilited: ""};
	
	if (defined(JSDOC.PluginManager)) {
		JSDOC.PluginManager.run("onPublishSrc", src);
	}

	if (src.hilited) {
		IO.saveFile(srcDir, name+publish.conf.ext, src.hilited);
	}
}

function makeSignature(params) {
	if (!params) return "()";
	var signature = "("
	+
	params.filter(
		function($) {
			return $.name.indexOf(".") == -1; // don't show config params in signature
		}
	).map(
		function($) {
			return $.name;
		}
	).join(", ")
	+
	")";
	return signature;
}

/** Find symbol {@link ...} strings in text and turn into html links */
function resolveLinks(str, from) {
	str = str.replace(/\{@link ([^} ]+) ?\}/gi,
		function(match, symbolName) {
			return new Link().toSymbol(symbolName);
		}
	);
	
	return str;
}
