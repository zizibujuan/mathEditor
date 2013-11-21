define([ "intern!tdd", 
         "intern/chai!assert", 
         "mathEditor/Model", 
         "mathEditor/lang" ], function(
        		 tdd,
        		 assert,
        		 Model, 
        		 dripLang) {
	/**
	 * 注意：不要强行使用\n作为换行符号，而是应该使用操作系统支持的换行符号。
	 * 因为如果用户从其他文本编辑器中拷贝过来一段文字之后，如果换行符为\r\n，
	 * 则这个程序就无法正确识别。
	 */
	
	with(tdd){
		suite("Model.setData.line newLine创建新行", function(){
			
			var model = null;
			beforeEach(function () {
				model = new Model({});
			});
			
			test("text模式下，在空的model中插入一个新行，即敲击回车插入空行, 使用\\n表示换行，因此遇到keyCode为13时，转换为\\n", function(){
				// 遇到如回车符号或者换行符号这类特殊的字符时，使用转义字符表示。
  				model.setData({data:"\n"});
  				assert.ok(model.getLineCount() == 2);
  				// 如果刚开始什么都不输入，则只插入一个空的line节点，不预插入text节点
  				assert.equal("/root/line[2]", model.getPath());
  				// 测试用例需要确定，这个节点不是第一个节点
  				assert.equal("line", model.getFocusNode().nodeName);
  				// 确认当前获取焦点的行节点，是第二行
  				assert.equal(model.getFocusNode(), model.getLineAt(1));
  				assert.equal(0, model.getOffset());
  				
  				// 确定每个行中都没有值
  				assert.equal(0, model.getLineAt(0).childNodes.length);
  				assert.equal(0, model.getLineAt(1).childNodes.length);
			});
			
			test("text模式下，输入一个字符，然后输入回车符", function(){
				// 遇到如回车符号或者换行符号这类特殊的字符时，使用转义字符表示。
  				model.setData({data: "a"});
  				model.setData({data: "\n"});
  				assert.equal(2, model.getLineCount());
  				// 如果刚开始什么都不输入，则只插入一个空的line节点，不预插入text节点
  				assert.equal("/root/line[2]", model.getPath());
  				// 测试用例需要确定，这个节点不是第一个节点
  				assert.equal("line", model.getFocusNode().nodeName);
  				assert.equal(0, model.getOffset());
  				
  				assert.equal("a", dripLang.getText(model.getLineAt(0).childNodes[0]));
  				assert.equal(0, model.getLineAt(1).childNodes.length);
			});
			
			// 因为这个测试用例主要是用户测试换行，所以放在这个文件中。即使其中也间接测试了输入letter
			test("text模式下，在空的model中输入两行内容", function(){
				// 遇到如回车符号或者换行符号这类特殊的字符时，使用转义字符表示。
  				model.setData({data:"a\nb"});
  				assert.equal(2, model.getLineCount());
  				// 如果刚开始什么都不输入，则只插入一个空的line节点，不预插入text节点
  				assert.equal("/root/line[2]/text[1]", model.getPath());
  				// 测试用例需要确定，这个节点不是第一个节点
  				assert.equal("text", model.getFocusNode().nodeName);
  				assert.equal(1, model.getOffset());
  				
  				assert.equal("a", dripLang.getText(model.getLineAt(0).childNodes[0]));
  				assert.equal("b", dripLang.getText(model.getLineAt(1).childNodes[0]));
			});
			
			test("text模式下，在空的model中输入三行内容", function(){
				// 遇到如回车符号或者换行符号这类特殊的字符时，使用转义字符表示。
  				model.setData({data:"a\nb\nc"});
  				assert.equal(3, model.getLineCount());
  				// 如果刚开始什么都不输入，则只插入一个空的line节点，不预插入text节点
  				assert.equal("/root/line[3]/text[1]", model.getPath());
  				// 测试用例需要确定，这个节点不是第一个节点
  				assert.equal("text", model.getFocusNode().nodeName);
  				assert.equal(1, model.getOffset());
			});
			
			test("text模式下，在已有内容的model中输入换行符", function(){
				model.setData({data:"ab"});
  				model.anchor.offset--;
  				model.setData({data:"\n"});
  				assert.equal(2, model.getLineCount());
  				// 如果刚开始什么都不输入，则只插入一个空的line节点，不预插入text节点
  				assert.equal("/root/line[2]/text[1]", model.getPath());
  				// 测试用例需要确定，这个节点不是第一个节点
  				assert.equal("text", model.getFocusNode().nodeName);
  				assert.equal(0, model.getOffset());
  				
  				assert.equal("a", dripLang.getText(model.getLineAt(0).childNodes[0]));
  				assert.equal("b", dripLang.getText(model.getLineAt(1).childNodes[0]));
			});
			
			test("在一行有text和math的model中，输入回车符", function(){
				model.toMathMLMode();
			});
			
			test("mathml模式下，输入回车符，不做任何操作", function(){
				model.toMathMLMode();
				assert.equal("/root/line[1]/math[1]", model.getPath());
				
				model.setData({data:"\n"});
				assert.equal("/root/line[1]/math[1]", model.getPath());
				assert.equal(1, model.getLineCount());
				assert.equal("math", model.getFocusNode().nodeName);
  				assert.equal(2, model.getOffset());// 2表示当前处于选中状态
			});
		});
	}
	
});