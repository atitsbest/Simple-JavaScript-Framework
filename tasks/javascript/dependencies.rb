require 'rubygems'
require 'json'

module JavaScript
	
	class Dependencies

		# (Relativer) Pfad zu den JavaScript ausgehend von den Dateinamen
		# in der dependencies.js
		attr_accessor :javascript_path
		
		# Die Abhängikeiten
		attr_reader :tags

		# CTR
		# @param file {String} Dateiname der dependencies.js relativ zu javascript_path
		def initialize(file="dependencies.json")
			self.javascript_path = "content/scripts"
			load(File.join(javascript_path, file))			
		end

		# .js-Dateien von JSLint überprüfen lassen.
		# @param filenames {String[]} Stringarray mit den Dateinamen.
		def lint(filenames)
			filenames.each do |f|
				file_name = File.join(javascript_path,"#{f}.js")
				print "#{file_name}: "
				system("cscript tools/jslint.js <#{file_name} //Nologo //B")
				puts ""
			end
		end
		
		# .js-Datei zu diesem Tag von JSLint überprüfen lassen.
		# @param tag {String} Tag aus den Abhängigkeiten.
		def lint_by_tag(tag)
			files = get_file_names_for_tag(tag) do |t|
				t["noLint"] ? false : true 
			end
			lint(files)
		end

		# Ermittelt die Liste der Dateien aus der dependencies.js.
		# @param tag {String} Dieser Tag soll mit allen Abhängigkeiten geladen werden.
		# @param block Bietet die Möglichkeit einezelne Einträge zuvor auszuschließen.
		# @returns {String[]} Ein Stringarray mit allen Dateien zum angegebenen Tag.
		def get_file_names_for_tag(tag, &block)
			get_file_names_for_tag_rec(tag, [], &block)
		end
		
	private
	
		# Dependencies laden
		# @param file {String} Der Name der Json-Datei mit den Abhängigkeiten. 
		# @returns {Hash} Den Json-String geparst als Hash.
		def load(file)
			# dependencies.js einlesen.
			src = File.read(file)
			
			# JSON parsen
			@tags = JSON.parse(src)
		end	

		# Rekursive Methode um Abhängikeiten aufzulösen.
		def get_file_names_for_tag_rec(tag, names, &block)
			# Gibt es den gewünschten Tag?
			return [] unless @tags[tag]
		
			# Anhängigkeiten auflösen.
			if requires = @tags[tag]["requires"]
				requires.each {|r| names = get_file_names_for_tag_rec(r, names, &block) + names }
			end
			
			# Dateien hinzufügen.
			if (!block_given? or yield(@tags[tag]))
				if @tags[tag]["files"]
					names += @tags[tag]["files"]
				end
			end
			
			names.uniq	
		end
	
	end

end

