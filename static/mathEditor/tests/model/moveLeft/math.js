define([ "doh","mathEditor/Model" ], function(doh,Model) {

	doh.register("Model.moveLeft.math",[
	    {
	    	name: "从math节点后，向左往math内层移动,移到token节点内容的后面。",
  			setUp: function(){
  				this.model = new Model({});
  			},
  			runTest: function(t){
  				var model = this.model;
  				model.loadData("<root><line><math><mn>12</mn></math></line></root>");
  				model.mode = "mathml";
  				var line = model.getLineAt(0);
  				model.anchor.node = line.firstChild;
  				model.anchor.offset = 1;
  				model.path.push({nodeName: "root"});
  				model.path.push({nodeName: "line", offset: 1});
  				model.path.push({nodeName: "math", offset: 1});
  				model.moveLeft();
  				// 直接移到token节点的内容后面。
  				t.is("/root/line[1]/math[1]/mn[1]", model.getPath());
  				var focusNode = model.getFocusNode();
  				t.is("mn", focusNode.nodeName);
  				t.is(2, model.getOffset());
  			},
  			tearDown: function(){
  				
  			}
	    },{
	    	name: "从math节点后，向左往math内层移动,移到layout节点上，layout节点外没有mstyle节点。",
  			setUp: function(){
  				this.model = new Model({});
  			},
  			runTest: function(t){
  				var model = this.model;
  				model.loadData("<root><line><math><mfrac><mrow><mn>1</mn></mrow><mrow><mn>2</mn></mrow></mfrac></math></line></root>");
  				model.mode = "mathml";
  				var line = model.getLineAt(0);
  				model.anchor.node = line.firstChild;
  				model.anchor.offset = 1;
  				model.path.push({nodeName: "root"});
  				model.path.push({nodeName: "line", offset: 1});
  				model.path.push({nodeName: "math", offset: 1});
  				model.moveLeft();
  				// 直接移到layout节点的内容后面。
  				t.is("/root/line[1]/math[1]/mfrac[1]", model.getPath());
  				var focusNode = model.getFocusNode();
  				t.is("mfrac", focusNode.nodeName);
  				t.is(1, model.getOffset());
  			},
  			tearDown: function(){
  				
  			}
	    },{
	    	// TODO: 了解mstyle会应用在哪些地方。
	    	name: "从math节点后，向左往math内层移动,移到layout节点上，layout节点外有mstyle节点。",
  			setUp: function(){
  				this.model = new Model({});
  			},
  			runTest: function(t){
  				var model = this.model;
  				model.loadData("<root><line><math><mstyle displaystyle='true'><mfrac><mrow><mn>1</mn></mrow><mrow><mn>2</mn></mrow></mfrac></mstyle></math></line></root>");
  				model.mode = "mathml";
  				var line = model.getLineAt(0);
  				model.anchor.node = line.firstChild;
  				model.anchor.offset = 1;
  				model.path.push({nodeName: "root"});
  				model.path.push({nodeName: "line", offset: 1});
  				model.path.push({nodeName: "math", offset: 1});
  				model.moveLeft();
  				// 直接移到layout节点的内容后面。
  				t.is("/root/line[1]/math[1]/mfrac[1]", model.getPath());
  				var focusNode = model.getFocusNode();
  				t.is("mfrac", focusNode.nodeName);
  				t.is(1, model.getOffset());
  			},
  			tearDown: function(){
  				
  			}
	    }
	    // TODO：左移，移出。
	                             
	]);
});