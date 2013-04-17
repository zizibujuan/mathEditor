define([ "doh","mathEditor/Model" ], function(doh,Model) {

	doh.register("Model.moveLeft.textToMath 左移光标时，从text模式移到mathml模式",[
	    {
	    	name: "左移光标，从text节点移到math节点",
  			setUp: function(){
  				this.model = new Model({});
  			},
  			runTest: function(t){
  				var model = this.model;
  				model.loadData("<root><line><math><mn>1</mn></math><text>ab</text></line></root>");
  				var line = model.getLineAt(0);
  				model.anchor.node = line.lastChild;
  				model.anchor.offset = 0;
  				model.path.push({nodeName:"root"});
				model.path.push({nodeName:"line", offset:1});
				model.path.push({nodeName:"text", offset:2});
				model.moveLeft();
  				
  				t.is("/root/line[1]/math[1]", model.getPath()); 
  				t.is("math", model.getFocusNode().nodeName);
  				t.is(1, model.getOffset());// math前获取焦点，此时应该出现一个数学框。
  			},
  			tearDown: function(){
  				
  			}
	    }
	                             
	]);
});