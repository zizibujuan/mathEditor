define([ "intern!tdd", 
         "intern/chai!assert", 
         "mathEditor/string" ], function(
        		 tdd,
        		 assert, 
        		 dripString) {

	with(tdd){
		suite("string 工具类", function(){
			test("insertAtOffset 插入字符", function(){
				assert.equal("1a",dripString.insertAtOffset("1",1,"a"));
				assert.equal("a1",dripString.insertAtOffset("1",0,"a"));
				assert.equal("1a2",dripString.insertAtOffset("12",1,"a"));
			});
			
			test("insertAtOffset 替换字符", function(){
				assert.equal("",dripString.insertAtOffset("12",2,"",2));
				assert.equal("123",dripString.insertAtOffset("1a3",2,"2",1));
			});
			
			test("拆分字符", function(){
				var dataArray = dripString.splitData("你好");
				assert.equal("你",dataArray[0]);
				assert.equal("好",dataArray[1]);
				
				dataArray = dripString.splitData("&1;");
				assert.equal("&1;",dataArray[0]);
				assert.isTrue(dataArray.length == 1);
				
				// 如果&和;之间不存在任何值，则不做unicode处理
				dataArray = dripString.splitData("&;");
				assert.equal("&",dataArray[0]);
				assert.equal(";",dataArray[1]);
				assert.isTrue(dataArray.length == 2);
				
				dataArray = dripString.splitData("1&#xD7;2");
				assert.equal("1",dataArray[0]);
				assert.equal("&#xD7;",dataArray[1]);
				assert.equal("2",dataArray[2]);
				assert.isTrue(dataArray.length == 3);
				
				dataArray = dripString.splitData("=");
				assert.equal("=", dataArray[0]);
				assert.isTrue(dataArray.length == 1);
				
				// 测试操作符的长度为2时
				dataArray = dripString.splitData("==");
				assert.equal("==", dataArray[0]);
				assert.isTrue(dataArray.length == 1);
				
				dataArray = dripString.splitData("!=");
				assert.equal("!=", dataArray[0]);
				assert.isTrue(dataArray.length == 1);
				
				// 测试操作符的长度为>=2时, 只发现一个不常用的|||, 
				// 因此暂不支持。
			});
			
			test("insertAtOffset 删除unicode字符", function(){
				// assert.equal("",dripString.insertAtOffset("&#1;",1,"",1));
				// 因为现在unicode码都是存在mo节点中，在removeLeft中已经处理了删除unicode的逻辑，所以在
				// insertAtOffset中暂不做处理
			});
		});
	}

});