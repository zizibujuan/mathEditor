define([ "doh", "mathEditor/Model", "mathEditor/lang" ], function(doh, Model, dripLang) {

	// summary:
	//		在有上标的公式上右移光标(base的mrow部分要高亮显示)
	//
	//		右移进入sup
	//		1. sup前没有任何节点，在sup前右移光标，移到base前，base的第一个节点是token节点；
	//		2. sup前没有任何节点，在sup前右移光标，移到base前，base的第一个节点是layout节点；
	//		3. sup前有一个token节点，从token的最后右移到sup的base前，base的第一个节点是token节点；
	//		4. sup前有一个token节点，从token的最后右移到sup的base前，base的第一个节点是layout节点；
	//		5. sup前有一个layout节点，从layout的最后右移到sup的base前，base的第一个节点是token节点；
	//		6. sup前有一个layout节点，从layout的最后右移到sup的base前，base的第一个节点是layout节点；
	//		从base后右移到superscript前
	//		1. base的最后一个节点是token节点，superscript的第一个节点是token节点
	//		2. base的最后一个节点是token节点，superscript的第一个节点是layout节点
	//		3. base的最后一个节点是layout节点，superscript的第一个节点是token节点
	//		4. base的最后一个节点是layout节点，superscript的第一个节点是layout节点
	//		从superscript后移出sup节点
	//		1. superscript的最后一个节点是token节点
	//		2. superscript的最后一个节点是layout节点
	doh.register("Model.moveRight.sup 在有上标的符号中右移光标",[
	    {
	    	name: "mathml模式下，在空的有上标的公式中，将光标从base中移到supscript中",
  			setUp: function(){
  				this.model = new Model({});
  			},
  			runTest: function(t){
  				var model = this.model;
  				model.toMathMLMode();
  				model.setData({data: "", nodeName: "msup"});
  				model.moveLeft();
  				model.moveRight();
  				
  				t.is("/root/line[1]/math[1]/msup[1]/mrow[2]/mn[1]", model.getPath());
  				var node = model.getFocusNode();
	  			t.is("mn", node.nodeName);
	  			t.is("drip_placeholder_box", node.getAttribute("class"));
	  			t.is(0, model.getOffset());
	  			
	  			var baseNode = node;
	  			var superscriptNode = baseNode.parentNode.previousSibling.firstChild;
	  			t.is("mn", superscriptNode.nodeName);
	  			t.is("drip_placeholder_box", superscriptNode.getAttribute("class"));
  			},
  			tearDown: function(){
  				
  			}
	    },{
	    	name: "右移进入sup，sup前没有任何节点，在sup前右移光标，移到base前，base的第一个节点是token节点。",
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
  				model.anchor.offset = 0;
  				model.path = [];model.path.push({nodeName: "root"});
  				model.path.push({nodeName: "line", offset: 1});
  				model.path.push({nodeName: "math", offset: 1});
  				model.path.push({nodeName: "msup", offset: 1});
  				model.moveRight();
  				t.is("/root/line[1]/math[1]/msup[1]/mrow[1]/mn[1]", model.getPath());
				var node = model.getFocusNode();
				t.is("mn", node.nodeName);
				t.is(0, model.getOffset());
				t.is("123", dripLang.getText(node));
  			},
  			tearDown: function(){
  				
  			}
	    },{
	    	name: "右移进入sup，sup前没有任何节点，在sup前右移光标，移到base前，base的第一个节点是layout节点。",
  			setUp: function(){
  				this.model = new Model({});
  			},
  			runTest: function(t){
  				var model = this.model;
  				model.mode = "mathml";
  				model.loadData("<root><line>" +
  						"<math>" +
	  						"<msup>" +
		  						"<mrow><msup><mrow><mn>2</mn></mrow><mrow><mn>3</mn></mrow></msup></mrow>" + // base
		  						"<mrow><mn>123</mn></mrow>" + // superscript
	  						"</msup>" +
  						"</math>" +
  				"</line></root>");
  				
  				var line = model.getLineAt(0);
  				model.anchor.node = line.firstChild.firstChild;
  				model.anchor.offset = 0;
  				model.path = [];model.path.push({nodeName: "root"});
  				model.path.push({nodeName: "line", offset: 1});
  				model.path.push({nodeName: "math", offset: 1});
  				model.path.push({nodeName: "msup", offset: 1});
  				model.moveRight();
  				t.is("/root/line[1]/math[1]/msup[1]/mrow[1]/msup[1]", model.getPath());
				var node = model.getFocusNode();
				t.is("msup", node.nodeName);
				t.is(0, model.getOffset());
  			},
  			tearDown: function(){
  				
  			}
	    },{
	    	name: "右移进入sup，sup前有一个token节点，从token的最后右移到sup的base前，base的第一个节点是token节点。",
  			setUp: function(){
  				this.model = new Model({});
  			},
  			runTest: function(t){
  				var model = this.model;
  				model.mode = "mathml";
  				model.loadData("<root><line>" +
  						"<math>" +
  							"<mn>12</mn>" +
	  						"<msup>" +
		  						"<mrow><mn>5678</mn></mrow>" + // base
		  						"<mrow><mn>345</mn></mrow>" + // superscript
	  						"</msup>" +
  						"</math>" +
  				"</line></root>");
  				
  				var line = model.getLineAt(0);
  				model.anchor.node = line.firstChild.firstChild;
  				model.anchor.offset = 2;
  				model.path = [];model.path.push({nodeName: "root"});
  				model.path.push({nodeName: "line", offset: 1});
  				model.path.push({nodeName: "math", offset: 1});
  				model.path.push({nodeName: "mn", offset: 1});
  				model.moveRight();
  				t.is("/root/line[1]/math[1]/msup[2]/mrow[1]/mn[1]", model.getPath());
				var node = model.getFocusNode();
				t.is("mn", node.nodeName);
				t.is(0, model.getOffset());
				t.is("5678", dripLang.getText(node));
  			},
  			tearDown: function(){
  				
  			}
	    },{
	    	name: "右移进入sup，sup前有一个token节点，从token的最后右移到sup的base前，base的第一个节点是layout节点。",
  			setUp: function(){
  				this.model = new Model({});
  			},
  			runTest: function(t){
  				var model = this.model;
  				model.mode = "mathml";
  				model.loadData("<root><line>" +
  						"<math>" +
  							"<mn>12</mn>" +
	  						"<msup>" +
		  						"<mrow><msup><mrow><mn>4</mn></mrow><mrow><mn>2</mn></mrow></msup></mrow>" + // base
		  						"<mrow><mn>345</mn></mrow>" + // superscript
	  						"</msup>" +
  						"</math>" +
  				"</line></root>");
  				
  				var line = model.getLineAt(0);
  				model.anchor.node = line.firstChild.firstChild;
  				model.anchor.offset = 2;
  				model.path = [];model.path.push({nodeName: "root"});
  				model.path.push({nodeName: "line", offset: 1});
  				model.path.push({nodeName: "math", offset: 1});
  				model.path.push({nodeName: "mn", offset: 1});
  				model.moveRight();
  				t.is("/root/line[1]/math[1]/msup[2]/mrow[1]/msup[1]", model.getPath());
				var node = model.getFocusNode();
				t.is("msup", node.nodeName);
				t.is(0, model.getOffset());
  			},
  			tearDown: function(){
  				
  			}
	    },{
	    	name: "右移进入sup，sup前有一个layout节点，从layout的最后右移到sup的base前，base的第一个节点是token节点。",
  			setUp: function(){
  				this.model = new Model({});
  			},
  			runTest: function(t){
  				var model = this.model;
  				model.mode = "mathml";
  				model.loadData("<root><line>" +
  						"<math>" +
  							"<msup><mrow><mn>4</mn></mrow><mrow><mn>2</mn></mrow></msup>" +
	  						"<msup>" +
		  						"<mrow><mn>12</mn></mrow>" + // base
		  						"<mrow><mn>345</mn></mrow>" + // superscript
	  						"</msup>" +
  						"</math>" +
  				"</line></root>");
  				var line = model.getLineAt(0);
  				model.anchor.node = line.firstChild.firstChild;
  				model.anchor.offset = 1;
  				model.path = [];model.path.push({nodeName: "root"});
  				model.path.push({nodeName: "line", offset: 1});
  				model.path.push({nodeName: "math", offset: 1});
  				model.path.push({nodeName: "msup", offset: 1});
  				model.moveRight();
  				t.is("/root/line[1]/math[1]/msup[2]/mrow[1]/mn[1]", model.getPath());
				var node = model.getFocusNode();
				t.is("mn", node.nodeName);
				t.is(0, model.getOffset());
				t.is("12", dripLang.getText(node));
  			},
  			tearDown: function(){
  				
  			}
	    },{
	    	name: "右移进入sup，sup前有一个layout节点，从layout的最后右移到sup的base前，base的第一个节点是layout节点。",
  			setUp: function(){
  				this.model = new Model({});
  			},
  			runTest: function(t){
  				var model = this.model;
  				model.mode = "mathml";
  				model.loadData("<root><line>" +
  						"<math>" +
  							"<msup><mrow><mn>4</mn></mrow><mrow><mn>2</mn></mrow></msup>" +
	  						"<msup>" +
		  						"<mrow><msup><mrow><mn>4</mn></mrow><mrow><mn>2</mn></mrow></msup></mrow>" + // base
		  						"<mrow><mn>4</mn></mrow>" + // superscript
	  						"</msup>" +
  						"</math>" +
  				"</line></root>");
  				var line = model.getLineAt(0);
  				model.anchor.node = line.firstChild.firstChild;
  				model.anchor.offset = 1;
  				model.path = [];model.path.push({nodeName: "root"});
  				model.path.push({nodeName: "line", offset: 1});
  				model.path.push({nodeName: "math", offset: 1});
  				model.path.push({nodeName: "msup", offset: 1});
  				model.moveRight();
  				t.is("/root/line[1]/math[1]/msup[2]/mrow[1]/msup[1]", model.getPath());
				var node = model.getFocusNode();
				t.is("msup", node.nodeName);
				t.is(0, model.getOffset());
  			},
  			tearDown: function(){
  				
  			}
	    },{
	    	name: "从base后右移到superscript前，base的最后一个节点是token节点，superscript的第一个节点是token节点。",
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
  				model.anchor.node = line.firstChild.firstChild.firstChild.firstChild;
  				model.anchor.offset = 3;
  				model.path = [];model.path.push({nodeName: "root"});
  				model.path.push({nodeName: "line", offset: 1});
  				model.path.push({nodeName: "math", offset: 1});
  				model.path.push({nodeName: "msup", offset: 1});
  				model.path.push({nodeName: "mrow", offset: 1});
  				model.path.push({nodeName: "mn", offset: 1});
  				model.moveRight();
  				t.is("/root/line[1]/math[1]/msup[1]/mrow[2]/mn[1]", model.getPath());
				var node = model.getFocusNode();
				t.is("mn", node.nodeName);
				t.is(0, model.getOffset());
				t.is("12", dripLang.getText(node));
  			},
  			tearDown: function(){
  				
  			}
	    },{
	    	name: "从base后右移到superscript前，base的最后一个节点是token节点，superscript的第一个节点是layout节点。",
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
  				model.anchor.node = line.firstChild.firstChild.firstChild.firstChild;
  				model.anchor.offset = 2;
  				model.path = [];model.path.push({nodeName: "root"});
  				model.path.push({nodeName: "line", offset: 1});
  				model.path.push({nodeName: "math", offset: 1});
  				model.path.push({nodeName: "msup", offset: 1});
  				model.path.push({nodeName: "mrow", offset: 1});
  				model.path.push({nodeName: "mn", offset: 1});
  				model.moveRight();
  				t.is("/root/line[1]/math[1]/msup[1]/mrow[2]/msup[1]", model.getPath());
				var node = model.getFocusNode();
				t.is("msup", node.nodeName);
				t.is(0, model.getOffset());
  			},
  			tearDown: function(){
  				
  			}
	    },{
	    	name: "从base后右移到superscript前，base的最后一个节点是layout节点，superscript的第一个节点是token节点。",
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
  				model.anchor.node = line.firstChild.firstChild.firstChild.firstChild;
  				model.anchor.offset = 1;
  				model.path = [];model.path.push({nodeName: "root"});
  				model.path.push({nodeName: "line", offset: 1});
  				model.path.push({nodeName: "math", offset: 1});
  				model.path.push({nodeName: "msup", offset: 1});
  				model.path.push({nodeName: "mrow", offset: 1});
  				model.path.push({nodeName: "msup", offset: 1});
  				model.moveRight();
  				t.is("/root/line[1]/math[1]/msup[1]/mrow[2]/mn[1]", model.getPath());
				var node = model.getFocusNode();
				t.is("mn", node.nodeName);
				t.is(0, model.getOffset());
				t.is("12", dripLang.getText(node));
  			},
  			tearDown: function(){
  				
  			}
	    },{
	    	name: "从base后右移到superscript前，base的最后一个节点是layout节点，superscript的第一个节点是layout节点。",
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
  				model.anchor.node = line.firstChild.firstChild.firstChild.firstChild;
  				model.anchor.offset = 1;
  				model.path = [];model.path.push({nodeName: "root"});
  				model.path.push({nodeName: "line", offset: 1});
  				model.path.push({nodeName: "math", offset: 1});
  				model.path.push({nodeName: "msup", offset: 1});
  				model.path.push({nodeName: "mrow", offset: 1});
  				model.path.push({nodeName: "msup", offset: 1});
  				model.moveRight();
  				t.is("/root/line[1]/math[1]/msup[1]/mrow[2]/msup[1]", model.getPath());
				var node = model.getFocusNode();
				t.is("msup", node.nodeName);
				t.is(0, model.getOffset());
  			},
  			tearDown: function(){
  				
  			}
	    },{
	    	name: "从superscript后移出sup节点，superscript的最后一个节点是token节点。",
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
		  						"<mrow><mn>123</mn></mrow>" + // superscript
	  						"</msup>" +
  						"</math>" +
  				"</line></root>");
  				var line = model.getLineAt(0);
  				model.anchor.node = line.firstChild.firstChild.lastChild.firstChild;
  				model.anchor.offset = 3;
  				model.path = [];model.path.push({nodeName: "root"});
  				model.path.push({nodeName: "line", offset: 1});
  				model.path.push({nodeName: "math", offset: 1});
  				model.path.push({nodeName: "msup", offset: 1});
  				model.path.push({nodeName: "mrow", offset: 2});
  				model.path.push({nodeName: "mn", offset: 1});
  				model.moveRight();
  				t.is("/root/line[1]/math[1]/msup[1]", model.getPath());
				var node = model.getFocusNode();
				t.is("msup", node.nodeName);
				t.is(1, model.getOffset());
  			},
  			tearDown: function(){
  				
  			}
	    },{
	    	name: "从superscript后移出sup节点，superscript的最后一个节点是layout节点。",
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
		  						"<mrow><msup><mrow><mn>1</mn></mrow><mrow><mn>2</mn></mrow></msup></mrow>" + // superscript
	  						"</msup>" +
  						"</math>" +
  				"</line></root>");
  				var line = model.getLineAt(0);
  				model.anchor.node = line.firstChild.firstChild.lastChild.firstChild;
  				model.anchor.offset = 1;
  				model.path = [];model.path.push({nodeName: "root"});
  				model.path.push({nodeName: "line", offset: 1});
  				model.path.push({nodeName: "math", offset: 1});
  				model.path.push({nodeName: "msup", offset: 1});
  				model.path.push({nodeName: "mrow", offset: 2});
  				model.path.push({nodeName: "msup", offset: 1});
  				model.moveRight();
  				t.is("/root/line[1]/math[1]/msup[1]", model.getPath());
				var node = model.getFocusNode();
				t.is("msup", node.nodeName);
				t.is(1, model.getOffset());
  			},
  			tearDown: function(){
  				
  			}
	    }
	                             
	]);
});