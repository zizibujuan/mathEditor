define(["doh/main", "require"], function(doh, require){
	if(doh.isBrowser){
		doh.register("tests.MathJaxView", require.toUrl("./MathJaxView.html"), 30000);
	}
});
