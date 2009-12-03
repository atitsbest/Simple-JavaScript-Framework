namespace :javascript do
	
	desc "Führt die JavaScript Specs aus."
	task :specs do 
		system("start tests.html")
	end

end