define([ "doh","mathEditor/Model" ], function(doh,Model) {

	// summry:
	//		光标在最后一行的结束位置：
	//		1.最后一行没有任何节点，执行右删除时，什么也不做
	//		2.最后一行的最后一个节点是text节点，执行右删除时，什么也不做
	//		3.最后一行的最后一个节点是mathml节点，执行右删除时，什么也不做
	//		光标在倒数第二行的最后位置：
	//		1.有两行，都为空行，光标在第一行的最后位置,执行右删除时，删除第二行，光标停留在第一行初始位置
	//		2.有两行，第一行为空行，第二行的第一个节点是text节点，光标在第一行时，执行右删除，将第二行的内容移到第一行，然后删除第二行
	//		3.有两行，第一行为空行，第二行的第一个节点是math节点，光标在第一行时，执行右删除，将第二行的内容移到第一行，然后删除第二行
	//		4.倒数第二行不为空行，第一个节点是text节点，最后一行的第一个节点是text节点，则删除倒数第二行，并将最后一行的text合并到倒数第二行中的text后
	//		5.倒数第二行不为空行，第一个节点是text节点，最后一行的第一个节点是math节点，则删除倒数第二行，并将最后一行的math节点放在倒数第二行中的text节点后面
	//		6.倒数第二行不为空行，第一个节点是math节点，最后一行的第一个节点是text节点，则删除倒数第二行，并将最后一行的text放在倒数第二行中的math节点后面
	//		7.倒数第二行不为空行，第一个节点是math节点，最后一行的第一个节点是math节点，则删除倒数第二行，并将最后一行的math放在倒数第二行中的math节点后面
	doh.register("Model.removeRight.line 右删除行",[
	    {
	    	name: "光标在最后一行的结束位置,最后一行没有任何节点，执行右删除时，什么也不做。",
  			setUp: function(){
  				this.model = new Model({});
  			},
  			runTest: function(t){
  				var model = this.model;
  				model.loadData("<root><line></line></root>");
  				var line = model.getLineAt(0);
  				model.anchor.node = line;
  				model.anchor.offset = 0;
  				model.path = [];model.path.push({nodeName: "root"});
  				model.path.push({nodeName: "line", offset: 1});
  				model.removeRight();
  				var focusNode = model.getFocusNode();
  				t.is("/root/line[1]", model.getPath());
  				t.is("line", focusNode.nodeName);
  				t.is(0, model.getOffset());
  			},
  			tearDown: function(){
  				
  			}
	    },{
	    	name: "光标在最后一行的结束位置,最后一行的最后一个节点是text节点，执行右删除时，什么也不做。",
  			setUp: function(){
  				this.model = new Model({});
  			},
  			runTest: function(t){
  				var model = this.model;
  				model.loadData("<root><line><text>abc</text></line></root>");
  				var line = model.getLineAt(0);
  				model.anchor.node = line.firstChild;
  				model.anchor.offset = 3;
  				model.path = [];model.path.push({nodeName: "root"});
  				model.path.push({nodeName: "line", offset: 1});
  				model.path.push({nodeName: "text", offset: 1});
  				model.removeRight();
  				var focusNode = model.getFocusNode();
  				t.is("/root/line[1]/text[1]", model.getPath());
  				t.is("text", focusNode.nodeName);
  				t.is(3, model.getOffset());
  			},
  			tearDown: function(){
  				
  			}
	    },{
	    	name: "光标在最后一行的结束位置,最后一行的最后一个节点是mathml节点，执行右删除时，什么也不做。",
  			setUp: function(){
  				this.model = new Model({});
  			},
  			runTest: function(t){
  				var model = this.model;
  				model.loadData("<root><line><math><mn>12</mn></math></line></root>");
  				var line = model.getLineAt(0);
  				model.anchor.node = line.firstChild;
  				model.anchor.offset = 1;
  				model.path = [];model.path.push({nodeName: "root"});
  				model.path.push({nodeName: "line", offset: 1});
  				model.path.push({nodeName: "math", offset: 1});
  				model.removeRight();
  				var focusNode = model.getFocusNode();
  				t.is("/root/line[1]/math[1]", model.getPath());
  				t.is("math", focusNode.nodeName);
  				t.is(1, model.getOffset());
  			},
  			tearDown: function(){
  				
  			}
	    },{
	    	name: "有两行，都为空行，光标在第一行的最后位置,执行右删除时，删除第二行，光标停留在第一行初始位置。",
  			setUp: function(){
  				this.model = new Model({});
  			},
  			runTest: function(t){
  				var model = this.model;
  				model.loadData("<root>" +
  						"<line></line>" +
  						"<line></line>" +
  				"</root>");
  				var line = model.getLineAt(0);
  				model.anchor.node = line;
  				model.anchor.offset = 0;
  				model.path = [];model.path.push({nodeName: "root"});
  				model.path.push({nodeName: "line", offset: 1});
  				model.removeRight();
  				var focusNode = model.getFocusNode();
  				t.is("/root/line[1]", model.getPath());
  				t.is("line", focusNode.nodeName);
  				t.is(0, model.getOffset());
  				t.is(1, model.getLineCount());
  			},
  			tearDown: function(){
  				
  			}
	    },{
	    	name: "有两行，第一行为空行，第二行的第一个节点是text节点，光标在第一行时，执行右删除，将第二行的内容移到第一行，然后删除第二行，" +
	    			"光标停留在最后一行的起始位置",
  			setUp: function(){
  				this.model = new Model({});
  			},
  			runTest: function(t){
  				var model = this.model;
  				model.loadData("<root>" +
  						"<line></line>" +
  						"<line><text>abc</text></line>" +
  				"</root>");
  				var line = model.getLineAt(0);
  				model.anchor.node = line;
  				model.anchor.offset = 0;
  				model.path = [];model.path.push({nodeName: "root"});
  				model.path.push({nodeName: "line", offset: 1});
  				model.removeRight();
  				var focusNode = model.getFocusNode();
  				t.is("/root/line[1]/text[1]", model.getPath());
  				t.is("text", focusNode.nodeName);
  				t.is(0, model.getOffset());
  				t.is(1, model.getLineCount());
  				t.is("abc", focusNode.textContent);
  			},
  			tearDown: function(){
  				
  			}
	    },{
	    	name: "有两行，第一行为空行，第二行的第一个节点是math节点，光标在第一行时，执行右删除，将第二行的内容移到第一行，然后删除第二行。",
  			setUp: function(){
  				this.model = new Model({});
  			},
  			runTest: function(t){
  				var model = this.model;
  				model.loadData("<root>" +
  						"<line></line>" +
  						"<line><math><mn>12</mn></math></line>" +
  				"</root>");
  				var line = model.getLineAt(0);
  				model.anchor.node = line;
  				model.anchor.offset = 0;
  				model.path = [];model.path.push({nodeName: "root"});
  				model.path.push({nodeName: "line", offset: 1});
  				model.removeRight();
  				var focusNode = model.getFocusNode();
  				t.is("/root/line[1]/math[1]", model.getPath());
  				t.is("math", focusNode.nodeName);
  				t.is(0, model.getOffset());
  				t.is(1, model.getLineCount());
  			},
  			tearDown: function(){
  				
  			}
	    },{
	    	name: "有两行，第一行最后一个节点是text节点，第二行的第一个节点是text节点，光标在第一行末尾，" +
	    			"执行右删除后，将第一行最后的text与第二行的第一个text合并，删除第二行空行",
  			setUp: function(){
  				this.model = new Model({});
  			},
  			runTest: function(t){
  				var model = this.model;
  				model.loadData("<root>" +
  						"<line><text>abc</text></line>" +
  						"<line><text>de</text></line>" +
  				"</root>");
  				var line = model.getLineAt(0);
  				model.anchor.node = line.firstChild;
  				model.anchor.offset = 3;
  				model.path = [];model.path.push({nodeName: "root"});
  				model.path.push({nodeName: "line", offset: 1});
  				model.path.push({nodeName: "text", offset: 1});
  				model.removeRight();
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
	    	name: "有两行，第一行最后一个节点是text节点，第二行的第一个节点是math节点，光标在第一行末尾，" +
	    			"执行右删除后，将第二行的所有节点都移到第一行，删除第二行空行",
  			setUp: function(){
  				this.model = new Model({});
  			},
  			runTest: function(t){
  				var model = this.model;
  				model.loadData("<root>" +
  						"<line><text>abc</text></line>" +
  						"<line><math><mn>12</mn></math></line>" +
  				"</root>");
  				var line = model.getLineAt(0);
  				model.anchor.node = line.firstChild;
  				model.anchor.offset = 3;
  				model.path = [];model.path.push({nodeName: "root"});
  				model.path.push({nodeName: "line", offset: 1});
  				model.path.push({nodeName: "text", offset: 1});
  				model.removeRight();
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
	    	name: "有两行，第一行最后一个节点是math节点，第二行的第一个节点是text节点，光标在第一行末尾，" +
	    			"执行右删除后，将第二行的所有节点都移到第一行，删除第二行空行",
  			setUp: function(){
  				this.model = new Model({});
  			},
  			runTest: function(t){
  				var model = this.model;
  				model.loadData("<root>" +
  						"<line><math><mn>12</mn></math></line>" +
  						"<line><text>abc</text><math><mn>34</mn></math></line>" +
  				"</root>");
  				var line = model.getLineAt(0);
  				model.anchor.node = line.firstChild;
  				model.anchor.offset = 1;
  				model.path = [];model.path.push({nodeName: "root"});
  				model.path.push({nodeName: "line", offset: 1});
  				model.path.push({nodeName: "math", offset: 1});
  				model.removeRight();
  				var focusNode = model.getFocusNode();
  				t.is("/root/line[1]/math[1]", model.getPath());
  				t.is("math", focusNode.nodeName);
  				t.is(1, model.getOffset());
  				t.is(1, model.getLineCount());
  				t.is(3, model.getLineAt(0).childNodes.length);
  			},
  			tearDown: function(){
  				
  			}
	    },{
	    	name: "有两行，第一行最后一个节点是math节点，第二行的第一个节点是math节点，光标在第一行末尾，" +
	    			"执行右删除后，将第二行的所有节点都移到第一行，删除第二行空行",
			setUp: function(){
				this.model = new Model({});
			},
			runTest: function(t){
				var model = this.model;
				model.loadData("<root>" +
						"<line><math><mn>12</mn></math></line>" +
						"<line><math><mn>34</mn></math></line>" +
				"</root>");
				var line = model.getLineAt(0);
				model.anchor.node = line.firstChild;
				model.anchor.offset = 1;
				model.path = [];model.path.push({nodeName: "root"});
				model.path.push({nodeName: "line", offset: 1});
				model.path.push({nodeName: "math", offset: 1});
				model.removeRight();
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