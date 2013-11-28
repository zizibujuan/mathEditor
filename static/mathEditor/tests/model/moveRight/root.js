define([ "intern!tdd", 
         "intern/chai!assert", 
         "mathEditor/Model", 
         "mathEditor/lang" ], function(
        		 tdd,
        		 assert, 
        		 Model, 
        		 dripLang) {

	// summary:
	//		在根式中右移光标（这个根式中显示包含根次）
	//		右移进根式，首先进入根次
	//		1. 根式前没有任何节点，在根式前右移光标到根次前，根次的第一个节点是token节点；
	//		2. 根式前没有任何节点，在根式前右移光标到根次前，根次的第一个节点是layout节点；
	//		3. 根式前有一个token节点，在token节点最后右移光标到根次前，根次的第一个节点是token节点；
	//		4. 根式前有一个token节点，在token节点最后右移光标到根次前，根次的第一个节点是layout节点；
	//		5. 根式前有一个layout节点，在layout节点最后右移光标到根次前，根次的第一个节点是token节点；
	//		6. 根式前有一个layout节点，在layout节点最后右移光标到根次前，根次的第一个节点是layout节点；
	//		从根次后右移进根数前
	//		1. 根次最后一个节点是token节点，根数第一个节点是token节点
	//		2. 根次最后一个节点是token节点，根数第一个节点是layout节点
	//		3. 根次最后一个节点是layout节点，根数第一个节点是token节点
	//		4. 根次最后一个节点是layout节点，根数第一个节点是layout节点
	//		从根数后右移出根式，到根式后（注意：与根式后有无节点或节点种类无关）
	//		1. 根数的最后一个节点是token节点
	//		2. 根数的最后一个节点是layout节点
	
	with(tdd){
		suite("Model.moveRight.root 在根式中右移光标", function(){
			
			var model = null;
			beforeEach(function () {
				model = new Model({});
			});
			
			test("mathml模式下，在空的根式root中右移光标，将光标从index中移到base中。", function(){
				model.toMathMLMode();
  				model.setData({data: "", nodeName: "mroot"});
  				model.moveRight();
  				
				assert.equal("/root/line[1]/math[1]/mroot[1]/mrow[1]/mn[1]", model.getPath());
				
				var baseNode = model.getFocusNode();
				assert.equal("mn", baseNode.nodeName);
				assert.equal("drip_placeholder_box", baseNode.getAttribute("class"));
				assert.equal(0, model.getOffset());
				
				var indexNode = baseNode.parentNode.nextSibling.firstChild;
				assert.equal("mn", indexNode.nodeName);
				assert.equal("drip_placeholder_box", indexNode.getAttribute("class"));
			});
			
			test("mathml模式下，在空的根式root中右移光标两次，将光标移到根式之后。", function(){
				model.toMathMLMode();
  				model.setData({data: "", nodeName: "mroot"});
  				model.moveRight();
  				model.moveRight();
  				
				assert.equal("/root/line[1]/math[1]/mroot[1]", model.getPath());
				
				var node = model.getFocusNode();
				assert.equal("mroot", node.nodeName);
				assert.equal(1, model.getOffset());
			});
			
			test("右移进根次，根式前没有任何节点，在根式前右移光标到根次前，根次的第一个节点是token节点。", function(){
				model.mode = "mathml";
  				model.loadData("<root><line>" +
  						"<math>" +
	  						"<mroot>" +
		  						"<mrow><mn>4</mn></mrow>" + // base
		  						"<mrow><mn>2</mn></mrow>" + // index
	  						"</mroot>" +
  						"</math>" +
  				"</line></root>");
  				
  				var line = model.getLineAt(0);
  				model.anchor.node = line.firstChild.firstChild;
  				model.anchor.offset = 0;
  				model.path = [];model.path.push({nodeName: "root"});
  				model.path.push({nodeName: "line", offset: 1});
  				model.path.push({nodeName: "math", offset: 1});
  				model.path.push({nodeName: "mroot", offset: 1});
  				model.moveRight();
  				assert.equal("/root/line[1]/math[1]/mroot[1]/mrow[2]/mn[1]", model.getPath());
				var node = model.getFocusNode();
				assert.equal("mn", node.nodeName);
				assert.equal(0, model.getOffset());
				assert.equal("2", dripLang.getText(node));
			});
			
			test("右移进根次，根式前没有任何节点，在根式前右移光标到根次前，根次的第一个节点是layout节点。", function(){
				model.mode = "mathml";
  				model.loadData("<root><line>" +
  						"<math>" +
	  						"<mroot>" +
		  						"<mrow><mn>4</mn></mrow>" + // base
		  						"<mrow><mroot><mrow><mn>4</mn></mrow><mrow><mn>2</mn></mrow></mroot></mrow>" + // index
	  						"</mroot>" +
  						"</math>" +
  				"</line></root>");
  				
  				var line = model.getLineAt(0);
  				model.anchor.node = line.firstChild.firstChild;
  				model.anchor.offset = 0;
  				model.path = [];model.path.push({nodeName: "root"});
  				model.path.push({nodeName: "line", offset: 1});
  				model.path.push({nodeName: "math", offset: 1});
  				model.path.push({nodeName: "mroot", offset: 1});
  				model.moveRight();
  				assert.equal("/root/line[1]/math[1]/mroot[1]/mrow[2]/mroot[1]", model.getPath());
				var node = model.getFocusNode();
				assert.equal("mroot", node.nodeName);
				assert.equal(0, model.getOffset());
			});
			
			test("右移进根次，根式前有一个token节点，在token节点最后右移光标到根次前，根次的第一个节点是token节点。", function(){
				model.mode = "mathml";
  				model.loadData("<root><line>" +
  						"<math>" +
  							"<mn>12</mn>" +
	  						"<mroot>" +
		  						"<mrow><mn>4</mn></mrow>" + // base
		  						"<mrow><mn>2</mn></mrow>" + // index
	  						"</mroot>" +
  						"</math>" +
  				"</line></root>");
  				
  				var line = model.getLineAt(0);
  				model.anchor.node = line.firstChild.firstChild;
  				model.anchor.offset = 2;
  				model.path = [];model.path.push({nodeName: "root"});
  				model.path.push({nodeName: "line", offset: 1});
  				model.path.push({nodeName: "math", offset: 1});
  				model.path.push({nodeName: "mn", offset: 1});
  				model.moveRight();
  				assert.equal("/root/line[1]/math[1]/mroot[2]/mrow[2]/mn[1]", model.getPath());
				var node = model.getFocusNode();
				assert.equal("mn", node.nodeName);
				assert.equal(0, model.getOffset());
			});
			
			test("右移进根次，根式前有一个token节点，在token节点最后右移光标到根次前，根次的第一个节点是layout节点。", function(){
				model.mode = "mathml";
  				model.loadData("<root><line>" +
  						"<math>" +
  							"<mn>12</mn>" +
	  						"<mroot>" +
		  						"<mrow><mn>4</mn></mrow>" + // base
		  						"<mrow><mroot><mrow><mn>4</mn></mrow><mrow><mn>2</mn></mrow></mroot></mrow>" + // index
	  						"</mroot>" +
  						"</math>" +
  				"</line></root>");
  				
  				var line = model.getLineAt(0);
  				model.anchor.node = line.firstChild.firstChild;
  				model.anchor.offset = 2;
  				model.path = [];model.path.push({nodeName: "root"});
  				model.path.push({nodeName: "line", offset: 1});
  				model.path.push({nodeName: "math", offset: 1});
  				model.path.push({nodeName: "mn", offset: 1});
  				model.moveRight();
  				assert.equal("/root/line[1]/math[1]/mroot[2]/mrow[2]/mroot[1]", model.getPath());
				var node = model.getFocusNode();
				assert.equal("mroot", node.nodeName);
				assert.equal(0, model.getOffset());
			});
			
			test("右移进根次，根式前有一个layout节点，在layout节点最后右移光标到根次前，根次的第一个节点是token节点。", function(){
				model.mode = "mathml";
  				model.loadData("<root><line>" +
  						"<math>" +
  							"<mroot><mrow><mn>4</mn></mrow><mrow><mn>2</mn></mrow></mroot>" +
	  						"<mroot>" +
		  						"<mrow><mn>4</mn></mrow>" + // base
		  						"<mrow><mn>12</mn></mrow>" + // index
	  						"</mroot>" +
  						"</math>" +
  				"</line></root>");
  				
  				var line = model.getLineAt(0);
  				model.anchor.node = line.firstChild.firstChild;
  				model.anchor.offset = 1;
  				model.path = [];model.path.push({nodeName: "root"});
  				model.path.push({nodeName: "line", offset: 1});
  				model.path.push({nodeName: "math", offset: 1});
  				model.path.push({nodeName: "mroot", offset: 1});
  				model.moveRight();
  				assert.equal("/root/line[1]/math[1]/mroot[2]/mrow[2]/mn[1]", model.getPath());
				var node = model.getFocusNode();
				assert.equal("mn", node.nodeName);
				assert.equal(0, model.getOffset());
			});
			
			test("右移进根次，根式前有一个layout节点，在layout节点最后右移光标到根次前，根次的第一个节点是layout节点。", function(){
				model.mode = "mathml";
  				model.loadData("<root><line>" +
  						"<math>" +
  							"<mroot><mrow><mn>4</mn></mrow><mrow><mn>2</mn></mrow></mroot>" +
	  						"<mroot>" +
		  						"<mrow><mn>4</mn></mrow>" + // base
		  						"<mrow><mroot><mrow><mn>4</mn></mrow><mrow><mn>2</mn></mrow></mroot></mrow>" + // index
	  						"</mroot>" +
  						"</math>" +
  				"</line></root>");
  				
  				var line = model.getLineAt(0);
  				model.anchor.node = line.firstChild.firstChild;
  				model.anchor.offset = 1;
  				model.path = [];model.path.push({nodeName: "root"});
  				model.path.push({nodeName: "line", offset: 1});
  				model.path.push({nodeName: "math", offset: 1});
  				model.path.push({nodeName: "mroot", offset: 1});
  				model.moveRight();
  				assert.equal("/root/line[1]/math[1]/mroot[2]/mrow[2]/mroot[1]", model.getPath());
				var node = model.getFocusNode();
				assert.equal("mroot", node.nodeName);
				assert.equal(0, model.getOffset());
			});
			
			test("从根次后右移进根数前，根次最后一个节点是token节点，根数第一个节点是token节点。", function(){
				model.mode = "mathml";
  				model.loadData("<root><line>" +
  						"<math>" +
	  						"<mroot>" +
		  						"<mrow><mn>34</mn></mrow>" + // base
		  						"<mrow><mn>12</mn></mrow>" + // index
	  						"</mroot>" +
  						"</math>" +
  				"</line></root>");
  				
  				var line = model.getLineAt(0);
  				model.anchor.node = line.firstChild.firstChild.lastChild.firstChild;
  				model.anchor.offset = 2;
  				model.path = [];model.path.push({nodeName: "root"});
  				model.path.push({nodeName: "line", offset: 1});
  				model.path.push({nodeName: "math", offset: 1});
  				model.path.push({nodeName: "mroot", offset: 1});
  				model.path.push({nodeName: "mrow", offset: 2});
  				model.path.push({nodeName: "mn", offset: 1});
  				model.moveRight();
  				assert.equal("/root/line[1]/math[1]/mroot[1]/mrow[1]/mn[1]", model.getPath());
				var node = model.getFocusNode();
				assert.equal("mn", node.nodeName);
				assert.equal(0, model.getOffset());
				assert.equal("34", dripLang.getText(node));
			});
			
			test("从根次后右移进根数前，根次最后一个节点是token节点，根数第一个节点是layout节点。", function(){
				model.mode = "mathml";
  				model.loadData("<root><line>" +
  						"<math>" +
	  						"<mroot>" +
		  						"<mrow><mroot><mrow><mn>4</mn></mrow><mrow><mn>2</mn></mrow></mroot></mrow>" + // base
		  						"<mrow><mn>12</mn></mrow>" + // index
	  						"</mroot>" +
  						"</math>" +
  				"</line></root>");
  				
  				var line = model.getLineAt(0);
  				model.anchor.node = line.firstChild.firstChild.lastChild.firstChild;
  				model.anchor.offset = 2;
  				model.path = [];model.path.push({nodeName: "root"});
  				model.path.push({nodeName: "line", offset: 1});
  				model.path.push({nodeName: "math", offset: 1});
  				model.path.push({nodeName: "mroot", offset: 1});
  				model.path.push({nodeName: "mrow", offset: 2});
  				model.path.push({nodeName: "mn", offset: 1});
  				model.moveRight();
  				assert.equal("/root/line[1]/math[1]/mroot[1]/mrow[1]/mroot[1]", model.getPath());
				var node = model.getFocusNode();
				assert.equal("mroot", node.nodeName);
				assert.equal(0, model.getOffset());
			});
			
			test("从根次后右移进根数前，根次最后一个节点是layout节点，根数第一个节点是token节点。", function(){
				model.mode = "mathml";
  				model.loadData("<root><line>" +
  						"<math>" +
	  						"<mroot>" +
		  						"<mrow><mn>12</mn></mrow>" + // base
		  						"<mrow><mroot><mrow><mn>4</mn></mrow><mrow><mn>2</mn></mrow></mroot></mrow>" + // index
	  						"</mroot>" +
  						"</math>" +
  				"</line></root>");
  				
  				var line = model.getLineAt(0);
  				model.anchor.node = line.firstChild.firstChild.lastChild.firstChild;
  				model.anchor.offset = 1;
  				model.path = [];model.path.push({nodeName: "root"});
  				model.path.push({nodeName: "line", offset: 1});
  				model.path.push({nodeName: "math", offset: 1});
  				model.path.push({nodeName: "mroot", offset: 1});
  				model.path.push({nodeName: "mrow", offset: 2});
  				model.path.push({nodeName: "mroot", offset: 1});
  				model.moveRight();
  				assert.equal("/root/line[1]/math[1]/mroot[1]/mrow[1]/mn[1]", model.getPath());
				var node = model.getFocusNode();
				assert.equal("mn", node.nodeName);
				assert.equal(0, model.getOffset());
			});
			
			test("从根次后右移进根数前，根次最后一个节点是layout节点，根数第一个节点是layout节点。", function(){
				model.mode = "mathml";
  				model.loadData("<root><line>" +
  						"<math>" +
	  						"<mroot>" +
		  						"<mrow><mroot><mrow><mn>3</mn></mrow><mrow><mn>4</mn></mrow></mroot></mrow>" + // base
		  						"<mrow><mroot><mrow><mn>1</mn></mrow><mrow><mn>2</mn></mrow></mroot></mrow>" + // index
	  						"</mroot>" +
  						"</math>" +
  				"</line></root>");
  				
  				var line = model.getLineAt(0);
  				model.anchor.node = line.firstChild.firstChild.lastChild.firstChild;
  				model.anchor.offset = 1;
  				model.path = [];model.path.push({nodeName: "root"});
  				model.path.push({nodeName: "line", offset: 1});
  				model.path.push({nodeName: "math", offset: 1});
  				model.path.push({nodeName: "mroot", offset: 1});
  				model.path.push({nodeName: "mrow", offset: 2});
  				model.path.push({nodeName: "mroot", offset: 1});
  				model.moveRight();
  				assert.equal("/root/line[1]/math[1]/mroot[1]/mrow[1]/mroot[1]", model.getPath());
				var node = model.getFocusNode();
				assert.equal("mroot", node.nodeName);
				assert.equal(0, model.getOffset());
			});
			
			test("从根数后右移出根式，到根式后，根数的最后一个节点是token节点。", function(){
				model.mode = "mathml";
  				model.loadData("<root><line>" +
  						"<math>" +
	  						"<mroot>" +
		  						"<mrow><mn>34</mn></mrow>" + // base
		  						"<mrow><mn>12</mn></mrow>" + // index
	  						"</mroot>" +
  						"</math>" +
  				"</line></root>");
  				
  				var line = model.getLineAt(0);
  				model.anchor.node = line.firstChild.firstChild.firstChild.firstChild;
  				model.anchor.offset = 2;
  				model.path = [];model.path.push({nodeName: "root"});
  				model.path.push({nodeName: "line", offset: 1});
  				model.path.push({nodeName: "math", offset: 1});
  				model.path.push({nodeName: "mroot", offset: 1});
  				model.path.push({nodeName: "mrow", offset: 1});
  				model.path.push({nodeName: "mn", offset: 1});
  				model.moveRight();
  				assert.equal("/root/line[1]/math[1]/mroot[1]", model.getPath());
				var node = model.getFocusNode();
				assert.equal("mroot", node.nodeName);
				assert.equal(1, model.getOffset());
			});
			
			test("从根数后右移出根式，到根式后，根数的最后一个节点是layout节点。", function(){
				model.mode = "mathml";
  				model.loadData("<root><line>" +
  						"<math>" +
	  						"<mroot>" +
		  						"<mrow><mroot><mrow><mn>1</mn></mrow><mrow><mn>2</mn></mrow></mroot></mrow>" + // base
		  						"<mrow><mn>12</mn></mrow>" + // index
	  						"</mroot>" +
  						"</math>" +
  				"</line></root>");
  				
  				var line = model.getLineAt(0);
  				model.anchor.node = line.firstChild.firstChild.firstChild.firstChild;
  				model.anchor.offset = 1;
  				model.path = [];model.path.push({nodeName: "root"});
  				model.path.push({nodeName: "line", offset: 1});
  				model.path.push({nodeName: "math", offset: 1});
  				model.path.push({nodeName: "mroot", offset: 1});
  				model.path.push({nodeName: "mrow", offset: 1});
  				model.path.push({nodeName: "mroot", offset: 1});
  				model.moveRight();
  				assert.equal("/root/line[1]/math[1]/mroot[1]", model.getPath());
				var node = model.getFocusNode();
				assert.equal("mroot", node.nodeName);
				assert.equal(1, model.getOffset());
			});
			
		});
	}
	
});