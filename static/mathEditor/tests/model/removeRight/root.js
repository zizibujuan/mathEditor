define([ "intern!tdd", 
         "intern/chai!assert", 
         "mathEditor/Model", 
         "mathEditor/lang" ], function(
        		 tdd,
        		 assert, 
        		 Model, 
        		 dripLang) {

	// summary:
	//		1.根式中的根数为空时，右删除时，删掉整个根式，同时将根次中的内容放在之前的根式前,根式最后一个节点是token节点
	//		2.根式中的根数为空时，右删除时，删掉整个根式，同时将根次中的内容放在之前的根式前,根式最后一个节点是layout节点
	//		3.根式中的根次为空时，右删除时，删掉整个根式，同时将根数中的内容放在之前的根式前,根数中最前一个节点是token节点
	//		4.根式中的根次为空时，右删除时，删掉整个根式，同时将根数中的内容放在之前的根式前,根数中最前一个节点是layout节点
	with(tdd){
		suite("Model.removeRight.root 右删除根式", function(){
			
			var model = null;
			beforeEach(function () {
				model = new Model({});
			});
			
			test("右删除根数，根式中的根数为空时，右删除时，删掉整个根式，同时将根次中的内容放在之前的根式前,根式最后一个节点是token节点", function(){
				model.loadData("<root><line>" +
  						"<math>" +
	  						"<mroot>" +
		  						"<mrow><mn class=\"drip_placeholder_box\">8</mn></mrow>" +
		  						"<mrow><mn>12</mn></mrow>" +
	  						"</mroot>" +
  						"</math>" +
  				"</line></root>");
  				model.mode = "mathml";
  				var line = model.getLineAt(0);
  				model.anchor.node = line.firstChild.firstChild.firstChild.firstChild;
  				model.anchor.offset = 0;
  				model.path = [];model.path.push({nodeName: "root"});
  				model.path.push({nodeName: "line", offset: 1});
  				model.path.push({nodeName: "math", offset: 1});
  				model.path.push({nodeName: "msqrt", offset: 1});
  				model.path.push({nodeName: "mrow", offset: 1});
  				model.path.push({nodeName: "mn", offset: 1});
  				model.removeRight();
  				
  				var focusNode = model.getFocusNode();
  				assert.equal("/root/line[1]/math[1]/mn[1]", model.getPath());
  				assert.equal("mn", focusNode.nodeName);
  				assert.equal(2, model.getOffset());
  				assert.equal("12", dripLang.getText(focusNode));
  				// 确认mroot已经被删除掉了
  				assert.equal(focusNode, line.firstChild.firstChild);
  				assert.equal(1, line.firstChild.childNodes.length);
			});
			
			test("右删除根数，根式中的根数为空时，右删除时，删掉整个根式，同时将根次中的内容放在之前的根式前,根式最后一个节点是layout节点", function(){
				model.loadData("<root><line>" +
  						"<math>" +
	  						"<mroot>" +
		  						"<mrow><mn class=\"drip_placeholder_box\">8</mn></mrow>" +
		  						"<mrow><msqrt><mrow><mn>2</mn></mrow></msqrt></mrow>" +
	  						"</mroot>" +
  						"</math>" +
  				"</line></root>");
  				model.mode = "mathml";
  				var line = model.getLineAt(0);
  				model.anchor.node = line.firstChild.firstChild.firstChild.firstChild;
  				model.anchor.offset = 0;
  				model.path = [];model.path.push({nodeName: "root"});
  				model.path.push({nodeName: "line", offset: 1});
  				model.path.push({nodeName: "math", offset: 1});
  				model.path.push({nodeName: "msqrt", offset: 1});
  				model.path.push({nodeName: "mrow", offset: 1});
  				model.path.push({nodeName: "mn", offset: 1});
  				model.removeRight();
  				
  				var focusNode = model.getFocusNode();
  				assert.equal("/root/line[1]/math[1]/msqrt[1]", model.getPath());
  				assert.equal("msqrt", focusNode.nodeName);
  				assert.equal(1, model.getOffset());
  				// 确认mroot已经被删除掉了
  				assert.equal(focusNode, line.firstChild.firstChild);
  				assert.equal(1, line.firstChild.childNodes.length);
			});
			
			test("右删除根数，根式中的根次为空时，右删除时，删掉整个根式，同时将根数中的内容放在之前的根式前,根数中最前一个节点是token节点", function(){
				model.loadData("<root><line>" +
  						"<math>" +
	  						"<mroot>" +
	  							"<mrow><mn>12</mn></mrow>" +
		  						"<mrow><mn class=\"drip_placeholder_box\">8</mn></mrow>" +
	  						"</mroot>" +
  						"</math>" +
  				"</line></root>");
  				model.mode = "mathml";
  				var line = model.getLineAt(0);
  				model.anchor.node = line.firstChild.firstChild.lastChild.firstChild;
  				model.anchor.offset = 0;
  				model.path = [];model.path.push({nodeName: "root"});
  				model.path.push({nodeName: "line", offset: 1});
  				model.path.push({nodeName: "math", offset: 1});
  				model.path.push({nodeName: "msqrt", offset: 1});
  				model.path.push({nodeName: "mrow", offset: 2});
  				model.path.push({nodeName: "mn", offset: 1});
  				model.removeRight();
  				
  				var focusNode = model.getFocusNode();
  				assert.equal("/root/line[1]/math[1]/mn[1]", model.getPath());
  				assert.equal("mn", focusNode.nodeName);
  				assert.equal(0, model.getOffset());
  				assert.equal("12", dripLang.getText(focusNode));
  				// 确认mroot已经被删除掉了
  				assert.equal(focusNode, line.firstChild.firstChild);
  				assert.equal(1, line.firstChild.childNodes.length);
			});
			
			test("右删除根数，根式中的根次为空时，右删除时，删掉整个根式，同时将根数中的内容放在之前的根式前,根数中最前一个节点是layout节点", function(){
				model.loadData("<root><line>" +
  						"<math>" +
	  						"<mroot>" +
	  							"<mrow><msqrt><mrow><mn>2</mn></mrow></msqrt></mrow>" +
		  						"<mrow><mn class=\"drip_placeholder_box\">8</mn></mrow>" +
	  						"</mroot>" +
  						"</math>" +
  				"</line></root>");
  				model.mode = "mathml";
  				var line = model.getLineAt(0);
  				model.anchor.node = line.firstChild.firstChild.lastChild.firstChild;
  				model.anchor.offset = 0;
  				model.path = [];model.path.push({nodeName: "root"});
  				model.path.push({nodeName: "line", offset: 1});
  				model.path.push({nodeName: "math", offset: 1});
  				model.path.push({nodeName: "msqrt", offset: 1});
  				model.path.push({nodeName: "mrow", offset: 1});
  				model.path.push({nodeName: "mn", offset: 1});
  				model.removeRight();
  				
  				var focusNode = model.getFocusNode();
  				assert.equal("/root/line[1]/math[1]/msqrt[1]", model.getPath());
  				assert.equal("msqrt", focusNode.nodeName);
  				assert.equal(0, model.getOffset());
  				// 确认mroot已经被删除掉了
  				assert.equal(focusNode, line.firstChild.firstChild);
  				assert.equal(1, line.firstChild.childNodes.length);
			});
			
		});
	}
	
});