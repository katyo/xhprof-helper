NAME:=k10n-xhprof
DIST:=$(call TEMP)

dist.pre: build
	@mkdir -p $(DIST)

dist: dist.pre

dist.clean:
	@rm -rf $(DIST)

zip.dist: dist
	@cd $(DIST) && zip -r $(PWD)/$(NAME).zip *

zip: zip.dist dist.clean

TARGET+=zip
