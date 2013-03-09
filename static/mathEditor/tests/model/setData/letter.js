// 输入英文字母
define([ "doh","mathEditor/Model" ], function(doh,Model) {

	doh.register("Model.setData 英文字母",[
	    /********************text模式下*******************/
		{
			name: "text模式下，在空的model中输入一个英文字母",
			setUp: function(){
				this.model = new Model({});
			},
			runTest: function(t){
				var model = this.model;
				model.setData({data:"a"});
				t.is("/root/line[1]/text[1]", model.getPath());
				var focusNode = model.getFocusNode();
				t.is(focusNode.nodeName, "text");
				t.is("a", focusNode.textContent);
				t.is(1, model.getOffset());
			},
			tearDown: function(){
				
			}
		},{
			name: "text模式下，在空的model中输入连续输入两个英文字母",
			setUp: function(){
				this.model = new Model({});
			},
			runTest: function(t){
				var model = this.model;
				model.setData({data:"ab"});
				t.is("/root/line[1]/text[1]", model.getPath());
				var focusNode = model.getFocusNode();
				t.is(focusNode.nodeName, "text");
				t.is("ab", focusNode.textContent);
				t.is(2, model.getOffset());
			},
			tearDown: function(){
				
			}
		},{
			name: "text模式下，在空的model中输入一个字母之后，再输入一个字母",
			setUp: function(){
				this.model = new Model({});
			},
			runTest: function(t){
				var model = this.model;
				model.setData({data:"a"});
				model.setData({data:"b"});
				t.is("/root/line[1]/text[1]", model.getPath());
				var focusNode = model.getFocusNode();
				t.is(focusNode.nodeName, "text");
				t.is("ab", focusNode.textContent);
				t.is(2, model.getOffset());
			},
			tearDown: function(){
				
			}
		},{
			name: "text模式下，在空的model中输入两个字母，然后在字母中间插入一个字母",
			setUp: function(){
				this.model = new Model({});
			},
			runTest: function(t){
				var model = this.model;
				model.setData({data:"ab"});
				model.anchor.offset--;
				model.setData({data:"c"});
				t.is("/root/line[1]/text[1]", model.getPath());
				var focusNode = model.getFocusNode();
				t.is(focusNode.nodeName, "text");
				t.is("acb", focusNode.textContent);
				t.is(2, model.getOffset());
			},
			tearDown: function(){
				
			}
		},{
			name: "text模式下，在空的model中输入一个字母，然后在字母的前面插入一个字母",
			setUp: function(){
				this.model = new Model({});
			},
			runTest: function(t){
				var model = this.model;
				model.setData({data:"a"});
				model.anchor.offset--;
				model.setData({data:"b"});
				t.is("/root/line[1]/text[1]", model.getPath());
				var focusNode = model.getFocusNode();
				t.is(focusNode.nodeName, "text");
				t.is("ba", focusNode.textContent);
				t.is(1, model.getOffset());
			},
			tearDown: function(){
				
			}
		},
		/********************mathml模式下*******************/
		{
			name: "mathml模式下，在空的model中输入一个英文字母",
			setUp: function(){
				this.model = new Model({});
				this.model._toMathMLMode();
			},
			runTest: function(t){
				var model = this.model;
				
				model.setData({data:"x"});
				t.is("/root/line[1]/math[1]/mi[1]", model.getPath());
				var focusNode = model.getFocusNode();
				t.is("mi", focusNode.nodeName);
				t.is("x", focusNode.textContent);
				t.is(1, model.getOffset());
			},
			tearDown: function(){
				
			}
		},{
			name: "mathml模式下，在空的model中输入一个字母之后，再输入一个字母",
			setUp: function(){
				this.model = new Model({});
				this.model._toMathMLMode();
			},
			runTest: function(t){
				var model = this.model;
				model.setData({data:"x"});
				model.setData({data:"y"});
				t.is("/root/line[1]/math[1]/mi[2]", model.getPath());
				var focusNode = model.getFocusNode();
				t.is("mi", focusNode.nodeName);
				t.is("y", focusNode.textContent);
				t.is(1, model.getOffset());
				
				var previous = focusNode.previousSibling;
				t.is("mi", previous.nodeName);
				t.is("x", previous.textContent);
			},
			tearDown: function(){
				
			}
		}
	                             
	]);
});