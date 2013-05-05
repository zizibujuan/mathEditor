define([ "doh","mathEditor/Model" ], function(doh,Model) {

	// summary:
	//		以下节点下，只能包含一个参数，这个参数就是一个隐含的mrow节点：
	//		msqrt, mstyle, merror, mpadded, mphantom, menclose, mtd, mscarry, and math
	//		因此对于一个参数的节点，不在节点的路径中和节点中显式添加mrow节点。
	doh.register("Model.setData.sqrt 平方根",[
	    {
			name: "mathml模式下，在空的model中输入平方根",
			setUp: function(){
				this.model = new Model({});
			},
			runTest: function(t){
				/*
				 * <msqrt> base </msqrt>
				 * <mroot> base index </mroot>
				 * msqrt、mroot中的内容都使用mrow封装
				 */
				var model = this.model;
				model.toMathMLMode();
				model.setData({data:"", nodeName:"msqrt"});
				t.is("/root/line[1]/math[1]/msqrt[1]/mn[1]", model.getPath());
				
				var node = model.getFocusNode();
				t.is("mn", node.nodeName);
				t.is("drip_placeholder_box", node.getAttribute("class"));
				t.is(0, model.getOffset());
				
				var baseNode = node;
				t.is("msqrt", baseNode.parentNode.nodeName);// 确保不包含mrow节点
			},
			tearDown: function(){
				
			}
		},{
			name: "mathml模式下，在model中输入数字，然后输入平方根",
			setUp: function(){
				this.model = new Model({});
			},
			runTest: function(t){
				/*
				 * <msqrt> base </msqrt>
				 * <mroot> base index </mroot>
				 * msqrt、mroot中的内容都使用mrow封装
				 */
				var model = this.model;
				model.toMathMLMode();
				model.setData({data:"1"});
				model.setData({data:"", nodeName:"msqrt"});
				t.is("/root/line[1]/math[1]/msqrt[2]/mn[1]", model.getPath());
				
				var node = model.getFocusNode();
				t.is("mn", node.nodeName);
				t.is("drip_placeholder_box", node.getAttribute("class"));
				t.is(0, model.getOffset());
			},
			tearDown: function(){
				
			}
		},{
			name: "mathml模式下，输入平方根，然后在平方根下输入一个数字",
			setUp: function(){
				this.model = new Model({});
			},
			runTest: function(t){
				/*
				 * <msqrt> base </msqrt>
				 * <mroot> base index </mroot>
				 * msqrt、mroot中的内容都使用mrow封装
				 */
				var model = this.model;
				model.toMathMLMode();
				model.setData({data:"", nodeName:"msqrt"});
				model.setData({data:"1"});
				t.is("/root/line[1]/math[1]/msqrt[1]/mn[1]", model.getPath());
				
				var node = model.getFocusNode();
				t.is("mn", node.nodeName);
				t.is(1, model.getOffset());
				t.is("1", node.textContent);
			},
			tearDown: function(){
				
			}
		},{
			name: "在token节点前面输入msqrt",
			setUp: function(){
				this.model = new Model({});
			},
			runTest: function(t){
				var model = this.model;
				model.loadData("<root><line><math><mn>1</mn></math></line></root>");
				model.mode = "mathml";
				var line = model.getLineAt(0);
				model.anchor.node = line.firstChild.firstChild;
				model.anchor.offset = 0;
				model.path.push({nodeName:"root"});
				model.path.push({nodeName:"line", offset:1});
				model.path.push({nodeName:"math", offset:1});
				model.path.push({nodeName:"mn", offset:1});
				
				model.setData({data:"", nodeName:"msqrt"});
				t.is("/root/line[1]/math[1]/msqrt[1]/mn[1]", model.getPath());
				
				var node = model.getFocusNode();
				t.is("mn", node.nodeName);
				t.is("drip_placeholder_box", node.getAttribute("class"));
				t.is(0, model.getOffset());
				
				// 确保，后面的token节点还在
				t.is("mn", node.parentNode.nextSibling.nodeName);
			},
			tearDown: function(){
				
			}
		}
	                             
	]);
});