require 'find'

module CSSHelper

	def get_top_level_directories(root)
		puts Dir.entries(root).collect {|path| File.directory?(path)}
	end

end 