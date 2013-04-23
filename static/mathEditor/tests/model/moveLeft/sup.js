define([ "doh","mathEditor/Model" ], function(doh,Model) {

	// summary:
	//		在有上标的公式上左移光标(base的mrow部分要高亮显示)，TODO：需要model发布一个事件
	//
	//		左移进入sup
	//		1. sup后没有任何节点，在sup后左移光标，移到superscript后，superscript的最后一个节点是token节点；
	//		2. sup后没有任何节点，在sup后左移光标，移到superscript后，superscript的最后一个节点是layout节点；
	//		3. sup后有一个token节点，从token的前面左移到superscript后，superscript的最后一个节点是token节点；
	//		4. sup前有一个token节点，从token的前面左移到superscript后，superscript的最后一个节点是layout节点；
	//		5. sup后有一个layout节点，从layout的前面左移到superscript后，superscript的最后一个节点是token节点；
	//		6. sup前有一个layout节点，从layout的前面左移到superscript后，superscript的最后一个节点是layout节点；
	//		从superscript前左移到base后
	//		1. superscript的第一个节点是token节点，base的最后一个节点是token节点
	//		2. superscript的第一个节点是token节点，base的最后一个节点是layout节点
	//		3. superscript的第一个节点是layout节点，base的最后一个节点是token节点
	//		4. superscript的第一个节点是layout节点，base的最后一个节点是layout节点
	//		从base左移出sup节点，移到sup前面
	//		1. base的第一个节点是token节点
	//		2. base的第一个节点是layout节点
	doh.register("Model.moveLeft.sup 在有上标的符号中左移光标",[
	    {
	    	name: "mathml模式下，在空的有上标的公式中，将光标从supscript中移到base中",
  			setUp: function(){
  				this.model = new Model({});
  			},
  			runTest: function(t){
  				var model = this.model;
  				model.toMathMLMode();
  				model.setData({data:"", nodeName:"msup"});
  				model.moveLeft();
  				
  				t.is("/root/line[1]/math[1]/msup[1]/mrow[1]/mn[1]", model.getPath());
  				var node = model.getFocusNode();
				t.is("mn", node.nodeName);
				t.is("drip_placeholder_box", node.getAttribute("class"));
				t.is(0, model.getOffset());
				
				var baseNode = node;
				var superscriptNode = baseNode.parentNode.nextSibling.lastChild;
				t.is("mn", superscriptNode.nodeName);
				t.is("drip_placeholder_box", superscriptNode.getAttribute("class"));
  			},
  			tearDown: function(){
  				
  			}
	    },{
	    	name: "左移进入sup，sup后没有任何节点，在sup后左移光标，移到superscript后，superscript的最后一个节点是token节点。",
  			setUp: function(){
  				this.model = new Model({});
  			},
  			runTest: function(t){
  				var model = this.model;
  				model.mode = "mathml";
  				model.loadData("<root><line>" +
  						"<math>" +
	  						"<msup>" +
		  						"<mrow><mn>123</mn></mrow>" + // base
		  						"<mrow><mn>12</mn></mrow>" + // superscript
	  						"</msup>" +
  						"</math>" +
  				"</line></root>");
  				
  				var line = model.getLineAt(0);
  				model.anchor.node = line.firstChild.firstChild;
  				model.anchor.offset = 1;
  				model.path.push({nodeName: "root"});
  				model.path.push({nodeName: "line", offset: 1});
  				model.path.push({nodeName: "math", offset: 1});
  				model.path.push({nodeName: "msup", offset: 1});
  				model.moveLeft();
  				t.is("/root/line[1]/math[1]/msup[1]/mrow[2]/mn[1]", model.getPath());
				var node = model.getFocusNode();
				t.is("mn", node.nodeName);
				t.is(2, model.getOffset());
				t.is("12", node.textContent);
  			},
  			tearDown: function(){
  				
  			}
	    },{
	    	name: "左移进入sup，sup后没有任何节点，在sup后左移光标，移到superscript后，superscript的最后一个节点是layout节点。",
  			setUp: function(){
  				this.model = new Model({});
  			},
  			runTest: function(t){
  				var model = this.model;
  				model.mode = "mathml";
  				model.loadData("<root><line>" +
  						"<math>" +
	  						"<msup>" +
		  						"<mrow><mn>123</mn></mrow>" + // base
		  						"<mrow><msup><mrow><mn>2</mn></mrow><mrow><mn>3</mn></mrow></msup></mrow>" + // superscript
	  						"</msup>" +
  						"</math>" +
  				"</line></root>");
  				
  				var line = model.getLineAt(0);
  				model.anchor.node = line.firstChild.firstChild;
  				model.anchor.offset = 1;
  				model.path.push({nodeName: "root"});
  				model.path.push({nodeName: "line", offset: 1});
  				model.path.push({nodeName: "math", offset: 1});
  				model.path.push({nodeName: "msup", offset: 1});
  				model.moveLeft();
  				t.is("/root/line[1]/math[1]/msup[1]/mrow[2]/msup[1]", model.getPath());
				var node = model.getFocusNode();
				t.is("msup", node.nodeName);
				t.is(1, model.getOffset());
  			},
  			tearDown: function(){
  				
  			}
	    },{
	    	name: "左移进入sup，sup后有一个token节点，从token的前面左移到superscript后，superscript的最后一个节点是token节点。",
  			setUp: function(){
  				this.model = new Model({});
  			},
  			runTest: function(t){
  				var model = this.model;
  				model.mode = "mathml";
  				model.loadData("<root><line>" +
  						"<math>" +
	  						"<msup>" +
		  						"<mrow><mn>5678</mn></mrow>" + // base
		  						"<mrow><mn>345</mn></mrow>" + // superscript
	  						"</msup>" +
	  						"<mn>12</mn>" +
  						"</math>" +
  				"</line></root>");
  				
  				var line = model.getLineAt(0);
  				model.anchor.node = line.firstChild.lastChild;
  				model.anchor.offset = 0;
  				model.path.push({nodeName: "root"});
  				model.path.push({nodeName: "line", offset: 1});
  				model.path.push({nodeName: "math", offset: 1});
  				model.path.push({nodeName: "mn", offset: 2});
  				model.moveLeft();
  				t.is("/root/line[1]/math[1]/msup[1]/mrow[2]/mn[1]", model.getPath());
				var node = model.getFocusNode();
				t.is("mn", node.nodeName);
				t.is(3, model.getOffset());
				t.is("345", node.textContent);
  			},
  			tearDown: function(){
  				
  			}
	    },{
	    	name: "左移进入sup，sup后有一个token节点，从token的前面左移到superscript后，superscript的最后一个节点是layout节点。",
  			setUp: function(){
  				this.model = new Model({});
  			},
  			runTest: function(t){
  				var model = this.model;
  				model.mode = "mathml";
  				model.loadData("<root><line>" +
  						"<math>" +
	  						"<msup>" +
		  						"<mrow><mn>345</mn></mrow>" + // base
		  						"<mrow><msup><mrow><mn>4</mn></mrow><mrow><mn>2</mn></mrow></msup></mrow>" + // superscript
	  						"</msup>" +
	  						"<mn>12</mn>" +
  						"</math>" +
  				"</line></root>");
  				
  				var line = model.getLineAt(0);
  				model.anchor.node = line.firstChild.lastChild;
  				model.anchor.offset = 0;
  				model.path.push({nodeName: "root"});
  				model.path.push({nodeName: "line", offset: 1});
  				model.path.push({nodeName: "math", offset: 1});
  				model.path.push({nodeName: "mn", offset: 2});
  				model.moveLeft();
  				t.is("/root/line[1]/math[1]/msup[1]/mrow[2]/msup[1]", model.getPath());
				var node = model.getFocusNode();
				t.is("msup", node.nodeName);
				t.is(1, model.getOffset());
  			},
  			tearDown: function(){
  				
  			}
	    },{
	    	name: "左移进入sup，sup后有一个layout节点，从layout的前面左移到superscript后，superscript的最后一个节点是token节点。",
  			setUp: function(){
  				this.model = new Model({});
  			},
  			runTest: function(t){
  				var model = this.model;
  				model.mode = "mathml";
  				model.loadData("<root><line>" +
  						"<math>" +
	  						"<msup>" +
		  						"<mrow><mn>12</mn></mrow>" + // base
		  						"<mrow><mn>345</mn></mrow>" + // superscript
	  						"</msup>" +
	  						"<msup><mrow><mn>4</mn></mrow><mrow><mn>2</mn></mrow></msup>" +
  						"</math>" +
  				"</line></root>");
  				
  				var line = model.getLineAt(0);
  				model.anchor.node = line.firstChild.lastChild;
  				model.anchor.offset = 0;
  				model.path.push({nodeName: "root"});
  				model.path.push({nodeName: "line", offset: 1});
  				model.path.push({nodeName: "math", offset: 1});
  				model.path.push({nodeName: "msup", offset: 2});
  				model.moveLeft();
  				t.is("/root/line[1]/math[1]/msup[1]/mrow[2]/mn[1]", model.getPath());
				var node = model.getFocusNode();
				t.is("mn", node.nodeName);
				t.is(3, model.getOffset());
				t.is("345", node.textContent);
  			},
  			tearDown: function(){
  				
  			}
	    },{
	    	name: "左移进入sup，sup前有一个layout节点，从layout的前面左移到superscript后，superscript的最后一个节点是layout节点。",
  			setUp: function(){
  				this.model = new Model({});
  			},
  			runTest: function(t){
  				var model = this.model;
  				model.mode = "mathml";
  				model.loadData("<root><line>" +
  						"<math>" +
	  						"<msup>" +
		  						"<mrow><mn>4</mn></mrow>" + // base
		  						"<mrow><msup><mrow><mn>4</mn></mrow><mrow><mn>2</mn></mrow></msup></mrow>" + // superscript
	  						"</msup>" +
	  						"<msup><mrow><mn>4</mn></mrow><mrow><mn>2</mn></mrow></msup>" +
  						"</math>" +
  				"</line></root>");
  				
  				var line = model.getLineAt(0);
  				model.anchor.node = line.firstChild.lastChild;
  				model.anchor.offset = 0;
  				model.path.push({nodeName: "root"});
  				model.path.push({nodeName: "line", offset: 1});
  				model.path.push({nodeName: "math", offset: 1});
  				model.path.push({nodeName: "msup", offset: 2});
  				model.moveLeft();
  				t.is("/root/line[1]/math[1]/msup[1]/mrow[2]/msup[1]", model.getPath());
				var node = model.getFocusNode();
				t.is("msup", node.nodeName);
				t.is(1, model.getOffset());
  			},
  			tearDown: function(){
  				
  			}
	    },{
	    	name: "从superscript前左移到base后，superscript的第一个节点是token节点，base的最后一个节点是token节点。",
  			setUp: function(){
  				this.model = new Model({});
  			},
  			runTest: function(t){
  				var model = this.model;
  				model.mode = "mathml";
  				model.loadData("<root><line>" +
  						"<math>" +
	  						"<msup>" +
		  						"<mrow><mn>345</mn></mrow>" + // base 测试用例中base中数字的位数和index中数字的位数要不同。
		  						"<mrow><mn>12</mn></mrow>" + // superscript
	  						"</msup>" +
  						"</math>" +
  				"</line></root>");
  				
  				var line = model.getLineAt(0);
  				model.anchor.node = line.firstChild.firstChild.lastChild.firstChild;
  				model.anchor.offset = 0;
  				model.path.push({nodeName: "root"});
  				model.path.push({nodeName: "line", offset: 1});
  				model.path.push({nodeName: "math", offset: 1});
  				model.path.push({nodeName: "msup", offset: 1});
  				model.path.push({nodeName: "mrow", offset: 2});
  				model.path.push({nodeName: "mn", offset: 1});
  				model.moveLeft();
  				t.is("/root/line[1]/math[1]/msup[1]/mrow[1]/mn[1]", model.getPath());
				var node = model.getFocusNode();
				t.is("mn", node.nodeName);
				t.is(3, model.getOffset());
				t.is("345", node.textContent);
  			},
  			tearDown: function(){
  				
  			}
	    },{
	    	name: "从superscript前左移到base后，superscript的第一个节点是token节点，base的最后一个节点是layout节点。",
  			setUp: function(){
  				this.model = new Model({});
  			},
  			runTest: function(t){
  				var model = this.model;
  				model.mode = "mathml";
  				model.loadData("<root><line>" +
  						"<math>" +
	  						"<msup>" +
		  						"<mrow><msup><mrow><mn>4</mn></mrow><mrow><mn>2</mn></mrow></msup></mrow>" + // base
		  						"<mrow><mn>12</mn></mrow>" + // superscript
	  						"</msup>" +
  						"</math>" +
  				"</line></root>");
  				
  				var line = model.getLineAt(0);
  				model.anchor.node = line.firstChild.firstChild.lastChild.firstChild;
  				model.anchor.offset = 0;
  				model.path.push({nodeName: "root"});
  				model.path.push({nodeName: "line", offset: 1});
  				model.path.push({nodeName: "math", offset: 1});
  				model.path.push({nodeName: "msup", offset: 1});
  				model.path.push({nodeName: "mrow", offset: 2});
  				model.path.push({nodeName: "mn", offset: 1});
  				model.moveLeft();
  				t.is("/root/line[1]/math[1]/msup[1]/mrow[1]/msup[1]", model.getPath());
				var node = model.getFocusNode();
				t.is("msup", node.nodeName);
				t.is(1, model.getOffset());
  			},
  			tearDown: function(){
  				
  			}
	    },{
	    	name: "从superscript前左移到base后，superscript的第一个节点是layout节点，base的最后一个节点是token节点。",
  			setUp: function(){
  				this.model = new Model({});
  			},
  			runTest: function(t){
  				var model = this.model;
  				model.mode = "mathml";
  				model.loadData("<root><line>" +
  						"<math>" +
	  						"<msup>" +
		  						"<mrow><mn>12</mn></mrow>" + // base
		  						"<mrow><msup><mrow><mn>4</mn></mrow><mrow><mn>2</mn></mrow></msup></mrow>" + // superscript
	  						"</msup>" +
  						"</math>" +
  				"</line></root>");
  				
  				var line = model.getLineAt(0);
  				model.anchor.node = line.firstChild.firstChild.lastChild.firstChild;
  				model.anchor.offset = 0;
  				model.path.push({nodeName: "root"});
  				model.path.push({nodeName: "line", offset: 1});
  				model.path.push({nodeName: "math", offset: 1});
  				model.path.push({nodeName: "msup", offset: 1});
  				model.path.push({nodeName: "mrow", offset: 2});
  				model.path.push({nodeName: "msup", offset: 1});
  				model.moveLeft();
  				t.is("/root/line[1]/math[1]/msup[1]/mrow[1]/mn[1]", model.getPath());
				var node = model.getFocusNode();
				t.is("mn", node.nodeName);
				t.is(2, model.getOffset());
				t.is("12", node.textContent);
  			},
  			tearDown: function(){
  				
  			}
	    },
	    {
	    	name: "从superscript前左移到base后，superscript的第一个节点是layout节点，base的最后一个节点是layout节点。",
  			setUp: function(){
  				this.model = new Model({});
  			},
  			runTest: function(t){
  				var model = this.model;
  				model.mode = "mathml";
  				model.loadData("<root><line>" +
  						"<math>" +
	  						"<msup>" +
		  						"<mrow><msup><mrow><mn>3</mn></mrow><mrow><mn>4</mn></mrow></msup></mrow>" + // base
		  						"<mrow><msup><mrow><mn>1</mn></mrow><mrow><mn>2</mn></mrow></msup></mrow>" + // superscript
	  						"</msup>" +
  						"</math>" +
  				"</line></root>");
  				
  				var line = model.getLineAt(0);
  				model.anchor.node = line.firstChild.firstChild.lastChild.firstChild;
  				model.anchor.offset = 0;
  				model.path.push({nodeName: "root"});
  				model.path.push({nodeName: "line", offset: 1});
  				model.path.push({nodeName: "math", offset: 1});
  				model.path.push({nodeName: "msup", offset: 1});
  				model.path.push({nodeName: "mrow", offset: 2});
  				model.path.push({nodeName: "msup", offset: 1});
  				model.moveLeft();
  				t.is("/root/line[1]/math[1]/msup[1]/mrow[1]/msup[1]", model.getPath());
				var node = model.getFocusNode();
				t.is("msup", node.nodeName);
				t.is(1, model.getOffset());
  			},
  			tearDown: function(){
  				
  			}
	    },{
	    	name: "从base左移出sup节点，base的第一个节点是token节点。",
  			setUp: function(){
  				this.model = new Model({});
  			},
  			runTest: function(t){
  				var model = this.model;
  				model.mode = "mathml";
  				model.loadData("<root><line>" +
  						"<math>" +
	  						"<msup>" +
		  						"<mrow><mn>34</mn></mrow>" + // base
		  						"<mrow><mn>12</mn></mrow>" + // superscript
	  						"</msup>" +
  						"</math>" +
  				"</line></root>");
  				
  				var line = model.getLineAt(0);
  				model.anchor.node = line.firstChild.firstChild.firstChild.firstChild;
  				model.anchor.offset = 0;
  				model.path.push({nodeName: "root"});
  				model.path.push({nodeName: "line", offset: 1});
  				model.path.push({nodeName: "math", offset: 1});
  				model.path.push({nodeName: "msup", offset: 1});
  				model.path.push({nodeName: "mrow", offset: 1});
  				model.path.push({nodeName: "mn", offset: 1});
  				model.moveLeft();
  				t.is("/root/line[1]/math[1]/msup[1]", model.getPath());
				var node = model.getFocusNode();
				t.is("msup", node.nodeName);
				t.is(0, model.getOffset());
  			},
  			tearDown: function(){
  				
  			}
	    },{
	    	name: "从base左移出sup节点，移到sup前面，base的第一个节点是layout节点。",
  			setUp: function(){
  				this.model = new Model({});
  			},
  			runTest: function(t){
  				var model = this.model;
  				model.mode = "mathml";
  				model.loadData("<root><line>" +
  						"<math>" +
	  						"<msup>" +
		  						"<mrow><msup><mrow><mn>1</mn></mrow><mrow><mn>2</mn></mrow></msup></mrow>" + // base
		  						"<mrow><mn>12</mn></mrow>" + // superscript
	  						"</msup>" +
  						"</math>" +
  				"</line></root>");
  				
  				var line = model.getLineAt(0);
  				model.anchor.node = line.firstChild.firstChild.firstChild.firstChild;
  				model.anchor.offset = 0;
  				model.path.push({nodeName: "root"});
  				model.path.push({nodeName: "line", offset: 1});
  				model.path.push({nodeName: "math", offset: 1});
  				model.path.push({nodeName: "msup", offset: 1});
  				model.path.push({nodeName: "mrow", offset: 1});
  				model.path.push({nodeName: "msup", offset: 1});
  				model.moveLeft();
  				t.is("/root/line[1]/math[1]/msup[1]", model.getPath());
				var node = model.getFocusNode();
				t.is("msup", node.nodeName);
				t.is(0, model.getOffset());
  			},
  			tearDown: function(){
  				
  			}
	    }
	                             
	]);
});