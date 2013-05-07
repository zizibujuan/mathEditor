define([ "doh","dojox/xml/parser","mathEditor/dataUtil" ], function(doh,domParser,dataUtil) {
	doh.register("dataUtil",[
		function testXmlStringToHtml(t){
			var xmlString = "<root><line><text>a</text><math><mn>1</mn></math></line></root>";
			var expectHtml = "<div class='drip_line'><span>a</span><span class=\"drip_math\"><math><mn>1</mn></math></span></div>";
			t.is(expectHtml, dataUtil.xmlStringToHtml(xmlString));
		},
		function testUnicode(t){
			var xmlString = "<root><line><math><mo>&#xF7;</mo></math></line></root>";
			var expectHtml = "<div class='drip_line'><span class=\"drip_math\"><math><mo>÷</mo></math></span></div>";
			t.is(expectHtml, dataUtil.xmlStringToHtml(xmlString));
		}
	]);
});