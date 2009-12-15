# Neue Tasks in das Verzeichnis Tools/Tasks einfügen.

# Konfiguration lesen
config = open('rake.yml') {|f| YAML::load(f)}

# Constants:
APPLICATION_NAME 	= config["application name"]
TOOLS_PATH 				= config["shared paths"]["tools"]
CSS_PATH 					= config["shared paths"]["css"]
IMAGES_PATH 			= config["shared paths"]["images"]
SPRITES_PATH 			= File.join(IMAGES_PATH, "sprites")
SCRIPTS_PATH 			= config["shared paths"]["js"]

# Tasks einfügen.
Dir['tasks/*.rb'].each {|file| require file}
