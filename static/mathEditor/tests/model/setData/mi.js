// 输入英文字母
define([ "doh","mathEditor/Model" ], function(doh,Model) {

	doh.register("Model.setData.mi 输入变量",[
	    
		/********************mathml模式下*******************/
		{
			name: "mathml模式下，在空的model中输入一个英文字母",
			setUp: function(){
				this.model = new Model({});
				this.model.toMathMLMode();
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
				this.model.toMathMLMode();
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
		},{
			name: "mathml模式下，在空的model中输入一个字母之后，然后在这个字母前输入一个字母",
			setUp: function(){
				this.model = new Model({});
				this.model.toMathMLMode();
			},
			runTest: function(t){
				var model = this.model;
				model.setData({data:"x"});
				model.anchor.offset--;
				model.setData({data:"y"});
				t.is("/root/line[1]/math[1]/mi[1]", model.getPath());
				var focusNode = model.getFocusNode();
				t.is("mi", focusNode.nodeName);
				t.is("y", focusNode.textContent);
				t.is(1, model.getOffset());
				
				var previous = focusNode.nextSibling;
				t.is("mi", previous.nodeName);
				t.is("x", previous.textContent);
			},
			tearDown: function(){
				
			}
		},{
			name: "mathml模式下，在空的model中输入两个字母，然后在两个字母中间输入一个字母",
			setUp: function(){
				this.model = new Model({});
				this.model.toMathMLMode();
			},
			runTest: function(t){
				var model = this.model;
				model.setData({data:"x"});
				model.setData({data:"y"});
				model.anchor.offset--;
				model.setData({data:"z"});
				t.is("/root/line[1]/math[1]/mi[2]", model.getPath());
				var focusNode = model.getFocusNode();
				t.is("mi", focusNode.nodeName);
				t.is("z", focusNode.textContent);
				t.is(1, model.getOffset());
				
				var previous = focusNode.previousSibling;
				t.is("mi", previous.nodeName);
				t.is("x", previous.textContent);
				
				var next = focusNode.nextSibling;
				t.is("mi", next.nodeName);
				t.is("y", next.textContent);
			},
			tearDown: function(){
				
			}
		}
	                             
	]);
});