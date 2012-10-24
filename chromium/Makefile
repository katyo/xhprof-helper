all: $(addprefix icon_,$(addsuffix .png,128 64 48 32 16 19))
 
icon_%.png: icon.svg
	@echo Bake icon $*x$*..
	@inkscape --export-png=$@ --export-width=$* --export-height=$* $^
