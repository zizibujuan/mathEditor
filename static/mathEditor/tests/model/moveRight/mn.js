define([ "doh", "mathEditor/Model", "mathEditor/lang" ], function(doh, Model, dripLang) {

	doh.register("Model.moveRight.mn 在mn节点中右移",[
	    {
	    	name: "从分数后右移到分数后面的mn节点上，mn中只有一个数字",
  			setUp: function(){
  				this.model = new Model({});
  			},
  			runTest: function(t){
  				var model = this.model;
  				model.loadData("<root><line><math>" +
  						"<mstyle>" +
  							"<mfrac><mrow><mn>2</mn></mrow><mrow><mn>3</mn></mrow></mfrac>" +
  						"</mstyle>" +
  						"<mn>1</mn>" +
  						"</math></line></root>");
  				model.mode = "mathml";
  				var line = model.getLineAt(0);
  				model.anchor.node = line.firstChild.firstChild.firstChild;
  				model.anchor.offset = 1;
  				model.path = [];
  				model.path.push({nodeName: "root"});
  				model.path.push({nodeName: "line", offset: 1});
  				model.path.push({nodeName: "math", offset: 1});
  				model.path.push({nodeName: "mfrac", offset: 1});
  				
  				model.moveRight();
  				var node = model.getFocusNode();
  				t.is("/root/line[1]/math[1]/mn[2]", model.getPath()); 
  				t.is(node.nodeName, "mn");
  				t.is(1, model.getOffset());
  				t.is("1", dripLang.getText(node));
  			},
  			tearDown: function(){
  				
  			}
	    },{
	    	name: "从分数后右移到分数后面的mn节点上，mn中有两个数字",
  			setUp: function(){
  				this.model = new Model({});
  			},
  			runTest: function(t){
  				var model = this.model;
  				model.loadData("<root><line><math>" +
  						"<mstyle>" +
  							"<mfrac><mrow><mn>2</mn></mrow><mrow><mn>3</mn></mrow></mfrac>" +
  						"</mstyle>" +
  						"<mn>12</mn>" +
  						"</math></line></root>");
  				model.mode = "mathml";
  				var line = model.getLineAt(0);
  				model.anchor.node = line.firstChild.firstChild.firstChild;
  				model.anchor.offset = 1;
  				model.path = [];
  				model.path.push({nodeName: "root"});
  				model.path.push({nodeName: "line", offset: 1});
  				model.path.push({nodeName: "math", offset: 1});
  				model.path.push({nodeName: "mfrac", offset: 1});
  				
  				model.moveRight();
  				var node = model.getFocusNode();
  				t.is("/root/line[1]/math[1]/mn[2]", model.getPath()); 
  				t.is(node.nodeName, "mn");
  				t.is(1, model.getOffset());
  				t.is("12", dripLang.getText(node));
  			},
  			tearDown: function(){
  				
  			}
	    }
	                             
	]);
});