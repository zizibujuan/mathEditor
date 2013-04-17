define([ "doh","mathEditor/Model" ], function(doh,Model) {

	doh.register("Model.moveRight.mathToText 右移光标时，从mathml模式移到text模式",[
	    {
	    	name: "右移光标，从math节点移到text节点",
  			setUp: function(){
  				this.model = new Model({});
  			},
  			runTest: function(t){
  				var model = this.model;
  				model.loadData("<root><line><math><mn>1</mn></math><text>ab</text></line></root>");
  				var line = model.getLineAt(0);
  				model.anchor.node = line.firstChild;
  				model.anchor.offset = 1;
  				model.path.push({nodeName:"root"});
				model.path.push({nodeName:"line", offset:1});
				model.path.push({nodeName:"math", offset:1});
				model.moveRight();
  				
  				t.is("/root/line[1]/text[2]", model.getPath()); 
  				t.is("text", model.getFocusNode().nodeName);
  				t.is(0, model.getOffset());//TODO：此时math上的框消失。
  			},
  			tearDown: function(){
  				
  			}
	    }
	                             
	]);
});