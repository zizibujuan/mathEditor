define([ "doh","mathEditor/Model" ], function(doh,Model) {

	// FIXME：setData时，要根据光标两边的节点，来决定将值插入到哪个节点中。
	// summary:
	//		1. 平方根后没有任何节点，从平方根后，左移移动到根数后
	//		2. 平方根后有一个token节点，从token节点前左移动到根数后
	//		3. 平方根后有一个layout节点，从layout节点前移动到根数后
	//		4. 平方根前没有任何节点，从根数前移动到平方根前
	//		5. 平方根前有一个token节点，从根数前移动到平方根前(与前面的节点无关)
	//		6. 平方根前有一个layout节点，从根数前移动到平方根前(与前面的节点无关)
	//		上面的根数中的节点可能为token和layout两种情况。
	doh.register("Model.moveRight.sqrt 在平方根中右移光标",[
	    {
	    	name: "mathml模式下，平方根后没有任何节点，从平方根后，左移到根数后，根数中的最后一个节点是token节点",
  			setUp: function(){
  				this.model = new Model({});
  			},
  			runTest: function(t){
  				var model = this.model;
  				model.mode = "mathml";
  				model.loadData("<root><line>" +
  						"<math>" +
	  						"<msqrt>" +
		  						"<mrow><mn>12</mn></mrow>" +
	  						"</msqrt>" +
  						"</math>" +
  				"</line></root>");
  				var line = model.getLineAt(0);
  				model.anchor.node = line.lastChild.lastChild;
  				model.anchor.offset = 1;
  				model.path.push({nodeName: "root"});
  				model.path.push({nodeName: "line", offset: 1});
  				model.path.push({nodeName: "math", offset: 1});
  				model.path.push({nodeName: "msqrt", offset: 1});
  				model.moveLeft();
  				t.is("/root/line[1]/math[1]/msqrt[1]/mrow[1]/mn[1]", model.getPath());
				var node = model.getFocusNode();
				t.is("mn", node.nodeName);
				t.is(2, model.getOffset());
				t.is("12", node.textContent);
  			},
  			tearDown: function(){
  				
  			}
	    },{
	    	name: "mathml模式下，平方根后没有任何节点，从平方根后，左移到根数后，根数中的最后一个节点是layout节点",
  			setUp: function(){
  				this.model = new Model({});
  			},
  			runTest: function(t){
  				var model = this.model;
  				model.mode = "mathml";
  				model.loadData("<root><line>" +
  						"<math>" +
	  						"<msqrt>" +
		  						"<mrow><msqrt><mrow><mn>2</mn></mrow></msqrt></mrow>" +
	  						"</msqrt>" +
  						"</math>" +
  				"</line></root>");
  				var line = model.getLineAt(0);
  				model.anchor.node = line.lastChild.lastChild;
  				model.anchor.offset = 1;
  				model.path.push({nodeName: "root"});
  				model.path.push({nodeName: "line", offset: 1});
  				model.path.push({nodeName: "math", offset: 1});
  				model.path.push({nodeName: "msqrt", offset: 1});
  				model.moveLeft();
  				t.is("/root/line[1]/math[1]/msqrt[1]/mrow[1]/msqrt[1]", model.getPath());
				var node = model.getFocusNode();
				t.is("msqrt", node.nodeName);
				t.is(1, model.getOffset());
  			},
  			tearDown: function(){
  				
  			}
	    },{
	    	name: "mathml模式下，平方根后有一个token节点，从token节点前右移动到根数后,根数中的最后一个节点是token节点",
  			setUp: function(){
  				this.model = new Model({});
  			},
  			runTest: function(t){
  				var model = this.model;
  				model.mode = "mathml";
  				model.loadData("<root><line>" +
  						"<math>" +
	  						"<msqrt>" +
		  						"<mrow><mn>12</mn></mrow>" +
	  						"</msqrt>" +
	  						"<mn>34</mn>" +
  						"</math>" +
  				"</line></root>");
  				var line = model.getLineAt(0);
  				model.anchor.node = line.lastChild.lastChild;
  				model.anchor.offset = 0;
  				model.path.push({nodeName: "root"});
  				model.path.push({nodeName: "line", offset: 1});
  				model.path.push({nodeName: "math", offset: 1});
  				model.path.push({nodeName: "mn", offset: 2});
  				model.moveLeft();
  				t.is("/root/line[1]/math[1]/msqrt[1]/mrow[1]/mn[1]", model.getPath());
				var node = model.getFocusNode();
				t.is("mn", node.nodeName);
				t.is(2, model.getOffset());
				t.is("12", node.textContent);
  			},
  			tearDown: function(){
  				
  			}
	    },{
	    	name: "mathml模式下，平方根后有一个token节点，从token节点前左移动到根数后,根数中的最后一个节点是layout节点",
  			setUp: function(){
  				this.model = new Model({});
  			},
  			runTest: function(t){
  				var model = this.model;
  				model.mode = "mathml";
  				model.loadData("<root><line>" +
  						"<math>" +
	  						"<msqrt>" +
		  						"<mrow><msqrt><mrow><mn>2</mn></mrow></msqrt></mrow>" +
	  						"</msqrt>" +
	  						"<mn>23</mn>" +
  						"</math>" +
  				"</line></root>");
  				var line = model.getLineAt(0);
  				model.anchor.node = line.lastChild.lastChild;
  				model.anchor.offset = 0;
  				model.path.push({nodeName: "root"});
  				model.path.push({nodeName: "line", offset: 1});
  				model.path.push({nodeName: "math", offset: 1});
  				model.path.push({nodeName: "mn", offset: 2});
  				model.moveLeft();
  				t.is("/root/line[1]/math[1]/msqrt[1]/mrow[1]/msqrt[1]", model.getPath());
				var node = model.getFocusNode();
				t.is("msqrt", node.nodeName);
				t.is(1, model.getOffset());
  			},
  			tearDown: function(){
  				
  			}
	    },{
	    	name: "mathml模式下，平方根后有一个layout节点，从layout节点前左移动到根数后,根数中的最后一个节点是token节点",
  			setUp: function(){
  				this.model = new Model({});
  			},
  			runTest: function(t){
  				var model = this.model;
  				model.mode = "mathml";
  				model.loadData("<root><line>" +
  						"<math>" +
	  						"<msqrt>" +
	  							"<mrow><mn>12</mn></mrow>" +
							"</msqrt>" +
	  						"<msqrt>" +
		  						"<mrow><mn>34</mn></mrow>" +
	  						"</msqrt>" +
  						"</math>" +
  				"</line></root>");
  				var line = model.getLineAt(0);
  				model.anchor.node = line.lastChild.lastChild;
  				model.anchor.offset = 0;
  				model.path.push({nodeName: "root"});
  				model.path.push({nodeName: "line", offset: 1});
  				model.path.push({nodeName: "math", offset: 1});
  				model.path.push({nodeName: "msqrt", offset: 2});
  				model.moveLeft();
  				t.is("/root/line[1]/math[1]/msqrt[1]/mrow[1]/mn[1]", model.getPath());
				var node = model.getFocusNode();
				t.is("mn", node.nodeName);
				t.is(2, model.getOffset());
  			},
  			tearDown: function(){
  				
  			}
	    },{
	    	name: "mathml模式下，平方根后有一个layout节点，从layout节点前左移动到根数后,根数中的最后一个节点是layout节点",
  			setUp: function(){
  				this.model = new Model({});
  			},
  			runTest: function(t){
  				var model = this.model;
  				model.mode = "mathml";
  				model.loadData("<root><line>" +
  						"<math>" +
	  						"<msqrt>" +
								"<mrow><msqrt><mrow><mn>1</mn></mrow></msqrt></mrow>" +
							"</msqrt>" +
	  						"<msqrt>" +
		  						"<mrow><mn>2</mn></mrow>" +
	  						"</msqrt>" +
  						"</math>" +
  				"</line></root>");
  				var line = model.getLineAt(0);
  				model.anchor.node = line.lastChild.lastChild;
  				model.anchor.offset = 0;
  				model.path.push({nodeName: "root"});
  				model.path.push({nodeName: "line", offset: 1});
  				model.path.push({nodeName: "math", offset: 1});
  				model.path.push({nodeName: "msqrt", offset: 2});
  				model.moveLeft();
  				t.is("/root/line[1]/math[1]/msqrt[1]/mrow[1]/msqrt[1]", model.getPath());
				var node = model.getFocusNode();
				t.is("msqrt", node.nodeName);
				t.is(1, model.getOffset());
  			},
  			tearDown: function(){
  				
  			}
	    },{
	    	name: "mathml模式下，平方根前没有任何节点，从根数前左移到平方根前,根数的第一个节点是token节点",
  			setUp: function(){
  				this.model = new Model({});
  			},
  			runTest: function(t){
  				var model = this.model;
  				model.mode = "mathml";
  				model.loadData("<root><line>" +
  						"<math>" +
	  						"<msqrt>" +
								"<mrow><mn>12</mn></mrow>" +
							"</msqrt>" +
  						"</math>" +
  				"</line></root>");
  				var line = model.getLineAt(0);
  				model.anchor.node = line.firstChild.firstChild.firstChild.firstChild;
  				model.anchor.offset = 0;
  				model.path.push({nodeName: "root"});
  				model.path.push({nodeName: "line", offset: 1});
  				model.path.push({nodeName: "math", offset: 1});
  				model.path.push({nodeName: "msqrt", offset: 1});
  				model.path.push({nodeName: "mrow", offset: 1});
  				model.path.push({nodeName: "mn", offset: 1});
  				model.moveLeft();
  				t.is("/root/line[1]/math[1]/msqrt[1]", model.getPath());
				var node = model.getFocusNode();
				t.is("msqrt", node.nodeName);
				t.is(0, model.getOffset());
  			},
  			tearDown: function(){
  				
  			}
	    },{
	    	name: "mathml模式下，平方根前没有任何节点，从根数前左移到平方根前,根数的第一个节点是layout节点",
  			setUp: function(){
  				this.model = new Model({});
  			},
  			runTest: function(t){
  				var model = this.model;
  				model.mode = "mathml";
  				model.loadData("<root><line>" +
  						"<math>" +
	  						"<msqrt>" +
								"<mrow><msqrt><mrow><mn>2</mn></mrow></msqrt></mrow>" +
							"</msqrt>" +
  						"</math>" +
  				"</line></root>");
  				var line = model.getLineAt(0);
  				model.anchor.node = line.firstChild.firstChild.firstChild.firstChild;
  				model.anchor.offset = 0;
  				model.path.push({nodeName: "root"});
  				model.path.push({nodeName: "line", offset: 1});
  				model.path.push({nodeName: "math", offset: 1});
  				model.path.push({nodeName: "msqrt", offset: 1});
  				model.path.push({nodeName: "mrow", offset: 1});
  				model.path.push({nodeName: "msqrt", offset: 1});
  				model.moveLeft();
  				t.is("/root/line[1]/math[1]/msqrt[1]", model.getPath());
				var node = model.getFocusNode();
				t.is("msqrt", node.nodeName);
				t.is(0, model.getOffset());
  			},
  			tearDown: function(){
  				
  			}
	    }
	                             
	]);
});