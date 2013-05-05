define([ "doh","mathEditor/Model" ], function(doh,Model) {

	doh.register("Model.moveRight.mi 在mi节点中右移光标",[
	    {
	    	name: "mathml模式下，输入一个单字符的变量x，然后右移光标",
  			setUp: function(){
  				this.model = new Model({});
  			},
  			runTest: function(t){
  				var model = this.model;
  				var model = this.model;
  				model.loadData("<root><line><math><mi>x</mi></math></line></root>");
  				model.mode = "mathml";
  				var line = model.getLineAt(0);
  				model.anchor.node = line.firstChild.firstChild;
  				model.anchor.offset = 0;
  				model.path.push({nodeName:"root"});
  				model.path.push({nodeName:"line", offset:1});
  				model.path.push({nodeName:"math", offset:1});
  				model.path.push({nodeName:"mi", offset:1});
  				model.moveRight();
  				
  				t.is("/root/line[1]/math[1]/mi[1]", model.getPath()); 
  				t.is(model.getFocusNode().nodeName, "mi");
  				t.is(1, model.getOffset());
  			},
  			tearDown: function(){
  				
  			}
	    },
	    /**********多字符变量，如三角函数**********/
	    {
	    	name: "mathml模式下，输入一个多字符的变量sin，然后右移光标一次",
  			setUp: function(){
  				this.model = new Model({});
  			},
  			runTest: function(t){
  				var model = this.model;
  				model.loadData("<root><line><math><mi>sin</mi></math></line></root>");
  				model.mode = "mathml";
  				var line = model.getLineAt(0);
  				model.anchor.node = line.firstChild.firstChild;
  				model.anchor.offset = 0;
  				model.path.push({nodeName:"root"});
  				model.path.push({nodeName:"line", offset:1});
  				model.path.push({nodeName:"math", offset:1});
  				model.path.push({nodeName:"mi", offset:1});
  				model.moveRight();
  				
  				t.is("/root/line[1]/math[1]/mi[1]", model.getPath()); 
  				t.is("mi", model.getFocusNode().nodeName);
  				t.is(1, model.getOffset());
  			},
  			tearDown: function(){
  				
  			}
	    }
	                             
	]);
});