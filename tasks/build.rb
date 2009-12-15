desc "Erstellt den ganzen Clientbereich der Anwendung"
task :build => ["js:bundle", "css:bundle"]