define([ "intern!tdd", 
         "intern/chai!assert",
         "mathEditor/Model" ], function(
        		 tdd,
        		 assert,
        		 Model) {

	with(tdd){
		suite("Model.moveLeft.math", function(){
			
			var model = null;
			beforeEach(function () {
				model = new Model({});
			});
			
			test("从math节点后，向左往math内层移动,移到token节点内容的后面,math后没有节点。", function(){
				model.loadData("<root><line><math><mn>12</mn></math></line></root>");
  				model.mode = "text";
  				var line = model.getLineAt(0);
  				model.anchor.node = line.lastChild;
  				model.anchor.offset = 1;
  				model.path = [];model.path.push({nodeName: "root"});
  				model.path.push({nodeName: "line", offset: 1});
  				model.path.push({nodeName: "math", offset: 1});
  				model.moveLeft();
  				// 直接移到token节点的内容后面。
  				assert.equal("/root/line[1]/math[1]/mn[1]", model.getPath());
  				var focusNode = model.getFocusNode();
  				assert.equal("mn", focusNode.nodeName);
  				assert.equal(2, model.getOffset());
  				assert.ok(model.isMathMLMode());
			});
			
			test("从math节点后，向左往math内层移动,移到token节点内容的后面,math后有一个text节点。", function(){
				model.loadData("<root><line><math><mn>12</mn></math><text>123</text></line></root>");
  				model.mode = "text";
  				var line = model.getLineAt(0);
  				model.anchor.node = line.lastChild;
  				model.anchor.offset = 0;
  				model.path = [];model.path.push({nodeName: "root"});
  				model.path.push({nodeName: "line", offset: 1});
  				model.path.push({nodeName: "text", offset: 2});
  				model.moveLeft();
  				// 直接移到token节点的内容后面。
  				assert.equal("/root/line[1]/math[1]/mn[1]", model.getPath());
  				var focusNode = model.getFocusNode();
  				assert.equal("mn", focusNode.nodeName);
  				assert.equal(2, model.getOffset());
  				assert.ok(model.isMathMLMode());
			});
			
			test("从math节点后，向左往math内层移动,移到layout节点上，layout节点外没有mstyle节点,math后没有节点。", function(){
				model.loadData("<root><line><math><mfrac><mrow><mn>1</mn></mrow><mrow><mn>2</mn></mrow></mfrac></math></line></root>");
  				model.mode = "text";
  				var line = model.getLineAt(0);
  				model.anchor.node = line.lastChild;
  				model.anchor.offset = 1;
  				model.path = [];model.path.push({nodeName: "root"});
  				model.path.push({nodeName: "line", offset: 1});
  				model.path.push({nodeName: "math", offset: 1});
  				model.moveLeft();
  				// 直接移到layout节点的内容后面。
  				assert.equal("/root/line[1]/math[1]/mfrac[1]", model.getPath());
  				var focusNode = model.getFocusNode();
  				assert.equal("mfrac", focusNode.nodeName);
  				assert.equal(1, model.getOffset());
  				assert.ok(model.isMathMLMode());
			});
			
			// TODO: 了解mstyle会应用在哪些地方。
			test("从math节点后，向左往math内层移动,移到layout节点上，layout节点外有mstyle节点,math后没有节点。", function(){
				model.loadData("<root><line><math><mstyle displaystyle='true'><mfrac><mrow><mn>1</mn></mrow><mrow><mn>2</mn></mrow></mfrac></mstyle></math></line></root>");
  				model.mode = "mathml";
  				var line = model.getLineAt(0);
  				model.anchor.node = line.lastChild;
  				model.anchor.offset = 1;
  				model.path = [];model.path.push({nodeName: "root"});
  				model.path.push({nodeName: "line", offset: 1});
  				model.path.push({nodeName: "math", offset: 1});
  				model.moveLeft();
  				// 直接移到layout节点的内容后面。
  				assert.equal("/root/line[1]/math[1]/mfrac[1]", model.getPath());
  				var focusNode = model.getFocusNode();
  				assert.equal("mfrac", focusNode.nodeName);
  				assert.equal(1, model.getOffset());
			});
			
			test("math节点中没有子节点,左移进空的math中,math后有一个text节点", function(){
				model.loadData("<root><line><math></math><text>12</text></line></root>");
  				model.mode = "text";
  				var line = model.getLineAt(0);
  				model.anchor.node = line.lastChild;
  				model.anchor.offset = 0;
  				model.path = [];model.path.push({nodeName: "root"});
  				model.path.push({nodeName: "line", offset: 1});
  				model.path.push({nodeName: "text", offset: 2});
  				model.moveLeft();
  				assert.equal("/root/line[1]/math[1]", model.getPath());
  				var focusNode = model.getFocusNode();
  				assert.equal("math", focusNode.nodeName);
  				assert.equal(2, model.getOffset());// 此时math中没有子节点，可以在math中插入节点
  				assert.ok(model.isMathMLMode());
			});
			
			test("math节点中没有子节点,math前有一个text节点，左移出空的math", function(){
				model.loadData("<root><line><text>12</text><math></math></line></root>");
  				model.mode = "mathml";
  				var line = model.getLineAt(0);
  				model.anchor.node = line.lastChild;
  				model.anchor.offset = 2;
  				model.path = [];model.path.push({nodeName: "root"});
  				model.path.push({nodeName: "line", offset: 1});
  				model.path.push({nodeName: "math", offset: 2});
  				model.moveLeft();
  				assert.equal("/root/line[1]/math[2]", model.getPath());
  				var focusNode = model.getFocusNode();
  				assert.equal("math", focusNode.nodeName);
  				assert.equal(0, model.getOffset());
  				assert.ok(model.isTextMode());
			});
			
			// TODO：这个时机，是不是mathml与text模式切换的最好时机呢？
			test("向左移出math，从math节点的第一个token的内容最前面，向左往math外层移动。", function(){
				model.loadData("<root><line><math><mn>12</mn></math></line></root>");
  				model.mode = "mathml";
  				var line = model.getLineAt(0);
  				model.anchor.node = line.firstChild.firstChild;
  				model.anchor.offset = 0;
  				model.path = [];model.path.push({nodeName: "root"});
  				model.path.push({nodeName: "line", offset: 1});
  				model.path.push({nodeName: "math", offset: 1});
  				model.path.push({nodeName: "mn", offset: 1});
  				model.moveLeft();
  				assert.equal("/root/line[1]/math[1]", model.getPath());
  				var focusNode = model.getFocusNode();
  				assert.equal("math", focusNode.nodeName);
  				assert.equal(0, model.getOffset());
			});
			
			test("向左移出math，从math节点的第一个layout的节点最前面，向左往math外层移动,layout节点外没有mstyle节点。", function(){
				model.loadData("<root><line><math><mfrac><mrow><mn>1</mn></mrow><mrow><mn>2</mn></mrow></mfrac></math></line></root>");
  				model.mode = "mathml";
  				var line = model.getLineAt(0);
  				model.anchor.node = line.firstChild.firstChild;
  				model.anchor.offset = 0;
  				model.path = [];model.path.push({nodeName: "root"});
  				model.path.push({nodeName: "line", offset: 1});
  				model.path.push({nodeName: "math", offset: 1});
  				model.path.push({nodeName: "mfrac", offset: 1});
  				model.moveLeft();
  				assert.equal("/root/line[1]/math[1]", model.getPath());
  				var focusNode = model.getFocusNode();
  				assert.equal("math", focusNode.nodeName);
  				assert.equal(0, model.getOffset());
			});
			
			test("向左移出math，从math节点的第一个layout的节点最前面，向左往math外层移动,layout节点外有mstyle节点。", function(){
				model.loadData("<root><line><math><mstyle displaystyle='true'><mfrac><mrow><mn>1</mn></mrow><mrow><mn>2</mn></mrow></mfrac></mstyle></math></line></root>");
  				model.mode = "mathml";
  				var line = model.getLineAt(0);
  				model.anchor.node = line.firstChild.firstChild.firstChild;
  				model.anchor.offset = 0;
  				model.path = [];model.path.push({nodeName: "root"});
  				model.path.push({nodeName: "line", offset: 1});
  				model.path.push({nodeName: "math", offset: 1});
  				model.path.push({nodeName: "mfrac", offset: 1});
  				model.moveLeft();
  				assert.equal("/root/line[1]/math[1]", model.getPath());
  				var focusNode = model.getFocusNode();
  				assert.equal("math", focusNode.nodeName);
  				assert.equal(0, model.getOffset());
			});
			
			test("从math节点前，移到前面的text节点后", function(){
				model.loadData("<root><line><text>123</text><math><mn>12</mn></math></line></root>");
  				model.mode = "text";
  				var line = model.getLineAt(0);
  				model.anchor.node = line.lastChild;
  				model.anchor.offset = 0;
  				model.path = [];model.path.push({nodeName: "root"});
  				model.path.push({nodeName: "line", offset: 1});
  				model.path.push({nodeName: "math", offset: 2});
  				model.moveLeft();
  				// 直接移到token节点的内容后面。
  				assert.equal("/root/line[1]/text[1]", model.getPath());
  				var focusNode = model.getFocusNode();
  				assert.equal("text", focusNode.nodeName);
  				assert.equal(2, model.getOffset());
  				assert.ok(model.isTextMode());
			});
			
			test("math节点中没有子节点,左移进空的math中,math后没有任何节点", function(){
				model.loadData("<root><line><math></math></line></root>");
  				model.mode = "text";
  				var line = model.getLineAt(0);
  				model.anchor.node = line.firstChild;
  				model.anchor.offset = 1;
  				model.path = [];model.path.push({nodeName: "root"});
  				model.path.push({nodeName: "line", offset: 1});
  				model.path.push({nodeName: "math", offset: 1});
  				model.moveLeft();
  				assert.equal("/root/line[1]/math[1]", model.getPath());
  				var focusNode = model.getFocusNode();
  				assert.equal("math", focusNode.nodeName);
  				assert.equal(2, model.getOffset());// 此时math中没有子节点，可以在math中插入节点
  				assert.ok(model.isMathMLMode());
			});
			
			test("math节点中没有子节点,左移出空的math中", function(){
				model.loadData("<root><line><math></math></line></root>");
  				model.mode = "mathml";
  				var line = model.getLineAt(0);
  				model.anchor.node = line.firstChild;
  				model.anchor.offset = 2;// 在空的math中间
  				model.path = [];model.path.push({nodeName: "root"});
  				model.path.push({nodeName: "line", offset: 1});
  				model.path.push({nodeName: "math", offset: 1});
  				model.moveLeft();
  				assert.equal("/root/line[1]/math[1]", model.getPath());
  				var focusNode = model.getFocusNode();
  				assert.equal("math", focusNode.nodeName);
  				assert.equal(0, model.getOffset());// 表示已经移到math之后
  				assert.ok(model.isTextMode());
			});
			
			
		});
	}
	
});