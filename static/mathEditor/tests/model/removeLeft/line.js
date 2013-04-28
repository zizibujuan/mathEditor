define([ "doh","mathEditor/Model" ], function(doh,Model) {

	// summry:
	//		光标在第一行的起始位置：
	//		1.第一行没有任何节点，执行左删除时，什么也不做
	//		2.第一行的第一个节点是text节点，执行左删除时，什么也不做
	//		3.第一行的第一个节点是mathml节点，执行左删除时，什么也不做
	//		光标在第二行的起始位置：
	//		1.第二行为空行，执行左删除时，删除第二行，光标停留在第一行的结尾，第一行也是空行
	//		2.第二行为空行，执行左删除时，删除第二行，光标停留在第一行的结尾，第一行最后一个节点是text节点
	//		3.第二行为空行，执行左删除时，删除第二行，光标停留在第一行的结尾，第一行最后一个节点是math节点
	//		4.第二行不为空行，第一个节点是text节点，第一行的最后一个节点是text节点，则删除第二行，并将第二个text合并到第一行中的text后
	//		5.第二行不为空行，第一个节点是text节点，第一行的最后一个节点是math节点，则删除第二行，并将math节点放在第一行的text节点后面
	//		6.第二行不为空行，第一个节点是math节点，第一行的最后一个节点是text节点，则删除第二行，并将第二行的text放在第一行的math节点后面
	//		7.第二行不为空行，第一个节点是math节点，第一行的最后一个节点是math节点，则删除第二行，并将第二行的math放在第一行的math节点后面
	//
	//		现在的实现方法是将光标放在上一行的末尾，而不是当前行的首节点前
	doh.register("Model.removeLeft.line 左删除行",[
	    {
	    	name: "光标在第一行的起始位置,第一行没有任何节点，执行左删除时，什么也不做。",
  			setUp: function(){
  				this.model = new Model({});
  			},
  			runTest: function(t){
  				var model = this.model;
  				model.loadData("<root><line></line></root>");
  				var line = model.getLineAt(0);
  				model.anchor.node = line;
  				model.anchor.offset = 0;
  				model.path.push({nodeName: "root"});
  				model.path.push({nodeName: "line", offset: 1});
  				var removed = model.removeLeft();
  				var focusNode = model.getFocusNode();
  				t.is(null, removed);// 用null表示，什么也没有删除
  				t.is("/root/line[1]", model.getPath());
  				t.is("line", focusNode.nodeName);
  				t.is(0, model.getOffset());
  			},
  			tearDown: function(){
  				
  			}
	    },{
	    	name: "光标在第一行的起始位置,第一行的第一个节点是text节点，执行左删除时，什么也不做。",
  			setUp: function(){
  				this.model = new Model({});
  			},
  			runTest: function(t){
  				var model = this.model;
  				model.loadData("<root><line><text>abc</text></line></root>");
  				var line = model.getLineAt(0);
  				model.anchor.node = line.firstChild;
  				model.anchor.offset = 0;
  				model.path.push({nodeName: "root"});
  				model.path.push({nodeName: "line", offset: 1});
  				model.path.push({nodeName: "text", offset: 1});
  				var removed = model.removeLeft();
  				var focusNode = model.getFocusNode();
  				t.is(null, removed);// 用null表示，什么也没有删除
  				t.is("/root/line[1]/text[1]", model.getPath());
  				t.is("text", focusNode.nodeName);
  				t.is(0, model.getOffset());
  			},
  			tearDown: function(){
  				
  			}
	    },{
	    	name: "光标在第一行的起始位置,第一行的第一个节点是mathml节点，执行左删除时，什么也不做。",
  			setUp: function(){
  				this.model = new Model({});
  			},
  			runTest: function(t){
  				var model = this.model;
  				model.loadData("<root><line><math><mn>12</mn></math></line></root>");
  				var line = model.getLineAt(0);
  				model.anchor.node = line.firstChild;
  				model.anchor.offset = 0;
  				model.path.push({nodeName: "root"});
  				model.path.push({nodeName: "line", offset: 1});
  				model.path.push({nodeName: "math", offset: 1});
  				var removed = model.removeLeft();
  				var focusNode = model.getFocusNode();
  				t.is(null, removed);// 用null表示，什么也没有删除
  				t.is("/root/line[1]/math[1]", model.getPath());
  				t.is("math", focusNode.nodeName);
  				t.is(0, model.getOffset());
  			},
  			tearDown: function(){
  				
  			}
	    },{
	    	name: "光标在第二行的起始位置,第二行为空行，执行左删除时，删除第二行，光标停留在第一行的结尾，第一行也是空行。",
  			setUp: function(){
  				this.model = new Model({});
  			},
  			runTest: function(t){
  				var model = this.model;
  				model.loadData("<root>" +
  						"<line></line>" +
  						"<line></line>" +
  				"</root>");
  				var line = model.getLineAt(1);
  				model.anchor.node = line;
  				model.anchor.offset = 0;
  				model.path.push({nodeName: "root"});
  				model.path.push({nodeName: "line", offset: 2});
  				model.removeLeft();
  				var focusNode = model.getFocusNode();
  				t.is("/root/line[1]", model.getPath());
  				t.is("line", focusNode.nodeName);
  				t.is(0, model.getOffset());
  				t.is(1, model.getLineCount());
  			},
  			tearDown: function(){
  				
  			}
	    },{
	    	name: "光标在第二行的起始位置,第二行为空行，执行左删除时，删除第二行，光标停留在第一行的结尾，第一行最后一个节点是text节点。",
  			setUp: function(){
  				this.model = new Model({});
  			},
  			runTest: function(t){
  				var model = this.model;
  				model.loadData("<root>" +
  						"<line><text>abc</text></line>" +
  						"<line></line>" +
  				"</root>");
  				var line = model.getLineAt(1);
  				model.anchor.node = line;
  				model.anchor.offset = 0;
  				model.path.push({nodeName: "root"});
  				model.path.push({nodeName: "line", offset: 2});
  				model.removeLeft();
  				var focusNode = model.getFocusNode();
  				t.is("/root/line[1]/text[1]", model.getPath());
  				t.is("text", focusNode.nodeName);
  				t.is(3, model.getOffset());
  				t.is(1, model.getLineCount());
  			},
  			tearDown: function(){
  				
  			}
	    },{
	    	name: "光标在第二行的起始位置,第二行为空行，执行左删除时，删除第二行，光标停留在第一行的结尾，第一行最后一个节点是math节点。",
  			setUp: function(){
  				this.model = new Model({});
  			},
  			runTest: function(t){
  				var model = this.model;
  				model.loadData("<root>" +
  						"<line><math><mn>12</mn></math></line>" +
  						"<line></line>" +
  				"</root>");
  				var line = model.getLineAt(1);
  				model.anchor.node = line;
  				model.anchor.offset = 0;
  				model.path.push({nodeName: "root"});
  				model.path.push({nodeName: "line", offset: 2});
  				model.removeLeft();
  				var focusNode = model.getFocusNode();
  				t.is("/root/line[1]/math[1]", model.getPath());
  				t.is("math", focusNode.nodeName);
  				t.is(1, model.getOffset());
  				t.is(1, model.getLineCount());
  			},
  			tearDown: function(){
  				
  			}
	    },{
	    	name: "光标在第二行的起始位置,第二行不为空行，第一个节点是text节点，" +
	    		  "第一行的最后一个节点是text节点，则删除第二行，并将第二个text合并到第一行中的text后。",
  			setUp: function(){
  				this.model = new Model({});
  			},
  			runTest: function(t){
  				var model = this.model;
  				model.loadData("<root>" +
  						"<line><text>abc</text></line>" +
  						"<line><text>de</text></line>" +
  				"</root>");
  				var line = model.getLineAt(1);
  				model.anchor.node = line.firstChild;
  				model.anchor.offset = 0;
  				model.path.push({nodeName: "root"});
  				model.path.push({nodeName: "line", offset: 2});
  				model.path.push({nodeName: "text", offset: 1});
  				model.removeLeft();
  				var focusNode = model.getFocusNode();
  				t.is("/root/line[1]/text[1]", model.getPath());
  				t.is("text", focusNode.nodeName);
  				t.is(3, model.getOffset());
  				t.is(1, model.getLineCount());
  				t.is("abcde", focusNode.textContent);
  			},
  			tearDown: function(){
  				
  			}
	    },{
	    	name: "光标在第二行的起始位置,第二行不为空行，第一个节点是text节点，" +
	    			"第一行的最后一个节点是math节点，则删除第二行，并将math节点放在第一行的text节点后面。",
  			setUp: function(){
  				this.model = new Model({});
  			},
  			runTest: function(t){
  				var model = this.model;
  				model.loadData("<root>" +
  						"<line><math><mn>12</mn></math></line>" +
  						"<line><text>abc</text></line>" +
  				"</root>");
  				var line = model.getLineAt(1);
  				model.anchor.node = line.firstChild;
  				model.anchor.offset = 0;
  				model.path.push({nodeName: "root"});
  				model.path.push({nodeName: "line", offset: 2});
  				model.path.push({nodeName: "text", offset: 1});
  				model.removeLeft();
  				var focusNode = model.getFocusNode();
  				t.is("/root/line[1]/math[1]", model.getPath());
  				t.is("math", focusNode.nodeName);
  				t.is(1, model.getOffset());
  				t.is(1, model.getLineCount());
  				t.is(2, model.getLineAt(0).childNodes.length);
  			},
  			tearDown: function(){
  				
  			}
	    },{
	    	name: "光标在第二行的起始位置,第二行不为空行，第一个节点是math节点，" +
	    			"第一行的最后一个节点是text节点，则删除第二行，并将第二行的text放在第一行的math节点后面",
  			setUp: function(){
  				this.model = new Model({});
  			},
  			runTest: function(t){
  				var model = this.model;
  				model.loadData("<root>" +
  						"<line><text>abc</text></line>" +
  						"<line><math><mn>12</mn></math></line>" +
  				"</root>");
  				var line = model.getLineAt(1);
  				model.anchor.node = line.firstChild;
  				model.anchor.offset = 0;
  				model.path.push({nodeName: "root"});
  				model.path.push({nodeName: "line", offset: 2});
  				model.path.push({nodeName: "math", offset: 1});
  				model.removeLeft();
  				var focusNode = model.getFocusNode();
  				t.is("/root/line[1]/text[1]", model.getPath());
  				t.is("text", focusNode.nodeName);
  				t.is(3, model.getOffset());
  				t.is(1, model.getLineCount());
  				t.is(2, model.getLineAt(0).childNodes.length);
  			},
  			tearDown: function(){
  				
  			}
	    },{
	    	name: "光标在第二行的起始位置,第二行不为空行，第一个节点是math节点，" +
	    			"第一行的最后一个节点是math节点，则删除第二行，并将第二行的math放在第一行的math节点后面",
			setUp: function(){
				this.model = new Model({});
			},
			runTest: function(t){
				var model = this.model;
				model.loadData("<root>" +
						"<line><math><mn>12</mn></math></line>" +
						"<line><math><mn>34</mn></math></line>" +
				"</root>");
				var line = model.getLineAt(1);
				model.anchor.node = line.firstChild;
				model.anchor.offset = 0;
				model.path.push({nodeName: "root"});
				model.path.push({nodeName: "line", offset: 2});
				model.path.push({nodeName: "math", offset: 1});
				model.removeLeft();
				var focusNode = model.getFocusNode();
				t.is("/root/line[1]/math[1]", model.getPath());
				t.is("math", focusNode.nodeName);
				t.is(1, model.getOffset());
				t.is(1, model.getLineCount());
				t.is(2, model.getLineAt(0).childNodes.length);
			},
			tearDown: function(){
				
			}
	    }

	    
	]);
});