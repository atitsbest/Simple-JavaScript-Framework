require 'erubis'
require(File.join(File.dirname(__FILE__), 'javascript', 'dependencies.rb'))

namespace :javascript do
	
	# Abhängigkeiten laden.
	@dependencies = JavaScript::Dependencies.new('dependencies.json')
	
	desc "Fuehrt die JavaScript Specs aus."
	task :specs do 
		system("start tests.html")
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

end

