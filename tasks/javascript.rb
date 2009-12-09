require 'erubis'
require(File.join(File.dirname(__FILE__), 'javascript', 'dependencies.rb'))

namespace :js do
	
	# Abhängigkeiten laden.
	@dependencies = JavaScript::Dependencies.new('dependencies.json')

	desc "Alle JavaScript tasks ausführen"
	task :all => [:dependencies,:lint,:specs,:compile]
	
	desc "Fuehrt die JavaScript Specs aus."
	task :specs do 
		`start tests.html`
	end
	
	desc "Ueberprueft den Syntax aller JavaScript Dateien."
	task :lint do
		@dependencies.lint_by_tag('Intersport.VKLohn')
	end	
	
	desc "Erstellt aus den Abhaengigkeiten im JSON-Format die dependencies.js"
	task :dependencies do
		files = @dependencies.get_file_names_for_tag('Intersport.VKLohn')
		template = File.read(File.join(File.dirname(__FILE__), 'javascript', 'dependencies.erubis'))
		eruby = Erubis::Eruby.new(template)
		
		# dependencies.js erzeugen...
		result = eruby.result({
			:files=>files,
			:tags => @dependencies.tags
		})
		# ...und schreiben.
		File.open(File.join(@dependencies.javascript_path, 'dependencies.js'), 'w') do |f|
			f.write(result)		
		end
	end
	
	desc "Kompilert die JavaScripts mit Google closue Compiler."
	task :compile do
		closure_path = "tools/closure/compiler.jar"
		compilation_level = "WHITESPACE_ONLY" # ADVANCED_OPTIMIZATIONS, SIMPLE_OPTIMIZATIONS, WHITESPACE_ONLY

		# Dateien ermitteln und auf einen absolute Pfad bringen.
		files = @dependencies.get_file_names_for_tag('Intersport.VKLohn')
		files << 'run'
		files = files.map {|f| File.join(@dependencies.javascript_path, "#{f}.js")}

		# Wohin?
		target = File.join(@dependencies.javascript_path, 'compiled.js')

		# Kompilieren.
		`java -jar #{closure_path} --compilation_level #{compilation_level} --js #{files.join(" --js ")} --js_output_file #{target}`
	end

end

