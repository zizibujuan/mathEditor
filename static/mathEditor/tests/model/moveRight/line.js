define([ "intern!tdd", 
         "intern/chai!assert",
         "mathEditor/Model" ], function(
        		 tdd,
        		 assert,
        		 Model) {

	// summary:
	//		在行间右移的情况有四种：
	//		1. 在空的model中右移
	//		2. 在两个空行中执行右移
	//		3. 下一行中的第一个节点是text节点时
	//		4. 下一行中的第一个节点是math节点时
	//
	// 除了以上逻辑,还需要添加:
	//		1. 判断是否已到行尾的判断逻辑
	//		2. 进入行首的逻辑
	
	with(tdd){
		suite("Model.moveRight.line line节点间右移", function(){
			
			var model = null;
			beforeEach(function () {
				model = new Model({});
			});
			
			test("model中没有任何内容时，执行右移，则什么也不做", function(){
				model.moveRight();
				
				var focusNode = model.getFocusNode();
				assert.equal("/root/line[1]", model.getPath());
				assert.equal("line", focusNode.nodeName);
				assert.equal(0, model.getOffset());
				assert.equal(focusNode, model.getLineAt(0));
			});
			
			test("text模式下，输入换行符，执行左移，然后执行右移，光标停留在第二行", function(){
				model.setData({data:"\n"});
				model.moveLeft();
				model.moveRight();
				assert.equal("/root/line[2]", model.getPath());
				
				var focusNode = model.getFocusNode();
				assert.equal("line", focusNode.nodeName);
				assert.equal(0, model.getOffset());
				assert.equal(focusNode, model.getLineAt(1));
			});
			
			test("text模式下，第一行的最后一个节点是text节点，第二行是空行，从第一行末尾右移到第二行。", function(){
				model.setData({data:"a"});
				model.setData({data:"\n"});
				model.moveLeft();
				model.moveRight();
				
				assert.equal("/root/line[2]", model.getPath());
				var focusNode = model.getFocusNode();
				assert.equal("line", focusNode.nodeName);
				assert.equal(0, model.getOffset());
				assert.equal(focusNode, model.getLineAt(1));
			});
			
			test("text模式下，从上一行移到下一行，下一行的第一个节点是text节点", function(){
				model.setData({data:"a"});
				model.setData({data:"\n"});
				model.setData({data:"b"});
				model.moveLeft();
				assert.equal("/root/line[2]/text[1]", model.getPath());
				var focusNode = model.getFocusNode();
				assert.equal("text", focusNode.nodeName);
				assert.equal(0, model.getOffset());
				
				model.moveLeft();
				assert.equal("/root/line[1]/text[1]", model.getPath());
				var focusNode = model.getFocusNode();
				assert.equal("text", focusNode.nodeName);
				assert.equal(1, model.getOffset());
				
				model.moveRight();
				assert.equal("/root/line[2]/text[1]", model.getPath());
				var focusNode = model.getFocusNode();
				assert.equal("text", focusNode.nodeName);
				assert.equal(0, model.getOffset());
				
				model.moveRight();
				assert.equal("/root/line[2]/text[1]", model.getPath());
				var focusNode = model.getFocusNode();
				assert.equal("text", focusNode.nodeName);
				assert.equal(1, model.getOffset());
			});
			
			test("判断已到行尾，当光标在一个空行中时", function(){
				// 因为这个时候，moveRight还没有实现完全，所以直接通过加载并设置当前节点的方式来测试。
				model.loadData("<root><line></line></root>");
				var line = model.getLineAt(0);
				model.anchor.node = line;
				model.anchor.offset = 0;
				model.path = [];
				model.path.push({nodeName:"root"});
				model.path.push({nodeName:"line", offset:1});
				assert.ok(model._isLineEnd(model.anchor));
			});
			
			test("判断已到行尾，当光标在text节点的最后面时", function(){
				// 因为这个时候，moveRight还没有实现完全，所以直接通过加载并设置当前节点的方式来测试。
				model.loadData("<root><line><text>ab</text></line></root>");
				var line = model.getLineAt(0);
				model.anchor.node = line.firstChild;
				model.anchor.offset = 2;
				model.path = [];
				model.path.push({nodeName:"root"});
				model.path.push({nodeName:"line", offset:1});
				model.path.push({nodeName:"text", offset:1});
				assert.ok(model._isLineEnd(model.anchor));
			});
			
			test("判断已到行尾，当光标在math节点的最后面时", function(){
				// 因为这个时候，moveRight还没有实现完全，所以直接通过加载并设置当前节点的方式来测试。
				model.loadData("<root><line><math><mn>1</mn></math></line></root>");
				var line = model.getLineAt(0);
				model.anchor.node = line.firstChild;
				model.anchor.offset = 1;
				model.path = [];
				model.path.push({nodeName:"root"});
				model.path.push({nodeName:"line", offset:1});
				model.path.push({nodeName:"math", offset:1});
				
				assert.ok(model._isLineEnd(model.anchor));
			});
			
			test("进入行首，当行中没有内容时", function(){
				// 因为这个时候，moveRight还没有实现完全，所以直接通过加载并设置当前节点的方式来测试。
				model.loadData("<root><line></line><line></line></root>");
				var line = model.getLineAt(1);
				model.anchor.node = line;
				model.anchor.offset = 0;
				model.path = [];
				model.path.push({nodeName:"root"});
				model.path.push({nodeName:"line", offset:2});
				
				model._movePathToPreviousSibling(line);
				model._moveLineStart(line.previousSibling);
				assert.equal(line.previousSibling, model.getFocusNode());
				assert.equal(0, model.getOffset());
				assert.equal("/root/line[1]", model.getPath());
			});
			
			test("进入行首，当行中的第一个节点是text节点时", function(){
				// 因为这个时候，moveRight还没有实现完全，所以直接通过加载并设置当前节点的方式来测试。
				model.loadData("<root><line><text>ab</text></line><line></line></root>");
				var line = model.getLineAt(1);
				model.anchor.node = line;
				model.anchor.offset = 0;
				model.path = [];
				model.path.push({nodeName:"root"});
				model.path.push({nodeName:"line", offset:2});
				
				model._movePathToPreviousSibling(line);
				var focusLine = line.previousSibling;
				model._moveLineStart(focusLine);
				assert.equal(focusLine.firstChild, model.getFocusNode());
				assert.equal(0, model.getOffset());
				assert.equal("/root/line[1]/text[1]", model.getPath());
			});
			
			test("进入行首，当行中的第一个节点是math节点时", function(){
				// 因为这个时候，moveRight还没有实现完全，所以直接通过加载并设置当前节点的方式来测试。
				model.loadData("<root><line><math><mn>12</mn></math></line><line></line></root>");
				var line = model.getLineAt(1);
				model.anchor.node = line;
				model.anchor.offset = 0;
				model.path = [];
				model.path.push({nodeName:"root"});
				model.path.push({nodeName:"line", offset:2});
				
				model._movePathToPreviousSibling(line);
				var focusLine = line.previousSibling;
				model._moveLineStart(focusLine);
				assert.equal(focusLine.firstChild, model.getFocusNode());
				assert.equal(0, model.getOffset());
				assert.equal("/root/line[1]/math[1]", model.getPath());
			});
			
		});
	}
	
});
