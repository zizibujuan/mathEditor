define([ "doh","mathEditor/Model" ], function(doh,Model) {

	doh.register("Model.moveRight line节点间右移",[
		{
			name:"text模式下，model中没有任何内容时，执行右移，则什么也不做",
			setUp: function(){
				this.model = new Model({});
			},
			runTest: function(t){
				var model = this.model;
				model.moveRight();
				var focusNode = model.getFocusNode();
				t.is("/root/line[1]", model.getPath());
				t.is("line", focusNode.nodeName);
				t.is(0, model.getOffset());
				t.is(focusNode, model.getLineAt(0));
			},
			tearDown: function(){
				
			}
		},{
			name:"text模式下，输入换行符，执行左移，然后执行右移，光标停留在第二行",
			setUp: function(){
				this.model = new Model({});
			},
			runTest: function(t){
				var model = this.model;
				model.setData({data:"\n"});
				model.moveLeft();
				model.moveRight();
				t.is("/root/line[2]", model.getPath());
				var focusNode = model.getFocusNode();
				t.is("line", focusNode.nodeName);
				t.is(0, model.getOffset());
				t.is(focusNode, model.getLineAt(1));
			},
			tearDown: function(){
				
			}
		}
	                             
	]);
});
