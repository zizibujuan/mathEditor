// 输入英文字母
define([ "doh","mathEditor/Model" ], function(doh,Model) {

	doh.register("Model.setData 英文字母",[
		{
			name: "在空的model中输入一个英文字母",
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
			name: "在空的model中输入连续输入两个英文字母",
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
			name: "在空的model中输入一个字母之后，再输入一个字母",
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
			name: "在空的model中输入两个字母，然后在字母中间插入一个字母",
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
			name: "在空的model中输入一个字母，然后在字母的前面插入一个字母",
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
		}
	                             
	]);
});