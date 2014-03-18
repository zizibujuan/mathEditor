define([ "intern!tdd", 
         "intern/chai!assert",
         "mathEditor/Model", 
         "mathEditor/lang" ], function(
        		 tdd,
        		 assert,
        		 Model, 
        		 dripLang) {
	
	with(tdd){
		suite("Model.moveLeft", function(){
			
			var model = null;
			beforeEach(function () {
				model = new Model({});
			});
			
			test("text模式下，输入一个换行符，然后执行一次左移", function(){
				model.setData({data:"\n"});
				model.moveLeft();
				
				assert.equal("/root/line[1]", model.getPath());
				assert.equal(model.getFocusNode(), model.getLineAt(0));
				assert.equal(0, model.getOffset());
			});
			
			test("mathml模式下，model中没有任何内容时，直接跳转出math", function(){
				model.toMathMLMode();
				model.moveLeft();
				var focusNode = model.getFocusNode();
				assert.equal("math", focusNode.nodeName);
				assert.equal(0, model.getOffset());
			});
			
			test("text模式下，在model中的text节点中往左移动", function(){
				model.setData({data:"你我他"});
				
				var node1 = model.getFocusNode();
				var offset1 = model.getOffset();
				assert.equal(3, offset1);
				
				model.moveLeft();
				var node2 = model.getFocusNode();
				var offset2 = model.getOffset();
				assert.equal(2, offset2);
				assert.equal(node1, node2);
				
				model.moveLeft();
				var node3 = model.getFocusNode();
				var offset3 = model.getOffset();
				assert.equal(1, offset3);
				assert.equal(node1, node3);
				
				model.moveLeft();
				var node4 = model.getFocusNode();
				var offset4 = model.getOffset();
				assert.equal(0, offset4);
				assert.equal(node1, node4);
				
				model.moveLeft();
				var node5 = model.getFocusNode();
				var offset5 = model.getOffset();
				assert.equal(0, offset5);
				assert.equal(node1, node4);
			});
			
			// 、这里需要在text和mathml两个模式之间切换。
			test("mn节点向text节点移动", function(){
				model.setData({data: "我"});
				model.toMathMLMode();
				model.setData({data: "1"});
				// TODO：在setData时，需要考虑所处的位置，是不是在text和math节点之间。
				model.moveLeft();
				// 在设置聚焦节点和聚焦位置遵循就近原则。
				assert.equal("mn", model.getFocusNode().nodeName);
				assert.equal(0, model.getOffset());
				model.moveLeft();
				assert.equal("math", model.getFocusNode().nodeName);
				assert.equal(0, model.getOffset());
			});
			
			// 从text节点进入mn节点，先进入math模式，然后再移动
			test("text节点向mn节点移动", function(){
				model.toMathMLMode();
				model.setData({data: "1"});
				model.toTextMode();
				model.setData({data: "我"});
				model.moveLeft();
				assert.equal("text", model.getFocusNode().nodeName);
				assert.equal(0, model.getOffset());
				model.moveLeft();
				// 切换到math模式下，同时进入math最后可输入的节点后面
				assert.equal("mn", model.getFocusNode().nodeName);
				assert.equal(1, model.getOffset());
				model.moveLeft();
				assert.equal("mn", model.getFocusNode().nodeName);
				assert.equal(0, model.getOffset());
			});
			
			test("text模式下，从第二个空的line节点移动到第一个line节点的末尾", function(){
				model.setData({data:"中"});
				model.setData({data:"\n"});
				model.moveLeft();
				assert.equal("text", model.getFocusNode().nodeName);
				assert.equal(1, model.getOffset());
				assert.equal("/root/line[1]/text[1]", model.getPath());
				model.clear();
				
				// mathml模式下暂不支持输入回车符号。
//				model.toMathMLMode();
//				model.setData({data:"1"});
//				model.setData({data:"\n"});
//				model.moveLeft();
//				assert.equal("/root/line[1]/math[1]/mn[1]", model.getPath());
//				assert.equal("mn", model.getFocusNode().nodeName);
//				assert.equal(1, model.getOffset());
			});
			
			test("text模式下，从第二个非空的line节点的最前面移动到第一个line节点的末尾", function(){
				model.setData({data:"中"});
				model.setData({data:"\n"});
				model.setData({data:"文"});
				
				model.moveLeft();
				model.moveLeft();
				assert.equal("/root/line[1]/text[1]", model.getPath());
				assert.equal("中",dripLang.getText(model.getFocusNode()));
				assert.equal("text",model.getFocusNode().nodeName);
				assert.equal(1, model.getOffset());
				model.clear();
				
				// mathml模式下暂不支持输入回车符号。
//				model.toMathMLMode();
//				model.setData({data:"1"});
//				model.setData({data:"\n"});
//				model.toTextMode();
//				model.setData({data:"文"});
//				model.moveLeft();
//				model.moveLeft();
//				assert.equal("/root/line[1]/math[1]/mn[1]", model.getPath());
//				assert.equal("1",dripLang.getText(model.getFocusNode()));
//				assert.equal("mn",model.getFocusNode().nodeName);
//				assert.equal(1, model.getOffset());
			});
			
			
		});
	}
	
});

// 行之间的移动