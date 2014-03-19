define([ "intern!tdd", 
         "intern/chai!assert",
         "mathEditor/Model", 
         "mathEditor/lang" ], function(
        		 tdd,
        		 assert,
        		 Model, 
        		 dripLang) {

	with(tdd){
		suite("Model.removeLeft.mn", function(){
			
			var model = null;
			beforeEach(function () {
				model = new Model({});
			});
			
			test("删除左边的字符，删除占位符", function(){
				model.loadData("<root><line><math><mn class=\"drip_placeholder_box\">8</mn></math></line></root>");
  				model.mode = "mathml";
  				var line = model.getLineAt(0);
  				model.anchor.node = line.firstChild.firstChild;
  				model.anchor.offset = 0;
  				model.path = [];model.path.push({nodeName: "root"});
  				model.path.push({nodeName: "line", offset: 1});
  				model.path.push({nodeName: "math", offset: 1});
  				model.path.push({nodeName: "mn", offset: 1});
  				model.removeLeft();
  				
  				var focusNode = model.getFocusNode();
  				assert.equal("/root/line[1]/math[1]", model.getPath());
  				assert.equal("math", focusNode.nodeName);
  				assert.equal(2, model.getOffset()); // layoutOffset.select
  				assert.equal(0, focusNode.childNodes.length);
			});
			
			test("删除左边的字符,math中只有一个mn节点", function(){
				model.loadData("<root><line><math><mn>8</mn></math></line></root>");
  				model.mode = "mathml";
  				var line = model.getLineAt(0);
  				model.anchor.node = line.firstChild.firstChild;
  				model.anchor.offset = 1;
  				model.path = [];model.path.push({nodeName: "root"});
  				model.path.push({nodeName: "line", offset: 1});
  				model.path.push({nodeName: "math", offset: 1});
  				model.path.push({nodeName: "mn", offset: 1});
  				model.removeLeft();
  				
  				var focusNode = model.getFocusNode();
  				assert.equal("/root/line[1]/math[1]", model.getPath());
  				assert.equal("math", focusNode.nodeName);
  				assert.equal(2, model.getOffset());
  				assert.equal(0, focusNode.childNodes.length);
			});
			
			test("在mi节点前有一个mn节点,mn中只包含一个数字，删除mn节点中的内容", function(){
				model.loadData("<root><line>" +
  						"<math>" +
	  						"<mn>1</mn>" +
	  						"<mi>x</mi>" +
  						"</math></line></root>");
  				model.mode = "mathml";
  				var line = model.getLineAt(0);
  				model.anchor.node = line.firstChild.lastChild;
  				model.anchor.offset = 0;
  				model.path = [];model.path.push({nodeName: "root"});
  				model.path.push({nodeName: "line", offset: 1});
  				model.path.push({nodeName: "math", offset: 1});
  				model.path.push({nodeName: "mi", offset: 2});
  				model.removeLeft();
  				
  				var focusNode = model.getFocusNode();
  				assert.equal("/root/line[1]/math[1]/mi[1]", model.getPath());
  				assert.equal("mi", focusNode.nodeName);
  				assert.equal(0, model.getOffset());
  				assert.equal(1, focusNode.parentNode.childNodes.length);
			});
			
			test("在mi节点前有一个mn节点,mn中包含两个数字，删除mn节点中的内容", function(){
				model.loadData("<root><line>" +
  						"<math>" +
	  						"<mn>12</mn>" +
	  						"<mi>x</mi>" +
  						"</math></line></root>");
  				model.mode = "mathml";
  				var line = model.getLineAt(0);
  				model.anchor.node = line.firstChild.lastChild;
  				model.anchor.offset = 0;
  				model.path = [];model.path.push({nodeName: "root"});
  				model.path.push({nodeName: "line", offset: 1});
  				model.path.push({nodeName: "math", offset: 1});
  				model.path.push({nodeName: "mi", offset: 2});
  				model.removeLeft();
  				// 删除时，光标的位置还是放在当前节点的最前面。
  				var focusNode = model.getFocusNode();
  				assert.equal("/root/line[1]/math[1]/mi[2]", model.getPath());
  				assert.equal("mi", focusNode.nodeName);
  				assert.equal(0, model.getOffset());
  				assert.equal(2, focusNode.parentNode.childNodes.length);
  				assert.equal("1", dripLang.getText(focusNode.previousSibling));
			});
			
			test("mn中有一个数字，mn后面是一个mo节点，光标在mo后面，删除mo", function(){
				model.loadData("<root><line>" +
  						"<math>" +
	  						"<mn>2</mn>" +
	  						"<mo>+</mo>" +
  						"</math></line></root>");
  				model.mode = "mathml";
  				var line = model.getLineAt(0);
  				model.anchor.node = line.firstChild.lastChild;
  				model.anchor.offset = 1;
  				model.path = [];model.path.push({nodeName: "root"});
  				model.path.push({nodeName: "line", offset: 1});
  				model.path.push({nodeName: "math", offset: 1});
  				model.path.push({nodeName: "mo", offset: 2});
  				model.removeLeft();
  				// 删除时，光标的位置还是放在当前节点的最前面。
  				var focusNode = model.getFocusNode();
  				assert.equal("/root/line[1]/math[1]/mn[1]", model.getPath());
  				assert.equal("mn", focusNode.nodeName);
  				assert.equal(1, model.getOffset());
  				assert.equal(1, focusNode.parentNode.childNodes.length);
  				assert.equal("2", dripLang.getText(focusNode));
			});
			
			test("mn中有两个数字，mn后面是一个mo节点，光标在mo后面，删除mo", function(){
				model.loadData("<root><line>" +
  						"<math>" +
	  						"<mn>12</mn>" +
	  						"<mo>+</mo>" +
  						"</math></line></root>");
  				model.mode = "mathml";
  				var line = model.getLineAt(0);
  				model.anchor.node = line.firstChild.lastChild;
  				model.anchor.offset = 1;
  				model.path = [];model.path.push({nodeName: "root"});
  				model.path.push({nodeName: "line", offset: 1});
  				model.path.push({nodeName: "math", offset: 1});
  				model.path.push({nodeName: "mo", offset: 2});
  				model.removeLeft();
  				// 删除时，光标的位置还是放在当前节点的最前面。
  				var focusNode = model.getFocusNode();
  				assert.equal("/root/line[1]/math[1]/mn[1]", model.getPath());
  				assert.equal("mn", focusNode.nodeName);
  				assert.equal(2, model.getOffset());
  				assert.equal(1, focusNode.parentNode.childNodes.length);
  				assert.equal("12", dripLang.getText(focusNode));
			});
		});
	}

});