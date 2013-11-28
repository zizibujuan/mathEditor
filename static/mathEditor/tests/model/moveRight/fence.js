define([ "intern!tdd", 
         "intern/chai!assert", 
         "mathEditor/Model", 
         "mathEditor/lang" ], function(
        		 tdd,
        		 assert, 
        		 Model, 
        		 dripLang) {

	// summary:
	//		在括号上右移光标（目前只支持一个mrow子节点）
	//		右移进括号，
	//		1. 括号前没有任何节点，括号内第一个节点是token节点
	//		2. 括号前没有任何节点，括号内第一个节点是layout节点
	//		3. 括号前有一个token节点，从token后右移进括号内的第一个节点，第一个节点是token节点
	//		4. 括号前有一个token节点，从token后右移进括号内的第一个节点，第一个节点是layout节点
	//		5. 括号前有一个layout节点，从layout后右移进括号内第一个节点，第一个节点是token节点
	//		6. 括号前有一个layout节点，从layout后右移进括号内的第一个节点，第一个节点是layout节点
	//		右移出括号
	//		1. 括号内最后一个节点是token节点
	//		2. 括号内最后一个节点是layout节点
	
	with(tdd){
		suite("Model.moveRight.fence 在括号上右移光标", function(){
			
			var model = null;
			beforeEach(function () {
				model = new Model({});
			});
			
			test("右移进括号，括号前没有任何节点，括号内第一个节点是token节点", function(){
				model.loadData("<root><line>" +
  						"<math>" +
	  						"<mfenced>" +
		  						"<mrow><mn>123</mn></mrow>" +
	  						"</mfenced>" +
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
  				model.path.push({nodeName: "mfenced", offset: 1});
  				model.moveRight();
  				assert.equal("/root/line[1]/math[1]/mfenced[1]/mrow[1]/mn[1]", model.getPath());
				var node = model.getFocusNode();
				assert.equal("mn", node.nodeName);
				assert.equal(0, model.getOffset());
				assert.equal("123", dripLang.getText(node));
			});
			
			test("右移进括号，括号前没有任何节点，括号内第一个节点是layout节点", function(){
				model.loadData("<root><line>" +
  						"<math>" +
	  						"<mfenced>" +
		  						"<mrow><mfenced><mrow><mn>12</mn></mrow></mfenced></mrow>" +
	  						"</mfenced>" +
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
  				model.path.push({nodeName: "mfenced", offset: 1});
  				model.moveRight();
  				assert.equal("/root/line[1]/math[1]/mfenced[1]/mrow[1]/mfenced[1]", model.getPath());
				var node = model.getFocusNode();
				assert.equal("mfenced", node.nodeName);
				assert.equal(0, model.getOffset());
			});
			
			test("右移进括号，括号前有一个token节点，从token后右移进括号内的第一个节点，第一个节点是token节点", function(){
				model.loadData("<root><line>" +
  						"<math>" +
  							"<mn>1</mn>" +
	  						"<mfenced>" +
		  						"<mrow><mn>12</mn></mrow>" +
	  						"</mfenced>" +
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
  				model.path.push({nodeName: "mn", offset: 1});
  				model.moveRight();
  				assert.equal("/root/line[1]/math[1]/mfenced[2]/mrow[1]/mn[1]", model.getPath());
				var node = model.getFocusNode();
				assert.equal("mn", node.nodeName);
				assert.equal(0, model.getOffset());
				assert.equal("12", dripLang.getText(node));
			});
			
			test("右移进括号，括号前有一个token节点，从token后右移进括号内的第一个节点，第一个节点是layout节点", function(){
				model.loadData("<root><line>" +
  						"<math>" +
  							"<mn>1</mn>" +
	  						"<mfenced>" +
		  						"<mrow><mfenced><mrow><mn>12</mn></mrow></mfenced></mrow>" +
	  						"</mfenced>" +
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
  				model.path.push({nodeName: "mn", offset: 1});
  				model.moveRight();
  				assert.equal("/root/line[1]/math[1]/mfenced[2]/mrow[1]/mfenced[1]", model.getPath());
				var node = model.getFocusNode();
				assert.equal("mfenced", node.nodeName);
				assert.equal(0, model.getOffset());
			});
			
			test("右移进括号，括号前有一个layout节点，从layout后右移进括号内第一个节点，第一个节点是token节点", function(){
				model.loadData("<root><line>" +
  						"<math>" +
  							"<mfenced><mrow><mn>12</mn></mrow></mfenced>" +
	  						"<mfenced>" +
		  						"<mrow><mn>123</mn></mrow>" +
	  						"</mfenced>" +
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
  				model.path.push({nodeName: "mfenced", offset: 1});
  				model.moveRight();
  				assert.equal("/root/line[1]/math[1]/mfenced[2]/mrow[1]/mn[1]", model.getPath());
				var node = model.getFocusNode();
				assert.equal("mn", node.nodeName);
				assert.equal(0, model.getOffset());
				assert.equal("123", dripLang.getText(node));
			});
			
			test("右移进括号，括号前有一个layout节点，从layout后右移进括号内的第一个节点，第一个节点是layout节点", function(){
				model.loadData("<root><line>" +
  						"<math>" +
  							"<mfenced><mrow><mn>12</mn></mrow></mfenced>" +
	  						"<mfenced>" +
		  						"<mrow><mfenced><mrow><mn>12</mn></mrow></mfenced></mrow>" +
	  						"</mfenced>" +
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
  				model.path.push({nodeName: "mfenced", offset: 1});
  				model.moveRight();
  				assert.equal("/root/line[1]/math[1]/mfenced[2]/mrow[1]/mfenced[1]", model.getPath());
				var node = model.getFocusNode();
				assert.equal("mfenced", node.nodeName);
				assert.equal(0, model.getOffset());
			});
			
			test("右移出括号，括号内最后一个节点是token节点", function(){
				model.loadData("<root><line>" +
  						"<math>" +
	  						"<mfenced>" +
		  						"<mrow><mn>12</mn></mrow>" +
	  						"</mfenced>" +
  						"</math>" +
  				"</line></root>");
  				model.mode = "mathml";
  				var line = model.getLineAt(0);
  				model.anchor.node = line.firstChild.firstChild.firstChild.firstChild;
  				model.anchor.offset = 2;
  				model.path = [];
  				model.path.push({nodeName: "root"});
  				model.path.push({nodeName: "line", offset: 1});
  				model.path.push({nodeName: "math", offset: 1});
  				model.path.push({nodeName: "mfenced", offset: 1});
  				model.path.push({nodeName: "mrow", offset: 1});
  				model.path.push({nodeName: "mn", offset: 1});
  				model.moveRight();
  				assert.equal("/root/line[1]/math[1]/mfenced[1]", model.getPath());
				var node = model.getFocusNode();
				assert.equal("mfenced", node.nodeName);
				assert.equal(1, model.getOffset());
			});
			
			test("右移出括号，括号内最后一个节点是layout节点", function(){
				model.loadData("<root><line>" +
  						"<math>" +
	  						"<mfenced>" +
		  						"<mrow><mfenced><mrow><mn>12</mn></mrow></mfenced></mrow>" +
	  						"</mfenced>" +
  						"</math>" +
  				"</line></root>");
  				model.mode = "mathml";
  				var line = model.getLineAt(0);
  				model.anchor.node = line.firstChild.firstChild.firstChild.firstChild;
  				model.anchor.offset = 1;
  				model.path = [];
  				model.path.push({nodeName: "root"});
  				model.path.push({nodeName: "line", offset: 1});
  				model.path.push({nodeName: "math", offset: 1});
  				model.path.push({nodeName: "mfenced", offset: 1});
  				model.path.push({nodeName: "mrow", offset: 1});
  				model.path.push({nodeName: "mfenced", offset: 1});
  				model.moveRight();
  				assert.equal("/root/line[1]/math[1]/mfenced[1]", model.getPath());
				var node = model.getFocusNode();
				assert.equal("mfenced", node.nodeName);
				assert.equal(1, model.getOffset());
			});
			
		});
	}
	
});