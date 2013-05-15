define([ "doh","mathEditor/Model" ], function(doh,Model) {

	doh.register("Model.moveLeft.mn 在mn节点中左移",[
	    {
	    	name: "mathml模式下，输入一个数字，左移光标一次",
  			setUp: function(){
  				this.model = new Model({});
  			},
  			runTest: function(t){
  				var model = this.model;
  				model.toMathMLMode();
  				model.setData({data: "1"});
  				model.moveLeft();
  				t.is("/root/line[1]/math[1]/mn[1]", model.getPath()); 
  				t.is(model.getFocusNode().nodeName, "mn");
  				t.is(0, model.getOffset());
  			},
  			tearDown: function(){
  				
  			}
	    },{
	    	name: "mathml模式下，输入两个数字，左移光标两次",
  			setUp: function(){
  				this.model = new Model({});
  			},
  			runTest: function(t){
  				var model = this.model;
  				model.toMathMLMode();
  				model.setData({data: "1"});
  				model.setData({data: "2"});
  				model.moveLeft();
  				t.is("/root/line[1]/math[1]/mn[1]", model.getPath()); 
  				t.is(model.getFocusNode().nodeName, "mn");
  				t.is(1, model.getOffset());
  				
  				model.moveLeft();
  				t.is("/root/line[1]/math[1]/mn[1]", model.getPath()); 
  				t.is(model.getFocusNode().nodeName, "mn");
  				t.is(0, model.getOffset());
  			},
  			tearDown: function(){
  				
  			}
	    },{
	    	name: "从分数前左移到分数前面的mn节点前，mn中只有一个数字",
  			setUp: function(){
  				this.model = new Model({});
  			},
  			runTest: function(t){
  				var model = this.model;
  				model.loadData("<root><line><math>" +
  						"<mn>1</mn>" +
  						"<mstyle>" +
  							"<mfrac><mrow><mn>2</mn></mrow><mrow><mn>3</mn></mrow></mfrac>" +
  						"</mstyle>" +
  						"</math></line></root>");
  				model.mode = "mathml";
  				var line = model.getLineAt(0);
  				model.anchor.node = line.firstChild.lastChild.firstChild;
  				model.anchor.offset = 0;
  				model.path = [];
  				model.path.push({nodeName: "root"});
  				model.path.push({nodeName: "line", offset: 1});
  				model.path.push({nodeName: "math", offset: 1});
  				model.path.push({nodeName: "mfrac", offset: 2});
  				
  				model.moveLeft();
  				var node = model.getFocusNode();
  				t.is("/root/line[1]/math[1]/mn[1]", model.getPath()); 
  				t.is(node.nodeName, "mn");
  				t.is(0, model.getOffset());
  				t.is("1", node.textContent);
  			},
  			tearDown: function(){
  				
  			}
	    },{
	    	name: "从分数前左移到分数前面的mn节点前，mn中有两个数字",
  			setUp: function(){
  				this.model = new Model({});
  			},
  			runTest: function(t){
  				var model = this.model;
  				model.loadData("<root><line><math>" +
  						"<mn>12</mn>" +
  						"<mstyle>" +
  							"<mfrac><mrow><mn>1</mn></mrow><mrow><mn>3</mn></mrow></mfrac>" +
  						"</mstyle>" +
  						"</math></line></root>");
  				model.mode = "mathml";
  				var line = model.getLineAt(0);
  				model.anchor.node = line.firstChild.lastChild.firstChild;
  				model.anchor.offset = 0;
  				model.path = [];
  				model.path.push({nodeName: "root"});
  				model.path.push({nodeName: "line", offset: 1});
  				model.path.push({nodeName: "math", offset: 1});
  				model.path.push({nodeName: "mfrac", offset: 2});
  				
  				model.moveLeft();
  				var node = model.getFocusNode();
  				t.is("/root/line[1]/math[1]/mn[1]", model.getPath()); 
  				t.is(node.nodeName, "mn");
  				t.is(1, model.getOffset());
  				t.is("12", node.textContent);
  			},
  			tearDown: function(){
  				
  			}
	    }
	                             
	]);
});