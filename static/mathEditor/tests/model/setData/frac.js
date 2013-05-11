define([ "doh", "mathEditor/tests/testUtil", "mathEditor/Model" ], function(doh,testUtil,Model) {

	// summary:
	//		1.在空math中输入frac
	//		2.在token节点后输入frac
	//		3.在layout节点后输入frac,layout没有被mstyle封装
	//		4.在layout节点后输入frac,layout被mstyle封装
	//		5.在token节点前输入frac
	//		6.在layout节点前输入frac，layout没有被mstyle封装
	//		7.在layout节点前输入frac，layout被mstyle封装
	//		2.在任何空的layout节点中输入frac
	//		3.在mn节点中输入frac
	doh.register("Model.setData.frac 分数",[
		{
			name: "mathml模式下，在一个空的model中加入一个空的分数，分子获取焦点",
			setUp: function(){
				this.model = new Model({});
			},
			runTest: function(t){
				/**
  				 * <pre>
  				 * <math>
  				 * <mstyle>
  				 * 	<mfrac>
  				 *    <mrow><mn>8</mn></mrow>
  				 *    <mrow><mn></mn></mrow>
  				 *  <mfrac>
  				 *  </mstyle>
  				 * </math>
  				 * </pre>
  				 */
				var model = this.model;
				model.loadData("<root><line><math></math></line></root>");
				model.mode = "mathml";
				var line = model.getLineAt(0);
				model.anchor.node = line.firstChild;
				model.anchor.offset = 2;// layoutOffset.select
				model.path = [];
				model.path.push({nodeName: "root"});
				model.path.push({nodeName: "line", offset: 1});
				model.path.push({nodeName: "math", offset: 1});
				model.setData({data:"", nodeName:"mfrac"});
				
				t.is("/root/line[1]/math[1]/mfrac[1]/mrow[1]/mn[1]", model.getPath()); //创建完成后，让分子先获取焦点
				var node = model.getFocusNode();
				// 确保选中的是分子节点
				t.t(node.parentNode.previousSibling == null);
				testUtil.isPlaceHolder(t, model.anchor);
			},
			tearDown: function(){
				
			}
		},{
			name: "在token节点后输入frac",
			setUp: function(){
				this.model = new Model({});
			},
			runTest: function(t){
				var model = this.model;
				model.loadData("<root><line><math><mn>12</mn></math></line></root>");
				model.mode = "mathml";
				var line = model.getLineAt(0);
				model.anchor.node = line.firstChild.firstChild;
				model.anchor.offset = 2;
				model.path = [];
				model.path.push({nodeName: "root"});
				model.path.push({nodeName: "line", offset: 1});
				model.path.push({nodeName: "math", offset: 1});
				model.path.push({nodeName: "mn", offset: 1});
				model.setData({data:"", nodeName:"mfrac"});
				//创建完成后，让分子先获取焦点
				t.is("/root/line[1]/math[1]/mfrac[2]/mrow[1]/mn[1]", model.getPath()); 
				var node = model.getFocusNode();
				// 确保选中的是分子节点
				t.t(node.parentNode.previousSibling == null);
				testUtil.isPlaceHolder(t, model.anchor);
				// 判断新的mfrac是添加在mstyle之后，而不是mstyle中
				t.is(2, line.firstChild.childElementCount);
				// 确定新插入的mfrac在layout后
				t.is(node.parentNode.parentNode.parentNode, line.firstChild.lastChild);
			},
			tearDown: function(){
				
			}
		},{
			name: "在layout节点后输入frac,layout节点没有被mstyle封装",
			setUp: function(){
				this.model = new Model({});
			},
			runTest: function(t){
				var model = this.model;
				model.loadData("<root><line>" +
						"<math>" +
						"<mfrac><mrow><mn>1</mn></mrow><mrow><mn>2</mn></mrow></mfrac>" +
						"</math>" +
						"</line></root>");
				model.mode = "mathml";
				var line = model.getLineAt(0);
				model.anchor.node = line.firstChild.firstChild;
				model.anchor.offset = 1;
				model.path = [];
				model.path.push({nodeName: "root"});
				model.path.push({nodeName: "line", offset: 1});
				model.path.push({nodeName: "math", offset: 1});
				model.path.push({nodeName: "mfrac", offset: 1});
				model.setData({data:"", nodeName:"mfrac"});
				//创建完成后，让分子先获取焦点
				t.is("/root/line[1]/math[1]/mfrac[2]/mrow[1]/mn[1]", model.getPath()); 
				var node = model.getFocusNode();
				// 确保选中的是分子节点
				t.t(node.parentNode.previousSibling == null);
				testUtil.isPlaceHolder(t, model.anchor);
				// 判断新的mfrac是添加在mstyle之后，而不是mstyle中
				t.is(2, line.firstChild.childElementCount);
				// 确定新插入的mfrac在layout后
				t.is(node.parentNode.parentNode.parentNode, line.firstChild.lastChild);
			},
			tearDown: function(){
				
			}
		},{
			name: "在layout节点后输入frac,layout节点被mstyle封装",
			setUp: function(){
				this.model = new Model({});
			},
			runTest: function(t){
				var model = this.model;
				model.loadData("<root><line>" +
						"<math>" +
						"<mstyle><mfrac><mrow><mn>1</mn></mrow><mrow><mn>2</mn></mrow></mfrac></mstyle>" +
						"</math>" +
						"</line></root>");
				model.mode = "mathml";
				var line = model.getLineAt(0);
				model.anchor.node = line.firstChild.firstChild.firstChild;
				model.anchor.offset = 1;
				model.path = [];
				model.path.push({nodeName: "root"});
				model.path.push({nodeName: "line", offset: 1});
				model.path.push({nodeName: "math", offset: 1});
				model.path.push({nodeName: "mfrac", offset: 1});
				model.setData({data:"", nodeName:"mfrac"});
				//创建完成后，让分子先获取焦点
				t.is("/root/line[1]/math[1]/mfrac[2]/mrow[1]/mn[1]", model.getPath()); 
				var node = model.getFocusNode();
				// 确保选中的是分子节点
				t.t(node.parentNode.previousSibling == null);
				testUtil.isPlaceHolder(t, model.anchor);
				// 判断新的mfrac是添加在mstyle之后，而不是mstyle中
				t.is(2, line.firstChild.childElementCount);
				// 确定新插入的mfrac在layout后
				t.is(node.parentNode.parentNode.parentNode, line.firstChild.lastChild);
			},
			tearDown: function(){
				
			}
		},{
			name: "在token节点前输入frac",
			setUp: function(){
				this.model = new Model({});
			},
			runTest: function(t){
				var model = this.model;
				model.loadData("<root><line><math><mn>12</mn></math></line></root>");
				model.mode = "mathml";
				var line = model.getLineAt(0);
				model.anchor.node = line.firstChild.firstChild;
				model.anchor.offset = 0;
				model.path = [];
				model.path.push({nodeName: "root"});
				model.path.push({nodeName: "line", offset: 1});
				model.path.push({nodeName: "math", offset: 1});
				model.path.push({nodeName: "mn", offset: 1});
				model.setData({data:"", nodeName:"mfrac"});
				//创建完成后，让分子先获取焦点
				t.is("/root/line[1]/math[1]/mfrac[1]/mrow[1]/mn[1]", model.getPath()); 
				var node = model.getFocusNode();
				// 确保选中的是分子节点
				t.t(node.parentNode.previousSibling == null);
				testUtil.isPlaceHolder(t, model.anchor);
				// 确定新插入的mfrac在layout前
				t.is(node.parentNode.parentNode.parentNode, line.firstChild.firstChild);
			},
			tearDown: function(){
				
			}
		},{
			name: "在layout节点前输入frac,layout节点没有被mstyle封装",
			setUp: function(){
				this.model = new Model({});
			},
			runTest: function(t){
				var model = this.model;
				model.loadData("<root><line>" +
						"<math>" +
						"<mfrac><mrow><mn>1</mn></mrow><mrow><mn>2</mn></mrow></mfrac>" +
						"</math>" +
						"</line></root>");
				model.mode = "mathml";
				var line = model.getLineAt(0);
				model.anchor.node = line.firstChild.firstChild;
				model.anchor.offset = 0;
				model.path = [];
				model.path.push({nodeName: "root"});
				model.path.push({nodeName: "line", offset: 1});
				model.path.push({nodeName: "math", offset: 1});
				model.path.push({nodeName: "mfrac", offset: 1});
				model.setData({data:"", nodeName:"mfrac"});
				//创建完成后，让分子先获取焦点
				t.is("/root/line[1]/math[1]/mfrac[1]/mrow[1]/mn[1]", model.getPath()); 
				var node = model.getFocusNode();
				// 确保选中的是分子节点
				t.t(node.parentNode.previousSibling == null);
				testUtil.isPlaceHolder(t, model.anchor);
				// 确定新插入的mfrac在layout前
				t.is(node.parentNode.parentNode.parentNode, line.firstChild.firstChild);
			},
			tearDown: function(){
				
			}
		},{
			name: "在layout节点前输入frac,layout节点被mstyle封装",
			setUp: function(){
				this.model = new Model({});
			},
			runTest: function(t){
				var model = this.model;
				model.loadData("<root><line>" +
						"<math>" +
						"<mstyle><mfrac><mrow><mn>1</mn></mrow><mrow><mn>2</mn></mrow></mfrac></mstyle>" +
						"</math>" +
						"</line></root>");
				model.mode = "mathml";
				var line = model.getLineAt(0);
				model.anchor.node = line.firstChild.firstChild.firstChild;
				model.anchor.offset = 0;
				model.path = [];
				model.path.push({nodeName: "root"});
				model.path.push({nodeName: "line", offset: 1});
				model.path.push({nodeName: "math", offset: 1});
				model.path.push({nodeName: "mfrac", offset: 1});
				model.setData({data:"", nodeName:"mfrac"});
				//创建完成后，让分子先获取焦点
				t.is("/root/line[1]/math[1]/mfrac[1]/mrow[1]/mn[1]", model.getPath()); 
				var node = model.getFocusNode();
				// 确保选中的是分子节点
				t.t(node.parentNode.previousSibling == null);
				testUtil.isPlaceHolder(t, model.anchor);
				// 判断新的mfrac是添加在mstyle之后，而不是mstyle中
				t.is(2, line.firstChild.childElementCount);
				// 确定新插入的mfrac在layout前
				t.is(node.parentNode.parentNode.parentNode, line.firstChild.firstChild);
			},
			tearDown: function(){
				
			}
		},{
			name: "在mn节点中输入mfrac",
			setUp: function(){
				this.model = new Model({});
			},
			runTest: function(t){
				var model = this.model;
				model.loadData("<root><line>" +
						"<math>" +
						"<mn>123</mn>" +
						"</math>" +
						"</line></root>");
				model.mode = "mathml";
				var line = model.getLineAt(0);
				model.anchor.node = line.firstChild.firstChild;
				model.anchor.offset = 1;
				model.path = [];
				model.path.push({nodeName: "root"});
				model.path.push({nodeName: "line", offset: 1});
				model.path.push({nodeName: "math", offset: 1});
				model.path.push({nodeName: "mn", offset: 1});
				model.setData({data:"", nodeName:"mfrac"});
				//创建完成后，让分子先获取焦点
				t.is("/root/line[1]/math[1]/mfrac[2]/mrow[1]/mn[1]", model.getPath()); 
				var node = model.getFocusNode();
				// 确保选中的是分子节点
				t.t(node.parentNode.previousSibling == null);
				testUtil.isPlaceHolder(t, model.anchor);
				// 判断新的mfrac是添加在mstyle之后，而不是mstyle中
				t.is(3, line.firstChild.childElementCount);
				// 确定新插入的mfrac在layout前
				t.is(node.parentNode.parentNode.parentNode, line.firstChild.firstChild.nextSibling);
			},
			tearDown: function(){
				
			}
		},{
  			name: "在一个已输入中文的model中加入一个空的分数",
  			setUp: function(){
  				this.model = new Model({});
  			},
  			runTest: function(t){
  				var model = this.model;
  				model.setData({data:"你"});
  				model.toMathMLMode();
  				model.setData({data:"", nodeName:"mfrac"});
  				t.is("/root/line[1]/math[2]/mfrac[1]/mrow[1]/mn[1]", model.getPath()); //创建完成后，让分子先获取焦点
  				var node = model.getFocusNode();
  				// 确保选中的是分子节点
  				t.t(node.parentNode.previousSibling == null);
  				t.is("mn", node.nodeName);
  				t.is("drip_placeholder_box", node.getAttribute("class"));
  				t.is(0, model.getOffset());
  			},
  			tearDown: function(){
  				
  			}
  		},{
  			name: "在两个已输入中文中间加入一个空的分数",
  			setUp: function(){
  				this.model = new Model({});
  			},
  			runTest: function(t){
  				var model = this.model;
  				model.setData({data:"你我"});
  				model.anchor.offset--;
  				model.toMathMLMode();
  				model.setData({data:"", nodeName:"mfrac"});
  				t.is("/root/line[1]/math[2]/mfrac[1]/mrow[1]/mn[1]", model.getPath()); //创建完成后，让分子先获取焦点
  				var node = model.getFocusNode();
  				// 确保选中的是分子节点
  				t.t(node.parentNode.previousSibling == null);
  				t.is("mn", node.nodeName);
  				t.is("drip_placeholder_box", node.getAttribute("class"));
  				t.is(0, model.getOffset());
  				
  				var children = model.getLineAt(0).childNodes;
  				t.is(3, children.length);
  				t.is("text", children[0].nodeName);
  				t.is("math", children[1].nodeName);
  				t.is("text", children[2].nodeName);
  				
  				t.is("你", children[0].textContent);
  				t.is("我", children[2].textContent);
  			},
  			tearDown: function(){
  				
  			}
  		},{
  			name: "mathml模式下，在空的分数上的分子上输入第一个字符，清除占位符样式，并显示输入的字符",
  			setUp: function(){
  				this.model = new Model({});
  			},
  			runTest: function(t){
  				/**
  				 * <pre>
  				 * <math>
  				 * 	<mfrac>
  				 *    <mrow><mn>1</mn></mrow>
  				 *    <mrow><mn></mn></mrow>
  				 *  <mfrac>
  				 * </math>
  				 * </pre>
  				 */
  				var model = this.model;
  				model.toMathMLMode();
  				model.setData({data:"", nodeName:"mfrac"});
  				model.setData({data:"1"});
  				t.is("/root/line[1]/math[1]/mfrac[1]/mrow[1]/mn[1]", model.getPath());
  				var node = model.getFocusNode();
  				t.is("mn", node.nodeName);
  				t.isNot("drip_placeholder_box", node.getAttribute("class"));
  				t.is(1, model.getOffset());
  				
  				// 判断分子的值为1
  				t.is("mn", node.nodeName);
  				t.is("1", node.textContent);
  			},
  			tearDown: function(){
  				
  			}
  		}
	                             
	]);
});