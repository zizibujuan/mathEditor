define(["doh/main", "require"], function(doh, require){
	if(doh.isBrowser){
		doh.register("tests.TextInput 测试跨浏览器的用户输入", require.toUrl("./TextInput.html"), 999999);
	}
});