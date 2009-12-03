@echo off

echo Compiling JavaScript...
cd content/scripts/
java -jar ../../closure-compiler/compiler.jar --js jquery/jquery-1.3.2.js --js jquery/jquery.blockit.js --js jquery/jquery.form.js --js jquery/jquery.dimensions.pack.js --js jquery/jquery.metadata.js --js mootools-1.2.4-core-custom.js --js mootools-1.2.4.2-more.js --js mvc.js --js controls/control.js --js controls/panel.js --js controls/message.js --js app.js --js vklohn.js --js_output_file vklohn_compiled.js --compilation_level WHITESPACE_ONLY --summary_detail_level 3 --formatting PRETTY_PRINT

cd ../..

echo Done!

@echo on