define([ "doh","mathEditor/Model" ], function(doh,Model) {

	doh.register("Model.moveRight.math",[
	    {
	    	name: "从math节点前，向右往math内层移动，移到token节点内容的前面",
  			setUp: function(){
  				this.model = new Model({});
  			},
  			runTest: function(t){
  				var model = this.model;
  				model.loadData("<root><line><math><mn>12</mn></math></line></root>");
  				model.mode = "mathml";
  				var line = model.getLineAt(0);
  				model.anchor.node = line.firstChild;
  				model.anchor.offset = 0;
  				model.path.push({nodeName: "root"});
  				model.path.push({nodeName: "line", offset: 1});
  				model.path.push({nodeName: "math", offset: 1});
  				model.moveRight();
  				// 直接移到token节点的内容后面。
  				t.is("/root/line[1]/math[1]/mn[1]", model.getPath());
  				var focusNode = model.getFocusNode();
  				t.is("mn", focusNode.nodeName);
  				t.is(0, model.getOffset());
  			},
  			tearDown: function(){
  				
  			}
	    },{
	    	name: "从math节点前，向右往math内层移动,移到layout节点前面，layout节点外没有mstyle节点。",
  			setUp: function(){
  				this.model = new Model({});
  			},
  			runTest: function(t){
  				var model = this.model;
  				model.loadData("<root><line><math><mfrac><mrow><mn>1</mn></mrow><mrow><mn>2</mn></mrow></mfrac></math></line></root>");
  				model.mode = "mathml";
  				var line = model.getLineAt(0);
  				model.anchor.node = line.firstChild;
  				model.anchor.offset = 0;
  				model.path.push({nodeName: "root"});
  				model.path.push({nodeName: "line", offset: 1});
  				model.path.push({nodeName: "math", offset: 1});
  				model.moveRight();
  				// 直接移到layout节点的内容后面。
  				t.is("/root/line[1]/math[1]/mfrac[1]", model.getPath());
  				var focusNode = model.getFocusNode();
  				t.is("mfrac", focusNode.nodeName);
  				t.is(0, model.getOffset());
  			},
  			tearDown: function(){
  				
  			}
	    },{
	    	name: "从math节点前，向右往math内层移动,移到layout节点前面，layout节点外有mstyle节点。",
  			setUp: function(){
  				this.model = new Model({});
  			},
  			runTest: function(t){
  				var model = this.model;
  				model.loadData("<root><line><math><mstyle displaystyle='true'><mfrac><mrow><mn>1</mn></mrow><mrow><mn>2</mn></mrow></mfrac></mstyle></math></line></root>");
  				model.mode = "mathml";
  				var line = model.getLineAt(0);
  				model.anchor.node = line.firstChild;
  				model.anchor.offset = 0;
  				model.path.push({nodeName: "root"});
  				model.path.push({nodeName: "line", offset: 1});
  				model.path.push({nodeName: "math", offset: 1});
  				model.moveRight();
  				t.is("/root/line[1]/math[1]/mfrac[1]", model.getPath());
  				var focusNode = model.getFocusNode();
  				t.is("mfrac", focusNode.nodeName);
  				t.is(0, model.getOffset());
  			},
  			tearDown: function(){
  				
  			}
	    }
	                             
	]);
});