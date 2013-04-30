define([ "doh","mathEditor/Model" ], function(doh,Model) {

	// summary:
	//		1.光标在整个分数之后，左删除删除整个分数，math中只有一个分数节点
	//		2.光标在整个分数之后，左删除删除整个分数，分数前是一个token节点
	//		3.光标在整个分数之后，左删除删除整个分数，分数前是一个layout节点
	//		4.光标在整个分数之后，左删除删除整个分数，分数前没有节点，分数后有一个token节点
	//		5.光标在整个分数之后，左删除删除整个分数，分数前没有节点，分数后有一个layout节点
	//
	//		2.光标在分母上，分母里没有内容，左删除删掉分数结构，留下分子中的内容，光标在后面
	//		3.光标在分子上，分子里没有任何内容，左删除删掉分子结构，留下分母中的内容，光标在前面
	doh.register("Model.removeLeft.frac 左删除分数中的内容或整个分数",[
	    {
	    	name: "光标在整个分数之后，左删除删除整个分数，math中只有一个分数节点",
  			setUp: function(){
  				this.model = new Model({});
  			},
  			runTest: function(t){
  				var model = this.model;
  				model.loadData("<root><line><math>" +
  						"<mfrac><mrow><mn>1</mn></mrow><mrow><mn>2</mn></mrow></mfrac>" +
  				"</math></line></root>");
  				model.mode = "mathml";
  				var line = model.getLineAt(0);
  				model.anchor.node = line.firstChild.firstChild;
  				model.anchor.offset = 1;
  				model.path.push({nodeName: "root"});
  				model.path.push({nodeName: "line", offset: 1});
  				model.path.push({nodeName: "math", offset: 1});
  				model.path.push({nodeName: "mfrac", offset: 1});
  				model.removeLeft();
  				// 空的math，在获取焦点时，才显示；否则只占位，不显示。不在空的math中添加mn占位符。
  				var focusNode = model.getFocusNode();
  				t.is("/root/line[1]/math[1]", model.getPath());
  				t.is("math", focusNode.nodeName);
  				t.is(0, model.getOffset()); // 因为没有内容，所以偏移量为0
  				t.is(0, focusNode.childNodes.length)// 确保mfrac节点从math中删除
  			},
  			tearDown: function(){
  				
  			}
	    },{
	    	name: "光标在整个分数之后，左删除删除整个分数，分数前是一个token节点",
  			setUp: function(){
  				this.model = new Model({});
  			},
  			runTest: function(t){
  				var model = this.model;
  				model.loadData("<root><line><math>" +
  						"<mn>1234</mn>" +
  						"<mfrac><mrow><mn>1</mn></mrow><mrow><mn>2</mn></mrow></mfrac>" +
  				"</math></line></root>");
  				model.mode = "mathml";
  				var line = model.getLineAt(0);
  				model.anchor.node = line.firstChild.lastChild;
  				model.anchor.offset = 1;
  				model.path.push({nodeName: "root"});
  				model.path.push({nodeName: "line", offset: 1});
  				model.path.push({nodeName: "math", offset: 1});
  				model.path.push({nodeName: "mfrac", offset: 2});
  				model.removeLeft();
  				// 空的math，在获取焦点时，才显示；否则只占位，不显示。不在空的math中添加mn占位符。
  				var focusNode = model.getFocusNode();
  				t.is("/root/line[1]/math[1]/mn[1]", model.getPath());
  				t.is("mn", focusNode.nodeName);
  				t.is(4, model.getOffset()); // 因为没有内容，所以偏移量为0
  				t.is("1234", focusNode.textContent);
  				t.is(1, line.firstChild.childNodes.length)// 确保mfrac节点从math中删除
  			},
  			tearDown: function(){
  				
  			}
	    }
	                             
	]);
});