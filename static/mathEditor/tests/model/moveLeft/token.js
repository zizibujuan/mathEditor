define([ "doh","mathEditor/Model" ], function(doh,Model) {

	doh.register("Model.moveLeft 在mathml token节点之间左移",[
	    {
			name: "mathml模式下，从mo节点移到mn节点",
			setUp: function(){
				this.model = new Model({});
			},
			runTest: function(t){
				var model = this.model;
				model.toMathMLMode();
				model.setData({data:"11"});
				t.is("11", model.getFocusNode().textContent);
				model.setData({data:"+"});
				model.moveLeft();
				t.is("/root/line[1]/math[1]/mo[2]", model.getPath());
				t.is("mo", model.getFocusNode().nodeName);
				t.is(0, model.getOffset());
				
				model.moveLeft();
				t.is("/root/line[1]/math[1]/mn[1]", model.getPath());
				t.is("mn", model.getFocusNode().nodeName);
				t.is(1, model.getOffset());
				
				model.moveLeft();
				t.is("/root/line[1]/math[1]/mn[1]", model.getPath());
				t.is("mn", model.getFocusNode().nodeName);
				t.is(0, model.getOffset());
			},
			tearDown: function(){
				
			}
		}
	                             
	]);
});