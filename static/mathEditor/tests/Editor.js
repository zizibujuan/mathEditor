define(["doh/main", "require"], function(doh, require){
	if(doh.isBrowser){
		doh.register("tests.Editor 测试Editor类中的方法", require.toUrl("./Editor.html"), 999999);
	}
});