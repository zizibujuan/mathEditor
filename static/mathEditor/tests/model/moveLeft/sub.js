define([ "intern!tdd", 
         "intern/chai!assert", 
         "mathEditor/Model", 
         "mathEditor/lang" ], function(
        		 tdd,
        		 assert, 
        		 Model, 
        		 dripLang) {

	with(tdd){
		
		
		suite("Model.moveLeft.sub 在有下标的符号中左移光标", function(){
			
			var model = null;
			beforeEach(function () {
				model = new Model({});
			});
			
			test("mathml模式下，在空的有下标的公式中，将光标从subscript移到base中", function(){
				model.toMathMLMode();
  				model.setData({data:"", nodeName:"msub"});
  				model.moveLeft();
  				
  				assert.equal("/root/line[1]/math[1]/msub[1]/mrow[1]/mn[1]", model.getPath());
  				var node = model.getFocusNode();
				assert.equal("mn", node.nodeName);
				assert.equal("drip_placeholder_box", node.getAttribute("class"));
				assert.equal(0, model.getOffset());
				
				var baseNode = node;
				var subscriptNode = baseNode.parentNode.nextSibling.lastChild;
				assert.equal("mn", subscriptNode.nodeName);
				assert.equal("drip_placeholder_box", subscriptNode.getAttribute("class"));
			});
			
			test("左移进入sub，sub后没有任何节点，在sub后左移光标，移到subscript后，subscript的最后一个节点是token节点。", function(){
				model.mode = "mathml";
  				model.loadData("<root><line>" +
  						"<math>" +
	  						"<msub>" +
		  						"<mrow><mn>123</mn></mrow>" + // base
		  						"<mrow><mn>12</mn></mrow>" + // subscript
	  						"</msub>" +
  						"</math>" +
  				"</line></root>");
  				
  				var line = model.getLineAt(0);
  				model.anchor.node = line.firstChild.firstChild;
  				model.anchor.offset = 1;
  				model.path = [];model.path.push({nodeName: "root"});
  				model.path.push({nodeName: "line", offset: 1});
  				model.path.push({nodeName: "math", offset: 1});
  				model.path.push({nodeName: "msub", offset: 1});
  				model.moveLeft();
  				assert.equal("/root/line[1]/math[1]/msub[1]/mrow[2]/mn[1]", model.getPath());
				var node = model.getFocusNode();
				assert.equal("mn", node.nodeName);
				assert.equal(2, model.getOffset());
				assert.equal("12", dripLang.getText(node));
			});
			
			test("左移进入sub，sub后没有任何节点，在sub后左移光标，移到subscript后，subscript的最后一个节点是layout节点。", function(){
				model.mode = "mathml";
  				model.loadData("<root><line>" +
  						"<math>" +
	  						"<msub>" +
		  						"<mrow><mn>123</mn></mrow>" + // base
		  						"<mrow><msub><mrow><mn>2</mn></mrow><mrow><mn>3</mn></mrow></msub></mrow>" + // subscript
	  						"</msub>" +
  						"</math>" +
  				"</line></root>");
  				
  				var line = model.getLineAt(0);
  				model.anchor.node = line.firstChild.firstChild;
  				model.anchor.offset = 1;
  				model.path = [];model.path.push({nodeName: "root"});
  				model.path.push({nodeName: "line", offset: 1});
  				model.path.push({nodeName: "math", offset: 1});
  				model.path.push({nodeName: "msub", offset: 1});
  				model.moveLeft();
  				assert.equal("/root/line[1]/math[1]/msub[1]/mrow[2]/msub[1]", model.getPath());
				var node = model.getFocusNode();
				assert.equal("msub", node.nodeName);
				assert.equal(1, model.getOffset());
			});
			
			test("左移进入sub，sub后有一个token节点，从token的前面左移到subscript后，subscript的最后一个节点是token节点。", function(){
				model.mode = "mathml";
  				model.loadData("<root><line>" +
  						"<math>" +
	  						"<msub>" +
		  						"<mrow><mn>5678</mn></mrow>" + // base
		  						"<mrow><mn>345</mn></mrow>" + // superscript
	  						"</msub>" +
	  						"<mn>12</mn>" +
  						"</math>" +
  				"</line></root>");
  				
  				var line = model.getLineAt(0);
  				model.anchor.node = line.firstChild.lastChild;
  				model.anchor.offset = 0;
  				model.path = [];model.path.push({nodeName: "root"});
  				model.path.push({nodeName: "line", offset: 1});
  				model.path.push({nodeName: "math", offset: 1});
  				model.path.push({nodeName: "mn", offset: 2});
  				model.moveLeft();
  				assert.equal("/root/line[1]/math[1]/msub[1]/mrow[2]/mn[1]", model.getPath());
				var node = model.getFocusNode();
				assert.equal("mn", node.nodeName);
				assert.equal(3, model.getOffset());
				assert.equal("345", dripLang.getText(node));
			});
			
			test("左移进入sub，sub后有一个token节点，从token的前面左移到subscript后，subscript的最后一个节点是layout节点。", function(){
				model.mode = "mathml";
  				model.loadData("<root><line>" +
  						"<math>" +
	  						"<msub>" +
		  						"<mrow><mn>345</mn></mrow>" + // base
		  						"<mrow><msub><mrow><mn>4</mn></mrow><mrow><mn>2</mn></mrow></msub></mrow>" + // superscript
	  						"</msub>" +
	  						"<mn>12</mn>" +
  						"</math>" +
  				"</line></root>");
  				
  				var line = model.getLineAt(0);
  				model.anchor.node = line.firstChild.lastChild;
  				model.anchor.offset = 0;
  				model.path = [];model.path.push({nodeName: "root"});
  				model.path.push({nodeName: "line", offset: 1});
  				model.path.push({nodeName: "math", offset: 1});
  				model.path.push({nodeName: "mn", offset: 2});
  				model.moveLeft();
  				assert.equal("/root/line[1]/math[1]/msub[1]/mrow[2]/msub[1]", model.getPath());
				var node = model.getFocusNode();
				assert.equal("msub", node.nodeName);
				assert.equal(1, model.getOffset());
			});
			
			test("左移进入sub，sub后有一个layout节点，从layout的前面左移到subscript后，subscript的最后一个节点是token节点。", function(){
				model.mode = "mathml";
  				model.loadData("<root><line>" +
  						"<math>" +
	  						"<msub>" +
		  						"<mrow><mn>12</mn></mrow>" + // base
		  						"<mrow><mn>345</mn></mrow>" + // superscript
	  						"</msub>" +
	  						"<msub><mrow><mn>4</mn></mrow><mrow><mn>2</mn></mrow></msub>" +
  						"</math>" +
  				"</line></root>");
  				
  				var line = model.getLineAt(0);
  				model.anchor.node = line.firstChild.lastChild;
  				model.anchor.offset = 0;
  				model.path = [];model.path.push({nodeName: "root"});
  				model.path.push({nodeName: "line", offset: 1});
  				model.path.push({nodeName: "math", offset: 1});
  				model.path.push({nodeName: "msub", offset: 2});
  				model.moveLeft();
  				assert.equal("/root/line[1]/math[1]/msub[1]/mrow[2]/mn[1]", model.getPath());
				var node = model.getFocusNode();
				assert.equal("mn", node.nodeName);
				assert.equal(3, model.getOffset());
				assert.equal("345", dripLang.getText(node));
			});
			
			test("左移进入sub，sub前有一个layout节点，从layout的前面左移到subscript后，subscript的最后一个节点是layout节点。", function(){
				model.mode = "mathml";
  				model.loadData("<root><line>" +
  						"<math>" +
	  						"<msub>" +
		  						"<mrow><mn>4</mn></mrow>" + // base
		  						"<mrow><msub><mrow><mn>4</mn></mrow><mrow><mn>2</mn></mrow></msub></mrow>" + // subscript
	  						"</msub>" +
	  						"<msub><mrow><mn>4</mn></mrow><mrow><mn>2</mn></mrow></msub>" +
  						"</math>" +
  				"</line></root>");
  				
  				var line = model.getLineAt(0);
  				model.anchor.node = line.firstChild.lastChild;
  				model.anchor.offset = 0;
  				model.path = [];model.path.push({nodeName: "root"});
  				model.path.push({nodeName: "line", offset: 1});
  				model.path.push({nodeName: "math", offset: 1});
  				model.path.push({nodeName: "msub", offset: 2});
  				model.moveLeft();
  				assert.equal("/root/line[1]/math[1]/msub[1]/mrow[2]/msub[1]", model.getPath());
				var node = model.getFocusNode();
				assert.equal("msub", node.nodeName);
				assert.equal(1, model.getOffset());
			});
			
			test("从subscript前左移到base后，subscript的第一个节点是token节点，base的最后一个节点是token节点。", function(){
				model.mode = "mathml";
  				model.loadData("<root><line>" +
  						"<math>" +
	  						"<msub>" +
		  						"<mrow><mn>345</mn></mrow>" + // base 测试用例中base中数字的位数和index中数字的位数要不同。
		  						"<mrow><mn>12</mn></mrow>" + // superscript
	  						"</msub>" +
  						"</math>" +
  				"</line></root>");
  				
  				var line = model.getLineAt(0);
  				model.anchor.node = line.firstChild.firstChild.lastChild.firstChild;
  				model.anchor.offset = 0;
  				model.path = [];model.path.push({nodeName: "root"});
  				model.path.push({nodeName: "line", offset: 1});
  				model.path.push({nodeName: "math", offset: 1});
  				model.path.push({nodeName: "msub", offset: 1});
  				model.path.push({nodeName: "mrow", offset: 2});
  				model.path.push({nodeName: "mn", offset: 1});
  				model.moveLeft();
  				assert.equal("/root/line[1]/math[1]/msub[1]/mrow[1]/mn[1]", model.getPath());
				var node = model.getFocusNode();
				assert.equal("mn", node.nodeName);
				assert.equal(3, model.getOffset());
				assert.equal("345", dripLang.getText(node));
			});
			
			test("从subscript前左移到base后，subscript的第一个节点是token节点，base的最后一个节点是layout节点。", function(){
				model.mode = "mathml";
  				model.loadData("<root><line>" +
  						"<math>" +
	  						"<msub>" +
		  						"<mrow><msub><mrow><mn>4</mn></mrow><mrow><mn>2</mn></mrow></msub></mrow>" + // base
		  						"<mrow><mn>12</mn></mrow>" + // superscript
	  						"</msub>" +
  						"</math>" +
  				"</line></root>");
  				
  				var line = model.getLineAt(0);
  				model.anchor.node = line.firstChild.firstChild.lastChild.firstChild;
  				model.anchor.offset = 0;
  				model.path = [];model.path.push({nodeName: "root"});
  				model.path.push({nodeName: "line", offset: 1});
  				model.path.push({nodeName: "math", offset: 1});
  				model.path.push({nodeName: "msub", offset: 1});
  				model.path.push({nodeName: "mrow", offset: 2});
  				model.path.push({nodeName: "mn", offset: 1});
  				model.moveLeft();
  				assert.equal("/root/line[1]/math[1]/msub[1]/mrow[1]/msub[1]", model.getPath());
				var node = model.getFocusNode();
				assert.equal("msub", node.nodeName);
				assert.equal(1, model.getOffset());
			});
			
			test("从subscript前左移到base后，subscript的第一个节点是layout节点，base的最后一个节点是token节点。", function(){
				model.mode = "mathml";
  				model.loadData("<root><line>" +
  						"<math>" +
	  						"<msub>" +
		  						"<mrow><mn>12</mn></mrow>" + // base
		  						"<mrow><msub><mrow><mn>4</mn></mrow><mrow><mn>2</mn></mrow></msub></mrow>" + // superscript
	  						"</msub>" +
  						"</math>" +
  				"</line></root>");
  				
  				var line = model.getLineAt(0);
  				model.anchor.node = line.firstChild.firstChild.lastChild.firstChild;
  				model.anchor.offset = 0;
  				model.path = [];model.path.push({nodeName: "root"});
  				model.path.push({nodeName: "line", offset: 1});
  				model.path.push({nodeName: "math", offset: 1});
  				model.path.push({nodeName: "msub", offset: 1});
  				model.path.push({nodeName: "mrow", offset: 2});
  				model.path.push({nodeName: "msub", offset: 1});
  				model.moveLeft();
  				assert.equal("/root/line[1]/math[1]/msub[1]/mrow[1]/mn[1]", model.getPath());
				var node = model.getFocusNode();
				assert.equal("mn", node.nodeName);
				assert.equal(2, model.getOffset());
				assert.equal("12", dripLang.getText(node));
			});
			
			test("从subscript前左移到base后，subscript的第一个节点是layout节点，base的最后一个节点是layout节点。", function(){
				model.mode = "mathml";
  				model.loadData("<root><line>" +
  						"<math>" +
	  						"<msub>" +
		  						"<mrow><msub><mrow><mn>3</mn></mrow><mrow><mn>4</mn></mrow></msub></mrow>" + // base
		  						"<mrow><msub><mrow><mn>1</mn></mrow><mrow><mn>2</mn></mrow></msub></mrow>" + // superscript
	  						"</msub>" +
  						"</math>" +
  				"</line></root>");
  				
  				var line = model.getLineAt(0);
  				model.anchor.node = line.firstChild.firstChild.lastChild.firstChild;
  				model.anchor.offset = 0;
  				model.path = [];model.path.push({nodeName: "root"});
  				model.path.push({nodeName: "line", offset: 1});
  				model.path.push({nodeName: "math", offset: 1});
  				model.path.push({nodeName: "msub", offset: 1});
  				model.path.push({nodeName: "mrow", offset: 2});
  				model.path.push({nodeName: "msub", offset: 1});
  				model.moveLeft();
  				assert.equal("/root/line[1]/math[1]/msub[1]/mrow[1]/msub[1]", model.getPath());
				var node = model.getFocusNode();
				assert.equal("msub", node.nodeName);
				assert.equal(1, model.getOffset());
			});
			
			test("从base左移出sub节点，base的第一个节点是token节点。", function(){
				model.mode = "mathml";
  				model.loadData("<root><line>" +
  						"<math>" +
	  						"<msub>" +
		  						"<mrow><mn>34</mn></mrow>" + // base
		  						"<mrow><mn>12</mn></mrow>" + // superscript
	  						"</msub>" +
  						"</math>" +
  				"</line></root>");
  				
  				var line = model.getLineAt(0);
  				model.anchor.node = line.firstChild.firstChild.firstChild.firstChild;
  				model.anchor.offset = 0;
  				model.path = [];model.path.push({nodeName: "root"});
  				model.path.push({nodeName: "line", offset: 1});
  				model.path.push({nodeName: "math", offset: 1});
  				model.path.push({nodeName: "msub", offset: 1});
  				model.path.push({nodeName: "mrow", offset: 1});
  				model.path.push({nodeName: "mn", offset: 1});
  				model.moveLeft();
  				assert.equal("/root/line[1]/math[1]/msub[1]", model.getPath());
				var node = model.getFocusNode();
				assert.equal("msub", node.nodeName);
				assert.equal(0, model.getOffset());
			});
			
			test("从base左移出sub节点，移到sub前面，base的第一个节点是layout节点。", function(){
				model.mode = "mathml";
  				model.loadData("<root><line>" +
  						"<math>" +
	  						"<msub>" +
		  						"<mrow><msub><mrow><mn>1</mn></mrow><mrow><mn>2</mn></mrow></msub></mrow>" + // base
		  						"<mrow><mn>12</mn></mrow>" + // superscript
	  						"</msub>" +
  						"</math>" +
  				"</line></root>");
  				
  				var line = model.getLineAt(0);
  				model.anchor.node = line.firstChild.firstChild.firstChild.firstChild;
  				model.anchor.offset = 0;
  				model.path = [];model.path.push({nodeName: "root"});
  				model.path.push({nodeName: "line", offset: 1});
  				model.path.push({nodeName: "math", offset: 1});
  				model.path.push({nodeName: "msub", offset: 1});
  				model.path.push({nodeName: "mrow", offset: 1});
  				model.path.push({nodeName: "msub", offset: 1});
  				model.moveLeft();
  				assert.equal("/root/line[1]/math[1]/msub[1]", model.getPath());
				var node = model.getFocusNode();
				assert.equal("msub", node.nodeName);
				assert.equal(0, model.getOffset());
			});
			
		});
	}

});