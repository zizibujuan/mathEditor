define([ "doh","mathEditor/Model" ], function(doh,Model) {

	// anchor中只有一个offset值还不够，需要一个标识选中状态的信息，选中的起始和结束节点必须在同一个层级上。
	// math的offset=0，表示在math前，此时已到math外，已光标子math前的text节点最后是一样的。
	// 进入到math里面，才是mathml模式，offset为0或1，都是text模式，已离开math节点
	//
	doh.register("Model.moveRight.math",[
	    {
	    	name: "从math节点前，math前没有任何节点，向右往math内层移动，移到token节点内容前面",
  			setUp: function(){
  				this.model = new Model({});
  			},
  			runTest: function(t){
  				var model = this.model;
  				model.loadData("<root><line><math><mn>12</mn></math></line></root>");
  				model.mode = "text";
  				var line = model.getLineAt(0);
  				model.anchor.node = line.firstChild;
  				model.anchor.offset = 0;
  				model.path.push({nodeName: "root"});
  				model.path.push({nodeName: "line", offset: 1});
  				model.path.push({nodeName: "math", offset: 1});
  				model.moveRight();
  				// 直接移到token节点的内容后面。
  				t.is("/root/line[1]/math[1]/mn[1]", model.getPath());
  				var focusNode = model.getFocusNode();
  				t.is("mn", focusNode.nodeName);
  				t.is(0, model.getOffset());
  				t.t(model.isMathMLMode());
  			},
  			tearDown: function(){
  				
  			}
	    },{
	    	name: "从math节点前，math前有一个text节点，向右往math内层移动，移到token节点内容的前面",
  			setUp: function(){
  				this.model = new Model({});
  			},
  			runTest: function(t){
  				var model = this.model;
  				model.loadData("<root><line><text>123</text><math><mn>12</mn></math></line></root>");
  				model.mode = "text";
  				var line = model.getLineAt(0);
  				model.anchor.node = line.firstChild;
  				model.anchor.offset = 3;
  				model.path.push({nodeName: "root"});
  				model.path.push({nodeName: "line", offset: 1});
  				model.path.push({nodeName: "text", offset: 1});
  				model.moveRight();
  				
  				t.is("/root/line[1]/math[2]/mn[1]", model.getPath());
  				var focusNode = model.getFocusNode();
  				t.is("mn", focusNode.nodeName);
  				t.is(0, model.getOffset());
  				t.t(model.isMathMLMode());
  			},
  			tearDown: function(){
  				
  			}
	    },{
	    	name: "从math节点前，math前没有节点，向右往math内层移动,移到layout节点前面，layout节点外没有mstyle节点。",
  			setUp: function(){
  				this.model = new Model({});
  			},
  			runTest: function(t){
  				var model = this.model;
  				model.loadData("<root><line><math><mfrac><mrow><mn>1</mn></mrow><mrow><mn>2</mn></mrow></mfrac></math></line></root>");
  				model.mode = "text";
  				var line = model.getLineAt(0);
  				model.anchor.node = line.firstChild;
  				model.anchor.offset = 0;
  				model.path.push({nodeName: "root"});
  				model.path.push({nodeName: "line", offset: 1});
  				model.path.push({nodeName: "math", offset: 1});
  				model.moveRight();
  				// 直接移到layout节点的内容后面。
  				t.is("/root/line[1]/math[1]/mfrac[1]", model.getPath());
  				var focusNode = model.getFocusNode();
  				t.is("mfrac", focusNode.nodeName);
  				t.is(0, model.getOffset());
  				t.t(model.isMathMLMode());
  			},
  			tearDown: function(){
  				
  			}
	    },{
	    	name: "从math节点前，math前有一个text节点，向右往math内层移动,移到layout节点前面，layout节点外没有mstyle节点。",
  			setUp: function(){
  				this.model = new Model({});
  			},
  			runTest: function(t){
  				var model = this.model;
  				model.loadData("<root><line><text>123</text><math><mfrac><mrow><mn>1</mn></mrow><mrow><mn>2</mn></mrow></mfrac></math></line></root>");
  				model.mode = "text";
  				var line = model.getLineAt(0);
  				model.anchor.node = line.firstChild;
  				model.anchor.offset = 3;
  				model.path.push({nodeName: "root"});
  				model.path.push({nodeName: "line", offset: 1});
  				model.path.push({nodeName: "text", offset: 1});
  				model.moveRight();
  				// 直接移到layout节点的内容后面。
  				t.is("/root/line[1]/math[2]/mfrac[1]", model.getPath());
  				var focusNode = model.getFocusNode();
  				t.is("mfrac", focusNode.nodeName);
  				t.is(0, model.getOffset());
  				t.t(model.isMathMLMode());
  			},
  			tearDown: function(){
  				
  			}
	    },{
	    	name: "从math节点前，向右往math内层移动,移到layout节点前面，layout节点外有mstyle节点。",
  			setUp: function(){
  				this.model = new Model({});
  			},
  			runTest: function(t){
  				var model = this.model;
  				model.loadData("<root><line><math><mstyle displaystyle='true'><mfrac><mrow><mn>1</mn></mrow><mrow><mn>2</mn></mrow></mfrac></mstyle></math></line></root>");
  				model.mode = "text";
  				var line = model.getLineAt(0);
  				model.anchor.node = line.firstChild;
  				model.anchor.offset = 0;
  				model.path.push({nodeName: "root"});
  				model.path.push({nodeName: "line", offset: 1});
  				model.path.push({nodeName: "math", offset: 1});
  				model.moveRight();
  				t.is("/root/line[1]/math[1]/mfrac[1]", model.getPath());
  				var focusNode = model.getFocusNode();
  				t.is("mfrac", focusNode.nodeName);
  				t.is(0, model.getOffset());
  				t.t(model.isMathMLMode());
  			},
  			tearDown: function(){
  				
  			}
	    },{
	    	name: "向右移出math，从math节点的最后一个token的内容最后面，向右往math外层移动,math后没有任何节点。",
  			setUp: function(){
  				this.model = new Model({});
  			},
  			runTest: function(t){
  				var model = this.model;
  				model.loadData("<root><line><math><mn>12</mn></math></line></root>");
  				model.mode = "mathml";
  				var line = model.getLineAt(0);
  				model.anchor.node = line.lastChild.lastChild;
  				model.anchor.offset = 2;
  				model.path.push({nodeName: "root"});
  				model.path.push({nodeName: "line", offset: 1});
  				model.path.push({nodeName: "math", offset: 1});
  				model.path.push({nodeName: "mn", offset: 1});
  				model.moveRight();
  				t.is("/root/line[1]/math[1]", model.getPath());
  				var focusNode = model.getFocusNode();
  				t.is("math", focusNode.nodeName);
  				t.is(1, model.getOffset());
  				t.t(model.isTextMode());
  			},
  			tearDown: function(){
  				
  			}
	    },{
	    	name: "向右移出math，从math节点的最后一个layout的节点最后面，向右往math外层移动,layout节点外没有mstyle节点。",
  			setUp: function(){
  				this.model = new Model({});
  			},
  			runTest: function(t){
  				var model = this.model;
  				model.loadData("<root><line><math><mfrac><mrow><mn>1</mn></mrow><mrow><mn>2</mn></mrow></mfrac></math></line></root>");
  				model.mode = "mathml";
  				var line = model.getLineAt(0);
  				model.anchor.node = line.lastChild.lastChild;
  				model.anchor.offset = 1;
  				model.path.push({nodeName: "root"});
  				model.path.push({nodeName: "line", offset: 1});
  				model.path.push({nodeName: "math", offset: 1});
  				model.path.push({nodeName: "mfrac", offset: 1});
  				model.moveRight();
  				t.is("/root/line[1]/math[1]", model.getPath());
  				var focusNode = model.getFocusNode();
  				t.is("math", focusNode.nodeName);
  				t.is(1, model.getOffset());
  				t.t(model.isTextMode());
  			},
  			tearDown: function(){
  				
  			}
	    },{
	    	name: "向右移出math，从math节点的最后一个layout的节点最后面，向右往math外层移动,layout节点外有mstyle节点。",
  			setUp: function(){
  				this.model = new Model({});
  			},
  			runTest: function(t){
  				var model = this.model;
  				model.loadData("<root><line><math><mstyle displaystyle='true'><mfrac><mrow><mn>1</mn></mrow><mrow><mn>2</mn></mrow></mfrac></mstyle></math></line></root>");
  				model.mode = "mathml";
  				var line = model.getLineAt(0);
  				model.anchor.node = line.lastChild.lastChild.lastChild;
  				model.anchor.offset = 1;
  				model.path.push({nodeName: "root"});
  				model.path.push({nodeName: "line", offset: 1});
  				model.path.push({nodeName: "math", offset: 1});
  				model.path.push({nodeName: "mfrac", offset: 1});
  				model.moveRight();
  				t.is("/root/line[1]/math[1]", model.getPath());
  				var focusNode = model.getFocusNode();
  				t.is("math", focusNode.nodeName);
  				t.is(1, model.getOffset());
  				t.t(model.isTextMode());
  			},
  			tearDown: function(){
  				
  			}
	    },{
	    	name: "从math节点后，移到后面的text节点前",
  			setUp: function(){
  				this.model = new Model({});
  			},
  			runTest: function(t){
  				var model = this.model;
  				model.loadData("<root><line><math><mn>12</mn></math><text>12</text></line></root>");
  				model.mode = "text";
  				var line = model.getLineAt(0);
  				model.anchor.node = line.firstChild;
  				model.anchor.offset = 1;
  				model.path.push({nodeName: "root"});
  				model.path.push({nodeName: "line", offset: 1});
  				model.path.push({nodeName: "math", offset: 1});
  				model.moveRight();
  				// 直接移到token节点的内容后面。
  				t.is("/root/line[1]/text[2]", model.getPath());
  				var focusNode = model.getFocusNode();
  				t.is("text", focusNode.nodeName);
  				t.is(1, model.getOffset());
  				t.t(model.isTextMode());
  			},
  			tearDown: function(){
  				
  			}
	    }
	                             
	]);
});