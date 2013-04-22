define([ "doh","mathEditor/Model" ], function(doh,Model) {

	// summary:
	//		在有上标的公式上右移光标(base的mrow部分要高亮显示)
	//
	//		右移进入sup
	//		1. sup前没有任何节点，在sup前右移光标，移到base前，base的第一个节点是token节点；
	//		2. sup前没有任何节点，在sup前右移光标，移到base前，base的第一个节点是layout节点；
	//		3. sup前有一个token节点，从token的最后右移到sup的base前，base的第一个节点是token节点；
	//		4. sup前有一个token节点，从token的最后右移到sup的base前，base的第一个节点是layout节点；
	//		5. sup前有一个layout节点，从layout的最后右移到sup的base前，base的第一个节点是token节点；
	//		6. sup前有一个layout节点，从layout的最后右移到sup的base前，base的第一个节点是layout节点；
	//		从base后右移到superscript前
	//		1. base的最后一个节点是token节点，superscript的第一个节点是token节点
	//		2. base的最后一个节点是token节点，superscript的第一个节点是layout节点
	//		3. base的最后一个节点是layout节点，superscript的第一个节点是token节点
	//		4. base的最后一个节点是layout节点，superscript的第一个节点是layout节点
	//		从superscript后移出sup节点
	//		1. superscript的最后一个节点是token节点
	//		2. superscript的最后一个节点是layout节点
	doh.register("Model.moveRight.sup 在有上标的符号中右移光标",[
	    {
	    	name: "mathml模式下，在空的有上标的公式中，将光标从base中移到supscript中",
  			setUp: function(){
  				this.model = new Model({});
  			},
  			runTest: function(t){
  				var model = this.model;
  				model.toMathMLMode();
  				model.setData({data: "", nodeName: "msup"});
  				model.moveLeft();
  				model.moveRight();
  				
  				t.is("/root/line[1]/math[1]/msup[1]/mrow[2]/mn[1]", model.getPath());
  				var node = model.getFocusNode();
	  			t.is("mn", node.nodeName);
	  			t.is("drip_placeholder_box", node.getAttribute("class"));
	  			t.is(0, model.getOffset());
	  			
	  			var baseNode = node;
	  			var superscriptNode = baseNode.parentNode.previousSibling.firstChild;
	  			t.is("mn", superscriptNode.nodeName);
	  			t.is("drip_placeholder_box", superscriptNode.getAttribute("class"));
  			},
  			tearDown: function(){
  				
  			}
	    }
	                             
	]);
});