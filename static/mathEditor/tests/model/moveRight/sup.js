define([ "intern!tdd", 
         "intern/chai!assert", 
         "mathEditor/Model", 
         "mathEditor/lang" ], function(
        		 tdd,
        		 assert,
        		 Model, 
        		 dripLang) {

	// summary:
	//		在有上标的公式上右移光标(base的mrow部分要高亮显示)
	//
	//		右移进入sup
	//		1. sup前没有任何节点，在sup前右移光标，移到base前，base的第一个节点是token节点；
	//		2. sup前没有任何节点，在sup前右移光标，移到base前，base的第一个节点是layout节点；
	//		3. sup前有一个token节点，从token的最后右移到sup的base前，base的第一个节点是token节点；
	//		4. sup前有一个token节点，从token的最后右移到sup的base前，base的第一个节点是layout节点；
	//		5. sup前有一个layout节点，从layout的最后右移到sup的base前，base的第一个节点是token节点；
	//		6. sup前有一个layout节点，从layout的最后右移到sup的base前，base的第一个节点是layout节点；
	//		从base后右移到superscript前
	//		1. base的最后一个节点是token节点，superscript的第一个节点是token节点
	//		2. base的最后一个节点是token节点，superscript的第一个节点是layout节点
	//		3. base的最后一个节点是layout节点，superscript的第一个节点是token节点
	//		4. base的最后一个节点是layout节点，superscript的第一个节点是layout节点
	//		从superscript后移出sup节点
	//		1. superscript的最后一个节点是token节点
	//		2. superscript的最后一个节点是layout节点
	
	with(tdd){
		suite("Model.moveRight.sup 在有上标的符号中右移光标", function(){
			
			var model = null;
			beforeEach(function () {
				model = new Model({});
			});
			
			test("mathml模式下，在空的有上标的公式中，将光标从base中移到supscript中", function(){
				model.toMathMLMode();
  				model.setData({data: "", nodeName: "msup"});
  				model.moveLeft();
  				model.moveRight();
  				
  				assert.equal("/root/line[1]/math[1]/msup[1]/mrow[2]/mn[1]", model.getPath());
  				var node = model.getFocusNode();
	  			assert.equal("mn", node.nodeName);
	  			assert.equal("drip_placeholder_box", node.getAttribute("class"));
	  			assert.equal(0, model.getOffset());
	  			
	  			var baseNode = node;
	  			var superscriptNode = baseNode.parentNode.previousSibling.firstChild;
	  			assert.equal("mn", superscriptNode.nodeName);
	  			assert.equal("drip_placeholder_box", superscriptNode.getAttribute("class"));
			});
			
			test("右移进入sup，sup前没有任何节点，在sup前右移光标，移到base前，base的第一个节点是token节点。", function(){
				model.mode = "mathml";
  				model.loadData("<root><line>" +
  						"<math>" +
	  						"<msup>" +
		  						"<mrow><mn>123</mn></mrow>" + // base
		  						"<mrow><mn>12</mn></mrow>" + // superscript
	  						"</msup>" +
  						"</math>" +
  				"</line></root>");
  				
  				var line = model.getLineAt(0);
  				model.anchor.node = line.firstChild.firstChild;
  				model.anchor.offset = 0;
  				model.path = [];model.path.push({nodeName: "root"});
  				model.path.push({nodeName: "line", offset: 1});
  				model.path.push({nodeName: "math", offset: 1});
  				model.path.push({nodeName: "msup", offset: 1});
  				model.moveRight();
  				assert.equal("/root/line[1]/math[1]/msup[1]/mrow[1]/mn[1]", model.getPath());
				var node = model.getFocusNode();
				assert.equal("mn", node.nodeName);
				assert.equal(0, model.getOffset());
				assert.equal("123", dripLang.getText(node));
			});
			
			test("右移进入sup，sup前没有任何节点，在sup前右移光标，移到base前，base的第一个节点是layout节点。", function(){
				model.mode = "mathml";
  				model.loadData("<root><line>" +
  						"<math>" +
	  						"<msup>" +
		  						"<mrow><msup><mrow><mn>2</mn></mrow><mrow><mn>3</mn></mrow></msup></mrow>" + // base
		  						"<mrow><mn>123</mn></mrow>" + // superscript
	  						"</msup>" +
  						"</math>" +
  				"</line></root>");
  				
  				var line = model.getLineAt(0);
  				model.anchor.node = line.firstChild.firstChild;
  				model.anchor.offset = 0;
  				model.path = [];model.path.push({nodeName: "root"});
  				model.path.push({nodeName: "line", offset: 1});
  				model.path.push({nodeName: "math", offset: 1});
  				model.path.push({nodeName: "msup", offset: 1});
  				model.moveRight();
  				assert.equal("/root/line[1]/math[1]/msup[1]/mrow[1]/msup[1]", model.getPath());
				var node = model.getFocusNode();
				assert.equal("msup", node.nodeName);
				assert.equal(0, model.getOffset());
			});
			
			test("右移进入sup，sup前有一个token节点，从token的最后右移到sup的base前，base的第一个节点是token节点。", function(){
				model.mode = "mathml";
  				model.loadData("<root><line>" +
  						"<math>" +
  							"<mn>12</mn>" +
	  						"<msup>" +
		  						"<mrow><mn>5678</mn></mrow>" + // base
		  						"<mrow><mn>345</mn></mrow>" + // superscript
	  						"</msup>" +
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
  				assert.equal("/root/line[1]/math[1]/msup[2]/mrow[1]/mn[1]", model.getPath());
				var node = model.getFocusNode();
				assert.equal("mn", node.nodeName);
				assert.equal(0, model.getOffset());
				assert.equal("5678", dripLang.getText(node));
			});
			
			test("右移进入sup，sup前有一个token节点，从token的最后右移到sup的base前，base的第一个节点是layout节点。", function(){
				model.mode = "mathml";
  				model.loadData("<root><line>" +
  						"<math>" +
  							"<mn>12</mn>" +
	  						"<msup>" +
		  						"<mrow><msup><mrow><mn>4</mn></mrow><mrow><mn>2</mn></mrow></msup></mrow>" + // base
		  						"<mrow><mn>345</mn></mrow>" + // superscript
	  						"</msup>" +
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
  				assert.equal("/root/line[1]/math[1]/msup[2]/mrow[1]/msup[1]", model.getPath());
				var node = model.getFocusNode();
				assert.equal("msup", node.nodeName);
				assert.equal(0, model.getOffset());
			});
			
			test("右移进入sup，sup前有一个layout节点，从layout的最后右移到sup的base前，base的第一个节点是token节点。", function(){
				model.mode = "mathml";
  				model.loadData("<root><line>" +
  						"<math>" +
  							"<msup><mrow><mn>4</mn></mrow><mrow><mn>2</mn></mrow></msup>" +
	  						"<msup>" +
		  						"<mrow><mn>12</mn></mrow>" + // base
		  						"<mrow><mn>345</mn></mrow>" + // superscript
	  						"</msup>" +
  						"</math>" +
  				"</line></root>");
  				var line = model.getLineAt(0);
  				model.anchor.node = line.firstChild.firstChild;
  				model.anchor.offset = 1;
  				model.path = [];model.path.push({nodeName: "root"});
  				model.path.push({nodeName: "line", offset: 1});
  				model.path.push({nodeName: "math", offset: 1});
  				model.path.push({nodeName: "msup", offset: 1});
  				model.moveRight();
  				assert.equal("/root/line[1]/math[1]/msup[2]/mrow[1]/mn[1]", model.getPath());
				var node = model.getFocusNode();
				assert.equal("mn", node.nodeName);
				assert.equal(0, model.getOffset());
				assert.equal("12", dripLang.getText(node));
			});
			
			test("右移进入sup，sup前有一个layout节点，从layout的最后右移到sup的base前，base的第一个节点是layout节点。", function(){
				model.mode = "mathml";
  				model.loadData("<root><line>" +
  						"<math>" +
  							"<msup><mrow><mn>4</mn></mrow><mrow><mn>2</mn></mrow></msup>" +
	  						"<msup>" +
		  						"<mrow><msup><mrow><mn>4</mn></mrow><mrow><mn>2</mn></mrow></msup></mrow>" + // base
		  						"<mrow><mn>4</mn></mrow>" + // superscript
	  						"</msup>" +
  						"</math>" +
  				"</line></root>");
  				var line = model.getLineAt(0);
  				model.anchor.node = line.firstChild.firstChild;
  				model.anchor.offset = 1;
  				model.path = [];model.path.push({nodeName: "root"});
  				model.path.push({nodeName: "line", offset: 1});
  				model.path.push({nodeName: "math", offset: 1});
  				model.path.push({nodeName: "msup", offset: 1});
  				model.moveRight();
  				assert.equal("/root/line[1]/math[1]/msup[2]/mrow[1]/msup[1]", model.getPath());
				var node = model.getFocusNode();
				assert.equal("msup", node.nodeName);
				assert.equal(0, model.getOffset());
			});
			
			test("从base后右移到superscript前，base的最后一个节点是token节点，superscript的第一个节点是token节点。", function(){
				model.mode = "mathml";
  				model.loadData("<root><line>" +
  						"<math>" +
	  						"<msup>" +
		  						"<mrow><mn>345</mn></mrow>" + // base 测试用例中base中数字的位数和index中数字的位数要不同。
		  						"<mrow><mn>12</mn></mrow>" + // superscript
	  						"</msup>" +
  						"</math>" +
  				"</line></root>");
  				
  				var line = model.getLineAt(0);
  				model.anchor.node = line.firstChild.firstChild.firstChild.firstChild;
  				model.anchor.offset = 3;
  				model.path = [];model.path.push({nodeName: "root"});
  				model.path.push({nodeName: "line", offset: 1});
  				model.path.push({nodeName: "math", offset: 1});
  				model.path.push({nodeName: "msup", offset: 1});
  				model.path.push({nodeName: "mrow", offset: 1});
  				model.path.push({nodeName: "mn", offset: 1});
  				model.moveRight();
  				assert.equal("/root/line[1]/math[1]/msup[1]/mrow[2]/mn[1]", model.getPath());
				var node = model.getFocusNode();
				assert.equal("mn", node.nodeName);
				assert.equal(0, model.getOffset());
				assert.equal("12", dripLang.getText(node));
			});
			
			test("从base后右移到superscript前，base的最后一个节点是token节点，superscript的第一个节点是layout节点。", function(){
				model.mode = "mathml";
  				model.loadData("<root><line>" +
  						"<math>" +
	  						"<msup>" +
		  						"<mrow><mn>12</mn></mrow>" + // base
		  						"<mrow><msup><mrow><mn>4</mn></mrow><mrow><mn>2</mn></mrow></msup></mrow>" + // superscript
	  						"</msup>" +
  						"</math>" +
  				"</line></root>");
  				
  				var line = model.getLineAt(0);
  				model.anchor.node = line.firstChild.firstChild.firstChild.firstChild;
  				model.anchor.offset = 2;
  				model.path = [];model.path.push({nodeName: "root"});
  				model.path.push({nodeName: "line", offset: 1});
  				model.path.push({nodeName: "math", offset: 1});
  				model.path.push({nodeName: "msup", offset: 1});
  				model.path.push({nodeName: "mrow", offset: 1});
  				model.path.push({nodeName: "mn", offset: 1});
  				model.moveRight();
  				assert.equal("/root/line[1]/math[1]/msup[1]/mrow[2]/msup[1]", model.getPath());
				var node = model.getFocusNode();
				assert.equal("msup", node.nodeName);
				assert.equal(0, model.getOffset());
			});
			
			test("从base后右移到superscript前，base的最后一个节点是layout节点，superscript的第一个节点是token节点。", function(){
				model.mode = "mathml";
  				model.loadData("<root><line>" +
  						"<math>" +
	  						"<msup>" +
		  						"<mrow><msup><mrow><mn>4</mn></mrow><mrow><mn>2</mn></mrow></msup></mrow>" + // base
		  						"<mrow><mn>12</mn></mrow>" + // superscript
	  						"</msup>" +
  						"</math>" +
  				"</line></root>");
  				
  				var line = model.getLineAt(0);
  				model.anchor.node = line.firstChild.firstChild.firstChild.firstChild;
  				model.anchor.offset = 1;
  				model.path = [];model.path.push({nodeName: "root"});
  				model.path.push({nodeName: "line", offset: 1});
  				model.path.push({nodeName: "math", offset: 1});
  				model.path.push({nodeName: "msup", offset: 1});
  				model.path.push({nodeName: "mrow", offset: 1});
  				model.path.push({nodeName: "msup", offset: 1});
  				model.moveRight();
  				assert.equal("/root/line[1]/math[1]/msup[1]/mrow[2]/mn[1]", model.getPath());
				var node = model.getFocusNode();
				assert.equal("mn", node.nodeName);
				assert.equal(0, model.getOffset());
				assert.equal("12", dripLang.getText(node));
			});
			
			test("从base后右移到superscript前，base的最后一个节点是layout节点，superscript的第一个节点是layout节点。", function(){
				model.mode = "mathml";
  				model.loadData("<root><line>" +
  						"<math>" +
	  						"<msup>" +
		  						"<mrow><msup><mrow><mn>3</mn></mrow><mrow><mn>4</mn></mrow></msup></mrow>" + // base
		  						"<mrow><msup><mrow><mn>1</mn></mrow><mrow><mn>2</mn></mrow></msup></mrow>" + // superscript
	  						"</msup>" +
  						"</math>" +
  				"</line></root>");
  				
  				var line = model.getLineAt(0);
  				model.anchor.node = line.firstChild.firstChild.firstChild.firstChild;
  				model.anchor.offset = 1;
  				model.path = [];model.path.push({nodeName: "root"});
  				model.path.push({nodeName: "line", offset: 1});
  				model.path.push({nodeName: "math", offset: 1});
  				model.path.push({nodeName: "msup", offset: 1});
  				model.path.push({nodeName: "mrow", offset: 1});
  				model.path.push({nodeName: "msup", offset: 1});
  				model.moveRight();
  				assert.equal("/root/line[1]/math[1]/msup[1]/mrow[2]/msup[1]", model.getPath());
				var node = model.getFocusNode();
				assert.equal("msup", node.nodeName);
				assert.equal(0, model.getOffset());
			});
			
			test("从superscript后移出sup节点，superscript的最后一个节点是token节点。", function(){
				model.mode = "mathml";
  				model.loadData("<root><line>" +
  						"<math>" +
	  						"<msup>" +
		  						"<mrow><mn>34</mn></mrow>" + // base
		  						"<mrow><mn>123</mn></mrow>" + // superscript
	  						"</msup>" +
  						"</math>" +
  				"</line></root>");
  				var line = model.getLineAt(0);
  				model.anchor.node = line.firstChild.firstChild.lastChild.firstChild;
  				model.anchor.offset = 3;
  				model.path = [];model.path.push({nodeName: "root"});
  				model.path.push({nodeName: "line", offset: 1});
  				model.path.push({nodeName: "math", offset: 1});
  				model.path.push({nodeName: "msup", offset: 1});
  				model.path.push({nodeName: "mrow", offset: 2});
  				model.path.push({nodeName: "mn", offset: 1});
  				model.moveRight();
  				assert.equal("/root/line[1]/math[1]/msup[1]", model.getPath());
				var node = model.getFocusNode();
				assert.equal("msup", node.nodeName);
				assert.equal(1, model.getOffset());
			});
			
			test("从superscript后移出sup节点，superscript的最后一个节点是layout节点。", function(){
				model.mode = "mathml";
  				model.loadData("<root><line>" +
  						"<math>" +
	  						"<msup>" +
		  						"<mrow><mn>12</mn></mrow>" + // base
		  						"<mrow><msup><mrow><mn>1</mn></mrow><mrow><mn>2</mn></mrow></msup></mrow>" + // superscript
	  						"</msup>" +
  						"</math>" +
  				"</line></root>");
  				var line = model.getLineAt(0);
  				model.anchor.node = line.firstChild.firstChild.lastChild.firstChild;
  				model.anchor.offset = 1;
  				model.path = [];model.path.push({nodeName: "root"});
  				model.path.push({nodeName: "line", offset: 1});
  				model.path.push({nodeName: "math", offset: 1});
  				model.path.push({nodeName: "msup", offset: 1});
  				model.path.push({nodeName: "mrow", offset: 2});
  				model.path.push({nodeName: "msup", offset: 1});
  				model.moveRight();
  				assert.equal("/root/line[1]/math[1]/msup[1]", model.getPath());
				var node = model.getFocusNode();
				assert.equal("msup", node.nodeName);
				assert.equal(1, model.getOffset());
			});
		});
	}
	
});