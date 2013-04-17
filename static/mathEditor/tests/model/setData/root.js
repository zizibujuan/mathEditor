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
		}
	                             
	]);
});