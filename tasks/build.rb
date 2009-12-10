desc "Erstellt den ganzen Clientbereich der Anwendung"
task :compile => ["js:compile", "css:sprites", "css:compile"]