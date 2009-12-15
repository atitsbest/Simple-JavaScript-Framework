# Ermittelt alle Unterverzeichnisse eine angegebenen Verzeichnisses.
# @param root Verzeichnis unter dem gesucht wird.
# @returns {Array(String)} Array mit den Unterverzeichnissen.
def get_top_level_directories(root)
	Dir.entries(root).reject do |path| 
		!File.directory?(File.join(root, path)) or File.basename(path)[0] == ?.
	end
end

