define(["doh/main", "require"], function(doh, require){
	if(doh.isBrowser){
		doh.register("tests.MathJaxView 测试由xml转换为html后对应的获取焦点的节点信息", require.toUrl("./MathJaxView.html"), 999999);
	}
});