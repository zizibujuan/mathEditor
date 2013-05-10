define([ "doh","mathEditor/Model" ], function(doh,Model) {

	doh.register("Model.moveRight.token 在mathml token节点之间右移",[
	    {
			name: "mathml模式下，从mn节点移到mo节点",
			setUp: function(){
				this.model = new Model({});
			},
			runTest: function(t){
				var model = this.model;
				model.loadData("<root><line><math><mn>1</mn><mo>+</mo></math></line></root>");
				model.mode = "mathml";
				var line = model.getLineAt(0);
				model.anchor.node = line.firstChild.firstChild;
				model.anchor.offset = 1;
				model.path = [];
				model.path.push({nodeName:"root"});
				model.path.push({nodeName:"line", offset:1});
				model.path.push({nodeName:"math", offset:1});
				model.path.push({nodeName:"mn", offset:1});
				
				model.moveRight();
				t.is("/root/line[1]/math[1]/mo[2]", model.getPath());
				t.is("mo", model.getFocusNode().nodeName);
				t.is(1, model.getOffset());
			},
			tearDown: function(){
				
			}
		},{
	    	name: "mathml模式下，当mn为占位符时，判断是否能往在token中往右移动",
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
  				model.path = [];
  				model.path.push({nodeName: "root"});
  				model.path.push({nodeName: "line", offset: 1});
  				model.path.push({nodeName: "math", offset: 1});
  				model.path.push({nodeName: "mn", offset: 1});
  				t.f(model._canMoveRightWithInToken(model.anchor));
  			},
  			tearDown: function(){
  				
  			}
	    },{
	    	name: "往右移动时，判断当前光标是不是在token中移动",
  			setUp: function(){
  				this.model = new Model({});
  			},
  			runTest: function(t){
  				var model = this.model;
  				model.setData({data:"a"});
  				model.moveLeft();
  				t.t(model._canMoveRightWithInToken(model.anchor));
  			},
  			tearDown: function(){
  				
  			}
	    }
	                             
	]);
});