define([ "doh","mathEditor/Model" ], function(doh,Model) {

	// summary
	//		这里的测试逻辑有：
	//		1.在空的分数下
	//			由分数后面移到分母上
	//			由分母上移到分子上
	//			由分子移到分数前面
	//		2.涉及到两种模式之间的切换
	//			由text节点左移到math节点上
	//			由math节点左移到text节点上
	doh.register("Model.moveLeft.frac frac在分数之间左移光标",[
	    {
	    	name: "mathml模式下，由分数后面左移到分母上，当分母上最后一个元素是token节点时",
  			setUp: function(){
  				this.model = new Model({});
  			},
  			runTest: function(t){
  				var model = this.model;
  				model.mode = "mathml";
  				model.loadData("<root><line><math><mstyle><mfrac><mrow><mn>1</mn></mrow><mrow><mn>22</mn></mrow></mfrac></mstyle></math></line></root>");
  				var line = model.getLineAt(0);
  				model.anchor.node = line.lastChild.lastChild.lastChild;
  				model.anchor.offset = 1;
  				model.path = [];model.path.push({nodeName: "root"});
  				model.path.push({nodeName: "line", offset: 1});
  				model.path.push({nodeName: "math", offset: 1});
  				model.path.push({nodeName: "mfrac", offset: 1});
  				model.moveLeft();
  				t.is("/root/line[1]/math[1]/mfrac[1]/mrow[2]/mn[1]", model.getPath());
				var node = model.getFocusNode();
				t.t(node.parentNode.nextSibling == null); // 证明是分母。
				t.is("mn", node.nodeName);
				t.is(2, model.getOffset());
				t.is("22", node.textContent);
  			},
  			tearDown: function(){
  				
  			}
	    },{
	    	name: "mathml模式下，由分数后面左移到分母上，当分母上最后一个元素是layout节点时",
  			setUp: function(){
  				this.model = new Model({});
  			},
  			runTest: function(t){
  				var model = this.model;
  				model.mode = "mathml";
  				model.loadData("<root><line><math><mstyle><mfrac><mrow><mn>1</mn></mrow><mrow><mstyle><mfrac><mrow><mn>22</mn></mrow><mrow><mn>33</mn></mrow></mfrac></mstyle></mrow></mfrac></mstyle></math></line></root>");
  				var line = model.getLineAt(0);
  				model.anchor.node = line.lastChild.lastChild.lastChild;
  				model.anchor.offset = 1;
  				model.path = [];model.path.push({nodeName: "root"});
  				model.path.push({nodeName: "line", offset: 1});
  				model.path.push({nodeName: "math", offset: 1});
  				model.path.push({nodeName: "mfrac", offset: 1});
  				model.moveLeft();
  				t.is("/root/line[1]/math[1]/mfrac[1]/mrow[2]/mfrac[1]", model.getPath());
				var node = model.getFocusNode();
				t.t(node.parentNode.nextSibling == null); // 证明是分母。
				t.is("mfrac", node.nodeName);
				t.is(1, model.getOffset());
  			},
  			tearDown: function(){
  				
  			}
	    },{
	    	name: "mathml模式下，执行左移，从分母最前面移到分子最后面，分母首节点是token节点，分子尾节点是token节点",
	    	setUp: function(){
  				this.model = new Model({});
  			},
  			runTest: function(t){
  				var model = this.model;
  				model.mode = "mathml";
  				model.loadData("<root><line>" +
  						"<math>" +
	  						"<mstyle>" +
		  						"<mfrac>" +
			  						"<mrow><mn>11</mn></mrow>" +
			  						"<mrow><mn>22</mn></mrow>" +
		  						"</mfrac>" +
	  						"</mstyle>" +
  						"</math>" +
  				"</line></root>");
  				var line = model.getLineAt(0);
  				model.anchor.node = line.lastChild.lastChild.lastChild.lastChild.firstChild;
  				model.anchor.offset = 0;
  				model.path = [];model.path.push({nodeName: "root"});
  				model.path.push({nodeName: "line", offset: 1});
  				model.path.push({nodeName: "math", offset: 1});
  				model.path.push({nodeName: "mfrac", offset: 1});
  				model.path.push({nodeName: "mrow", offset: 2});
  				model.path.push({nodeName: "mn", offset: 1});
  				model.moveLeft();
  				t.is("/root/line[1]/math[1]/mfrac[1]/mrow[1]/mn[1]", model.getPath());
				var node = model.getFocusNode();
				t.t(node.parentNode.previousSibling == null); // 证明是分子。
				t.is("mn", node.nodeName);
				t.is(2, model.getOffset());
				t.is("11", node.textContent);
  			},
  			tearDown: function(){
  				
  			}
	    },{
	    	name: "mathml模式下，执行左移，从分母最前面移到分子最后面，分母首节点是token节点，分子尾节点是layout节点",
	    	setUp: function(){
  				this.model = new Model({});
  			},
  			runTest: function(t){
  				var model = this.model;
  				model.mode = "mathml";
  				model.loadData("<root><line>" +
  						"<math>" +
	  						"<mstyle>" +
		  						"<mfrac>" +
			  						"<mrow><mstyle><mfrac><mrow><mn>123</mn></mrow><mrow><mn>456</mn></mrow></mfrac></mstyle></mrow>" +
			  						"<mrow><mn>22</mn></mrow>" +
		  						"</mfrac>" +
	  						"</mstyle>" +
  						"</math>" +
  				"</line></root>");
  				var line = model.getLineAt(0);
  				model.anchor.node = line.lastChild.lastChild.lastChild.lastChild.firstChild;
  				model.anchor.offset = 0;
  				model.path = [];model.path.push({nodeName: "root"});
  				model.path.push({nodeName: "line", offset: 1});
  				model.path.push({nodeName: "math", offset: 1});
  				model.path.push({nodeName: "mfrac", offset: 1});
  				model.path.push({nodeName: "mrow", offset: 2});
  				model.path.push({nodeName: "mn", offset: 1});
  				model.moveLeft();
  				t.is("/root/line[1]/math[1]/mfrac[1]/mrow[1]/mfrac[1]", model.getPath());
				var node = model.getFocusNode();
				t.t(node.parentNode.previousSibling == null); // 证明是分子。
				t.is("mfrac", node.nodeName);
				t.is(1, model.getOffset());
  			},
  			tearDown: function(){
  				
  			}
	    },{
	    	name: "mathml模式下，执行左移，从分母最前面移到分子最后面，分母首节点是layout节点，分子尾节点是token节点",
	    	setUp: function(){
  				this.model = new Model({});
  			},
  			runTest: function(t){
  				var model = this.model;
  				model.mode = "mathml";
  				model.loadData("<root><line>" +
  						"<math>" +
	  						"<mstyle>" +
		  						"<mfrac>" +
			  						"<mrow><mn>22</mn></mrow>" +
			  						"<mrow><mstyle><mfrac><mrow><mn>123</mn></mrow><mrow><mn>456</mn></mrow></mfrac></mstyle></mrow>" +
		  						"</mfrac>" +
	  						"</mstyle>" +
  						"</math>" +
  				"</line></root>");
  				var line = model.getLineAt(0);
  				model.anchor.node = line.lastChild.lastChild.lastChild.lastChild.firstChild.firstChild;
  				model.anchor.offset = 0;
  				model.path = [];model.path.push({nodeName: "root"});
  				model.path.push({nodeName: "line", offset: 1});
  				model.path.push({nodeName: "math", offset: 1});
  				model.path.push({nodeName: "mfrac", offset: 1});
  				model.path.push({nodeName: "mrow", offset: 2});
  				model.path.push({nodeName: "mfrac", offset: 1});
  				model.moveLeft();
  				t.is("/root/line[1]/math[1]/mfrac[1]/mrow[1]/mn[1]", model.getPath());
				var node = model.getFocusNode();
				t.t(node.parentNode.previousSibling == null); // 证明是分子。
				t.is("mn", node.nodeName);
				t.is(2, model.getOffset());
  			},
  			tearDown: function(){
  				
  			}
	    },{
	    	name: "mathml模式下，执行左移，从分母最前面移到分子最后面，分母首节点是layout节点，分子尾节点是layout节点",
	    	setUp: function(){
  				this.model = new Model({});
  			},
  			runTest: function(t){
  				var model = this.model;
  				model.mode = "mathml";
  				model.loadData("<root><line>" +
  						"<math>" +
	  						"<mstyle>" +
		  						"<mfrac>" +
			  						"<mrow><mstyle><mfrac><mrow><mn>111</mn></mrow><mrow><mn>222</mn></mrow></mfrac></mstyle></mrow>" +
			  						"<mrow><mstyle><mfrac><mrow><mn>123</mn></mrow><mrow><mn>456</mn></mrow></mfrac></mstyle></mrow>" +
		  						"</mfrac>" +
	  						"</mstyle>" +
  						"</math>" +
  				"</line></root>");
  				var line = model.getLineAt(0);
  				model.anchor.node = line.lastChild.lastChild.lastChild.lastChild.firstChild.firstChild;
  				model.anchor.offset = 0;
  				model.path = [];model.path.push({nodeName: "root"});
  				model.path.push({nodeName: "line", offset: 1});
  				model.path.push({nodeName: "math", offset: 1});
  				model.path.push({nodeName: "mfrac", offset: 1});
  				model.path.push({nodeName: "mrow", offset: 2});
  				model.path.push({nodeName: "mfrac", offset: 1});
  				model.moveLeft();
  				t.is("/root/line[1]/math[1]/mfrac[1]/mrow[1]/mfrac[1]", model.getPath());
				var node = model.getFocusNode();
				t.t(node.parentNode.previousSibling == null); // 证明是分子。
				t.is("mfrac", node.nodeName);
				t.is(1, model.getOffset());
  			},
  			tearDown: function(){
  				
  			}
	    },{
	    	name: "mathml模式下，由分子前左移到分数前，当分子上的第一个元素是token节点时",
  			setUp: function(){
  				this.model = new Model({});
  			},
  			runTest: function(t){
  				var model = this.model;
  				model.mode = "mathml";
  				model.loadData("<root><line>" +
  						"<math>" +
	  						"<mstyle>" +
		  						"<mfrac>" +
			  						"<mrow><mn>1</mn></mrow>" +
			  						"<mrow><mn>22</mn></mrow>" +
		  						"</mfrac>" +
	  						"</mstyle>" +
  						"</math>" +
  						"</line></root>");
  				var line = model.getLineAt(0);
  				model.anchor.node = line.firstChild.firstChild.firstChild.firstChild.firstChild;
  				model.anchor.offset = 0;
  				model.path = [];model.path.push({nodeName: "root"});
  				model.path.push({nodeName: "line", offset: 1});
  				model.path.push({nodeName: "math", offset: 1});
  				model.path.push({nodeName: "mfrac", offset: 1});
  				model.path.push({nodeName: "mrow", offset: 1});
  				model.path.push({nodeName: "mn", offset: 1});
  				model.moveLeft();
  				t.is("/root/line[1]/math[1]/mfrac[1]", model.getPath());
				var node = model.getFocusNode();
				t.is("mfrac", node.nodeName);
				t.is(0, model.getOffset());
  			},
  			tearDown: function(){
  				
  			}
	    },{
	    	name: "mathml模式下，由分子前左移到分数前，当分子上第一个元素是layout节点时",
  			setUp: function(){
  				this.model = new Model({});
  			},
  			runTest: function(t){
  				var model = this.model;
  				model.mode = "mathml";
  				model.loadData("<root><line>" +
  						"<math>" +
	  						"<mstyle>" +
		  						"<mfrac>" +
		  						"<mrow><mstyle><mfrac><mrow><mn>22</mn></mrow><mrow><mn>33</mn></mrow></mfrac></mstyle></mrow>" +
		  						"<mrow><mn>1</mn></mrow>" +
		  						"</mfrac>" +
	  						"</mstyle>" +
  						"</math>" +
  						"</line></root>");
  				var line = model.getLineAt(0);
  				model.anchor.node = line.firstChild.firstChild.firstChild.firstChild.firstChild.firstChild;
  				model.anchor.offset = 0;
  				model.path = [];model.path.push({nodeName: "root"});
  				model.path.push({nodeName: "line", offset: 1});
  				model.path.push({nodeName: "math", offset: 1});
  				model.path.push({nodeName: "mfrac", offset: 1});
  				model.path.push({nodeName: "mrow", offset: 1});
  				model.path.push({nodeName: "mfrac", offset: 1});
  				model.moveLeft();
  				t.is("/root/line[1]/math[1]/mfrac[1]", model.getPath());
				var node = model.getFocusNode();
				t.is("mfrac", node.nodeName);
				t.is(0, model.getOffset());
  			},
  			tearDown: function(){
  				
  			}
	    },
	    
	    
	    
	    
	    
	    {
	    	name: "mathml模式下，在空的分数上先右移光标，然后再左移",
  			setUp: function(){
  				this.model = new Model({});
  			},
  			runTest: function(t){
  				var model = this.model;
  				model.toMathMLMode();
  				model.setData({data: "", nodeName: "mfrac"});
  				model.moveRight();
  				model.moveLeft();
  				
  				t.is("/root/line[1]/math[1]/mfrac[1]/mrow[1]/mn[1]", model.getPath());
				var node = model.getFocusNode();
				t.t(node.parentNode.previousSibling == null);
				t.is("mn", node.nodeName);
				t.is("drip_placeholder_box", node.getAttribute("class"));
				t.is(0, model.getOffset());
  			},
  			tearDown: function(){
  				
  			}
	    },{
	    	name: "mathml模式下，在空的分数上输入分子，右移光标到分母，在分母上输入一个数字，然后左移光标两次，此时光标在分子最后。",
  			setUp: function(){
  				this.model = new Model({});
  			},
  			runTest: function(t){
  				var model = this.model;
  				model.toMathMLMode();
  				model.setData({data: "", nodeName: "mfrac"});
  				model.setData({data: "1"});
  				model.moveRight();
  				model.setData({data: "2"});
  				
  				model.moveLeft();
  				t.is("/root/line[1]/math[1]/mfrac[1]/mrow[2]/mn[1]", model.getPath());
				var node = model.getFocusNode();
				t.is("mn", node.nodeName);
				t.is(0, model.getOffset());
				t.is("2", node.textContent);
  				
  				model.moveLeft();
  				t.is("/root/line[1]/math[1]/mfrac[1]/mrow[1]/mn[1]", model.getPath());
				var node = model.getFocusNode();
				t.t(node.parentNode.previousSibling == null);
				t.is("mn", node.nodeName);
				t.is(1, model.getOffset());
				t.is("1", node.textContent);
  			},
  			tearDown: function(){
  				
  			}
	    },{
	    	name: "mathml模式下，在空的分数上，左移一次光标，光标显示在整个分数之前",
  			setUp: function(){
  				this.model = new Model({});
  			},
  			runTest: function(t){
  				var model = this.model;
  				model.toMathMLMode();
  				model.setData({data: "", nodeName: "mfrac"});
  				model.moveLeft();
  				t.is("/root/line[1]/math[1]/mfrac[1]", model.getPath());
				var node = model.getFocusNode();
				// 如果是layout mathml节点获取焦点，则0表示所在节点之前，1表示所在节点之后。
				t.is("mfrac", node.nodeName);
				t.is(0, model.getOffset());
  			},
  			tearDown: function(){
  				
  			}
	    },{
	    	name: "mathml模式下，在空的分数上，左移两次光标，光标显示在整个分数之前，此时光标已移出分数",
  			setUp: function(){
  				this.model = new Model({});
  			},
  			runTest: function(t){
  				var model = this.model;
  				model.toMathMLMode();
  				model.setData({data: "", nodeName: "mfrac"});
  				model.moveLeft();
  				model.moveLeft();
  				t.is("/root/line[1]/math[1]", model.getPath());
				var node = model.getFocusNode();
				t.is("math", node.nodeName);
				t.is(0, model.getOffset());// 0表示在math节点之前
  			},
  			tearDown: function(){
  				
  			}
	    },{
	    	name: "mathml模式下，在空的分数上，左移三次光标，光标显示在整个分数之前，此时光标已移出分数,并进入前一个节点",
  			setUp: function(){
  				this.model = new Model({});
  			},
  			runTest: function(t){
  				var model = this.model;
  				model.setData({data: "a"});
  				model.toMathMLMode();
  				model.setData({data: "", nodeName: "mfrac"});// 光标停留在分子上
  				model.moveLeft();// 移到分数前
  				model.moveLeft();// 移到math节点前
  				model.moveLeft();// 移到text后
  				t.is("/root/line[1]/text[1]", model.getPath());
				var node = model.getFocusNode();
				t.is("text", node.nodeName);
				t.is(0, model.getOffset());// 光标应该停留在“a”前面
  			},
  			tearDown: function(){
  				
  			}
	    },{
	    	name: "mathml模式下，在空的分数中，先移到整个分数的后面，然后左移到分母上",
  			setUp: function(){
  				this.model = new Model({});
  			},
  			runTest: function(t){
  				var model = this.model;
  				model.toMathMLMode();
  				model.setData({data: "", nodeName: "mfrac"});
  				model.moveRight();// 移到分母
  				model.moveRight();// 移到整个分数后面
  				model.moveLeft();// 移到分母上
  				t.is("/root/line[1]/math[1]/mfrac[1]/mrow[2]/mn[1]", model.getPath());
  				var node = model.getFocusNode();
				t.t(node.parentNode.nextSibling == null);
				t.is("mn", node.nodeName);
				t.is("drip_placeholder_box", node.getAttribute("class"));
				t.is(0, model.getOffset());
  			},
  			tearDown: function(){
  				
  			}
	    },{
	    	name: "从text节点左移到math节点中",
  			setUp: function(){
  				this.model = new Model({});
  			},
  			runTest: function(t){
  				var model = this.model;
  				model.toMathMLMode();
  				model.setData({data: "", nodeName: "mfrac"});
  				model.moveRight();// 移到分母
  				model.moveRight();// 移到整个分数后面
  				model.moveRight();// 移出数学公式编辑区域
  				//model.toTextMode();
  				t.t(model.isTextMode());
  				model.setData({data: "a"});
  				model.moveLeft();// 移到a字母前面
  				model.moveLeft();// 模式切换，移到math节点中
  				t.t(model.isMathMLMode());
  				t.is("/root/line[1]/math[1]/mfrac[1]", model.getPath());
				var node = model.getFocusNode();
				t.is("mfrac", node.nodeName);
				t.is(1, model.getOffset());
  			},
  			tearDown: function(){
  				
  			}
	    }
	    // TODO:测试分数前面有text节点的情况
	    // TODO:测试分数前面和后面有mathml token和layout节点的情况
	    // TODO：从分数外面移到分数里面
	                             
	]);
});