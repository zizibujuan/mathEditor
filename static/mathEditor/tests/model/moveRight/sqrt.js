define([ "doh", "mathEditor/Model", "mathEditor/lang" ], function(doh, Model, dripLang) {

	// FIXME：setData时，要根据光标两边的节点，来决定将值插入到哪个节点中。放在什么位置，必须要统一，根据实际情况，二选一。
	// summary:
	//		在平方根中右移光标的所有逻辑
	//		1. 平方根前没有任何节点，从平方根前，移动到根数前
	//		2. 平方根前有一个token节点，从token节点后移动到根数前
	//		3. 平方根前有一个layout节点，从layout节点后移动到根数前
	//		4. 平方根后没有任何节点，从根数后移动到平方根后
	//		5. 平方根后有一个token节点，从根数后移动到平方根后,依然停在平方根后面(与后面的节点无关)
	//		6. 平方根后有一个layout节点，从根数后移动到平方根后,依然停在平方根后面(与后面的节点无关)
	//		上面的根数中的节点分为token和layout两种情况。
	doh.register("Model.moveRight.sqrt 在平方根中右移光标",[
	    {
	    	name: "mathml模式下，平方根前没有任何节点，从平方根前，右移到根数前，根数中的第一个节点是token节点",
  			setUp: function(){
  				this.model = new Model({});
  			},
  			runTest: function(t){
  				var model = this.model;
  				model.loadData("<root><line>" +
  						"<math>" +
	  						"<msqrt>" +
		  						"<mn>12</mn>" +
	  						"</msqrt>" +
  						"</math>" +
  				"</line></root>");
  				model.mode = "mathml";
  				var line = model.getLineAt(0);
  				model.anchor.node = line.firstChild.firstChild;
  				model.anchor.offset = 0;
  				model.path = [];
  				model.path.push({nodeName: "root"});
  				model.path.push({nodeName: "line", offset: 1});
  				model.path.push({nodeName: "math", offset: 1});
  				model.path.push({nodeName: "msqrt", offset: 1});
  				model.moveRight();
  				t.is("/root/line[1]/math[1]/msqrt[1]/mn[1]", model.getPath());
				var node = model.getFocusNode();
				t.is("mn", node.nodeName);
				t.is(0, model.getOffset());
				t.is("12", dripLang.getText(node));
  			},
  			tearDown: function(){
  				
  			}
	    },{
	    	name: "mathml模式下，平方根前没有任何节点，从平方根前，右移到根数前，根数中的第一个节点是layout节点",
  			setUp: function(){
  				this.model = new Model({});
  			},
  			runTest: function(t){
  				var model = this.model;
  				model.loadData("<root><line>" +
  						"<math>" +
	  						"<msqrt>" +
		  						"<msqrt><mn>2</mn></msqrt>" +
	  						"</msqrt>" +
  						"</math>" +
  				"</line></root>");
  				model.mode = "mathml";
  				var line = model.getLineAt(0);
  				model.anchor.node = line.firstChild.firstChild;
  				model.anchor.offset = 0;
  				model.path = [];
  				model.path.push({nodeName: "root"});
  				model.path.push({nodeName: "line", offset: 1});
  				model.path.push({nodeName: "math", offset: 1});
  				model.path.push({nodeName: "msqrt", offset: 1});
  				model.moveRight();
  				t.is("/root/line[1]/math[1]/msqrt[1]/msqrt[1]", model.getPath());
				var node = model.getFocusNode();
				t.is("msqrt", node.nodeName);
				t.is(0, model.getOffset());
  			},
  			tearDown: function(){
  				
  			}
	    },{
	    	name: "mathml模式下，平方根前有一个token节点，从token节点后移动到根数前,根数中的第一个节点是token节点",
  			setUp: function(){
  				this.model = new Model({});
  			},
  			runTest: function(t){
  				var model = this.model;
  				model.loadData("<root><line>" +
  						"<math>" +
  							"<mn>23</mn>" +
	  						"<msqrt>" +
		  						"<mn>12</mn>" +
	  						"</msqrt>" +
  						"</math>" +
  				"</line></root>");
  				model.mode = "mathml";
  				var line = model.getLineAt(0);
  				model.anchor.node = line.firstChild.firstChild;
  				model.anchor.offset = 2;
  				model.path = [];
  				model.path.push({nodeName: "root"});
  				model.path.push({nodeName: "line", offset: 1});
  				model.path.push({nodeName: "math", offset: 1});
  				model.path.push({nodeName: "mn", offset: 1});
  				model.moveRight();
  				t.is("/root/line[1]/math[1]/msqrt[2]/mn[1]", model.getPath());
				var node = model.getFocusNode();
				t.is("mn", node.nodeName);
				t.is(0, model.getOffset());
  			},
  			tearDown: function(){
  				
  			}
	    },{
	    	name: "mathml模式下，平方根前有一个token节点，从token节点后移动到根数前,根数中的第一个节点是layout节点",
  			setUp: function(){
  				this.model = new Model({});
  			},
  			runTest: function(t){
  				var model = this.model;
  				model.loadData("<root><line>" +
  						"<math>" +
  							"<mn>23</mn>" +
	  						"<msqrt>" +
		  						"<msqrt><mn>2</mn></msqrt>" +
	  						"</msqrt>" +
  						"</math>" +
  				"</line></root>");
  				model.mode = "mathml";
  				var line = model.getLineAt(0);
  				model.anchor.node = line.firstChild.firstChild;
  				model.anchor.offset = 2;
  				model.path = [];
  				model.path.push({nodeName: "root"});
  				model.path.push({nodeName: "line", offset: 1});
  				model.path.push({nodeName: "math", offset: 1});
  				model.path.push({nodeName: "mn", offset: 1});
  				model.moveRight();
  				t.is("/root/line[1]/math[1]/msqrt[2]/msqrt[1]", model.getPath());
				var node = model.getFocusNode();
				t.is("msqrt", node.nodeName);
				t.is(0, model.getOffset());
  			},
  			tearDown: function(){
  				
  			}
	    },{
	    	name: "mathml模式下，平方根前有一个layout节点，从layout节点后移动到根数前,根数中的第一个节点是token节点",
  			setUp: function(){
  				this.model = new Model({});
  			},
  			runTest: function(t){
  				var model = this.model;
  				model.loadData("<root><line>" +
  						"<math>" +
	  						"<msqrt>" +
	  							"<mn>2</mn>" +
							"</msqrt>" +
	  						"<msqrt>" +
		  						"<mn>12</mn>" +
	  						"</msqrt>" +
  						"</math>" +
  				"</line></root>");
  				model.mode = "mathml";
  				var line = model.getLineAt(0);
  				model.anchor.node = line.firstChild.firstChild;
  				model.anchor.offset = 1;
  				model.path = [];
  				model.path.push({nodeName: "root"});
  				model.path.push({nodeName: "line", offset: 1});
  				model.path.push({nodeName: "math", offset: 1});
  				model.path.push({nodeName: "msqrt", offset: 1});
  				model.moveRight();
  				t.is("/root/line[1]/math[1]/msqrt[2]/mn[1]", model.getPath());
				var node = model.getFocusNode();
				t.is("mn", node.nodeName);
				t.is(0, model.getOffset());
  			},
  			tearDown: function(){
  				
  			}
	    },{
	    	name: "mathml模式下，平方根前有一个layout节点，从layout节点后移动到根数前,根数中的第一个节点是layout节点",
  			setUp: function(){
  				this.model = new Model({});
  			},
  			runTest: function(t){
  				var model = this.model;
  				model.loadData("<root><line>" +
  						"<math>" +
	  						"<msqrt>" +
								"<mn>1</mn>" +
							"</msqrt>" +
	  						"<msqrt>" +
		  						"<msqrt><mn>2</mn></msqrt>" +
	  						"</msqrt>" +
  						"</math>" +
  				"</line></root>");
  				model.mode = "mathml";
  				var line = model.getLineAt(0);
  				model.anchor.node = line.firstChild.firstChild;
  				model.anchor.offset = 1;
  				model.path = [];model.path.push({nodeName: "root"});
  				model.path.push({nodeName: "line", offset: 1});
  				model.path.push({nodeName: "math", offset: 1});
  				model.path.push({nodeName: "msqrt", offset: 1});
  				model.moveRight();
  				t.is("/root/line[1]/math[1]/msqrt[2]/msqrt[1]", model.getPath());
				var node = model.getFocusNode();
				t.is("msqrt", node.nodeName);
				t.is(0, model.getOffset());
  			},
  			tearDown: function(){
  				
  			}
	    },{
	    	name: "mathml模式下，平方根后没有任何节点，从根数后移动到平方根后,根数的最后一个节点是token节点",
  			setUp: function(){
  				this.model = new Model({});
  			},
  			runTest: function(t){
  				var model = this.model;
  				model.loadData("<root><line>" +
  						"<math>" +
	  						"<msqrt>" +
								"<mn>12</mn>" +
							"</msqrt>" +
  						"</math>" +
  				"</line></root>");
  				model.mode = "mathml";
  				var line = model.getLineAt(0);
  				model.anchor.node = line.firstChild.firstChild.firstChild;
  				model.anchor.offset = 2;
  				model.path = [];
  				model.path.push({nodeName: "root"});
  				model.path.push({nodeName: "line", offset: 1});
  				model.path.push({nodeName: "math", offset: 1});
  				model.path.push({nodeName: "msqrt", offset: 1});
  				model.path.push({nodeName: "mn", offset: 1});
  				model.moveRight();
  				t.is("/root/line[1]/math[1]/msqrt[1]", model.getPath());
				var node = model.getFocusNode();
				t.is("msqrt", node.nodeName);
				t.is(1, model.getOffset());
  			},
  			tearDown: function(){
  				
  			}
	    },{
	    	name: "mathml模式下，平方根后没有任何节点，从根数后移动到平方根后,根数的最后一个节点是layout节点",
  			setUp: function(){
  				this.model = new Model({});
  			},
  			runTest: function(t){
  				var model = this.model;
  				model.loadData("<root><line>" +
  						"<math>" +
	  						"<msqrt>" +
								"<msqrt><mn>2</mn></msqrt>" +
							"</msqrt>" +
  						"</math>" +
  				"</line></root>");
  				model.mode = "mathml";
  				var line = model.getLineAt(0);
  				model.anchor.node = line.firstChild.firstChild.firstChild;
  				model.anchor.offset = 1;
  				model.path = [];
  				model.path.push({nodeName: "root"});
  				model.path.push({nodeName: "line", offset: 1});
  				model.path.push({nodeName: "math", offset: 1});
  				model.path.push({nodeName: "msqrt", offset: 1});
  				model.path.push({nodeName: "msqrt", offset: 1});
  				model.moveRight();
  				t.is("/root/line[1]/math[1]/msqrt[1]", model.getPath());
				var node = model.getFocusNode();
				t.is("msqrt", node.nodeName);
				t.is(1, model.getOffset());
  			},
  			tearDown: function(){
  				
  			}
	    }
	                             
	]);
});