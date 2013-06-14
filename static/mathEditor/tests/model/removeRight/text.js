define([ "doh", "mathEditor/Model", "mathEditor/lang" ], function(doh, Model, dripLang) {

	// summary:
	//		1.text节点中有3个字符，光标在第一个字符前面
	//		2.text节点中有3个字符，光标在第二个字符前面
	//		3.text节点中有3个字符，光标在第三个字符前面
	//		4.text节点后没有节点，text节点中只有一个字符，光标在第一个字符的前面，删除text节点
	//		5.text节点后有一个math节点，text节点中只有一个字符，光标在第一个字符的前面，删除text节点
	doh.register("Model.removeRight.text 右删除文本",[
	    {
	    	name: "text节点中有3个字符，光标在第一个字符前面",
  			setUp: function(){
  				this.model = new Model({});
  			},
  			runTest: function(t){
  				var model = this.model;
  				model.loadData("<root><line><text>abc</text></line></root>");
  				var line = model.getLineAt(0);
  				model.anchor.node = line.firstChild;
  				model.anchor.offset = 0;
  				model.path = [];model.path.push({nodeName: "root"});
  				model.path.push({nodeName: "line", offset: 1});
  				model.path.push({nodeName: "text", offset: 1});
  				var removed = model.removeRight();
  				var focusNode = model.getFocusNode();
  				t.is("a", removed);
  				t.is("/root/line[1]/text[1]", model.getPath());
  				t.is("text", focusNode.nodeName);
  				t.is(0, model.getOffset());
  				t.is("bc", dripLang.getText(focusNode));
  			},
  			tearDown: function(){
  				
  			}
	    },{
	    	name: "text节点中有3个字符，光标在第二个字符前面",
  			setUp: function(){
  				this.model = new Model({});
  			},
  			runTest: function(t){
  				var model = this.model;
  				model.loadData("<root><line><text>abc</text></line></root>");
  				var line = model.getLineAt(0);
  				model.anchor.node = line.firstChild;
  				model.anchor.offset = 1;
  				model.path = [];model.path.push({nodeName: "root"});
  				model.path.push({nodeName: "line", offset: 1});
  				model.path.push({nodeName: "text", offset: 1});
  				var removed = model.removeRight();
  				var focusNode = model.getFocusNode();
  				t.is("b", removed);
  				t.is("/root/line[1]/text[1]", model.getPath());
  				t.is("text", focusNode.nodeName);
  				t.is(1, model.getOffset());
  				t.is("ac", dripLang.getText(focusNode));
  			},
  			tearDown: function(){
  				
  			}
	    },{
	    	name: "text节点中有3个字符，光标在第三个字符前面",
  			setUp: function(){
  				this.model = new Model({});
  			},
  			runTest: function(t){
  				var model = this.model;
  				model.loadData("<root><line><text>abc</text></line></root>");
  				var line = model.getLineAt(0);
  				model.anchor.node = line.firstChild;
  				model.anchor.offset = 2;
  				model.path = [];model.path.push({nodeName: "root"});
  				model.path.push({nodeName: "line", offset: 1});
  				model.path.push({nodeName: "text", offset: 1});
  				var removed = model.removeRight();
  				var focusNode = model.getFocusNode();
  				t.is("c", removed);
  				t.is("/root/line[1]/text[1]", model.getPath());
  				t.is("text", focusNode.nodeName);
  				t.is(2, model.getOffset());
  				t.is("ab", dripLang.getText(focusNode));
  			},
  			tearDown: function(){
  				
  			}
	    },{
	    	name: "text节点后没有节点，text节点中只有一个字符，光标在第一个字符的前面，删除text节点",
  			setUp: function(){
  				this.model = new Model({});
  			},
  			runTest: function(t){
  				var model = this.model;
  				model.loadData("<root><line><text>a</text></line></root>");
  				var line = model.getLineAt(0);
  				model.anchor.node = line.firstChild;
  				model.anchor.offset = 0;
  				model.path = [];model.path.push({nodeName: "root"});
  				model.path.push({nodeName: "line", offset: 1});
  				model.path.push({nodeName: "text", offset: 1});
  				var removed = model.removeRight();
  				var focusNode = model.getFocusNode();
  				t.is("a", removed);
  				t.is("/root/line[1]", model.getPath());
  				t.is("line", focusNode.nodeName);
  				t.is(0, model.getOffset());
  				t.is(0, focusNode.childNodes.length);
  			},
  			tearDown: function(){
  				
  			}
	    },{
	    	// FIXME:将节点删除后，是聚焦到前一个节点后面，还是聚焦到后一个节点的前面？
	    	name: "text节点后有一个math节点，text节点中只有一个字符，光标在第一个字符的前面，删除text节点",
  			setUp: function(){
  				this.model = new Model({});
  			},
  			runTest: function(t){
  				var model = this.model;
  				model.loadData("<root><line><text>a</text><math><mn>1</mn></math></line></root>");
  				var line = model.getLineAt(0);
  				model.anchor.node = line.firstChild;
  				model.anchor.offset = 0;
  				model.path = [];model.path.push({nodeName: "root"});
  				model.path.push({nodeName: "line", offset: 1});
  				model.path.push({nodeName: "text", offset: 1});
  				var removed = model.removeRight();
  				var focusNode = model.getFocusNode();
  				t.is("a", removed);
  				t.is("/root/line[1]/math[1]", model.getPath());
  				t.is("math", focusNode.nodeName);
  				t.is(0, model.getOffset());
  				t.is(1, line.childNodes.length);
  			},
  			tearDown: function(){
  				
  			}
	    }
	                             
	]);
});