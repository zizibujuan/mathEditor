define([ "doh","mathEditor/Model" ], function(doh,Model) {

	doh.register("Model.moveLeft.token 在mathml token节点之间左移",[
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
		},{
	    	name: "mathml模式下，当mn为占位符时，判断是否能往在token中往左移动",
  			setUp: function(){
  				this.model = new Model({});
  			},
  			runTest: function(t){
  				var model = this.model;
  				model.loadData("<root><line><math><mn class=\"drip_placeholder_box\">8</mn></math></line></root>");
  				var line = model.getLineAt(0);
  				model.mode = "mathml";
  				model.anchor.node = line.firstChild.firstChild;
  				model.anchor.offset = 0;
  				model.path.push({nodeName: "root"});
  				model.path.push({nodeName: "line", offset: 1});
  				model.path.push({nodeName: "math", offset: 1});
  				model.path.push({nodeName: "mn", offset: 1});
  				t.f(model._canMoveLeftWithInToken(model.anchor));
  			},
  			tearDown: function(){
  				
  			}
	    },{
	    	name: "往左移动时，判断当前光标是不是在token中移动",
  			setUp: function(){
  				this.model = new Model({});
  			},
  			runTest: function(t){
  				var model = this.model;
  				model.setData({data:"a"});
  				t.t(model._canMoveLeftWithInToken(model.anchor));
  			},
  			tearDown: function(){
  				
  			}
	    }
	                             
	]);
});