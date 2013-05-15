define([ "doh","mathEditor/Model" ], function(doh,Model) {

	// summary:
	//		1.右删除删除根数,如果根数中没有任何内容，则直接删除掉根式
	doh.register("Model.removeRight.sqrt 右删除平方根",[
	    {
	    	name: "右删除删除根数,如果根数中没有任何内容，则直接删除掉根式。",
  			setUp: function(){
  				this.model = new Model({});
  			},
  			runTest: function(t){
  				var model = this.model;
  				model.loadData("<root><line>" +
  						"<math><msqrt><mrow><mn class=\"drip_placeholder_box\">8</mn></mrow></msqrt></math>" +
  				"</line></root>");
  				model.mode = "mathml";
  				var line = model.getLineAt(0);
  				model.anchor.node = line.firstChild.firstChild.firstChild.firstChild;
  				model.anchor.offset = 0;
  				model.path = [];
  				model.path.push({nodeName: "root"});
  				model.path.push({nodeName: "line", offset: 1});
  				model.path.push({nodeName: "math", offset: 1});
  				model.path.push({nodeName: "msqrt", offset: 1});
  				model.path.push({nodeName: "mrow", offset: 1});
  				model.path.push({nodeName: "mn", offset: 1});
  				model.removeRight();
  				
  				var focusNode = model.getFocusNode();
  				t.is("/root/line[1]/math[1]", model.getPath());
  				t.is("math", focusNode.nodeName);
  				t.is(2, model.getOffset());// layoutOffset.select
  				t.is(0, focusNode.childNodes.length);
  			},
  			tearDown: function(){
  				
  			}
	    }
	                             
	]);
});