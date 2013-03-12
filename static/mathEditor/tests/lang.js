define([ "doh", "mathEditor/lang" ], function(doh, dripLang) {

	doh.register("lang 工具类", [ {
		name : "isNumber 校验输入的内容是不是数字",

		runTest : function(t) {
			t.t(dripLang.isNumber(0));
			t.t(dripLang.isNumber(9));
			t.t(dripLang.isNumber(09));
			t.t(dripLang.isNumber(90));
			t.t(dripLang.isNumber("1"));
			
			t.f(dripLang.isNumber(""));
			t.f(dripLang.isNumber(" "));
			t.f(dripLang.isNumber("a"));
			
		}
	},
	{
		name : "isOperator 校验输入的内容是不是有效的数学操作符",

		runTest : function(t) {
			t.t(dripLang.isOperator("+"));
			t.t(dripLang.isOperator("-"));
			t.t(dripLang.isOperator("="));
			t.t(dripLang.isOperator("=="));
			t.t(dripLang.isOperator("&#xD7;"));// 乘号
			t.t(dripLang.isOperator("&#xF7;"));// 除号
			t.t(dripLang.isOperator(">"));
			t.t(dripLang.isOperator("<"));
			t.t(dripLang.isOperator("!="));
			
			t.t(dripLang.isOperator("&#x2A7E;"));// 大于等于
			t.t(dripLang.isOperator("&#x226B;"));// 远大于
			t.t(dripLang.isOperator("&#x2A7D;"));// 小于等于
			t.t(dripLang.isOperator("&#x226A;"));// 远小于
			t.t(dripLang.isOperator("&#x2260;"));// 不等于
			t.t(dripLang.isOperator("&#x2248;"));// 约等于
			 
		}
	},
	{
		name : "isFenced 对称的围栏符号",

		runTest : function(t) {
			t.t(dripLang.isFenced("("));
			t.t(dripLang.isFenced("["));
			t.t(dripLang.isFenced("{"));
			t.t(dripLang.isFenced("|"));
		}
	},{
		name: "isNewLine 输入的值是一个换行符",
		runTest: function(t){
			t.t(dripLang.isNewLine("\n"));
			t.t(dripLang.isNewLine("\r\n"));
		}
	},{
		name: "isGreekLetter 判断输入的值是不是希腊字母，包括大写和小写",
		runTest: function(t){
			t.t(dripLang.isGreekLetter("&#x3B1;"));
			t.t(dripLang.isGreekLetter("&#x3B5;"));
			t.t(dripLang.isGreekLetter("&#x39F;"));
			
			t.f(dripLang.isGreekLetter("&#x3CA;"));
		}
	}]);

});