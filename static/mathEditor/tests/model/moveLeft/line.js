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
				t.is("line", focusNode.nodeName);
				t.is(0, model.getOffset());
				t.is(focusNode, model.getLineAt(0));
			},
			tearDown: function(){
				
			}
		}
	                             
	]);
});
