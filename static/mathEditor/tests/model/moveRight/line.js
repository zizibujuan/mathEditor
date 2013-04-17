define([ "doh","mathEditor/Model" ], function(doh,Model) {

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
	doh.register("Model.moveRight line节点间右移",[
		{
			name:"model中没有任何内容时，执行右移，则什么也不做",
			setUp: function(){
				this.model = new Model({});
			},
			runTest: function(t){
				var model = this.model;
				model.moveRight();
				
				var focusNode = model.getFocusNode();
				t.is("/root/line[1]", model.getPath());
				t.is("line", focusNode.nodeName);
				t.is(0, model.getOffset());
				t.is(focusNode, model.getLineAt(0));
			},
			tearDown: function(){
				
			}
		},{
			name:"text模式下，输入换行符，执行左移，然后执行右移，光标停留在第二行",
			setUp: function(){
				this.model = new Model({});
			},
			runTest: function(t){
				var model = this.model;
				model.setData({data:"\n"});
				model.moveLeft();
				model.moveRight();
				t.is("/root/line[2]", model.getPath());
				
				var focusNode = model.getFocusNode();
				t.is("line", focusNode.nodeName);
				t.is(0, model.getOffset());
				t.is(focusNode, model.getLineAt(1));
			},
			tearDown: function(){
				
			}
		},{
			name:"text模式下，第一行的最后一个节点是text节点，第二行是空行，从第一行末尾右移到第二行。",
			setUp: function(){
				this.model = new Model({});
			},
			runTest: function(t){
				var model = this.model;
				model.setData({data:"a"});
				model.setData({data:"\n"});
				model.moveLeft();
				model.moveRight();
				
				t.is("/root/line[2]", model.getPath());
				var focusNode = model.getFocusNode();
				t.is("line", focusNode.nodeName);
				t.is(0, model.getOffset());
				t.is(focusNode, model.getLineAt(1));
			},
			tearDown: function(){
				
			}
		},{
			name:"text模式下，从上一行移到下一行，下一行的第一个节点是text节点",
			setUp: function(){
				this.model = new Model({});
			},
			runTest: function(t){
				var model = this.model;
				model.setData({data:"a"});
				model.setData({data:"\n"});
				model.setData({data:"b"});
				model.moveLeft();
				t.is("/root/line[2]/text[1]", model.getPath());
				var focusNode = model.getFocusNode();
				t.is("text", focusNode.nodeName);
				t.is(0, model.getOffset());
				
				model.moveLeft();
				t.is("/root/line[1]/text[1]", model.getPath());
				var focusNode = model.getFocusNode();
				t.is("text", focusNode.nodeName);
				t.is(1, model.getOffset());
				
				model.moveRight();
				t.is("/root/line[2]/text[1]", model.getPath());
				var focusNode = model.getFocusNode();
				t.is("text", focusNode.nodeName);
				t.is(0, model.getOffset());
				
				model.moveRight();
				t.is("/root/line[2]/text[1]", model.getPath());
				var focusNode = model.getFocusNode();
				t.is("text", focusNode.nodeName);
				t.is(1, model.getOffset());
			},
			tearDown: function(){
				
			}
		},{
			name:"判断已到行尾，当光标在一个空行中时",
			setUp: function(){
				this.model = new Model({});
			},
			runTest: function(t){
				var model = this.model;
				// 因为这个时候，moveRight还没有实现完全，所以直接通过加载并设置当前节点的方式来测试。
				model.loadData("<root><line></line></root>");
				var line = model.getLineAt(0);
				model.anchor.node = line;
				model.anchor.offset = 0;
				model.path.push({nodeName:"root"});
				model.path.push({nodeName:"line", offset:1});
				t.t(model._isLineEnd(model.anchor));
			},
			tearDown: function(){
				
			}
		},{
			name:"判断已到行尾，当光标在text节点的最后面时",
			setUp: function(){
				this.model = new Model({});
			},
			runTest: function(t){
				var model = this.model;
				// 因为这个时候，moveRight还没有实现完全，所以直接通过加载并设置当前节点的方式来测试。
				model.loadData("<root><line><text>ab</text></line></root>");
				var line = model.getLineAt(0);
				model.anchor.node = line.firstChild;
				model.anchor.offset = 2;
				model.path.push({nodeName:"root"});
				model.path.push({nodeName:"line", offset:1});
				model.path.push({nodeName:"text", offset:1});
				t.t(model._isLineEnd(model.anchor));
			},
			tearDown: function(){
				
			}
		},{
			name:"判断已到行尾，当光标在math节点的最后面时",
			setUp: function(){
				this.model = new Model({});
			},
			runTest: function(t){
				var model = this.model;
				// 因为这个时候，moveRight还没有实现完全，所以直接通过加载并设置当前节点的方式来测试。
				model.loadData("<root><line><math><mn>1</mn></math></line></root>");
				var line = model.getLineAt(0);
				model.anchor.node = line.firstChild;
				model.anchor.offset = 1;
				model.path.push({nodeName:"root"});
				model.path.push({nodeName:"line", offset:1});
				model.path.push({nodeName:"math", offset:1});
				
				t.t(model._isLineEnd(model.anchor));
			},
			tearDown: function(){
				
			}
		},{
			name:"进入行首，当行中没有内容时",
			setUp: function(){
				this.model = new Model({});
			},
			runTest: function(t){
				var model = this.model;
				// 因为这个时候，moveRight还没有实现完全，所以直接通过加载并设置当前节点的方式来测试。
				model.loadData("<root><line></line><line></line></root>");
				var line = model.getLineAt(1);
				model.anchor.node = line;
				model.anchor.offset = 0;
				model.path.push({nodeName:"root"});
				model.path.push({nodeName:"line", offset:2});
				
				model._movePathToPreviousSibling(line);
				model._moveLineStart(line.previousSibling);
				t.is(line.previousSibling, model.getFocusNode());
				t.is(0, model.getOffset());
				t.is("/root/line[1]", model.getPath());
			},
			tearDown: function(){
				
			}
		},{
			name:"进入行首，当行中的第一个节点是text节点时",
			setUp: function(){
				this.model = new Model({});
			},
			runTest: function(t){
				var model = this.model;
				// 因为这个时候，moveRight还没有实现完全，所以直接通过加载并设置当前节点的方式来测试。
				model.loadData("<root><line><text>ab</text></line><line></line></root>");
				var line = model.getLineAt(1);
				model.anchor.node = line;
				model.anchor.offset = 0;
				model.path.push({nodeName:"root"});
				model.path.push({nodeName:"line", offset:2});
				
				model._movePathToPreviousSibling(line);
				var focusLine = line.previousSibling;
				model._moveLineStart(focusLine);
				t.is(focusLine.firstChild, model.getFocusNode());
				t.is(0, model.getOffset());
				t.is("/root/line[1]/text[1]", model.getPath());
			},
			tearDown: function(){
				
			}
		},{
			name:"进入行首，当行中的第一个节点是math节点时",
			setUp: function(){
				this.model = new Model({});
			},
			runTest: function(t){
				var model = this.model;
				// 因为这个时候，moveRight还没有实现完全，所以直接通过加载并设置当前节点的方式来测试。
				var model = this.model;
				model.loadData("<root><line><math><mn>12</mn></math></line><line></line></root>");
				var line = model.getLineAt(1);
				model.anchor.node = line;
				model.anchor.offset = 0;
				model.path.push({nodeName:"root"});
				model.path.push({nodeName:"line", offset:2});
				
				model._movePathToPreviousSibling(line);
				var focusLine = line.previousSibling;
				model._moveLineStart(focusLine);
				t.is(focusLine.firstChild, model.getFocusNode());
				t.is(0, model.getOffset());
				t.is("/root/line[1]/math[1]", model.getPath());
			},
			tearDown: function(){
				
			}
		}
	                             
	]);
});
