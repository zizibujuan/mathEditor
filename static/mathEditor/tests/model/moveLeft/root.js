define([ "intern!tdd", 
         "intern/chai!assert", 
         "mathEditor/Model", 
         "mathEditor/lang" ], function(
        		 tdd,
        		 assert, 
        		 Model, 
        		 dripLang) {

	// summary:
	//		在根式中左移光标（这个根式中显示包含根次）
	//		左移进根式，首先进入根数
	//		1. 根式后没有任何节点，在根式后左移光标到根数后，根数的最后一个节点是token节点；
	//		2. 根式后没有任何节点，在根式后左移光标到根数后，根数的最后一个节点是layout节点；
	//		3. 根式后有一个token节点，在token节点最前左移光标到根数后，根数的最后一个节点是token节点；
	//		4. 根式后有一个token节点，在token节点最前左移光标到根数后，根数的最后一个节点是layout节点；
	//		5. 根式后有一个layout节点，在layout节点最前左移光标到根数后，根数的最后一个节点是token节点；
	//		6. 根式后有一个layout节点，在layout节点最前左移光标到根数后，根数的最后一个节点是layout节点；
	//		从根数前左移进根次后
	//		1. 根数第一个节点是token节点，根次最后一个节点是token节点
	//		2. 根数第一个节点是token节点，根次最后一个节点是layout节点
	//		3. 根数第一个节点是layout节点，根次最后一个节点是token节点
	//		4. 根数第一个节点是layout节点，根次最后一个节点是layout节点
	//		从根次前左移出根式，到根式前（注意：与根式前有无节点或节点种类无关）
	//		1. 根次的第一个节点是token节点
	//		2. 根次的第一个节点是layout节点
	
	with(tdd){
		suite("Model.moveLeft.root 在根式中左移光标", function(){
			
			var model = null;
			beforeEach(function () {
				model = new Model({});
			});
			
			test("mathml模式下，在空的根式root中左移光标，将光标从index中移到根式之前。", function(){
				model.toMathMLMode();
  				model.setData({data: "", nodeName: "mroot"});
  				model.moveLeft();
  				
				assert.equal("/root/line[1]/math[1]/mroot[1]", model.getPath());
				
				var baseNode = model.getFocusNode();
				assert.equal("mroot", baseNode.nodeName);
				assert.equal(0, model.getOffset());
			});
			
			test("mathml模式下，在空的根式root中右移光标到base，然后左移光标到index。", function(){
				model.toMathMLMode();
  				model.setData({data: "", nodeName: "mroot"});
  				model.moveRight();
  				model.moveLeft();
  				
				assert.equal("/root/line[1]/math[1]/mroot[1]/mrow[2]/mn[1]", model.getPath());
				
				var indexNode = model.getFocusNode();
				assert.equal("drip_placeholder_box", indexNode.getAttribute("class"));
				assert.equal("mn", indexNode.nodeName);
				assert.equal(0, model.getOffset());
			});
			
			test("mathml模式下，在base为1，index为2的根式root中左移光标到index。", function(){
				model.toMathMLMode();
  				model.setData({data: "", nodeName: "mroot"});
  				model.setData({data: "2"});
  				model.moveRight();
  				model.setData({data: "1"});
  				model.moveLeft();
  				model.moveLeft();
  				
				assert.equal("/root/line[1]/math[1]/mroot[1]/mrow[2]/mn[1]", model.getPath());
				
				var indexNode = model.getFocusNode();
				assert.notEqual("drip_placeholder_box", indexNode.getAttribute("class"));
				assert.equal("mn", indexNode.nodeName);
				assert.equal(1, model.getOffset());
			});
			
			test("左移进根数，根式后没有任何节点，在根式后左移光标到根数后，根数的最后一个节点是token节点。", function(){
				model.loadData("<root><line>" +
  						"<math>" +
	  						"<mroot>" +
		  						"<mrow><mn>22</mn></mrow>" + // base
		  						"<mrow><mn>11</mn></mrow>" + // index
	  						"</mroot>" +
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
  				model.path.push({nodeName: "mroot", offset: 1});
  				model.moveLeft();
  				assert.equal("/root/line[1]/math[1]/mroot[1]/mrow[1]/mn[1]", model.getPath());
				var node = model.getFocusNode();
				assert.equal("mn", node.nodeName);
				assert.equal(2, model.getOffset());
				assert.equal("22", dripLang.getText(node));
			});
			
			test("左移进根数，根式后没有任何节点，在根式后左移光标到根数后，根数的最后一个节点是layout节点", function(){
				model.loadData("<root><line>" +
  						"<math>" +
	  						"<mroot>" +
		  						"<mrow>" +
		  							"<mroot><mrow><mn>4</mn></mrow><mrow><mn>2</mn></mrow></mroot>" +
		  						"</mrow>" + // base
		  						"<mrow><mn>11</mn></mrow>" + // index
	  						"</mroot>" +
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
  				model.path.push({nodeName: "mroot", offset: 1});
  				model.moveLeft();
  				assert.equal("/root/line[1]/math[1]/mroot[1]/mrow[1]/mroot[1]", model.getPath());
				var node = model.getFocusNode();
				assert.equal("mroot", node.nodeName);
				assert.equal(1, model.getOffset());
			});
			
			test("左移进根数，根式后有一个token节点，在token节点最前左移光标到根数后，根数的最后一个节点是token节点。", function(){
				model.loadData("<root><line>" +
  						"<math>" +
	  						"<mroot>" +
		  						"<mrow><mn>5678</mn></mrow>" + // base
		  						"<mrow><mn>345</mn></mrow>" + // index
	  						"</mroot>" +
	  						"<mn>12</mn>" +
  						"</math>" +
  				"</line></root>");
  				model.mode = "mathml";
  				var line = model.getLineAt(0);
  				model.anchor.node = line.firstChild.lastChild;
  				model.anchor.offset = 0;
  				model.path = [];
  				model.path.push({nodeName: "root"});
  				model.path.push({nodeName: "line", offset: 1});
  				model.path.push({nodeName: "math", offset: 1});
  				model.path.push({nodeName: "mn", offset: 2});
  				model.moveLeft();
  				assert.equal("/root/line[1]/math[1]/mroot[1]/mrow[1]/mn[1]", model.getPath());
				var node = model.getFocusNode();
				assert.equal("mn", node.nodeName);
				assert.equal(4, model.getOffset());
				assert.equal("5678", dripLang.getText(node));
			});
			
			test("左移进根数，根式后有一个token节点，在token节点最前左移光标到根数后，根数的最后一个节点是layout节点。", function(){
				model.loadData("<root><line>" +
  						"<math>" +
	  						"<mroot>" +
		  						"<mrow><mroot><mrow><mn>4</mn></mrow><mrow><mn>2</mn></mrow></mroot></mrow>" + // base
		  						"<mrow><mn>345</mn></mrow>" + // index
	  						"</mroot>" +
	  						"<mn>12</mn>" +
  						"</math>" +
  				"</line></root>");
  				model.mode = "mathml";
  				var line = model.getLineAt(0);
  				model.anchor.node = line.firstChild.lastChild;
  				model.anchor.offset = 0;
  				model.path = [];
  				model.path.push({nodeName: "root"});
  				model.path.push({nodeName: "line", offset: 1});
  				model.path.push({nodeName: "math", offset: 1});
  				model.path.push({nodeName: "mn", offset: 2});
  				model.moveLeft();
  				assert.equal("/root/line[1]/math[1]/mroot[1]/mrow[1]/mroot[1]", model.getPath());
				var node = model.getFocusNode();
				assert.equal("mroot", node.nodeName);
				assert.equal(1, model.getOffset());
			});
			
			test("左移进根数，根式后有一个layout节点，在layout节点最前左移光标到根数后，根数的最后一个节点是token节点。", function(){
				model.loadData("<root><line>" +
  						"<math>" +
	  						"<mroot>" +
		  						"<mrow><mn>12</mn></mrow>" + // base
		  						"<mrow><mn>345</mn></mrow>" + // index
	  						"</mroot>" +
	  						"<mroot><mrow><mn>4</mn></mrow><mrow><mn>2</mn></mrow></mroot>" +
  						"</math>" +
  				"</line></root>");
  				model.mode = "mathml";
  				var line = model.getLineAt(0);
  				model.anchor.node = line.firstChild.lastChild;
  				model.anchor.offset = 0;
  				model.path = [];
  				model.path.push({nodeName: "root"});
  				model.path.push({nodeName: "line", offset: 1});
  				model.path.push({nodeName: "math", offset: 1});
  				model.path.push({nodeName: "mroot", offset: 2});
  				model.moveLeft();
  				assert.equal("/root/line[1]/math[1]/mroot[1]/mrow[1]/mn[1]", model.getPath());
				var node = model.getFocusNode();
				assert.equal("mn", node.nodeName);
				assert.equal(2, model.getOffset());
				assert.equal("12", dripLang.getText(node));
			});
			
			test("左移进根数，根式后有一个layout节点，在layout节点最前左移光标到根数后，根数的最后一个节点是layout节点。", function(){
				model.loadData("<root><line>" +
  						"<math>" +
	  						"<mroot>" +
		  						"<mrow><mroot><mrow><mn>4</mn></mrow><mrow><mn>2</mn></mrow></mroot></mrow>" + // base
		  						"<mrow><mn>4</mn></mrow>" + // index
	  						"</mroot>" +
	  						"<mroot><mrow><mn>4</mn></mrow><mrow><mn>2</mn></mrow></mroot>" +
  						"</math>" +
  				"</line></root>");
  				model.mode = "mathml";
  				var line = model.getLineAt(0);
  				model.anchor.node = line.firstChild.lastChild;
  				model.anchor.offset = 0;
  				model.path = [];
  				model.path.push({nodeName: "root"});
  				model.path.push({nodeName: "line", offset: 1});
  				model.path.push({nodeName: "math", offset: 1});
  				model.path.push({nodeName: "mroot", offset: 2});
  				model.moveLeft();
  				assert.equal("/root/line[1]/math[1]/mroot[1]/mrow[1]/mroot[1]", model.getPath());
				var node = model.getFocusNode();
				assert.equal("mroot", node.nodeName);
				assert.equal(1, model.getOffset());
			});
			
			test("从根数前左移进根次后，根数第一个节点是token节点，根次最后一个节点是token节点。", function(){
				model.loadData("<root><line>" +
  						"<math>" +
	  						"<mroot>" +
		  						"<mrow><mn>345</mn></mrow>" + // base 测试用例中base中数字的位数和index中数字的位数要不同。
		  						"<mrow><mn>12</mn></mrow>" + // index
	  						"</mroot>" +
  						"</math>" +
  				"</line></root>");
  				model.mode = "mathml";
  				var line = model.getLineAt(0);
  				model.anchor.node = line.firstChild.firstChild.firstChild.firstChild;
  				model.anchor.offset = 0;
  				model.path = [];
  				model.path.push({nodeName: "root"});
  				model.path.push({nodeName: "line", offset: 1});
  				model.path.push({nodeName: "math", offset: 1});
  				model.path.push({nodeName: "mroot", offset: 1});
  				model.path.push({nodeName: "mrow", offset: 1});
  				model.path.push({nodeName: "mn", offset: 1});
  				model.moveLeft();
  				assert.equal("/root/line[1]/math[1]/mroot[1]/mrow[2]/mn[1]", model.getPath());
				var node = model.getFocusNode();
				assert.equal("mn", node.nodeName);
				assert.equal(2, model.getOffset());
				assert.equal("12", dripLang.getText(node));
			});
			
			test("从根数前左移进根次后，根数第一个节点是token节点，根次最后一个节点是layout节点。", function(){
				model.loadData("<root><line>" +
  						"<math>" +
	  						"<mroot>" +
		  						"<mrow><mn>12</mn></mrow>" + // base
		  						"<mrow><mroot><mrow><mn>4</mn></mrow><mrow><mn>2</mn></mrow></mroot></mrow>" + // index
	  						"</mroot>" +
  						"</math>" +
  				"</line></root>");
  				model.mode = "mathml";
  				var line = model.getLineAt(0);
  				model.anchor.node = line.firstChild.firstChild.firstChild.firstChild;
  				model.anchor.offset = 0;
  				model.path = [];
  				model.path.push({nodeName: "root"});
  				model.path.push({nodeName: "line", offset: 1});
  				model.path.push({nodeName: "math", offset: 1});
  				model.path.push({nodeName: "mroot", offset: 1});
  				model.path.push({nodeName: "mrow", offset: 1});
  				model.path.push({nodeName: "mn", offset: 1});
  				model.moveLeft();
  				assert.equal("/root/line[1]/math[1]/mroot[1]/mrow[2]/mroot[1]", model.getPath());
				var node = model.getFocusNode();
				assert.equal("mroot", node.nodeName);
				assert.equal(1, model.getOffset());
			});
			
			test("从根数前左移进根次后，根数第一个节点是layout节点，根次最后一个节点是token节点。", function(){
				model.loadData("<root><line>" +
  						"<math>" +
	  						"<mroot>" +
		  						"<mrow><mroot><mrow><mn>4</mn></mrow><mrow><mn>2</mn></mrow></mroot></mrow>" + // base
		  						"<mrow><mn>12</mn></mrow>" + // index
	  						"</mroot>" +
  						"</math>" +
  				"</line></root>");
  				model.mode = "mathml";
  				var line = model.getLineAt(0);
  				model.anchor.node = line.firstChild.firstChild.firstChild.firstChild;
  				model.anchor.offset = 0;
  				model.path = [];
  				model.path.push({nodeName: "root"});
  				model.path.push({nodeName: "line", offset: 1});
  				model.path.push({nodeName: "math", offset: 1});
  				model.path.push({nodeName: "mroot", offset: 1});
  				model.path.push({nodeName: "mrow", offset: 1});
  				model.path.push({nodeName: "mroot", offset: 1});
  				model.moveLeft();
  				assert.equal("/root/line[1]/math[1]/mroot[1]/mrow[2]/mn[1]", model.getPath());
				var node = model.getFocusNode();
				assert.equal("mn", node.nodeName);
				assert.equal(2, model.getOffset());
				assert.equal("12", dripLang.getText(node));
			});
			
			test("从根数前左移进根次后，根数第一个节点是layout节点，根次最后一个节点是layout节点。", function(){
				model.loadData("<root><line>" +
  						"<math>" +
	  						"<mroot>" +
		  						"<mrow><mroot><mrow><mn>3</mn></mrow><mrow><mn>4</mn></mrow></mroot></mrow>" + // base
		  						"<mrow><mroot><mrow><mn>1</mn></mrow><mrow><mn>2</mn></mrow></mroot></mrow>" + // index
	  						"</mroot>" +
  						"</math>" +
  				"</line></root>");
  				model.mode = "mathml";
  				var line = model.getLineAt(0);
  				model.anchor.node = line.firstChild.firstChild.firstChild.firstChild;
  				model.anchor.offset = 0;
  				model.path = [];
  				model.path.push({nodeName: "root"});
  				model.path.push({nodeName: "line", offset: 1});
  				model.path.push({nodeName: "math", offset: 1});
  				model.path.push({nodeName: "mroot", offset: 1});
  				model.path.push({nodeName: "mrow", offset: 1});
  				model.path.push({nodeName: "mroot", offset: 1});
  				model.moveLeft();
  				assert.equal("/root/line[1]/math[1]/mroot[1]/mrow[2]/mroot[1]", model.getPath());
				var node = model.getFocusNode();
				assert.equal("mroot", node.nodeName);
				assert.equal(1, model.getOffset());
			});
			
			test("从根次前左移出根式，到根式前，根次的第一个节点是token节点。", function(){
				model.loadData("<root><line>" +
  						"<math>" +
	  						"<mroot>" +
		  						"<mrow><mn>34</mn></mrow>" + // base
		  						"<mrow><mn>12</mn></mrow>" + // index
	  						"</mroot>" +
  						"</math>" +
  				"</line></root>");
  				model.mode = "mathml";
  				var line = model.getLineAt(0);
  				model.anchor.node = line.firstChild.firstChild.lastChild.firstChild;
  				model.anchor.offset = 0;
  				model.path = [];
  				model.path.push({nodeName: "root"});
  				model.path.push({nodeName: "line", offset: 1});
  				model.path.push({nodeName: "math", offset: 1});
  				model.path.push({nodeName: "mroot", offset: 1});
  				model.path.push({nodeName: "mrow", offset: 2});
  				model.path.push({nodeName: "mn", offset: 1});
  				model.moveLeft();
  				assert.equal("/root/line[1]/math[1]/mroot[1]", model.getPath());
				var node = model.getFocusNode();
				assert.equal("mroot", node.nodeName);
				assert.equal(0, model.getOffset());
			});
			
			test("从根次前左移出根式，到根式前，根次的第一个节点是layout节点。", function(){
				model.loadData("<root><line>" +
  						"<math>" +
	  						"<mroot>" +
		  						"<mrow><mn>12</mn></mrow>" + // base
		  						"<mrow><mroot><mrow><mn>1</mn></mrow><mrow><mn>2</mn></mrow></mroot></mrow>" + // index
	  						"</mroot>" +
  						"</math>" +
  				"</line></root>");
  				model.mode = "mathml";
  				var line = model.getLineAt(0);
  				model.anchor.node = line.firstChild.firstChild.lastChild.firstChild;
  				model.anchor.offset = 0;
  				model.path = [];
  				model.path.push({nodeName: "root"});
  				model.path.push({nodeName: "line", offset: 1});
  				model.path.push({nodeName: "math", offset: 1});
  				model.path.push({nodeName: "mroot", offset: 1});
  				model.path.push({nodeName: "mrow", offset: 2});
  				model.path.push({nodeName: "mroot", offset: 1});
  				model.moveLeft();
  				assert.equal("/root/line[1]/math[1]/mroot[1]", model.getPath());
				var node = model.getFocusNode();
				assert.equal("mroot", node.nodeName);
				assert.equal(0, model.getOffset());
			});
			
			
		});
	}
	
});