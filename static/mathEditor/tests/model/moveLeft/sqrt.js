define([ "doh","mathEditor/Model" ], function(doh,Model) {

	// FIXME：setData时，要根据光标两边的节点，来决定将值插入到哪个节点中。
	// summary:
	//		1. 平方根前没有任何节点，从平方根前，移动到根数前
	//		2. 平方根前有一个token节点，从token节点后移动到根数前
	//		3. 平方根前有一个layout节点，从layout节点后移动到根数前
	//		4. 平方根后没有任何节点，从根数后移动到平方根后
	//		5. 平方根后有一个token节点，从根数后移动到平方根后
	//		6. 平方根后有一个layout节点，从根数后移动到平方根后
	//		上面的根数中的节点可能为token和layout两种情况。
	doh.register("Model.moveLeft.sqrt 在平方根中左移光标",[
	    {
	    	name: "mathml模式下，平方根前没有任何节点，从平方根前，移到根数前，根数中的第一个节点是token节点",
  			setUp: function(){
  				this.model = new Model({});
  			},
  			runTest: function(t){
//  				var model = this.model;
//  				model.mode = "mathml";
//  				model.loadData("<root><line>" +
//  						"<math>" +
//	  						"<msqrt>" +
//		  						"<mrow><mn>2</mn></mrow>" +
//	  						"</msqrt>" +
//  						"</math>" +
//  				"</line></root>");
//  				var line = model.getLineAt(0);
//  				model.anchor.node = line.firstChild.firstChild;
//  				model.anchor.offset = 0;
//  				model.path.push({nodeName: "root"});
//  				model.path.push({nodeName: "line", offset: 1});
//  				model.path.push({nodeName: "math", offset: 1});
//  				model.path.push({nodeName: "msqrt", offset: 1});
//  				model.moveLeft();
//  				t.is("/root/line[1]/math[1]/mfrac[1]/mrow[1]/mn[1]", model.getPath());
//				var node = model.getFocusNode();
//				t.t(node.parentNode.previousSibling == null); // 证明是分子。
//				t.is("mn", node.nodeName);
//				t.is(2, model.getOffset());
//				t.is("11", node.textContent);
  			},
  			tearDown: function(){
  				
  			}
	    }
	    // TODO:从根式外面移到根式里面
	                             
	]);
});