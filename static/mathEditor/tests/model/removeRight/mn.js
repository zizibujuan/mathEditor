define([ "doh","mathEditor/Model" ], function(doh,Model) {

	doh.register("Model.removeRight.mn",[
	    {
	    	name: "删除右边的字符，删除占位符",// FIXME：删除占位符，需要具体问题，具体分析
  			setUp: function(){
  				this.model = new Model({});
  			},
  			runTest: function(t){
  				var model = this.model;
  				model.loadData("<root><line><math><mn class=\"drip_placeholder_box\">8</mn></math></line></root>");
  				model.mode = "mathml";
  				var line = model.getLineAt(0);
  				model.anchor.node = line.firstChild.firstChild;
  				model.anchor.offset = 0;
  				model.path.push({nodeName: "root"});
  				model.path.push({nodeName: "line", offset: 1});
  				model.path.push({nodeName: "math", offset: 1});
  				model.path.push({nodeName: "mn", offset: 1});
  				model.removeRight();
  				
  				var focusNode = model.getFocusNode();
  				t.is("/root/line[1]/math[1]", model.getPath());
  				t.is("math", focusNode.nodeName);
  				t.is(2, model.getOffset()); // layoutOffset.select
  				t.is(0, focusNode.childNodes.length);
  			},
  			tearDown: function(){
  				
  			}
	    },{
	    	name: "删除右边的字符，math中只有一个mn节点",
  			setUp: function(){
  				this.model = new Model({});
  			},
  			runTest: function(t){
  				var model = this.model;
  				model.loadData("<root><line><math><mn>8</mn></math></line></root>");
  				model.mode = "mathml";
  				var line = model.getLineAt(0);
  				model.anchor.node = line.firstChild.firstChild;
  				model.anchor.offset = 0;
  				model.path.push({nodeName: "root"});
  				model.path.push({nodeName: "line", offset: 1});
  				model.path.push({nodeName: "math", offset: 1});
  				model.path.push({nodeName: "mn", offset: 1});
  				model.removeRight();
  				
  				var focusNode = model.getFocusNode();
  				t.is("/root/line[1]/math[1]", model.getPath());
  				t.is("math", focusNode.nodeName);
  				t.is(2, model.getOffset()); // layoutOffset.select
  				t.is(0, focusNode.childNodes.length);
  			},
  			tearDown: function(){
  				
  			}
	    },{
	    	name: "在mi节点后有一个mn节点，光标在mi节点后,mn中只包含一个数字，删除mn节点",
  			setUp: function(){
  				this.model = new Model({});
  			},
  			runTest: function(t){
  				var model = this.model;
  				model.loadData("<root><line>" +
  						"<math>" +
  							"<mi>x</mi>" +
	  						"<mn>1</mn>" +
  						"</math></line></root>");
  				model.mode = "mathml";
  				var line = model.getLineAt(0);
  				model.anchor.node = line.firstChild.firstChild;
  				model.anchor.offset = 1;
  				model.path.push({nodeName: "root"});
  				model.path.push({nodeName: "line", offset: 1});
  				model.path.push({nodeName: "math", offset: 1});
  				model.path.push({nodeName: "mi", offset: 1});
  				model.removeRight();
  				
  				var focusNode = model.getFocusNode();
  				t.is("/root/line[1]/math[1]/mi[1]", model.getPath());
  				t.is("mi", focusNode.nodeName);
  				t.is(1, model.getOffset());
  				t.is(1, focusNode.parentNode.childNodes.length);
  			},
  			tearDown: function(){
  				
  			}
	    },{
	    	name: "在mi节点后有一个mn节点，光标在mi节点后，mn中包含两个数字，删除mn节点中的内容",
  			setUp: function(){
  				this.model = new Model({});
  			},
  			runTest: function(t){
  				var model = this.model;
  				model.loadData("<root><line>" +
  						"<math>" +
  							"<mi>x</mi>" +
	  						"<mn>12</mn>" +
  						"</math></line></root>");
  				model.mode = "mathml";
  				var line = model.getLineAt(0);
  				model.anchor.node = line.firstChild.firstChild;
  				model.anchor.offset = 1;
  				model.path.push({nodeName: "root"});
  				model.path.push({nodeName: "line", offset: 1});
  				model.path.push({nodeName: "math", offset: 1});
  				model.path.push({nodeName: "mi", offset: 1});
  				model.removeRight();
  				// 删除时，光标的位置还是放在当前节点的最前面。
  				var focusNode = model.getFocusNode();
  				t.is("/root/line[1]/math[1]/mi[1]", model.getPath());
  				t.is("mi", focusNode.nodeName);
  				t.is(1, model.getOffset());
  				t.is(2, focusNode.parentNode.childNodes.length);
  				t.is("2", focusNode.nextSibling.textContent);
  			},
  			tearDown: function(){
  				
  			}
	    },{
	    	name: "有一个mn节点，mn节点中只有一个数字，光标在数字前",
  			setUp: function(){
  				this.model = new Model({});
  			},
  			runTest: function(t){
  				var model = this.model;
  				model.loadData("<root><line>" +
  						"<math>" +
	  						"<mn>1</mn>" +
  						"</math></line></root>");
  				model.mode = "mathml";
  				var line = model.getLineAt(0);
  				model.anchor.node = line.firstChild.firstChild;
  				model.anchor.offset = 0;
  				model.path.push({nodeName: "root"});
  				model.path.push({nodeName: "line", offset: 1});
  				model.path.push({nodeName: "math", offset: 1});
  				model.path.push({nodeName: "mn", offset: 1});
  				model.removeRight();
  				// 删除时，光标的位置还是放在当前节点的最前面。
  				var focusNode = model.getFocusNode();
  				t.is("/root/line[1]/math[1]", model.getPath());
  				t.is("math", focusNode.nodeName);
  				t.is(2, model.getOffset());
  				t.is(0, focusNode.childNodes.length);
  			},
  			tearDown: function(){
  				
  			}
	    },{
	    	name: "mi节点后有一个mn节点，光标在mn节点前，mn节点中只有一个数字",
  			setUp: function(){
  				this.model = new Model({});
  			},
  			runTest: function(t){
  				var model = this.model;
  				model.loadData("<root><line>" +
  						"<math>" +
  							"<mi>x</mi>" +
	  						"<mn>1</mn>" +
  						"</math></line></root>");
  				model.mode = "mathml";
  				var line = model.getLineAt(0);
  				model.anchor.node = line.firstChild.lastChild;
  				model.anchor.offset = 0;
  				model.path.push({nodeName: "root"});
  				model.path.push({nodeName: "line", offset: 1});
  				model.path.push({nodeName: "math", offset: 1});
  				model.path.push({nodeName: "mn", offset: 2});
  				model.removeRight();
  				// 删除时，光标的位置还是放在当前节点的最前面。
  				var focusNode = model.getFocusNode();
  				t.is("/root/line[1]/math[1]/mi[1]", model.getPath());
  				t.is("mi", focusNode.nodeName);
  				t.is(1, model.getOffset());
  				t.is(1, focusNode.parentNode.childNodes.length);
  			},
  			tearDown: function(){
  				
  			}
	    },{
	    	name: "mi节点后前一个mn节点，光标在mn节点前，mn节点中只有一个数字",
  			setUp: function(){
  				this.model = new Model({});
  			},
  			runTest: function(t){
  				var model = this.model;
  				model.loadData("<root><line>" +
  						"<math>" +
  							"<mn>1</mn>" +
  							"<mi>x</mi>" +
  						"</math></line></root>");
  				model.mode = "mathml";
  				var line = model.getLineAt(0);
  				model.anchor.node = line.firstChild.firstChild;
  				model.anchor.offset = 0;
  				model.path.push({nodeName: "root"});
  				model.path.push({nodeName: "line", offset: 1});
  				model.path.push({nodeName: "math", offset: 1});
  				model.path.push({nodeName: "mn", offset: 1});
  				model.removeRight();
  				// 删除时，光标的位置还是放在当前节点的最前面。
  				var focusNode = model.getFocusNode();
  				t.is("/root/line[1]/math[1]/mi[1]", model.getPath());
  				t.is("mi", focusNode.nodeName);
  				t.is(0, model.getOffset());
  				t.is(1, focusNode.parentNode.childNodes.length);
  			},
  			tearDown: function(){
  				
  			}
	    },{
	    	name: "mn中有多个值，在mn中间删除一个数字",
  			setUp: function(){
  				this.model = new Model({});
  			},
  			runTest: function(t){
  				var model = this.model;
  				model.loadData("<root><line>" +
  						"<math>" +
	  						"<mn>1234</mn>" +
  						"</math></line></root>");
  				model.mode = "mathml";
  				var line = model.getLineAt(0);
  				model.anchor.node = line.firstChild.firstChild;
  				model.anchor.offset = 1;
  				model.path.push({nodeName: "root"});
  				model.path.push({nodeName: "line", offset: 1});
  				model.path.push({nodeName: "math", offset: 1});
  				model.path.push({nodeName: "mn", offset: 1});
  				model.removeRight();
  				
  				var focusNode = model.getFocusNode();
  				t.is("/root/line[1]/math[1]/mn[1]", model.getPath());
  				t.is("mn", focusNode.nodeName);
  				t.is(1, model.getOffset());
  				t.is("134", focusNode.textContent);
  			},
  			tearDown: function(){
  				
  			}
	    },{
	    	name: "mn中有两个值，在mn前删除一个数字",
  			setUp: function(){
  				this.model = new Model({});
  			},
  			runTest: function(t){
  				var model = this.model;
  				model.loadData("<root><line>" +
  						"<math>" +
	  						"<mn>12</mn>" +
  						"</math></line></root>");
  				model.mode = "mathml";
  				var line = model.getLineAt(0);
  				model.anchor.node = line.firstChild.firstChild;
  				model.anchor.offset = 0;
  				model.path.push({nodeName: "root"});
  				model.path.push({nodeName: "line", offset: 1});
  				model.path.push({nodeName: "math", offset: 1});
  				model.path.push({nodeName: "mn", offset: 1});
  				model.removeRight();
  				
  				var focusNode = model.getFocusNode();
  				t.is("/root/line[1]/math[1]/mn[1]", model.getPath());
  				t.is("mn", focusNode.nodeName);
  				t.is(0, model.getOffset());
  				t.is("2", focusNode.textContent);
  			},
  			tearDown: function(){
  				
  			}
	    }
	                             
	]);
});