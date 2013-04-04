define([ "doh","mathEditor/Model" ], function(doh,Model) {

	doh.register("Model.moveRight 在mathml token节点之间右移",[
	    {
			name: "mathml模式下，从mn节点移到mo节点",
			setUp: function(){
				this.model = new Model({});
			},
			runTest: function(t){
				var model = this.model;
				model.toMathMLMode();
				model.setData({data:"1"});
				model.setData({data:"+"});
				model.moveLeft();
				model.moveLeft();
				
				model.moveRight();
				t.is("/root/line[1]/math[1]/mn[1]", model.getPath());
				t.is("mn", model.getFocusNode().nodeName);
				t.is(1, model.getOffset());
				
				model.moveRight();
				t.is("/root/line[1]/math[1]/mo[2]", model.getPath());
				t.is("mo", model.getFocusNode().nodeName);
				t.is(1, model.getOffset());
			},
			tearDown: function(){
				
			}
		}
	                             
	]);
});