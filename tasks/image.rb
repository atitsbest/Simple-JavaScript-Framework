require(File.join(File.dirname(__FILE__), 'img2sprite', 'sprite.rb'))
require(File.join(File.dirname(__FILE__), 'helper', 'dir_helper.rb'))
require 'active_support'

namespace :image do

	desc "Für jedes Unterverzeichnis in content/images/sprites wird ein Sprite (img+css) erstellt."
	task :sprites do 

		# Unterverzeichnisse in Sprites ermitteln.
		dirs = get_top_level_directories(IMAGES_SPRITES_PATH)

		# Sprites erstellen
		dirs.each {|dir| create_sprite_for_directory(dir)}

		puts "Fertig!"
	end

end	

# -------
# Helpers
#

def get_top_level_directories(root)
	Dir.entries(root).reject do |path| 
		!File.directory?(File.join(root, path)) or File.basename(path)[0] == ?.
	end
end

def create_sprite_for_directory(dirname)
	imagename = "#{dirname}.png"
	cssname = "#{dirname}.css"
	classname = "sprite.#{dirname.singularize}"
	
	# Alle Dateien mit der gewünschten Erweiterung
	image_names = Dir.glob(File.join(IMAGES_SPRITES_PATH, dirname, "*.png")) +
	              Dir.glob(File.join(IMAGES_SPRITES_PATH, dirname, "*.gif"))
	image_names = image_names.uniq.sort {|a,b| a.downcase <=> b.downcase }
	
	# Bilder gefunden?
	if image_names.length == 0
		puts "Keine Bilder in #{dirname} gefunden."
	else
		# Sprite erzeugen
		puts "Bilder suchen in #{dirname}..."
		sprite = SpriteCollection.new(classname, File.join(IMAGES_SPRITES_PATH, imagename), File.join(CSS_SPRITES_PATH, cssname))
		
		image_names.each do |filename|
		  puts filename
		  begin
		    sprite << filename
		  rescue
		    puts "Datei #{filename} konnte nicht geöffnet werden!"
		  end
		end
		
		# Sprite (img+css) erzeugen
		puts "Sprite (#{imagename}, #{cssname}) schreiben..."
		sprite.write()
	end
end