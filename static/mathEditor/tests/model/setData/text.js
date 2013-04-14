define([ "doh","mathEditor/Model" ], function(doh,Model) {

	doh.register("Model.setData 在text中输入文本",[
	    /********************text模式下，输入英文字母*******************/
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
		/****************text模式下输入数字*********************/
		// TODO:增加text模式下输入数字的测试用例
	    {
	    	name: "text模式下,输入数字。text模式下，对数字和字母的处理逻辑是一样的。",
  			setUp: function(){
  				this.model = new Model({});
  			},
  			runTest: function(t){
  				var model = this.model;
  				model.setData({data:"1"});
  				var focusNode = model.getFocusNode();
  				t.is("/root/line[1]/text[1]", model.getPath());
  				t.is("text", focusNode.nodeName);
  				t.is(1, model.getOffset());
  				t.is("1", focusNode.textContent);
  				
  				model.setData({data:"2"});
  				focusNode = model.getFocusNode();
  				t.is("/root/line[1]/text[1]", model.getPath());
  				t.is("text", focusNode.nodeName);
  				t.is(2, model.getOffset());
  				t.is("12", focusNode.textContent);
  				
  				model.anchor.offset--;
  				model.setData({data:"3"});
  				focusNode = model.getFocusNode();
  				t.is("/root/line[1]/text[1]", model.getPath());
  				t.is("text", focusNode.nodeName);
  				t.is(2, model.getOffset());
  				t.is("132", focusNode.textContent);
  			},
  			tearDown: function(){
  				
  			}
	    },{
	    	name: "在移出math节点后，后面没有任何内容时，输入字母",
	    	setUp: function(){
  				this.model = new Model({});
  			},
  			runTest: function(t){
  				var model = this.model;
  				model.toMathMLMode();
  				model.setData({data:"", nodeName:"mfrac"});
  				model.moveRight();
  				model.moveRight();
  				model.moveRight();
  				// 移出math节点后，默认切换到text模式
  				t.is("text", model.mode);
  				model.setData({data:"a"});
  				
  				var focusNode = model.getFocusNode();
  				t.is("/root/line[1]/text[2]", model.getPath());
  				t.is("text", focusNode.nodeName);
  				t.is(1, model.getOffset());
  				t.is("a", focusNode.textContent);
  			},
  			tearDown: function(){
  				
  			}
	    }                        
	]);
});