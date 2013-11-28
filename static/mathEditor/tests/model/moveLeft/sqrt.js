define([ "intern!tdd", 
         "intern/chai!assert",
         "mathEditor/Model",
         "mathEditor/lang"], function(
        		 tdd,
        		 assert,
        		 Model,
        		 dripLang) {

	// FIXME：setData时，要根据光标两边的节点，来决定将值插入到哪个节点中。
	// summary:
	//		1. 平方根后没有任何节点，从平方根后，左移移动到根数后
	//		2. 平方根后有一个token节点，从token节点前左移动到根数后
	//		3. 平方根后有一个layout节点，从layout节点前移动到根数后
	//		4. 平方根前没有任何节点，从根数前移动到平方根前
	//		5. 平方根前有一个token节点，从根数前移动到平方根前(与前面的节点无关)
	//		6. 平方根前有一个layout节点，从根数前移动到平方根前(与前面的节点无关)
	//		上面的根数中的节点可能为token和layout两种情况。
	
	with(tdd){
		suite("Model.moveLeft.sqrt 在平方根中左移光标", function(){
			var model = null;
			beforeEach(function () {
				model = new Model({});
			});
			
			test("mathml模式下，平方根后没有任何节点，从平方根后，左移到根数后，根数中的最后一个节点是token节点", function(){
				model.loadData("<root><line>" +
  						"<math>" +
	  						"<msqrt>" +
		  						"<mn>12</mn>" +
	  						"</msqrt>" +
  						"</math>" +
  				"</line></root>");
  				model.mode = "mathml";
  				var line = model.getLineAt(0);
  				model.anchor.node = line.lastChild.lastChild;
  				model.anchor.offset = 1;
  				model.path = [];
  				model.path.push({nodeName: "root"});
  				model.path.push({nodeName: "line", offset: 1});
  				model.path.push({nodeName: "math", offset: 1});
  				model.path.push({nodeName: "msqrt", offset: 1});
  				model.moveLeft();
  				assert.equal("/root/line[1]/math[1]/msqrt[1]/mn[1]", model.getPath());
				var node = model.getFocusNode();
				assert.equal("mn", node.nodeName);
				assert.equal(2, model.getOffset());
				assert.equal("12", dripLang.getText(node));
			});
			
			test("mathml模式下，平方根后没有任何节点，从平方根后，左移到根数后，根数中的最后一个节点是layout节点", function(){
				model.loadData("<root><line>" +
  						"<math>" +
	  						"<msqrt>" +
		  						"<msqrt><mn>2</mn></msqrt>" +
	  						"</msqrt>" +
  						"</math>" +
  				"</line></root>");
  				model.mode = "mathml";
  				var line = model.getLineAt(0);
  				model.anchor.node = line.lastChild.lastChild;
  				model.anchor.offset = 1;
  				model.path = [];
  				model.path.push({nodeName: "root"});
  				model.path.push({nodeName: "line", offset: 1});
  				model.path.push({nodeName: "math", offset: 1});
  				model.path.push({nodeName: "msqrt", offset: 1});
  				model.moveLeft();
  				assert.equal("/root/line[1]/math[1]/msqrt[1]/msqrt[1]", model.getPath());
				var node = model.getFocusNode();
				assert.equal("msqrt", node.nodeName);
				assert.equal(1, model.getOffset());
			});
			
			test("mathml模式下，平方根后有一个token节点，从token节点前右移动到根数后,根数中的最后一个节点是token节点", function(){
				model.loadData("<root><line>" +
  						"<math>" +
	  						"<msqrt>" +
		  						"<mn>12</mn>" +
	  						"</msqrt>" +
	  						"<mn>34</mn>" +
  						"</math>" +
  				"</line></root>");
  				model.mode = "mathml";
  				var line = model.getLineAt(0);
  				model.anchor.node = line.lastChild.lastChild;
  				model.anchor.offset = 0;
  				model.path = [];
  				model.path.push({nodeName: "root"});
  				model.path.push({nodeName: "line", offset: 1});
  				model.path.push({nodeName: "math", offset: 1});
  				model.path.push({nodeName: "mn", offset: 2});
  				model.moveLeft();
  				assert.equal("/root/line[1]/math[1]/msqrt[1]/mn[1]", model.getPath());
				var node = model.getFocusNode();
				assert.equal("mn", node.nodeName);
				assert.equal(2, model.getOffset());
				assert.equal("12", dripLang.getText(node));
			});
			
			test("mathml模式下，平方根后有一个token节点，从token节点前左移动到根数后,根数中的最后一个节点是layout节点", function(){
				model.loadData("<root><line>" +
  						"<math>" +
	  						"<msqrt>" +
		  						"<msqrt><mn>2</mn></msqrt>" +
	  						"</msqrt>" +
	  						"<mn>23</mn>" +
  						"</math>" +
  				"</line></root>");
  				model.mode = "mathml";
  				var line = model.getLineAt(0);
  				model.anchor.node = line.lastChild.lastChild;
  				model.anchor.offset = 0;
  				model.path = [];
  				model.path.push({nodeName: "root"});
  				model.path.push({nodeName: "line", offset: 1});
  				model.path.push({nodeName: "math", offset: 1});
  				model.path.push({nodeName: "mn", offset: 2});
  				model.moveLeft();
  				assert.equal("/root/line[1]/math[1]/msqrt[1]/msqrt[1]", model.getPath());
				var node = model.getFocusNode();
				assert.equal("msqrt", node.nodeName);
				assert.equal(1, model.getOffset());
			});
			
			test("mathml模式下，平方根后有一个layout节点，从layout节点前左移动到根数后,根数中的最后一个节点是token节点", function(){
				model.loadData("<root><line>" +
  						"<math>" +
	  						"<msqrt>" +
	  							"<mn>12</mn>" +
							"</msqrt>" +
	  						"<msqrt>" +
		  						"<mn>34</mn>" +
	  						"</msqrt>" +
  						"</math>" +
  				"</line></root>");
  				model.mode = "mathml";
  				var line = model.getLineAt(0);
  				model.anchor.node = line.lastChild.lastChild;
  				model.anchor.offset = 0;
  				model.path = [];
  				model.path.push({nodeName: "root"});
  				model.path.push({nodeName: "line", offset: 1});
  				model.path.push({nodeName: "math", offset: 1});
  				model.path.push({nodeName: "msqrt", offset: 2});
  				model.moveLeft();
  				assert.equal("/root/line[1]/math[1]/msqrt[1]/mn[1]", model.getPath());
				var node = model.getFocusNode();
				assert.equal("mn", node.nodeName);
				assert.equal(2, model.getOffset());
			});
			
			test("mathml模式下，平方根后有一个layout节点，从layout节点前左移动到根数后,根数中的最后一个节点是layout节点", function(){
				model.loadData("<root><line>" +
  						"<math>" +
	  						"<msqrt>" +
								"<msqrt><mn>1</mn></msqrt>" +
							"</msqrt>" +
	  						"<msqrt>" +
		  						"<mn>2</mn>" +
	  						"</msqrt>" +
  						"</math>" +
  				"</line></root>");
  				model.mode = "mathml";
  				var line = model.getLineAt(0);
  				model.anchor.node = line.lastChild.lastChild;
  				model.anchor.offset = 0;
  				model.path = [];
  				model.path.push({nodeName: "root"});
  				model.path.push({nodeName: "line", offset: 1});
  				model.path.push({nodeName: "math", offset: 1});
  				model.path.push({nodeName: "msqrt", offset: 2});
  				model.moveLeft();
  				assert.equal("/root/line[1]/math[1]/msqrt[1]/msqrt[1]", model.getPath());
				var node = model.getFocusNode();
				assert.equal("msqrt", node.nodeName);
				assert.equal(1, model.getOffset());
			});
			
			test("mathml模式下，平方根前没有任何节点，从根数前左移到平方根前,根数的第一个节点是token节点", function(){
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
  				model.anchor.offset = 0;
  				model.path = [];
  				model.path.push({nodeName: "root"});
  				model.path.push({nodeName: "line", offset: 1});
  				model.path.push({nodeName: "math", offset: 1});
  				model.path.push({nodeName: "msqrt", offset: 1});
  				model.path.push({nodeName: "mn", offset: 1});
  				model.moveLeft();
  				assert.equal("/root/line[1]/math[1]/msqrt[1]", model.getPath());
				var node = model.getFocusNode();
				assert.equal("msqrt", node.nodeName);
				assert.equal(0, model.getOffset());
			});
			
			test("mathml模式下，平方根前没有任何节点，从根数前左移到平方根前,根数的第一个节点是layout节点", function(){
				model.mode = "mathml";
  				model.loadData("<root><line>" +
  						"<math>" +
	  						"<msqrt>" +
								"<msqrt><mn>2</mn></msqrt>" +
							"</msqrt>" +
  						"</math>" +
  				"</line></root>");
  				var line = model.getLineAt(0);
  				model.anchor.node = line.firstChild.firstChild.firstChild;
  				model.anchor.offset = 0;
  				model.path = [];
  				model.path.push({nodeName: "root"});
  				model.path.push({nodeName: "line", offset: 1});
  				model.path.push({nodeName: "math", offset: 1});
  				model.path.push({nodeName: "msqrt", offset: 1});
  				model.path.push({nodeName: "msqrt", offset: 1});
  				model.moveLeft();
  				assert.equal("/root/line[1]/math[1]/msqrt[1]", model.getPath());
				var node = model.getFocusNode();
				assert.equal("msqrt", node.nodeName);
				assert.equal(0, model.getOffset());
			});
			
		});
	}
});