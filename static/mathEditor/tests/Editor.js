define(["doh/main", "require", "dojo/sniff"], function(doh, require, sniff){
	if(doh.isBrowser){
		doh.register("tests.Editor 测试Editor类中的方法", require.toUrl("./Editor_box_chrome.html"), 999999);
	}
});