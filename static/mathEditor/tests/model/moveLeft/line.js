define([ "doh","mathEditor/Model" ], function(doh,Model) {

	doh.register("Model.moveLeft line节点间左移",[
	    {
			name:"text模式下，model中没有任何内容时，执行左移，则什么也不做",
			setUp: function(){
				this.model = new Model({});
			},
			runTest: function(t){
				var model = this.model;
				model.moveLeft();
				var focusNode = model.getFocusNode();
				t.is("/root/line[1]", model.getPath());
				t.is("line", focusNode.nodeName);
				t.is(0, model.getOffset());
				t.is(focusNode, model.getLineAt(0));
			},
			tearDown: function(){
				
			}
		},{
			name:"text模式下，输入换行符，执行左移，则移动到第一行",
			setUp: function(){
				this.model = new Model({});
			},
			runTest: function(t){
				var model = this.model;
				model.setData({data:"\n"});
				model.moveLeft();
				var focusNode = model.getFocusNode();
				t.is("/root/line[1]", model.getPath());
				t.is("line", focusNode.nodeName);
				t.is(0, model.getOffset());
				t.is(focusNode, model.getLineAt(0));
			},
			tearDown: function(){
				
			}
		},{
			name:"text模式下，在第一行输入字符，输入回车符，然后在第二行输入字符，执行左移操作，然后再执行左移操作，第一行末尾获取光标",
			setUp: function(){
				this.model = new Model({});
			},
			runTest: function(t){
				var model = this.model;
				model.setData({data:"a"});
				model.setData({data:"\n"});
				model.setData({data:"b"});
				model.moveLeft();
				model.moveLeft();
				t.is("/root/line[1]/text[1]", model.getPath());
				var focusNode = model.getFocusNode();
				t.is("text", focusNode.nodeName);
				t.is(1, model.getOffset());
			},
			tearDown: function(){
				
			}
		}
	                             
	]);
});
