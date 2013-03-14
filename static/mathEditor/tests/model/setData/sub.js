define([ "doh","mathEditor/Model" ], function(doh,Model) {

	doh.register("Model.setData sub下标",[
	    {
			name: "在空的数学编辑器上直接输入下标",
			setUp: function(){
				this.model = new Model({});
			},
			runTest: function(t){
				/*
				 * <msub> base superscript </msub>
				 * msub中的内容都使用mrow封装
				 * 如果直接输入上标，并且适配不到base，则添加一个空的base和superscript，让superscript获取焦点
				 */
				var model = this.model;
				model.toMathMLMode();
				model.setData({data:"", nodeName:"msub"});
				t.is("/root/line[1]/math[1]/msub[1]/mrow[2]/mn[1]", model.getPath());
				
				var node = model.getFocusNode();
				t.is("mn", node.nodeName);
				t.is("drip_placeholder_box", node.getAttribute("class"));
				t.is(0, model.getOffset());
				
				var subscriptNode = node;
				t.is("msub", subscriptNode.parentNode.parentNode.nodeName);
				
				var baseNode = subscriptNode.parentNode.previousSibling.firstChild;
				t.is("mn", baseNode.nodeName);
				t.is("drip_placeholder_box", baseNode.getAttribute("class"));
			},
			tearDown: function(){
				
			}
		},{
			name: "在空的数学编辑器上输入数字和下标",
			setUp: function(){
				this.model = new Model({});
			},
			runTest: function(t){
				/*
				 * <msub> base superscript </msub>
				 * msub中的内容都使用mrow封装
				 */
				var model = this.model;
				model.toMathMLMode();
				model.setData({data:"1"});
				model.setData({data:"", nodeName:"msub"});
				t.is("/root/line[1]/math[1]/msub[1]/mrow[2]/mn[1]", model.getPath());
				
				var node = model.getFocusNode();
				t.is("mn", node.nodeName);
				t.is("drip_placeholder_box", node.getAttribute("class"));
				t.is(0, model.getOffset());
				
				var subscriptNode = node;
				t.is("msub", subscriptNode.parentNode.parentNode.nodeName);
				
				var baseNode = subscriptNode.parentNode.previousSibling.firstChild;
				t.is("mn", baseNode.nodeName);
				t.is("1", baseNode.textContent);
			},
			tearDown: function(){
				
			}
		}
	                             
	]);
});