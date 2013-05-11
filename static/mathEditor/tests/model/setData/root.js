define([ "doh","mathEditor/Model" ], function(doh,Model) {

	doh.register("Model.setData.root 开根号",[
	    {
			name: "mathml模式下，在空的数学编辑器上输入N次方根",
			setUp: function(){
				this.model = new Model({});
			},
			runTest: function(t){
				/*
				 * <msqrt> base </msqrt>
				 * <mroot> base index </mroot>
				 * msqrt、mroot中的内容都使用mrow封装
				 * 
				 * 让index获取焦点，因为index的值往往很简单，输入完成后去输入base；如果先输入base，需要倒退到左上角。
				 * 注意，index在界面上显示时在左上角，但是在mathml中显示在base的右边。
				 */
				var model = this.model;
				model.toMathMLMode();
				model.setData({data:"", nodeName:"mroot"});
				t.is("/root/line[1]/math[1]/mroot[1]/mrow[2]/mn[1]", model.getPath());
				
				var node = model.getFocusNode();
				t.is("mn", node.nodeName);
				t.is("drip_placeholder_box", node.getAttribute("class"));
				t.is(0, model.getOffset());
				
				var baseNode = node.parentNode.previousSibling.firstChild;
				t.is("mn", baseNode.nodeName);
				t.is("drip_placeholder_box", baseNode.getAttribute("class"));
			},
			tearDown: function(){
				
			}
		},// 在layout节点后输入layout节点
		{
			name: "在layout节点后输入mroot节点，layout没有被mstyle封装",
			setUp: function(){
				this.model = new Model({});
			},
			runTest: function(t){
				var model = this.model;
				model.loadData("<root><line><math><mfrac></mfrac></math></line></root>");
				model.mode = "mathml";
				var line = model.getLineAt(0);
				model.anchor.node = line.firstChild.firstChild;
				model.anchor.offset = 1;
				model.path = [];
				model.path.push({nodeName:"root"});
				model.path.push({nodeName:"line", offset:1});
				model.path.push({nodeName:"math", offset:1});
				model.path.push({nodeName:"mfrac", offset:1});
				
				model.setData({data:"", nodeName:"mroot"});
				t.is("/root/line[1]/math[1]/mroot[2]/mrow[2]/mn[1]", model.getPath());// 根次获取焦点
				
				var node = model.getFocusNode();
				t.is("mn", node.nodeName);
				t.is("drip_placeholder_box", node.getAttribute("class"));
				t.is(0, model.getOffset());
				
				t.is(2, line.firstChild.childElementCount);
				t.is(node.parentNode.parentNode, line.firstChild.lastChild);
			},
			tearDown: function(){
				
			}
		},{
			name: "在layout节点后输入mroot节点，layout被mstyle封装",
			setUp: function(){
				this.model = new Model({});
			},
			runTest: function(t){
				var model = this.model;
				model.loadData("<root><line><math><mstyle><mfrac></mfrac></mstyle></math></line></root>");
				model.mode = "mathml";
				var line = model.getLineAt(0);
				model.anchor.node = line.firstChild.firstChild.firstChild;
				model.anchor.offset = 1;
				model.path = [];
				model.path.push({nodeName:"root"});
				model.path.push({nodeName:"line", offset:1});
				model.path.push({nodeName:"math", offset:1});
				model.path.push({nodeName:"mfrac", offset:1});
				
				model.setData({data:"", nodeName:"mroot"});
				t.is("/root/line[1]/math[1]/mroot[2]/mrow[2]/mn[1]", model.getPath());
				
				var node = model.getFocusNode();
				t.is("mn", node.nodeName);
				t.is("drip_placeholder_box", node.getAttribute("class"));
				t.is(0, model.getOffset());
				
				t.is(2, line.firstChild.childElementCount);
				t.is(node.parentNode.parentNode, line.firstChild.lastChild);
			},
			tearDown: function(){
				
			}
		},{
			name: "在layout节点后,输入mi节点，然后删除mi节点，然后输入mroot节点，layout被mstyle封装",
			setUp: function(){
				this.model = new Model({});
			},
			runTest: function(t){
				var model = this.model;
				model.loadData("<root><line><math><mstyle><mfrac><mrow><mn>1</mn></mrow><mrow><mn>1</mn></mrow></mfrac></mstyle></math></line></root>");
				model.mode = "mathml";
				var line = model.getLineAt(0);
				model.anchor.node = line.firstChild.firstChild.firstChild;
				model.anchor.offset = 1;
				model.path = [];
				model.path.push({nodeName:"root"});
				model.path.push({nodeName:"line", offset:1});
				model.path.push({nodeName:"math", offset:1});
				model.path.push({nodeName:"mfrac", offset:1});
				model.setData({data:"s", nodeName:"mi"});
				model.removeLeft();
				model.setData({data:"", nodeName:"mroot"});
				t.is("/root/line[1]/math[1]/mroot[2]/mrow[2]/mn[1]", model.getPath());
				
				var node = model.getFocusNode();
				t.is("mn", node.nodeName);
				t.is("drip_placeholder_box", node.getAttribute("class"));
				t.is(0, model.getOffset());
				
				t.is(2, line.firstChild.childElementCount);
				t.is(node.parentNode.parentNode, line.firstChild.lastChild);
			},
			tearDown: function(){
				
			}
		},
		
		// 在layout节点前输入layout节点
		{
			name: "在layout节点前输入mroot节点，layout没有被mstyle封装",
			setUp: function(){
				this.model = new Model({});
			},
			runTest: function(t){
				var model = this.model;
				model.loadData("<root><line><math><mfrac></mfrac></math></line></root>");
				model.mode = "mathml";
				var line = model.getLineAt(0);
				model.anchor.node = line.firstChild.firstChild;
				model.anchor.offset = 0;
				model.path = [];
				model.path.push({nodeName:"root"});
				model.path.push({nodeName:"line", offset:1});
				model.path.push({nodeName:"math", offset:1});
				model.path.push({nodeName:"mfrac", offset:1});
				
				model.setData({data:"", nodeName:"mroot"});
				t.is("/root/line[1]/math[1]/mroot[1]/mrow[2]/mn[1]", model.getPath());
				
				var node = model.getFocusNode();
				t.is("mn", node.nodeName);
				t.is("drip_placeholder_box", node.getAttribute("class"));
				t.is(0, model.getOffset());
				
				t.is(2, line.firstChild.childElementCount);
				t.is(node.parentNode.parentNode, line.firstChild.firstChild);
			},
			tearDown: function(){
				
			}
		},{
			name: "在layout节点前输入mroot节点，layout被mstyle封装",
			setUp: function(){
				this.model = new Model({});
			},
			runTest: function(t){
				var model = this.model;
				model.loadData("<root><line><math><mstyle><mfrac></mfrac></mstyle></math></line></root>");
				model.mode = "mathml";
				var line = model.getLineAt(0);
				model.anchor.node = line.firstChild.firstChild.firstChild;
				model.anchor.offset = 0;
				model.path = [];
				model.path.push({nodeName:"root"});
				model.path.push({nodeName:"line", offset:1});
				model.path.push({nodeName:"math", offset:1});
				model.path.push({nodeName:"mfrac", offset:1});
				
				model.setData({data:"", nodeName:"mroot"});
				t.is("/root/line[1]/math[1]/mroot[1]/mrow[2]/mn[1]", model.getPath());
				
				var node = model.getFocusNode();
				t.is("mn", node.nodeName);
				t.is("drip_placeholder_box", node.getAttribute("class"));
				t.is(0, model.getOffset());
				
				t.is(2, line.firstChild.childElementCount);
				t.is(node.parentNode.parentNode, line.firstChild.firstChild);
			},
			tearDown: function(){
				
			}
		},{
			name: "在layout节点前,输入mi节点，然后删除mi节点，然后输入mroot节点，layout被mstyle封装",
			setUp: function(){
				this.model = new Model({});
			},
			runTest: function(t){
				var model = this.model;
				model.loadData("<root><line><math><mstyle><mfrac><mrow><mn>1</mn></mrow><mrow><mn>1</mn></mrow></mfrac></mstyle></math></line></root>");
				model.mode = "mathml";
				var line = model.getLineAt(0);
				model.anchor.node = line.firstChild.firstChild.firstChild;
				model.anchor.offset = 0;
				model.path = [];
				model.path.push({nodeName:"root"});
				model.path.push({nodeName:"line", offset:1});
				model.path.push({nodeName:"math", offset:1});
				model.path.push({nodeName:"mfrac", offset:1});
				model.setData({data:"s", nodeName:"mi"});
				model.removeLeft();
				model.setData({data:"", nodeName:"mroot"});
				t.is("/root/line[1]/math[1]/mroot[1]/mrow[2]/mn[1]", model.getPath());
				
				var node = model.getFocusNode();
				t.is("mn", node.nodeName);
				t.is("drip_placeholder_box", node.getAttribute("class"));
				t.is(0, model.getOffset());
				
				t.is(2, line.firstChild.childElementCount);
				t.is(node.parentNode.parentNode, line.firstChild.firstChild);
			},
			tearDown: function(){
				
			}
		} 
	                             
	]);
});