require(File.join(File.dirname(__FILE__), 'javascript', 'dependencies.rb'))

namespace :javascript do
	
	desc "Fuehrt die JavaScript Specs aus."
	task :specs do 
		system("start tests.html")
	end
	
	desc "Ueberprueft den Syntax aller JavaScript Dateien."
	task :lint do
		dependencies = JavaScript::Dependencies.new('dependencies_json.js')
		dependencies.lint_by_tag('Intersport.VKLohn')
	end	

end

