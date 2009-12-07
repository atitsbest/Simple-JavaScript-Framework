
namespace :script do
	
	desc "Führt die JavaScript Specs aus."
	task :specs do 
		system("start tests.html")
	end
	
	namespace :lint do
	
		desc "Überprüft den Syntax aller JavaScript Dateien."
		task :all do
			jslint(get_javascript_file_names)
		end
		
	end

end

# Ermittelt die Liste der Dateien aus der dependencies.js.
def get_javascript_file_names
	names = [];
	
	src = ""
	# dependencies.js einlesen.
	File.foreach('content/scripts/dependencies.js') {|l| src+=l}
	
	# Also JSON parsen

	# Alle mögliche Dateien ermitteln.
	src.gsub(/\{\s*name\s*:\s*'(.+)'\s*\}/) do |n| 
		n =~ /'(.+)'/
		names << "content/scripts/#{$1}.js";
	end
	names	
end

# Hilfsmethode um eine JavaScript Datei von JSLint überprüfen zu lassen.
def jslint(filenames)
	filenames.each do |f|
		puts "#{f}..."
		system("cscript tools/jslint.js <#{f} //Nologo //B")
		puts ""
	end
end