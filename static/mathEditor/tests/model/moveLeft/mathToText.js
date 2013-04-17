define([ "doh","mathEditor/Model" ], function(doh,Model) {

	doh.register("Model.moveLeft.mathToText 左移光标时，从mathml模式移到text模式",[
	    {
	    	name: "左移光标，从math节点移到text节点",
  			setUp: function(){
  				this.model = new Model({});
  			},
  			runTest: function(t){
  				var model = this.model;
  				model.loadData("<root><line><text>ab</text><math><mn>1</mn></math></line></root>");
  				var line = model.getLineAt(0);
  				model.anchor.node = line.lastChild;
  				model.anchor.offset = 0;
  				model.path.push({nodeName:"root"});
				model.path.push({nodeName:"line", offset:1});
				model.path.push({nodeName:"math", offset:2});
				model.moveLeft();
  				t.is("/root/line[1]/text[1]", model.getPath()); 
  				t.is("text", model.getFocusNode().nodeName);
  				t.is(2, model.getOffset());// math前获取焦点，此时应该出现一个数学框。
  			},
  			tearDown: function(){
  				
  			}
	    }
	                             
	]);
});