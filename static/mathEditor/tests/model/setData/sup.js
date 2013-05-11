define([ "doh","mathEditor/Model" ], function(doh,Model) {

	// summary:
	//		model.setData({data:"^"});与model.setData({data:"", nodeName:"msup"});的效果是一样的。
	doh.register("Model.setData.sup 上标",[
	    {
			name: "mathml模式下，在空的数学编辑器上直接输入上标",
			setUp: function(){
				this.model = new Model({});
			},
			runTest: function(t){
				/*
				 * <msup> base superscript </msup>
				 * msup中的内容都使用mrow封装
				 * 如果直接输入上标，并且适配不到base，则添加一个空的base和superscript，让superscript获取焦点
				 */
				var model = this.model;
				model.toMathMLMode();
				model.setData({data:"", nodeName:"msup"});
				t.is("/root/line[1]/math[1]/msup[1]/mrow[2]/mn[1]", model.getPath());
				
				var node = model.getFocusNode();
				t.is("mn", node.nodeName);
				t.is("drip_placeholder_box", node.getAttribute("class"));
				t.is(0, model.getOffset());
				
				var superscriptNode = node;
				t.is("msup", superscriptNode.parentNode.parentNode.nodeName);
				
				var baseNode = superscriptNode.parentNode.previousSibling.firstChild;
				t.is("mn", baseNode.nodeName);
				t.is("drip_placeholder_box", baseNode.getAttribute("class"));
			},
			tearDown: function(){
				
			}
		},{
			name: "mathml模式下，在空的数学编辑器上输入数字和上标",
			setUp: function(){
				this.model = new Model({});
			},
			runTest: function(t){
				/*
				 * <msup> base superscript </msup>
				 * msup中的内容都使用mrow封装
				 */
				var model = this.model;
				model.toMathMLMode();
				model.setData({data:"1"});
				model.setData({data:"", nodeName:"msup"});
				t.is("/root/line[1]/math[1]/msup[1]/mrow[2]/mn[1]", model.getPath());
				
				var node = model.getFocusNode();
				t.is("mn", node.nodeName);
				t.is("drip_placeholder_box", node.getAttribute("class"));
				t.is(0, model.getOffset());
				
				var superscriptNode = node;
				t.is("msup", superscriptNode.parentNode.parentNode.nodeName);
				
				var baseNode = superscriptNode.parentNode.previousSibling.firstChild;
				t.is("mn", baseNode.nodeName);
				t.is("1", baseNode.textContent);
			},
			tearDown: function(){
				
			}
		},{
			name: "mathml模式下，在空的数学编辑器上输入数字和上标",
			setUp: function(){
				this.model = new Model({});
			},
			runTest: function(t){
				/*
				 * <msup> base superscript </msup>
				 * msup中的内容都使用mrow封装
				 */
				var model = this.model;
				model.toMathMLMode();
				model.setData({data:"1"});
				model.setData({data:"", nodeName:"msup"});
				t.is("/root/line[1]/math[1]/msup[1]/mrow[2]/mn[1]", model.getPath());
				
				var node = model.getFocusNode();
				t.is("mn", node.nodeName);
				t.is("drip_placeholder_box", node.getAttribute("class"));
				t.is(0, model.getOffset());
				
				var superscriptNode = node;
				t.is("msup", superscriptNode.parentNode.parentNode.nodeName);
				
				var baseNode = superscriptNode.parentNode.previousSibling.firstChild;
				t.is("mn", baseNode.nodeName);
				t.is("1", baseNode.textContent);
			},
			tearDown: function(){
				
			}
		},{
			name: "mathml模式下，输入数字，输入^",
			setUp: function(){
				this.model = new Model({});
			},
			runTest: function(t){
				/*
				 * <msup> base superscript </msup>
				 * msup中的内容都使用mrow封装
				 */
				var model = this.model;
				model.toMathMLMode();
				model.setData({data:"1"});
				model.setData({data:"^"});
				t.is("/root/line[1]/math[1]/msup[1]/mrow[2]/mn[1]", model.getPath());
				
				var node = model.getFocusNode();
				t.is("mn", node.nodeName);
				t.is("drip_placeholder_box", node.getAttribute("class"));
				t.is(0, model.getOffset());
				
				var superscriptNode = node;
				t.is("msup", superscriptNode.parentNode.parentNode.nodeName);
				
				var baseNode = superscriptNode.parentNode.previousSibling.firstChild;
				t.is("mn", baseNode.nodeName);
				t.is("1", baseNode.textContent);
			},
			tearDown: function(){
				
			}
		}
	                             
	]);
});