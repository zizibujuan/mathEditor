define([ "intern!tdd", 
         "intern/chai!assert", 
         "mathEditor/Model", 
         "mathEditor/lang" ], function(
        		 tdd,
        		 assert, 
        		 Model, 
        		 dripLang) {

	// summary:
	//		1.text节点中有3个字符，光标在第一个字符前面
	//		2.text节点中有3个字符，光标在第二个字符前面
	//		3.text节点中有3个字符，光标在第三个字符前面
	//		4.text节点后没有节点，text节点中只有一个字符，光标在第一个字符的前面，删除text节点
	//		5.text节点后有一个math节点，text节点中只有一个字符，光标在第一个字符的前面，删除text节点
	with(tdd){
		suite("Model.removeRight.text 右删除文本", function(){
			
			var model = null;
			beforeEach(function () {
				model = new Model({});
			});
			
			test("text节点中有3个字符，光标在第一个字符前面", function(){
				model.loadData("<root><line><text>abc</text></line></root>");
  				var line = model.getLineAt(0);
  				model.anchor.node = line.firstChild;
  				model.anchor.offset = 0;
  				model.path = [];model.path.push({nodeName: "root"});
  				model.path.push({nodeName: "line", offset: 1});
  				model.path.push({nodeName: "text", offset: 1});
  				var removed = model.removeRight();
  				var focusNode = model.getFocusNode();
  				assert.equal("a", removed);
  				assert.equal("/root/line[1]/text[1]", model.getPath());
  				assert.equal("text", focusNode.nodeName);
  				assert.equal(0, model.getOffset());
  				assert.equal("bc", dripLang.getText(focusNode));
			});
			
			test("text节点中有3个字符，光标在第二个字符前面", function(){
				model.loadData("<root><line><text>abc</text></line></root>");
  				var line = model.getLineAt(0);
  				model.anchor.node = line.firstChild;
  				model.anchor.offset = 1;
  				model.path = [];model.path.push({nodeName: "root"});
  				model.path.push({nodeName: "line", offset: 1});
  				model.path.push({nodeName: "text", offset: 1});
  				var removed = model.removeRight();
  				var focusNode = model.getFocusNode();
  				assert.equal("b", removed);
  				assert.equal("/root/line[1]/text[1]", model.getPath());
  				assert.equal("text", focusNode.nodeName);
  				assert.equal(1, model.getOffset());
  				assert.equal("ac", dripLang.getText(focusNode));
			});
			
			test("text节点中有3个字符，光标在第三个字符前面", function(){
				model.loadData("<root><line><text>abc</text></line></root>");
  				var line = model.getLineAt(0);
  				model.anchor.node = line.firstChild;
  				model.anchor.offset = 2;
  				model.path = [];model.path.push({nodeName: "root"});
  				model.path.push({nodeName: "line", offset: 1});
  				model.path.push({nodeName: "text", offset: 1});
  				var removed = model.removeRight();
  				var focusNode = model.getFocusNode();
  				assert.equal("c", removed);
  				assert.equal("/root/line[1]/text[1]", model.getPath());
  				assert.equal("text", focusNode.nodeName);
  				assert.equal(2, model.getOffset());
  				assert.equal("ab", dripLang.getText(focusNode));
			});
			
			test("text节点后没有节点，text节点中只有一个字符，光标在第一个字符的前面，删除text节点", function(){
				model.loadData("<root><line><text>a</text></line></root>");
  				var line = model.getLineAt(0);
  				model.anchor.node = line.firstChild;
  				model.anchor.offset = 0;
  				model.path = [];model.path.push({nodeName: "root"});
  				model.path.push({nodeName: "line", offset: 1});
  				model.path.push({nodeName: "text", offset: 1});
  				var removed = model.removeRight();
  				var focusNode = model.getFocusNode();
  				assert.equal("a", removed);
  				assert.equal("/root/line[1]", model.getPath());
  				assert.equal("line", focusNode.nodeName);
  				assert.equal(0, model.getOffset());
  				assert.equal(0, focusNode.childNodes.length);
			});
			
			// FIXME:将节点删除后，是聚焦到前一个节点后面，还是聚焦到后一个节点的前面？
			test("text节点后有一个math节点，text节点中只有一个字符，光标在第一个字符的前面，删除text节点", function(){
				model.loadData("<root><line><text>a</text><math><mn>1</mn></math></line></root>");
  				var line = model.getLineAt(0);
  				model.anchor.node = line.firstChild;
  				model.anchor.offset = 0;
  				model.path = [];model.path.push({nodeName: "root"});
  				model.path.push({nodeName: "line", offset: 1});
  				model.path.push({nodeName: "text", offset: 1});
  				var removed = model.removeRight();
  				var focusNode = model.getFocusNode();
  				assert.equal("a", removed);
  				assert.equal("/root/line[1]/math[1]", model.getPath());
  				assert.equal("math", focusNode.nodeName);
  				assert.equal(0, model.getOffset());
  				assert.equal(1, line.childNodes.length);
			});
		});
	}
	
});