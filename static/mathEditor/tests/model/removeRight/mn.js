define([ "intern!tdd", 
         "intern/chai!assert", 
         "mathEditor/Model", 
         "mathEditor/lang" ], function(
        		 tdd,
        		 assert, 
        		 Model, 
        		 dripLang) {

	with(tdd){
		suite("Model.removeRight.mn", function(){
			
			var model = null;
			beforeEach(function () {
				model = new Model({});
			});
			
			// FIXME：删除占位符，需要具体问题，具体分析
			test("删除右边的字符，删除占位符", function(){
				model.loadData("<root><line><math><mn class=\"drip_placeholder_box\">8</mn></math></line></root>");
  				model.mode = "mathml";
  				var line = model.getLineAt(0);
  				model.anchor.node = line.firstChild.firstChild;
  				model.anchor.offset = 0;
  				model.path = [];model.path.push({nodeName: "root"});
  				model.path.push({nodeName: "line", offset: 1});
  				model.path.push({nodeName: "math", offset: 1});
  				model.path.push({nodeName: "mn", offset: 1});
  				model.removeRight();
  				
  				var focusNode = model.getFocusNode();
  				assert.equal("/root/line[1]/math[1]", model.getPath());
  				assert.equal("math", focusNode.nodeName);
  				assert.equal(2, model.getOffset()); // layoutOffset.select
  				assert.equal(0, focusNode.childNodes.length);
			});
			
			test("删除右边的字符，math中只有一个mn节点", function(){
				model.loadData("<root><line><math><mn>8</mn></math></line></root>");
  				model.mode = "mathml";
  				var line = model.getLineAt(0);
  				model.anchor.node = line.firstChild.firstChild;
  				model.anchor.offset = 0;
  				model.path = [];model.path.push({nodeName: "root"});
  				model.path.push({nodeName: "line", offset: 1});
  				model.path.push({nodeName: "math", offset: 1});
  				model.path.push({nodeName: "mn", offset: 1});
  				model.removeRight();
  				
  				var focusNode = model.getFocusNode();
  				assert.equal("/root/line[1]/math[1]", model.getPath());
  				assert.equal("math", focusNode.nodeName);
  				assert.equal(2, model.getOffset()); // layoutOffset.select
  				assert.equal(0, focusNode.childNodes.length);
			});
			
			test("在mi节点后有一个mn节点，光标在mi节点后,mn中只包含一个数字，删除mn节点", function(){
				model.loadData("<root><line>" +
  						"<math>" +
  							"<mi>x</mi>" +
	  						"<mn>1</mn>" +
  						"</math></line></root>");
  				model.mode = "mathml";
  				var line = model.getLineAt(0);
  				model.anchor.node = line.firstChild.firstChild;
  				model.anchor.offset = 1;
  				model.path = [];model.path.push({nodeName: "root"});
  				model.path.push({nodeName: "line", offset: 1});
  				model.path.push({nodeName: "math", offset: 1});
  				model.path.push({nodeName: "mi", offset: 1});
  				model.removeRight();
  				
  				var focusNode = model.getFocusNode();
  				assert.equal("/root/line[1]/math[1]/mi[1]", model.getPath());
  				assert.equal("mi", focusNode.nodeName);
  				assert.equal(1, model.getOffset());
  				assert.equal(1, focusNode.parentNode.childNodes.length);
			});
			
			test("在mi节点后有一个mn节点，光标在mi节点后，mn中包含两个数字，删除mn节点中的内容", function(){
				model.loadData("<root><line>" +
  						"<math>" +
  							"<mi>x</mi>" +
	  						"<mn>12</mn>" +
  						"</math></line></root>");
  				model.mode = "mathml";
  				var line = model.getLineAt(0);
  				model.anchor.node = line.firstChild.firstChild;
  				model.anchor.offset = 1;
  				model.path = [];model.path.push({nodeName: "root"});
  				model.path.push({nodeName: "line", offset: 1});
  				model.path.push({nodeName: "math", offset: 1});
  				model.path.push({nodeName: "mi", offset: 1});
  				model.removeRight();
  				// 删除时，光标的位置还是放在当前节点的最前面。
  				var focusNode = model.getFocusNode();
  				assert.equal("/root/line[1]/math[1]/mi[1]", model.getPath());
  				assert.equal("mi", focusNode.nodeName);
  				assert.equal(1, model.getOffset());
  				assert.equal(2, focusNode.parentNode.childNodes.length);
  				assert.equal("2", dripLang.getText(focusNode.nextSibling));
			});
			
			test("有一个mn节点，mn节点中只有一个数字，光标在数字前", function(){
				model.loadData("<root><line>" +
  						"<math>" +
	  						"<mn>1</mn>" +
  						"</math></line></root>");
  				model.mode = "mathml";
  				var line = model.getLineAt(0);
  				model.anchor.node = line.firstChild.firstChild;
  				model.anchor.offset = 0;
  				model.path = [];model.path.push({nodeName: "root"});
  				model.path.push({nodeName: "line", offset: 1});
  				model.path.push({nodeName: "math", offset: 1});
  				model.path.push({nodeName: "mn", offset: 1});
  				model.removeRight();
  				// 删除时，光标的位置还是放在当前节点的最前面。
  				var focusNode = model.getFocusNode();
  				assert.equal("/root/line[1]/math[1]", model.getPath());
  				assert.equal("math", focusNode.nodeName);
  				assert.equal(2, model.getOffset());
  				assert.equal(0, focusNode.childNodes.length);
			});
			
			test("mi节点后有一个mn节点，光标在mn节点前，mn节点中只有一个数字", function(){
				model.loadData("<root><line>" +
  						"<math>" +
  							"<mi>x</mi>" +
	  						"<mn>1</mn>" +
  						"</math></line></root>");
  				model.mode = "mathml";
  				var line = model.getLineAt(0);
  				model.anchor.node = line.firstChild.lastChild;
  				model.anchor.offset = 0;
  				model.path = [];model.path.push({nodeName: "root"});
  				model.path.push({nodeName: "line", offset: 1});
  				model.path.push({nodeName: "math", offset: 1});
  				model.path.push({nodeName: "mn", offset: 2});
  				model.removeRight();
  				// 删除时，光标的位置还是放在当前节点的最前面。
  				var focusNode = model.getFocusNode();
  				assert.equal("/root/line[1]/math[1]/mi[1]", model.getPath());
  				assert.equal("mi", focusNode.nodeName);
  				assert.equal(1, model.getOffset());
  				assert.equal(1, focusNode.parentNode.childNodes.length);
			});
			
			test("mi节点后前一个mn节点，光标在mn节点前，mn节点中只有一个数字", function(){
				model.loadData("<root><line>" +
  						"<math>" +
  							"<mn>1</mn>" +
  							"<mi>x</mi>" +
  						"</math></line></root>");
  				model.mode = "mathml";
  				var line = model.getLineAt(0);
  				model.anchor.node = line.firstChild.firstChild;
  				model.anchor.offset = 0;
  				model.path = [];model.path.push({nodeName: "root"});
  				model.path.push({nodeName: "line", offset: 1});
  				model.path.push({nodeName: "math", offset: 1});
  				model.path.push({nodeName: "mn", offset: 1});
  				model.removeRight();
  				// 删除时，光标的位置还是放在当前节点的最前面。
  				var focusNode = model.getFocusNode();
  				assert.equal("/root/line[1]/math[1]/mi[1]", model.getPath());
  				assert.equal("mi", focusNode.nodeName);
  				assert.equal(0, model.getOffset());
  				assert.equal(1, focusNode.parentNode.childNodes.length);
			});
			
			test("mn中有多个值，在mn中间删除一个数字", function(){
				model.loadData("<root><line>" +
  						"<math>" +
	  						"<mn>1234</mn>" +
  						"</math></line></root>");
  				model.mode = "mathml";
  				var line = model.getLineAt(0);
  				model.anchor.node = line.firstChild.firstChild;
  				model.anchor.offset = 1;
  				model.path = [];model.path.push({nodeName: "root"});
  				model.path.push({nodeName: "line", offset: 1});
  				model.path.push({nodeName: "math", offset: 1});
  				model.path.push({nodeName: "mn", offset: 1});
  				model.removeRight();
  				
  				var focusNode = model.getFocusNode();
  				assert.equal("/root/line[1]/math[1]/mn[1]", model.getPath());
  				assert.equal("mn", focusNode.nodeName);
  				assert.equal(1, model.getOffset());
  				assert.equal("134", dripLang.getText(focusNode));
			});
			
			test("mn中有两个值，在mn前删除一个数字", function(){
				model.loadData("<root><line>" +
  						"<math>" +
	  						"<mn>12</mn>" +
  						"</math></line></root>");
  				model.mode = "mathml";
  				var line = model.getLineAt(0);
  				model.anchor.node = line.firstChild.firstChild;
  				model.anchor.offset = 0;
  				model.path = [];model.path.push({nodeName: "root"});
  				model.path.push({nodeName: "line", offset: 1});
  				model.path.push({nodeName: "math", offset: 1});
  				model.path.push({nodeName: "mn", offset: 1});
  				model.removeRight();
  				
  				var focusNode = model.getFocusNode();
  				assert.equal("/root/line[1]/math[1]/mn[1]", model.getPath());
  				assert.equal("mn", focusNode.nodeName);
  				assert.equal(0, model.getOffset());
  				assert.equal("2", dripLang.getText(focusNode));
			});
			
		});
	}
	
});