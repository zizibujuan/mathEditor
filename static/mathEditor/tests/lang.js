define([ "intern!tdd", 
         "intern/chai!assert", 
         "mathEditor/lang" ], function(
        		 tdd,
        		 assert, 
        		 dripLang) {

	with(tdd){
		suite("lang 工具类", function(){
			test("isNumber 校验输入的内容是不是数字", function(){
				assert.isTrue(dripLang.isNumber(0));
				assert.isTrue(dripLang.isNumber(9));
				assert.isTrue(dripLang.isNumber(09));
				assert.isTrue(dripLang.isNumber(90));
				assert.isTrue(dripLang.isNumber("1"));
				
				assert.isFalse(dripLang.isNumber(""));
				assert.isFalse(dripLang.isNumber(" "));
				assert.isFalse(dripLang.isNumber("a"));
			});
			
			test("isOperator 校验输入的内容是不是有效的数学操作符", function(){
				assert.isTrue(dripLang.isOperator("+"));
				assert.isTrue(dripLang.isOperator("-"));
				assert.isTrue(dripLang.isOperator("="));
				assert.isTrue(dripLang.isOperator("=="));
				assert.isTrue(dripLang.isOperator("&#xD7;"));// 乘号
				assert.isTrue(dripLang.isOperator("&#xF7;"));// 除号
				assert.isTrue(dripLang.isOperator(">"));
				assert.isTrue(dripLang.isOperator("<"));
				assert.isTrue(dripLang.isOperator("!="));
				
				assert.isTrue(dripLang.isOperator("&#x2A7E;"));// 大于等于
				assert.isTrue(dripLang.isOperator("&#x226B;"));// 远大于
				assert.isTrue(dripLang.isOperator("&#x2A7D;"));// 小于等于
				assert.isTrue(dripLang.isOperator("&#x226A;"));// 远小于
				assert.isTrue(dripLang.isOperator("&#x2260;"));// 不等于
				assert.isTrue(dripLang.isOperator("&#x2248;"));// 约等于
				
				assert.isFalse(dripLang.isOperator("("));
			});
			
			test("isFenced 对称的围栏符号", function(){
				assert.isTrue(dripLang.isFenced("("));
				assert.isTrue(dripLang.isFenced("["));
				assert.isTrue(dripLang.isFenced("{"));
				assert.isTrue(dripLang.isFenced("|"));
			});
			
			test("isNewLine 输入的值是一个换行符", function(){
				assert.isTrue(dripLang.isNewLine("\n"));
				assert.isTrue(dripLang.isNewLine("\r\n"));
			});
			
			test("isMathTokenName 输入的节点名称是mathml语法下的token节点", function(){
				assert.isTrue(dripLang.isMathTokenName("mi"));
				assert.isFalse(dripLang.isMathTokenName("text"));
				assert.isFalse(dripLang.isMathTokenName("mfrac"));
			});
			
			test("_isMathLayoutNodeName 输入的节点名称是mathml语法下的layout节点", function(){
				assert.isFalse(dripLang._isMathLayoutNodeName("mi"));
				assert.isFalse(dripLang._isMathLayoutNodeName("text"));
				assert.isTrue(dripLang._isMathLayoutNodeName("mfrac"));
			});
			
			test("isGreekLetter 判断输入的值是不是希腊字母，包括大写和小写", function(){
				assert.isTrue(dripLang.isGreekLetter("&#x3B1;"));
				assert.isTrue(dripLang.isGreekLetter("&#x3B5;"));
				assert.isTrue(dripLang.isGreekLetter("&#x39F;"));
				
				assert.isFalse(dripLang.isGreekLetter("&#x3CA;"));
			});
		});
	}

});