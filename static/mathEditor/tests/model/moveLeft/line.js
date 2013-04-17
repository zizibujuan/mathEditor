define([ "doh","mathEditor/Model" ], function(doh,Model) {

	// summary:
	//		在行间左移的情况有四种：
	//		1. 在空的model中左移
	//		2. 在两个空行中执行左移
	//		3. 上一行中的最后一个节点是text节点时
	//		4. 上一行中的最后一个节点是math节点时
	//
	// 除了以上逻辑,还需要添加:
	//		1. 判断是否已到行首的判断逻辑
	//		2. 进入行尾的逻辑
	doh.register("Model.moveLeft.line line节点间左移",[
	    {
			name:"model中没有任何内容时，执行左移，则什么也不做",
			setUp: function(){
				this.model = new Model({});
			},
			runTest: function(t){
				var model = this.model;
				model.moveLeft();
				
				var focusNode = model.getFocusNode();
				t.is("/root/line[1]", model.getPath());
				t.is("line", focusNode.nodeName);
				t.is(0, model.getOffset());
				t.is(focusNode, model.getLineAt(0));
			},
			tearDown: function(){
				
			}
		},{
			name:"text模式下，输入换行符，执行左移，则移动到第一行",
			setUp: function(){
				this.model = new Model({});
			},
			runTest: function(t){
				var model = this.model;
				model.setData({data:"\n"});
				model.moveLeft();
				
				var focusNode = model.getFocusNode();
				t.is("/root/line[1]", model.getPath());
				t.is("line", focusNode.nodeName);
				t.is(0, model.getOffset());
				t.is(focusNode, model.getLineAt(0));
			},
			tearDown: function(){
				
			}
		},{
			name:"text模式下，在第一行输入字符，输入回车符，然后在第二行输入字符，执行左移操作，然后再执行左移操作，第一行末尾获取光标",
			setUp: function(){
				this.model = new Model({});
			},
			runTest: function(t){
				var model = this.model;
				model.setData({data:"a"});
				model.setData({data:"\n"});
				model.setData({data:"b"});
				model.moveLeft();
				model.moveLeft();
				t.is("/root/line[1]/text[1]", model.getPath());
				var focusNode = model.getFocusNode();
				t.is("text", focusNode.nodeName);
				t.is(1, model.getOffset());
			},
			tearDown: function(){
				
			}
		},{
			name:"第一行结尾是math节点，从第二行行首左移到math结尾",
			setUp: function(){
				this.model = new Model({});
			},
			runTest: function(t){
				var model = this.model;
				// 因为这个时候，moveRight还没有实现完全，所以直接通过加载并设置当前节点的方式来测试。
				model.loadData("<root><line><math><mn>1</mn></math></line><line></line></root>");
				var line = model.getLineAt(1);
				model.anchor.node = line;
				model.anchor.offset = 0;
				model.path.push({nodeName:"root"});
				model.path.push({nodeName:"line", offset:2});

				model.moveLeft();
				t.is("/root/line[1]/math[1]", model.getPath());
				var focusNode = model.getFocusNode();
				t.is("math", focusNode.nodeName);
				t.is(1, model.getOffset());
			},
			tearDown: function(){
				
			}
		},{
			name:"判断已到行首，当光标在一个空行中时",
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
				t.t(model._isLineStart(model.anchor));
			},
			tearDown: function(){
				
			}
		},{
			name:"判断已到行首，当光标在text节点的最前面时",
			setUp: function(){
				this.model = new Model({});
			},
			runTest: function(t){
				var model = this.model;
				// 因为这个时候，moveRight还没有实现完全，所以直接通过加载并设置当前节点的方式来测试。
				model.loadData("<root><line><text>a</text></line></root>");
				var line = model.getLineAt(0);
				model.anchor.node = line.firstChild;
				model.anchor.offset = 0;
				model.path.push({nodeName:"root"});
				model.path.push({nodeName:"line", offset:1});
				model.path.push({nodeName:"text", offset:1});
				t.t(model._isLineStart(model.anchor));
			},
			tearDown: function(){
				
			}
		},{
			name:"判断已到行首，当光标在math节点的最前面时",
			setUp: function(){
				this.model = new Model({});
			},
			runTest: function(t){
				var model = this.model;
				// 因为这个时候，moveRight还没有实现完全，所以直接通过加载并设置当前节点的方式来测试。
				model.loadData("<root><line><math><mn>1</mn></math></line></root>");
				var line = model.getLineAt(0);
				model.anchor.node = line.firstChild;
				model.anchor.offset = 0;
				model.path.push({nodeName:"root"});
				model.path.push({nodeName:"line", offset:1});
				model.path.push({nodeName:"math", offset:1});
				
				t.t(model._isLineStart(model.anchor));
			},
			tearDown: function(){
				
			}
		},{
			name:"进入行尾，当进入的行中没有内容时",
			setUp: function(){
				this.model = new Model({});
			},
			runTest: function(t){
				var model = this.model;
				model.loadData("<root><line></line><line></line></root>");
				// 以下是初始化操作。先定位到第二行。
				var line = model.getLineAt(1);
				model.anchor.node = line;
				model.anchor.offset = 0;
				model.path.push({nodeName:"root"});
				model.path.push({nodeName:"line", offset:2});
				
				model._movePathToPreviousSibling(line);
				model._moveLineEnd(line.previousSibling);
				t.is(line.previousSibling, model.getFocusNode());
				t.is(0, model.getOffset());
				t.is("/root/line[1]", model.getPath()); // 调整line path的逻辑不在_moveLineEnd中
			},
			tearDown: function(){
				
			}
		},{
			name:"进入行尾，当行中最后一个节点是text节点时",
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
				model._moveLineEnd(focusLine);
				t.is(focusLine.lastChild, model.getFocusNode());
				t.is(2, model.getOffset());
				t.is("/root/line[1]/text[1]", model.getPath());
			},
			tearDown: function(){
				
			}
		},{
			name:"进入行尾，当行中最后一个节点是math节点时",
			setUp: function(){
				this.model = new Model({});
			},
			runTest: function(t){
				var model = this.model;
				model.loadData("<root><line><math><mn>12</mn></math></line><line></line></root>");
				var line = model.getLineAt(1);
				model.anchor.node = line;
				model.anchor.offset = 0;
				model.path.push({nodeName:"root"});
				model.path.push({nodeName:"line", offset:2});
				
				model._movePathToPreviousSibling(line);
				var focusLine = line.previousSibling;
				model._moveLineEnd(focusLine);
				t.is(focusLine.lastChild, model.getFocusNode());
				t.is(1, model.getOffset());
				t.is("/root/line[1]/math[1]", model.getPath());
			},
			tearDown: function(){
				
			}
		}
	                             
	]);
});
