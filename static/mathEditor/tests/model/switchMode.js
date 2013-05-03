define([ "doh","mathEditor/Model" ], function(doh,Model) {

	var layoutOffset = {before:0, after:1, select:2 /*当前节点处于选中状态*/};
	// summary:
	//		在mathml和text两个模式之间切换。
	//		从text模式切换到mathml模式：
	//		1.line中没有任何内容，则在line中插入一个math节点
	//		2.光标在text的前面，offset==0，则在text前面插入math节点
	//		3.光标在text的后面，offset==contentLength，则在text后面插入math节点
	//		4.光标在text的中间，0 < offset < contentLength，则将text拆分为两个text，并在其间插入math节点
	//		从mathml模式切换到text模式：
	//		1.如果math中没有内容，则删除math节点，line中只有一个math节点
	//		2.如果math中没有内容，则删除math节点，math前没有节点,后面有一个text节点
	//		3.如果math中没有内容，则删除math节点，math前没有节点,后面有一个layout节点
	//		4.如果math中没有内容，则删除math节点，math前是一个text节点
	//		5.如果math中没有内容，则删除math节点，math前是一个math节点
	//		6.如果math中有内容，则将光标放在math之后，即offset=1
	doh.register("Model.switchMode",[
	    {
	    	name: "从text模式切换到mathml模式，line中没有任何内容，则在line中插入一个math节点。",
  			setUp: function(){
  				this.model = new Model({});
  			},
  			runTest: function(t){
  				var model = this.model;
  				model.loadData("<root><line></line></root>");
  				model.mode = "text";
  				var line = model.getLineAt(0);
  				model.anchor.node = line;
  				model.anchor.offset = 0;
  				model.path.push({nodeName:"root"});
  				model.path.push({nodeName:"line", offset:1});
  				
  				model.switchMode();
  				var focusNode = model.getFocusNode();
  				t.t(model.isMathMLMode());
  				t.is("math", focusNode.nodeName);
  				t.is(layoutOffset.select, model.getOffset());
  				t.is("/root/line[1]/math[1]", model.getPath());
  				t.is(1, line.childNodes.length);
  			},
  			tearDown: function(){
  				
  			}
	    },{
	    	name: "从text模式切换到mathml模式，光标在text的前面，offset==0，则在text前面插入math节点。",
  			setUp: function(){
  				this.model = new Model({});
  			},
  			runTest: function(t){
  				var model = this.model;
  				model.loadData("<root><line><text>abc</text></line></root>");
  				model.mode = "text";
  				var line = model.getLineAt(0);
  				model.anchor.node = line.firstChild;
  				model.anchor.offset = 0;
  				model.path.push({nodeName:"root"});
  				model.path.push({nodeName:"line", offset:1});
  				model.path.push({nodeName:"text", offset:1});
  				
  				model.switchMode();
  				var focusNode = model.getFocusNode();
  				t.t(model.isMathMLMode());
  				t.is("math", focusNode.nodeName);
  				t.is(layoutOffset.select, model.getOffset());
  				t.is("/root/line[1]/math[1]", model.getPath());
  				t.is(2, line.childNodes.length);
  			},
  			tearDown: function(){
  				
  			}
	    },{
	    	name: "从text模式切换到mathml模式，光标在text的后面，offset==contentLength，则在text后面插入math节点。",
  			setUp: function(){
  				this.model = new Model({});
  			},
  			runTest: function(t){
  				var model = this.model;
  				model.loadData("<root><line><text>abc</text></line></root>");
  				model.mode = "text";
  				var line = model.getLineAt(0);
  				model.anchor.node = line.firstChild;
  				model.anchor.offset = 3;
  				model.path.push({nodeName:"root"});
  				model.path.push({nodeName:"line", offset:1});
  				model.path.push({nodeName:"text", offset:1});
  				
  				model.switchMode();
  				var focusNode = model.getFocusNode();
  				t.t(model.isMathMLMode());
  				t.is("math", focusNode.nodeName);
  				t.is(layoutOffset.select, model.getOffset());
  				t.is("/root/line[1]/math[2]", model.getPath());
  				t.is(2, line.childNodes.length);
  			},
  			tearDown: function(){
  				
  			}
	    },{
	    	name: "从text模式切换到mathml模式，光标在text的中间，0 < offset < contentLength，则将text拆分为两个text，并在其间插入math节点。",
  			setUp: function(){
  				this.model = new Model({});
  			},
  			runTest: function(t){
  				var model = this.model;
  				model.loadData("<root><line><text>abc</text></line></root>");
  				model.mode = "text";
  				var line = model.getLineAt(0);
  				model.anchor.node = line.firstChild;
  				model.anchor.offset = 1;
  				model.path.push({nodeName:"root"});
  				model.path.push({nodeName:"line", offset:1});
  				model.path.push({nodeName:"text", offset:1});
  				
  				model.switchMode();
  				var focusNode = model.getFocusNode();
  				t.t(model.isMathMLMode());
  				t.is("math", focusNode.nodeName);
  				t.is(layoutOffset.select, model.getOffset());
  				t.is("/root/line[1]/math[2]", model.getPath());
  				t.is(3, line.childNodes.length);
  				t.is("text", line.childNodes[0].nodeName);
  				t.is("math", line.childNodes[1].nodeName);
  				t.is("text", line.childNodes[2].nodeName);
  			},
  			tearDown: function(){
  				
  			}
	    },{
	    	name: "从mathml模式切换到text模式，如果math中没有内容，则删除math节点，line中只有一个math节点。",
  			setUp: function(){
  				this.model = new Model({});
  			},
  			runTest: function(t){
  				var model = this.model;
  				model.loadData("<root><line><math></math></line></root>");
  				model.mode = "mathml";
  				var line = model.getLineAt(0);
  				model.anchor.node = line.firstChild;
  				model.anchor.offset = layoutOffset.select;
  				model.path.push({nodeName:"root"});
  				model.path.push({nodeName:"line", offset:1});
  				model.path.push({nodeName:"math", offset:1});
  				
  				model.switchMode();
  				var focusNode = model.getFocusNode();
  				t.t(model.isTextMode());
  				t.is("line", focusNode.nodeName);
  				t.is(0, model.getOffset());
  				t.is("/root/line[1]", model.getPath());
  				t.is(0, line.childNodes.length);
  			},
  			tearDown: function(){
  				
  			}
	    },{
	    	name: "从mathml模式切换到text模式，如果math中没有内容，则删除math节点，math前没有节点,后面有一个text节点。",
  			setUp: function(){
  				this.model = new Model({});
  			},
  			runTest: function(t){
  				var model = this.model;
  				model.loadData("<root><line><math></math><text>abc</text></line></root>");
  				model.mode = "mathml";
  				var line = model.getLineAt(0);
  				model.anchor.node = line.firstChild;
  				model.anchor.offset = layoutOffset.select; // 不管有没有选中
  				model.path.push({nodeName:"root"});
  				model.path.push({nodeName:"line", offset:1});
  				model.path.push({nodeName:"math", offset:1});
  				
  				model.switchMode();
  				var focusNode = model.getFocusNode();
  				t.t(model.isTextMode());
  				t.is("text", focusNode.nodeName);
  				t.is(0, model.getOffset());
  				t.is("/root/line[1]/text[1]", model.getPath());
  				t.is(1, line.childNodes.length);
  			},
  			tearDown: function(){
  				
  			}
	    },{
	    	name: "从mathml模式切换到text模式，如果math中没有内容，则删除math节点，math前没有节点,后面有一个layout节点。",
  			setUp: function(){
  				this.model = new Model({});
  			},
  			runTest: function(t){
  				var model = this.model;
  				model.loadData("<root><line><math></math><math><msqrt><mrow><mn>1</mn></mrow></msqrt></math></line></root>");
  				model.mode = "mathml";
  				var line = model.getLineAt(0);
  				model.anchor.node = line.firstChild;
  				model.anchor.offset = layoutOffset.select; // 不管有没有选中
  				model.path.push({nodeName:"root"});
  				model.path.push({nodeName:"line", offset:1});
  				model.path.push({nodeName:"math", offset:1});
  				
  				model.switchMode();
  				var focusNode = model.getFocusNode();
  				t.t(model.isTextMode());
  				t.is("math", focusNode.nodeName);
  				t.is(0, model.getOffset());
  				t.is("/root/line[1]/math[1]", model.getPath());
  				t.is(1, line.childNodes.length);
  			},
  			tearDown: function(){
  				
  			}
	    },{
	    	name: "从mathml模式切换到text模式，如果math中没有内容，则删除math节点，math前是一个text节点。",
  			setUp: function(){
  				this.model = new Model({});
  			},
  			runTest: function(t){
  				var model = this.model;
  				model.loadData("<root><line><text>abc</text><math></math></line></root>");
  				model.mode = "mathml";
  				var line = model.getLineAt(0);
  				model.anchor.node = line.lastChild;
  				model.anchor.offset = layoutOffset.select; // 不管有没有选中
  				model.path.push({nodeName:"root"});
  				model.path.push({nodeName:"line", offset:1});
  				model.path.push({nodeName:"math", offset:2});
  				
  				model.switchMode();
  				var focusNode = model.getFocusNode();
  				t.t(model.isTextMode());
  				t.is("text", focusNode.nodeName);
  				t.is(3, model.getOffset());
  				t.is("abc", focusNode.textContent);
  				t.is("/root/line[1]/text[1]", model.getPath());
  				t.is(1, line.childNodes.length);
  			},
  			tearDown: function(){
  				
  			}
	    },{
	    	name: "从mathml模式切换到text模式，如果math中有内容，则将光标放在math之后，即offset=1。",
  			setUp: function(){
  				this.model = new Model({});
  			},
  			runTest: function(t){
  				var model = this.model;
  				model.loadData("<root><line><math><mn>123</mn></math></line></root>");
  				model.mode = "mathml";
  				var line = model.getLineAt(0);
  				model.anchor.node = line.firstChild.firstChild;
  				model.anchor.offset = 2;
  				model.path.push({nodeName:"root"});
  				model.path.push({nodeName:"line", offset:1});
  				model.path.push({nodeName:"math", offset:1});
  				model.path.push({nodeName:"mn", offset:1});
  				
  				model.switchMode();
  				var focusNode = model.getFocusNode();
  				t.t(model.isTextMode());
  				t.is("math", focusNode.nodeName);
  				t.is(layoutOffset.after, model.getOffset());
  				t.is("/root/line[1]/math[1]", model.getPath());
  				t.is(1, line.childNodes.length);
  			},
  			tearDown: function(){
  				
  			}
	    }
                    
	]);
});