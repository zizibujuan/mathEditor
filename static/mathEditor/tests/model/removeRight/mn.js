define([ "doh","mathEditor/Model" ], function(doh,Model) {

	doh.register("Model.removeRight.mn",[
	    {
	    	name: "删除右边的字符，删除占位符",// FIXME：删除占位符，需要具体问题，具体分析
  			setUp: function(){
  				this.model = new Model({});
  			},
  			runTest: function(t){
  				var model = this.model;
  				model.loadData("<root><line><math><mn class=\"drip_placeholder_box\">8</mn></math></line></root>");
  				model.mode = "mathml";
  				var line = model.getLineAt(0);
  				model.anchor.node = line.firstChild.firstChild;
  				model.anchor.offset = 0;
  				model.path.push({nodeName: "root"});
  				model.path.push({nodeName: "line", offset: 1});
  				model.path.push({nodeName: "math", offset: 1});
  				model.path.push({nodeName: "mn", offset: 1});
  				model.removeRight();
  				
  				var focusNode = model.getFocusNode();
  				t.is("/root/line[1]/math[1]", model.getPath());
  				t.is("math", focusNode.nodeName);
  				t.is(0, model.getOffset()); // 因为没有内容，所以偏移量为0
  				t.is(0, focusNode.childNodes.length);
  			},
  			tearDown: function(){
  				
  			}
	    }
	                             
	]);
});