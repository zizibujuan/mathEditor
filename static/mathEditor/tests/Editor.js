define(["doh/main", "require", "dojo/sniff"], function(doh, require, sniff){
	if(doh.isBrowser){
		if(sniff("chrome")){
			doh.register("tests.Editor 测试Editor类中的方法", require.toUrl("./Editor_box_chrome.html"), 999999);
		}else{
			
		}
		
	}
});