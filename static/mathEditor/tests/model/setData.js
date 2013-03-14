define([ "doh","mathEditor/Model" ], function(doh,Model) {
	
	function getNodeByXPath(xpath, node){
		var xpathResult = document.evaluate(xpath, node,null, XPathResult.ORDERED_NODE_ITERATOR_TYPE, null);
		var node = xpathResult.iterateNext();
		return node;
	}
	
	doh.register("Model.setData",[
  		{
  			name: "model中有一个中文字符，在中文字符\"后面\"添加一个数字",
  			setUp: function(){
  				this.model = new Model({});
  			},
  			runTest: function(t){
  				// 结果是在line中先加一个text节点，然后再加一个math节点
  				var model = this.model;
  				// 如果是中文，则放在text节点中
  				model.setData({data:"中"});
  				model._toMathMLMode();
  				model.setData({data:"1"});
  				t.is("/root/line[1]/math[2]/mn[1]", model.getPath());
  				t.is(model.getFocusNode().nodeName, "mn");
  				t.is(1, model.getOffset());
  				t.is(2, model.getLineAt(0).childNodes.length);
  			},
  			tearDown: function(){
  				
  			}
  		},
  		{
  			name: "model中有一个中文字符，在中文字符\"前面\"加一个数字",
  			setUp: function(){
  				this.model = new Model({});
  			},
  			runTest: function(t){
  				// 结果是在line中先加一个text节点，然后再加一个math节点
  				var model = this.model;
  				// 如果是中文，则放在text节点中
  				model.setData({data:"中"});
  				model.moveLeft();
  				model._toMathMLMode();
  				model.setData({data:"1"});
  				t.is("/root/line[1]/math[1]/mn[1]", model.getPath());
  				t.is(model.getFocusNode().nodeName, "mn");
  				t.is(1, model.getOffset());
  				var children = model.getLineAt(0).childNodes;
  				t.is(2, children.length);
  				t.is("math", children[0].nodeName);
  				t.is("text", children[1].nodeName);
  			},
  			tearDown: function(){
  				
  			}
  		},
  		{
  			name: "在已有一个数字的model中添加中文",
  			setUp: function(){
  				this.model = new Model({});
  			},
  			runTest: function(t){
  				// 结果是在line中先加一个text节点，然后再加一个math节点
  				var model = this.model;
  				model._toMathMLMode();
  				// 如果是中文，则放在text节点中
  				model.setData({data:"1"});
  				model._toTextMode();
  				model.setData({data:"中"});
  				t.is("/root/line[1]/text[2]", model.getPath());
  				t.is(model.getFocusNode().nodeName, "text");
  				t.is(1, model.getOffset());
  				// 确认text没有被放在math节点中
  				t.is(2, model.getLineAt(0).childNodes.length);
  			},
  			tearDown: function(){
  				
  			}
  		},
  		{
  			name: "在一个空的model中输入1+1=2",
  			setUp: function(){
  				this.model = new Model({});
  			},
  			runTest: function(t){
  				// 结果是在line中先加一个text节点，然后再加一个math节点
  				var model = this.model;
  				model._toMathMLMode();
  				// 如果是中文，则放在text节点中
  				model.setData({data:"1"});
  				t.is("/root/line[1]/math[1]/mn[1]", model.getPath());
  				t.is(model.getFocusNode().nodeName, "mn");
  				t.is(1, model.getOffset());
  				model.setData({data:"+"});
  				t.is("/root/line[1]/math[1]/mo[2]", model.getPath());
  				t.is(model.getFocusNode().nodeName, "mo");
  				t.is(1, model.getOffset());
  				model.setData({data:"1"});
  				t.is("/root/line[1]/math[1]/mn[3]", model.getPath());
  				t.is(model.getFocusNode().nodeName, "mn");
  				t.is(1, model.getOffset());
  				model.setData({data:"="});
  				t.is("/root/line[1]/math[1]/mo[4]", model.getPath());
  				t.is(model.getFocusNode().nodeName, "mo");
  				t.is(1, model.getOffset());
  				model.setData({data:"2"});
  				t.is("/root/line[1]/math[1]/mn[5]", model.getPath());
  				t.is(model.getFocusNode().nodeName, "mn");
  				t.is(1, model.getOffset());
  			},
  			tearDown: function(){
  				
  			}
  		},
  		{
  			name: "替换字符",
  			setUp: function(){
  				this.model = new Model({});
  			},
  			runTest: function(t){
  				var model = this.model;
  				model.setData({data:"你们好"});
  				model.setData({data:"",removeCount:2});
  				t.is("/root/line[1]/text[1]", model.getPath());
  				t.is(model.getFocusNode().nodeName, "text");
  				t.is("你", model.getFocusNode().textContent);
  				t.is(1, model.getOffset());
  				model.clear();
  				// TODO：如果删除的text界面中没有任何内容，则应该删除该节点
  				// TODO：在remove系列方法中实现。
  				model._toMathMLMode();
  				model.setData({data:"12"});
  				model.setData({data:"3",removeCount:1});
  				t.is("/root/line[1]/math[1]/mn[1]", model.getPath());
  				t.is(model.getFocusNode().nodeName, "mn");
  				t.is("13", model.getFocusNode().textContent);
  				t.is(2, model.getOffset());
  			},
  			tearDown: function(){
  				
  			}
  		},
  		{
  			name: "当model中的math值被删除完后，重新输入新的math值",
  			setUp: function(){
  				this.model = new Model({});
  			},
  			runTest: function(t){
  				var model = this.model;
  				model._toMathMLMode();
  				model.setData({data:"1"});
  				model.removeLeft();
  				t.is("/root/line[1]", model.getPath());
  				t.is(model.getFocusNode().nodeName, "line");
  				t.is(0, model.getOffset());
  				
  				model.setData({data:"2"});
  				t.is("/root/line[1]/math[1]/mn[1]", model.getPath());
  				t.is(model.getFocusNode().nodeName, "mn");
  				t.is("2", model.getFocusNode().textContent);
  				t.is(1, model.getOffset());
  			},
  			tearDown: function(){
  				
  			}
  		},
  		{
  			name: "在两个中文字符中间插入数字1后，行中应该被分为三部分",
  			setUp: function(){
  				this.model = new Model({});
  			},
  			runTest: function(t){
  				var model = this.model;
  				model.setData({data:"你我"});
  				model.anchor.offset--;
  				model._toMathMLMode();
  				model.setData({data:"1"});
  				
  				t.is("/root/line[1]/math[2]/mn[1]", model.getPath());
  				var node = model.getFocusNode();
  				t.is("mn", node.nodeName);
  				t.is(1, model.getOffset());
  				var children = model.getLineAt(0).childNodes;
  				t.is(3, children.length);
  				t.is("text", children[0].nodeName);
  				t.is("math", children[1].nodeName);
  				t.is("text", children[2].nodeName);
  				
  				t.is("你", children[0].textContent);
  				t.is("1", children[1].textContent);
  				t.is("我", children[2].textContent);
  			},
  			tearDown: function(){
  				
  			}
  		}
  	]);
});