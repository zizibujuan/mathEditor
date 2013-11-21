define([ "intern!tdd", 
         "intern/chai!assert", 
         "mathEditor/Model", 
         "mathEditor/lang" ], function(
        		 tdd,
        		 assert, 
        		 Model, 
        		 dripLang) {

	// 因为sub和sup的逻辑是一样的，底层走的是相同的代码，所以不再详细写测试用例了。
	with(tdd){
		suite("Model.setData.sub 下标", function(){
			
			var model = null;
			beforeEach(function () {
				model = new Model({});
			});
			
			test("mathml模式下，在空的数学编辑器上直接输入下标", function(){
				/*
				 * <msub> base superscript </msub>
				 * msub中的内容都使用mrow封装
				 * 如果直接输入上标，并且适配不到base，则添加一个空的base和superscript，让superscript获取焦点
				 */
				model.toMathMLMode();
				model.setData({data:"", nodeName:"msub"});
				assert.equal("/root/line[1]/math[1]/msub[1]/mrow[2]/mn[1]", model.getPath());
				
				var node = model.getFocusNode();
				assert.equal("mn", node.nodeName);
				assert.equal("drip_placeholder_box", node.getAttribute("class"));
				assert.equal(0, model.getOffset());
				
				var subscriptNode = node;
				assert.equal("msub", subscriptNode.parentNode.parentNode.nodeName);
				
				var baseNode = subscriptNode.parentNode.previousSibling.firstChild;
				assert.equal("mn", baseNode.nodeName);
				assert.equal("drip_placeholder_box", baseNode.getAttribute("class"));
			});
			
			test("mathml模式下，在空的数学编辑器上输入数字和下标", function(){
				/*
				 * <msub> base superscript </msub>
				 * msub中的内容都使用mrow封装
				 */
				model.toMathMLMode();
				model.setData({data:"1"});
				model.setData({data:"", nodeName:"msub"});
				assert.equal("/root/line[1]/math[1]/msub[1]/mrow[2]/mn[1]", model.getPath());
				
				var node = model.getFocusNode();
				assert.equal("mn", node.nodeName);
				assert.equal("drip_placeholder_box", node.getAttribute("class"));
				assert.equal(0, model.getOffset());
				
				var subscriptNode = node;
				assert.equal("msub", subscriptNode.parentNode.parentNode.nodeName);
				
				var baseNode = subscriptNode.parentNode.previousSibling.firstChild;
				assert.equal("mn", baseNode.nodeName);
				assert.equal("1", dripLang.getText(baseNode));
			});
		});
	}
	
});