define([ "doh","mathEditor/Model" ], function(doh,Model) {

	// summary:
	//		在有上标的公式上左移光标(base的mrow部分要高亮显示)
	//
	//		左移进入sup
	//		1. sup后没有任何节点，在sup后左移光标，移到superscript后，superscript的最后一个节点是token节点；
	//		2. sup后没有任何节点，在sup后左移光标，移到superscript后，superscript的最后一个节点是layout节点；
	//		3. sup后有一个token节点，从token的前面左移到superscript后，superscript的最后一个节点是token节点；
	//		4. sup前有一个token节点，从token的前面左移到superscript后，superscript的最后一个节点是layout节点；
	//		5. sup后有一个layout节点，从layout的前面左移到superscript后，superscript的最后一个节点是token节点；
	//		6. sup前有一个layout节点，从layout的前面左移到superscript后，superscript的最后一个节点是layout节点；
	//		从superscript前左移到base后
	//		1. superscript的第一个节点是token节点，base的最后一个节点是token节点
	//		2. superscript的第一个节点是token节点，base的最后一个节点是layout节点
	//		3. superscript的第一个节点是layout节点，base的最后一个节点是token节点
	//		4. superscript的第一个节点是layout节点，base的最后一个节点是layout节点
	//		从base左移出sup节点，移到sup前面
	//		1. base的第一个节点是token节点
	//		2. base的第一个节点是layout节点
	doh.register("Model.moveLeft.sup 在有上标的符号中左移光标",[
	    {
	    	name: "mathml模式下，在空的有上标的公式中，将光标从supscript中移到base中",
  			setUp: function(){
  				this.model = new Model({});
  			},
  			runTest: function(t){
  				var model = this.model;
  				model.toMathMLMode();
  				model.setData({data:"", nodeName:"msup"});
  				model.moveLeft();
  				
  				t.is("/root/line[1]/math[1]/msup[1]/mrow[1]/mn[1]", model.getPath());
  				var node = model.getFocusNode();
				t.is("mn", node.nodeName);
				t.is("drip_placeholder_box", node.getAttribute("class"));
				t.is(0, model.getOffset());
				
				var baseNode = node;
				var superscriptNode = baseNode.parentNode.nextSibling.lastChild;
				t.is("mn", superscriptNode.nodeName);
				t.is("drip_placeholder_box", superscriptNode.getAttribute("class"));
  			},
  			tearDown: function(){
  				
  			}
	    }
	                             
	]);
});