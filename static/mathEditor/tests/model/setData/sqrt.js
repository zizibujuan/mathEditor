define([ "doh","mathEditor/Model" ], function(doh,Model) {

	doh.register("Model.setData sqrt平方根",[
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
			model._toMathMLMode();
			model.setData({data:"", nodeName:"msqrt"});
			t.is("/root/line[1]/math[1]/msqrt[1]/mrow[1]/mn[1]", model.getPath());
			
			var node = model.getFocusNode();
			t.is("mn", node.nodeName);
			t.is("drip_placeholder_box", node.getAttribute("class"));
			t.is(0, model.getOffset());
			
			var baseNode = node;
			t.is("msqrt", baseNode.parentNode.parentNode.nodeName);
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
			model._toMathMLMode();
			model.setData({data:"1"});
			model.setData({data:"", nodeName:"msqrt"});
			t.is("/root/line[1]/math[1]/msqrt[2]/mrow[1]/mn[1]", model.getPath());
			
			var node = model.getFocusNode();
			t.is("mn", node.nodeName);
			t.is("drip_placeholder_box", node.getAttribute("class"));
			t.is(0, model.getOffset());
		},
		tearDown: function(){
			
		}
	}
	                             
	]);
});