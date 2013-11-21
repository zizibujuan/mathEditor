define([ "intern!tdd", 
         "intern/chai!assert",
         "mathEditor/Model", 
         "mathEditor/lang" ], function(
        		 tdd,
        		 assert,
        		 Model, 
        		 dripLang) {
	
	function getNodeByXPath(xpath, node){
		var xpathResult = document.evaluate(xpath, node,null, XPathResult.ORDERED_NODE_ITERATOR_TYPE, null);
		var node = xpathResult.iterateNext();
		return node;
	}
	
	with(tdd){
		suite("Model.setData", function(){
			
			var model = null;
			beforeEach(function () {
				model = new Model({});
			});
			
			test("model中有一个中文字符，在中文字符\"后面\"添加一个数字", function(){
				// 结果是在line中先加一个text节点，然后再加一个math节点
  				// 如果是中文，则放在text节点中
  				model.setData({data:"中"});
  				model.toMathMLMode();
  				model.setData({data:"1"});
  				assert.equal("/root/line[1]/math[2]/mn[1]", model.getPath());
  				assert.equal(model.getFocusNode().nodeName, "mn");
  				assert.equal(1, model.getOffset());
  				assert.equal(2, model.getLineAt(0).childNodes.length);
			});
			
			test("model中有一个中文字符，在中文字符\"前面\"加一个数字", function(){
				// 结果是在line中先加一个text节点，然后再加一个math节点
  				// 如果是中文，则放在text节点中
  				model.setData({data:"中"});
  				model.moveLeft();
  				model.toMathMLMode();
  				model.setData({data:"1"});
  				assert.equal("/root/line[1]/math[1]/mn[1]", model.getPath());
  				assert.equal(model.getFocusNode().nodeName, "mn");
  				assert.equal(1, model.getOffset());
  				var children = model.getLineAt(0).childNodes;
  				assert.equal(2, children.length);
  				assert.equal("math", children[0].nodeName);
  				assert.equal("text", children[1].nodeName);
			});
			
			test("在已有一个数字的model中添加中文", function(){
				model.toMathMLMode();
  				// 如果是中文，则放在text节点中
  				model.setData({data:"1"});
  				model.toTextMode();
  				model.setData({data:"中"});
  				assert.equal("/root/line[1]/text[2]", model.getPath());
  				assert.equal(model.getFocusNode().nodeName, "text");
  				assert.equal(1, model.getOffset());
  				// 确认text没有被放在math节点中
  				assert.equal(2, model.getLineAt(0).childNodes.length);
			});
			
			test("在一个空的model中输入1+1=2", function(){
				var focusNode = null;
  				model.toMathMLMode();
  				// 如果是中文，则放在text节点中
  				model.setData({data:"1"});
  				assert.equal("/root/line[1]/math[1]/mn[1]", model.getPath());
  				focusNode = model.getFocusNode();
  				assert.equal(focusNode.nodeName, "mn");
  				assert.equal(1, model.getOffset());
  				assert.equal("1", dripLang.getText(focusNode));
  				
  				model.setData({data:"+"});
  				focusNode = model.getFocusNode();
  				assert.equal("/root/line[1]/math[1]/mo[2]", model.getPath());
  				assert.equal(focusNode.nodeName, "mo");
  				assert.equal(1, model.getOffset());
  				assert.equal("+", dripLang.getText(focusNode));
  				
  				model.setData({data:"1"});
  				focusNode = model.getFocusNode();
  				assert.equal("/root/line[1]/math[1]/mn[3]", model.getPath());
  				assert.equal(focusNode.nodeName, "mn");
  				assert.equal(1, model.getOffset());
  				assert.equal("1", dripLang.getText(focusNode));
  				
  				model.setData({data:"="});
  				focusNode = model.getFocusNode();
  				assert.equal("/root/line[1]/math[1]/mo[4]", model.getPath());
  				assert.equal(focusNode.nodeName, "mo");
  				assert.equal(1, model.getOffset());
  				assert.equal("=", dripLang.getText(focusNode));
  				
  				model.setData({data:"2"});
  				focusNode = model.getFocusNode();
  				assert.equal("/root/line[1]/math[1]/mn[5]", model.getPath());
  				assert.equal(focusNode.nodeName, "mn");
  				assert.equal(1, model.getOffset());
  				assert.equal("2", dripLang.getText(focusNode));
			});
			
			test("替换字符", function(){
				model.setData({data:"你们好"});
  				model.setData({data:"",removeCount:2});
  				assert.equal("/root/line[1]/text[1]", model.getPath());
  				assert.equal(model.getFocusNode().nodeName, "text");
  				assert.equal("你", dripLang.getText(model.getFocusNode()));
  				assert.equal(1, model.getOffset());
  				model.clear();
  				// TODO：如果删除的text界面中没有任何内容，则应该删除该节点
  				// TODO：在remove系列方法中实现。
  				model.toMathMLMode();
  				model.setData({data:"12"});
  				model.setData({data:"3",removeCount:1});
  				assert.equal("/root/line[1]/math[1]/mn[1]", model.getPath());
  				assert.equal(model.getFocusNode().nodeName, "mn");
  				assert.equal("13", dripLang.getText(model.getFocusNode()));
  				assert.equal(2, model.getOffset());
			});
			
			test("当model中的math值被删除完后，重新输入新的math值", function(){
				model.toMathMLMode();
  				model.setData({data:"1"});
  				model.removeLeft();
  				assert.equal("/root/line[1]/math[1]", model.getPath());
  				assert.equal("math", model.getFocusNode().nodeName);
  				assert.equal(2, model.getOffset());// layoutOffset.select
  				
  				model.setData({data:"2"});
  				assert.equal("/root/line[1]/math[1]/mn[1]", model.getPath());
  				assert.equal(model.getFocusNode().nodeName, "mn");
  				assert.equal("2", dripLang.getText(model.getFocusNode()));
  				assert.equal(1, model.getOffset());
			});
			
			test("在两个中文字符中间插入数字1后，行中应该被分为三部分", function(){
				model.setData({data:"你我"});
  				model.anchor.offset--;
  				model.toMathMLMode();
  				model.setData({data:"1"});
  				
  				assert.equal("/root/line[1]/math[2]/mn[1]", model.getPath());
  				var node = model.getFocusNode();
  				assert.equal("mn", node.nodeName);
  				assert.equal(1, model.getOffset());
  				var children = model.getLineAt(0).childNodes;
  				assert.equal(3, children.length);
  				assert.equal("text", children[0].nodeName);
  				assert.equal("math", children[1].nodeName);
  				assert.equal("text", children[2].nodeName);
  				
  				assert.equal("你", dripLang.getText(children[0]));
  				assert.equal("1", dripLang.getText(children[1]));
  				assert.equal("我", dripLang.getText(children[2]));
			});
			
			// TODO:当弹出提示框时，也要显示当前输入的值。
			
		});
	}
});