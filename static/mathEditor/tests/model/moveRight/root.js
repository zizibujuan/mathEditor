define([ "doh","mathEditor/Model" ], function(doh,Model) {

	// summary:
	//		在根式中右移光标（这个根式中显示包含根次）
	//		右移进根式，首先进入根次
	//		1. 根式前没有任何节点，在根式前右移光标到根次前，根次的第一个节点是token节点；
	//		2. 根式前没有任何节点，在根式前右移光标到根次前，根次的第一个节点是layout节点；
	//		3. 根式前有一个token节点，在token节点最后右移光标到根次前，根次的第一个节点是token节点；
	//		4. 根式前有一个token节点，在token节点最后右移光标到根次前，根次的第一个节点是layout节点；
	//		5. 根式前有一个layout节点，在layout节点最后右移光标到根次前，根次的第一个节点是token节点；
	//		6. 根式前有一个layout节点，在layout节点最后右移光标到根次前，根次的第一个节点是layout节点；
	//		从根次后右移进根数前
	//		1. 根次最后一个节点是token节点，根数第一个节点是token节点
	//		2. 根次最后一个节点是token节点，根数第一个节点是layout节点
	//		3. 根次最后一个节点是layout节点，根数第一个节点是token节点
	//		4. 根次最后一个节点是layout节点，根数第一个节点是layout节点
	//		从根数后右移出根式，到根式后（注意：与根式后有无节点或节点种类无关）
	//		1. 根数的最后一个节点是token节点
	//		2. 根数的最后一个节点是layout节点
	doh.register("Model.moveRight.root 在根式中右移光标",[
	    {
	    	name: "mathml模式下，在空的根式root中右移光标，将光标从index中移到base中。",
  			setUp: function(){
  				this.model = new Model({});
  			},
  			runTest: function(t){
  				var model = this.model;
  				model.toMathMLMode();
  				model.setData({data: "", nodeName: "mroot"});
  				model.moveRight();
  				
				t.is("/root/line[1]/math[1]/mroot[1]/mrow[1]/mn[1]", model.getPath());
				
				var baseNode = model.getFocusNode();
				t.is("mn", baseNode.nodeName);
				t.is("drip_placeholder_box", baseNode.getAttribute("class"));
				t.is(0, model.getOffset());
				
				var indexNode = baseNode.parentNode.nextSibling.firstChild;
				t.is("mn", indexNode.nodeName);
				t.is("drip_placeholder_box", indexNode.getAttribute("class"));
  			},
  			tearDown: function(){
  				
  			}
	    },{
	    	name: "mathml模式下，在空的根式root中右移光标两次，将光标移到根式之后。",
  			setUp: function(){
  				this.model = new Model({});
  			},
  			runTest: function(t){
  				var model = this.model;
  				model.toMathMLMode();
  				model.setData({data: "", nodeName: "mroot"});
  				model.moveRight();
  				model.moveRight();
  				
				t.is("/root/line[1]/math[1]/mroot[1]", model.getPath());
				
				var node = model.getFocusNode();
				t.is("mroot", node.nodeName);
				t.is(1, model.getOffset());
  			},
  			tearDown: function(){
  				
  			}
	    },{
	    	name: "右移进根次，根式前没有任何节点，在根式前右移光标到根次前，根次的第一个节点是token节点。",
  			setUp: function(){
  				this.model = new Model({});
  			},
  			runTest: function(t){
  				var model = this.model;
  				model.mode = "mathml";
  				model.loadData("<root><line>" +
  						"<math>" +
	  						"<mroot>" +
		  						"<mrow><mn>4</mn></mrow>" + // base
		  						"<mrow><mn>2</mn></mrow>" + // index
	  						"</mroot>" +
  						"</math>" +
  				"</line></root>");
  				
  				var line = model.getLineAt(0);
  				model.anchor.node = line.firstChild.firstChild;
  				model.anchor.offset = 0;
  				model.path = [];model.path.push({nodeName: "root"});
  				model.path.push({nodeName: "line", offset: 1});
  				model.path.push({nodeName: "math", offset: 1});
  				model.path.push({nodeName: "mroot", offset: 1});
  				model.moveRight();
  				t.is("/root/line[1]/math[1]/mroot[1]/mrow[2]/mn[1]", model.getPath());
				var node = model.getFocusNode();
				t.is("mn", node.nodeName);
				t.is(0, model.getOffset());
				t.is("2", node.textContent);
  			},
  			tearDown: function(){
  				
  			}
	    },{
	    	name: "右移进根次，根式前没有任何节点，在根式前右移光标到根次前，根次的第一个节点是layout节点。",
  			setUp: function(){
  				this.model = new Model({});
  			},
  			runTest: function(t){
  				var model = this.model;
  				model.mode = "mathml";
  				model.loadData("<root><line>" +
  						"<math>" +
	  						"<mroot>" +
		  						"<mrow><mn>4</mn></mrow>" + // base
		  						"<mrow><mroot><mrow><mn>4</mn></mrow><mrow><mn>2</mn></mrow></mroot></mrow>" + // index
	  						"</mroot>" +
  						"</math>" +
  				"</line></root>");
  				
  				var line = model.getLineAt(0);
  				model.anchor.node = line.firstChild.firstChild;
  				model.anchor.offset = 0;
  				model.path = [];model.path.push({nodeName: "root"});
  				model.path.push({nodeName: "line", offset: 1});
  				model.path.push({nodeName: "math", offset: 1});
  				model.path.push({nodeName: "mroot", offset: 1});
  				model.moveRight();
  				t.is("/root/line[1]/math[1]/mroot[1]/mrow[2]/mroot[1]", model.getPath());
				var node = model.getFocusNode();
				t.is("mroot", node.nodeName);
				t.is(0, model.getOffset());
  			},
  			tearDown: function(){
  				
  			}
	    },{
	    	name: "右移进根次，根式前有一个token节点，在token节点最后右移光标到根次前，根次的第一个节点是token节点。",
  			setUp: function(){
  				this.model = new Model({});
  			},
  			runTest: function(t){
  				var model = this.model;
  				model.mode = "mathml";
  				model.loadData("<root><line>" +
  						"<math>" +
  							"<mn>12</mn>" +
	  						"<mroot>" +
		  						"<mrow><mn>4</mn></mrow>" + // base
		  						"<mrow><mn>2</mn></mrow>" + // index
	  						"</mroot>" +
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
  				t.is("/root/line[1]/math[1]/mroot[2]/mrow[2]/mn[1]", model.getPath());
				var node = model.getFocusNode();
				t.is("mn", node.nodeName);
				t.is(0, model.getOffset());
  			},
  			tearDown: function(){
  				
  			}
	    },{
	    	name: "右移进根次，根式前有一个token节点，在token节点最后右移光标到根次前，根次的第一个节点是layout节点。",
  			setUp: function(){
  				this.model = new Model({});
  			},
  			runTest: function(t){
  				var model = this.model;
  				model.mode = "mathml";
  				model.loadData("<root><line>" +
  						"<math>" +
  							"<mn>12</mn>" +
	  						"<mroot>" +
		  						"<mrow><mn>4</mn></mrow>" + // base
		  						"<mrow><mroot><mrow><mn>4</mn></mrow><mrow><mn>2</mn></mrow></mroot></mrow>" + // index
	  						"</mroot>" +
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
  				t.is("/root/line[1]/math[1]/mroot[2]/mrow[2]/mroot[1]", model.getPath());
				var node = model.getFocusNode();
				t.is("mroot", node.nodeName);
				t.is(0, model.getOffset());
  			},
  			tearDown: function(){
  				
  			}
	    },{
	    	name: "右移进根次，根式前有一个layout节点，在layout节点最后右移光标到根次前，根次的第一个节点是token节点。",
  			setUp: function(){
  				this.model = new Model({});
  			},
  			runTest: function(t){
  				var model = this.model;
  				model.mode = "mathml";
  				model.loadData("<root><line>" +
  						"<math>" +
  							"<mroot><mrow><mn>4</mn></mrow><mrow><mn>2</mn></mrow></mroot>" +
	  						"<mroot>" +
		  						"<mrow><mn>4</mn></mrow>" + // base
		  						"<mrow><mn>12</mn></mrow>" + // index
	  						"</mroot>" +
  						"</math>" +
  				"</line></root>");
  				
  				var line = model.getLineAt(0);
  				model.anchor.node = line.firstChild.firstChild;
  				model.anchor.offset = 1;
  				model.path = [];model.path.push({nodeName: "root"});
  				model.path.push({nodeName: "line", offset: 1});
  				model.path.push({nodeName: "math", offset: 1});
  				model.path.push({nodeName: "mroot", offset: 1});
  				model.moveRight();
  				t.is("/root/line[1]/math[1]/mroot[2]/mrow[2]/mn[1]", model.getPath());
				var node = model.getFocusNode();
				t.is("mn", node.nodeName);
				t.is(0, model.getOffset());
  			},
  			tearDown: function(){
  				
  			}
	    },{
	    	name: "右移进根次，根式前有一个layout节点，在layout节点最后右移光标到根次前，根次的第一个节点是layout节点。",
  			setUp: function(){
  				this.model = new Model({});
  			},
  			runTest: function(t){
  				var model = this.model;
  				model.mode = "mathml";
  				model.loadData("<root><line>" +
  						"<math>" +
  							"<mroot><mrow><mn>4</mn></mrow><mrow><mn>2</mn></mrow></mroot>" +
	  						"<mroot>" +
		  						"<mrow><mn>4</mn></mrow>" + // base
		  						"<mrow><mroot><mrow><mn>4</mn></mrow><mrow><mn>2</mn></mrow></mroot></mrow>" + // index
	  						"</mroot>" +
  						"</math>" +
  				"</line></root>");
  				
  				var line = model.getLineAt(0);
  				model.anchor.node = line.firstChild.firstChild;
  				model.anchor.offset = 1;
  				model.path = [];model.path.push({nodeName: "root"});
  				model.path.push({nodeName: "line", offset: 1});
  				model.path.push({nodeName: "math", offset: 1});
  				model.path.push({nodeName: "mroot", offset: 1});
  				model.moveRight();
  				t.is("/root/line[1]/math[1]/mroot[2]/mrow[2]/mroot[1]", model.getPath());
				var node = model.getFocusNode();
				t.is("mroot", node.nodeName);
				t.is(0, model.getOffset());
  			},
  			tearDown: function(){
  				
  			}
	    },{
	    	name: "从根次后右移进根数前，根次最后一个节点是token节点，根数第一个节点是token节点。",
  			setUp: function(){
  				this.model = new Model({});
  			},
  			runTest: function(t){
  				var model = this.model;
  				model.mode = "mathml";
  				model.loadData("<root><line>" +
  						"<math>" +
	  						"<mroot>" +
		  						"<mrow><mn>34</mn></mrow>" + // base
		  						"<mrow><mn>12</mn></mrow>" + // index
	  						"</mroot>" +
  						"</math>" +
  				"</line></root>");
  				
  				var line = model.getLineAt(0);
  				model.anchor.node = line.firstChild.firstChild.lastChild.firstChild;
  				model.anchor.offset = 2;
  				model.path = [];model.path.push({nodeName: "root"});
  				model.path.push({nodeName: "line", offset: 1});
  				model.path.push({nodeName: "math", offset: 1});
  				model.path.push({nodeName: "mroot", offset: 1});
  				model.path.push({nodeName: "mrow", offset: 2});
  				model.path.push({nodeName: "mn", offset: 1});
  				model.moveRight();
  				t.is("/root/line[1]/math[1]/mroot[1]/mrow[1]/mn[1]", model.getPath());
				var node = model.getFocusNode();
				t.is("mn", node.nodeName);
				t.is(0, model.getOffset());
				t.is("34", node.textContent);
  			},
  			tearDown: function(){
  				
  			}
	    },{
	    	name: "从根次后右移进根数前，根次最后一个节点是token节点，根数第一个节点是layout节点。",
  			setUp: function(){
  				this.model = new Model({});
  			},
  			runTest: function(t){
  				var model = this.model;
  				model.mode = "mathml";
  				model.loadData("<root><line>" +
  						"<math>" +
	  						"<mroot>" +
		  						"<mrow><mroot><mrow><mn>4</mn></mrow><mrow><mn>2</mn></mrow></mroot></mrow>" + // base
		  						"<mrow><mn>12</mn></mrow>" + // index
	  						"</mroot>" +
  						"</math>" +
  				"</line></root>");
  				
  				var line = model.getLineAt(0);
  				model.anchor.node = line.firstChild.firstChild.lastChild.firstChild;
  				model.anchor.offset = 2;
  				model.path = [];model.path.push({nodeName: "root"});
  				model.path.push({nodeName: "line", offset: 1});
  				model.path.push({nodeName: "math", offset: 1});
  				model.path.push({nodeName: "mroot", offset: 1});
  				model.path.push({nodeName: "mrow", offset: 2});
  				model.path.push({nodeName: "mn", offset: 1});
  				model.moveRight();
  				t.is("/root/line[1]/math[1]/mroot[1]/mrow[1]/mroot[1]", model.getPath());
				var node = model.getFocusNode();
				t.is("mroot", node.nodeName);
				t.is(0, model.getOffset());
  			},
  			tearDown: function(){
  				
  			}
	    },{
	    	name: "从根次后右移进根数前，根次最后一个节点是layout节点，根数第一个节点是token节点。",
  			setUp: function(){
  				this.model = new Model({});
  			},
  			runTest: function(t){
  				var model = this.model;
  				model.mode = "mathml";
  				model.loadData("<root><line>" +
  						"<math>" +
	  						"<mroot>" +
		  						"<mrow><mn>12</mn></mrow>" + // base
		  						"<mrow><mroot><mrow><mn>4</mn></mrow><mrow><mn>2</mn></mrow></mroot></mrow>" + // index
	  						"</mroot>" +
  						"</math>" +
  				"</line></root>");
  				
  				var line = model.getLineAt(0);
  				model.anchor.node = line.firstChild.firstChild.lastChild.firstChild;
  				model.anchor.offset = 1;
  				model.path = [];model.path.push({nodeName: "root"});
  				model.path.push({nodeName: "line", offset: 1});
  				model.path.push({nodeName: "math", offset: 1});
  				model.path.push({nodeName: "mroot", offset: 1});
  				model.path.push({nodeName: "mrow", offset: 2});
  				model.path.push({nodeName: "mroot", offset: 1});
  				model.moveRight();
  				t.is("/root/line[1]/math[1]/mroot[1]/mrow[1]/mn[1]", model.getPath());
				var node = model.getFocusNode();
				t.is("mn", node.nodeName);
				t.is(0, model.getOffset());
  			},
  			tearDown: function(){
  				
  			}
	    },{
	    	name: "从根次后右移进根数前，根次最后一个节点是layout节点，根数第一个节点是layout节点。",
  			setUp: function(){
  				this.model = new Model({});
  			},
  			runTest: function(t){
  				var model = this.model;
  				model.mode = "mathml";
  				model.loadData("<root><line>" +
  						"<math>" +
	  						"<mroot>" +
		  						"<mrow><mroot><mrow><mn>3</mn></mrow><mrow><mn>4</mn></mrow></mroot></mrow>" + // base
		  						"<mrow><mroot><mrow><mn>1</mn></mrow><mrow><mn>2</mn></mrow></mroot></mrow>" + // index
	  						"</mroot>" +
  						"</math>" +
  				"</line></root>");
  				
  				var line = model.getLineAt(0);
  				model.anchor.node = line.firstChild.firstChild.lastChild.firstChild;
  				model.anchor.offset = 1;
  				model.path = [];model.path.push({nodeName: "root"});
  				model.path.push({nodeName: "line", offset: 1});
  				model.path.push({nodeName: "math", offset: 1});
  				model.path.push({nodeName: "mroot", offset: 1});
  				model.path.push({nodeName: "mrow", offset: 2});
  				model.path.push({nodeName: "mroot", offset: 1});
  				model.moveRight();
  				t.is("/root/line[1]/math[1]/mroot[1]/mrow[1]/mroot[1]", model.getPath());
				var node = model.getFocusNode();
				t.is("mroot", node.nodeName);
				t.is(0, model.getOffset());
  			},
  			tearDown: function(){
  				
  			}
	    },{
	    	name: "从根数后右移出根式，到根式后，根数的最后一个节点是token节点。",
  			setUp: function(){
  				this.model = new Model({});
  			},
  			runTest: function(t){
  				var model = this.model;
  				model.mode = "mathml";
  				model.loadData("<root><line>" +
  						"<math>" +
	  						"<mroot>" +
		  						"<mrow><mn>34</mn></mrow>" + // base
		  						"<mrow><mn>12</mn></mrow>" + // index
	  						"</mroot>" +
  						"</math>" +
  				"</line></root>");
  				
  				var line = model.getLineAt(0);
  				model.anchor.node = line.firstChild.firstChild.firstChild.firstChild;
  				model.anchor.offset = 2;
  				model.path = [];model.path.push({nodeName: "root"});
  				model.path.push({nodeName: "line", offset: 1});
  				model.path.push({nodeName: "math", offset: 1});
  				model.path.push({nodeName: "mroot", offset: 1});
  				model.path.push({nodeName: "mrow", offset: 1});
  				model.path.push({nodeName: "mn", offset: 1});
  				model.moveRight();
  				t.is("/root/line[1]/math[1]/mroot[1]", model.getPath());
				var node = model.getFocusNode();
				t.is("mroot", node.nodeName);
				t.is(1, model.getOffset());
  			},
  			tearDown: function(){
  				
  			}
	    },{
	    	name: "从根数后右移出根式，到根式后，根数的最后一个节点是layout节点。",
  			setUp: function(){
  				this.model = new Model({});
  			},
  			runTest: function(t){
  				var model = this.model;
  				model.mode = "mathml";
  				model.loadData("<root><line>" +
  						"<math>" +
	  						"<mroot>" +
		  						"<mrow><mroot><mrow><mn>1</mn></mrow><mrow><mn>2</mn></mrow></mroot></mrow>" + // base
		  						"<mrow><mn>12</mn></mrow>" + // index
	  						"</mroot>" +
  						"</math>" +
  				"</line></root>");
  				
  				var line = model.getLineAt(0);
  				model.anchor.node = line.firstChild.firstChild.firstChild.firstChild;
  				model.anchor.offset = 1;
  				model.path = [];model.path.push({nodeName: "root"});
  				model.path.push({nodeName: "line", offset: 1});
  				model.path.push({nodeName: "math", offset: 1});
  				model.path.push({nodeName: "mroot", offset: 1});
  				model.path.push({nodeName: "mrow", offset: 1});
  				model.path.push({nodeName: "mroot", offset: 1});
  				model.moveRight();
  				t.is("/root/line[1]/math[1]/mroot[1]", model.getPath());
				var node = model.getFocusNode();
				t.is("mroot", node.nodeName);
				t.is(1, model.getOffset());
  			},
  			tearDown: function(){
  				
  			}
	    }
            
	]);
});