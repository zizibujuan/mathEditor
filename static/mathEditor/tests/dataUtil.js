define([ "intern!tdd", 
         "intern/chai!assert",
         "dojox/xml/parser",
         "mathEditor/dataUtil" ], function(
        		 tdd,
        		 assert,
        		 domParser,
        		 dataUtil) {
	
	with(tdd){
		suite("dataUtil", function(){
			test("xmlStringToHtml", function(){
				var xmlString = "<root><line><text>a</text><math><mn>1</mn></math></line></root>";
				var expectHtml = "<div class='drip_line'><span>a</span><span class=\"drip_math\"><math><mn>1</mn></math></span></div>";
				assert.equal(expectHtml, dataUtil.xmlStringToHtml(xmlString));
			});
			
			test("testUnicode", function(){
				var xmlString = "<root><line><math><mo>&#xF7;</mo></math></line></root>";
				var expectHtml = "<div class='drip_line'><span class=\"drip_math\"><math><mo>÷</mo></math></span></div>";
				assert.equal(expectHtml, dataUtil.xmlStringToHtml(xmlString));
			});
		});
	}
});