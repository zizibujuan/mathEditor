define([ "doh","mathEditor/Model" ], function(doh,Model) {

	// summary:
	//		删除整个平方根(因为删除整个平方根的逻辑与删除分数的逻辑是一样的，所以不再提供测试用例，只测试平方根专有的逻辑)
	//		1.光标在整个平方根之后，删除光标左边的整个分数，math节点中只有一个平方根
	//		左删除删除根数
	//		1.如果根数中没有任何内容，则直接删除掉根式
	//		左删除完后，根数中没有内容时，用占位符替代
	//		1.剩一个token节点，token中只有一个字符
	//		2.剩下一个layout节点
	doh.register("Model.removeLeft.sqrt 左删除平方根",[
	    {
	    	name: "左删除整个平方根，光标在整个平方根之后，删除光标左边的整个分数，math节点中只有一个平方根。",
  			setUp: function(){
  				this.model = new Model({});
  			},
  			runTest: function(t){
  				var model = this.model;
  				model.loadData("<root><line>" +
  						"<math><msqrt><mrow><mn>2</mn></mrow></msqrt></math>" +
  				"</line></root>");
  				model.mode = "mathml";
  				var line = model.getLineAt(0);
  				model.anchor.node = line.firstChild.firstChild;
  				model.anchor.offset = 1;
  				model.path = [];
  				model.path.push({nodeName: "root"});
  				model.path.push({nodeName: "line", offset: 1});
  				model.path.push({nodeName: "math", offset: 1});
  				model.path.push({nodeName: "msqrt", offset: 1});
  				model.removeLeft();
  				
  				var focusNode = model.getFocusNode();
  				t.is("/root/line[1]/math[1]", model.getPath());
  				t.is("math", focusNode.nodeName);
  				t.is(2, model.getOffset()); // 因为没有内容，所以偏移量为layoutOffset.select
  				t.is(0, focusNode.childNodes.length);
  			},
  			tearDown: function(){
  				
  			}
	    },{
	    	name: "左删除删除根数，如果根数中没有任何内容，则直接删除掉根式。",
  			setUp: function(){
  				this.model = new Model({});
  			},
  			runTest: function(t){
  				var model = this.model;
  				// msqrt中包含一个隐含的mrow，因此在测试用例中不显式使用mrow
  				model.loadData("<root><line>" +
  						"<math><msqrt><mn class=\"drip_placeholder_box\">8</mn></msqrt></math>" +
  				"</line></root>");
  				model.mode = "mathml";
  				var line = model.getLineAt(0);
  				model.anchor.node = line.firstChild.firstChild.firstChild;
  				model.anchor.offset = 0;
  				model.path = [];
  				model.path.push({nodeName: "root"});
  				model.path.push({nodeName: "line", offset: 1});
  				model.path.push({nodeName: "math", offset: 1});
  				model.path.push({nodeName: "msqrt", offset: 1});
  				model.path.push({nodeName: "mn", offset: 1});
  				model.removeLeft();
  				
  				var focusNode = model.getFocusNode();
  				t.is("/root/line[1]/math[1]", model.getPath());
  				t.is("math", focusNode.nodeName);
  				t.is(2, model.getOffset());// layoutOffset.select
  				t.is(0, focusNode.childNodes.length);
  			},
  			tearDown: function(){
  				
  			}
	    },{
	    	name: "左删除完后，根数中没有内容时，用占位符替代，剩一个token节点，token中只有一个字符。",
  			setUp: function(){
  				this.model = new Model({});
  			},
  			runTest: function(t){
  				var model = this.model;
  				model.loadData("<root><line>" +
  						"<math><msqrt><mrow><mn>1</mn></mrow></msqrt></math>" +
  				"</line></root>");
  				model.mode = "mathml";
  				var line = model.getLineAt(0);
  				model.anchor.node = line.firstChild.firstChild.firstChild.firstChild;
  				model.anchor.offset = 1;
  				model.path = [];
  				model.path.push({nodeName: "root"});
  				model.path.push({nodeName: "line", offset: 1});
  				model.path.push({nodeName: "math", offset: 1});
  				model.path.push({nodeName: "msqrt", offset: 1});
  				model.path.push({nodeName: "mrow", offset: 1});
  				model.path.push({nodeName: "mn", offset: 1});
  				model.removeLeft();
  			// 空的math，在获取焦点时，才显示；否则只占位，不显示。不在空的math中添加mn占位符。
  				var focusNode = model.getFocusNode();
  				t.is("/root/line[1]/math[1]/msqrt[1]/mrow[1]/mn[1]", model.getPath());
  				t.is("mn", focusNode.nodeName);
  				t.is(0, model.getOffset());
  				t.is("drip_placeholder_box", focusNode.getAttribute("class"));// 是占位符
  				// 确定新的节点是占位符
  				t.is(focusNode, line.firstChild.firstChild.firstChild.firstChild);
  			},
  			tearDown: function(){
  				
  			}
	    }
	                             
	]);
});