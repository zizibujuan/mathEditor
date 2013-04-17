define([ "doh","mathEditor/Model" ], function(doh,Model) {

	doh.register("Model.moveRight.textToMath 右移光标时，从text模式移到mathml模式",[
	    {
	    	name: "右移光标，从text节点移到math节点",
  			setUp: function(){
  				this.model = new Model({});
  			},
  			runTest: function(t){
  				var model = this.model;
  				model.loadData("<root><line><text>ab</text><math><mn>1</mn></math></line></root>");
  				var line = model.getLineAt(0);
  				model.anchor.node = line.firstChild;
  				model.anchor.offset = 2;
  				model.path.push({nodeName:"root"});
				model.path.push({nodeName:"line", offset:1});
				model.path.push({nodeName:"text", offset:1});
				model.moveRight();
  				
  				t.is("/root/line[1]/math[2]", model.getPath()); 
  				t.is("math", model.getFocusNode().nodeName);
  				t.is(0, model.getOffset());// math前获取焦点，此时应该出现一个数学框。
  			},
  			tearDown: function(){
  				
  			}
	    }
	                             
	]);
});