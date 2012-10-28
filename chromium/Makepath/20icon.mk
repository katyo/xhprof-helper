ICON_SIZES:=128 48 16 19
ICON_FILES:=$(addprefix icon_,$(addsuffix .png,$(ICON_SIZES)))

icon.build: $(ICON_FILES)
build: icon.build

icon_%.png: icon.svg
	@echo Bake icon $*x$*..
	@inkscape --export-png=$@ --export-width=$* --export-height=$* $^

icon.clean:
	@rm -f $(ICON_FILES)
clean: icon.clean

icon.dist: dist.pre icon.build
	@cp $(ICON_FILES) $(DIST)
dist: icon.dist

icon: icon.build

TARGET+=icon
