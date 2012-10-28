serv.dist: dist.pre
	@cp ../server/k10n_xhprof.php $(DIST)
dist: serv.dist
