MAIN_FILES:=manifest.json $(wildcard *.js) $(wildcard *.html) bootstrap

main.dist: dist.pre
	cp -r $(MAIN_FILES) $(DIST)
dist: main.dist
