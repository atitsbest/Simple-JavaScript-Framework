# Neue Tasks in das Verzeichnis Tools/Tasks einfügen.

# Konfiguration lesen
config = open('rake.yml') {|f| YAML::load(f)}

# Constants:
APPLICATION_NAME 		= config["application name"]
TOOLS_PATH 					= config["shared paths"]["tools"]
CSS_PATH 						= config["shared paths"]["css"]
CSS_SPRITES_PATH 		= File.join(CSS_PATH, "sprites")
IMAGES_PATH 				= config["shared paths"]["images"]
IMAGES_SPRITES_PATH = File.join(IMAGES_PATH, "sprites")
SCRIPTS_PATH 				= config["shared paths"]["js"]

# Tasks einfügen.
Dir['tasks/*.rb'].each {|file| require file}
