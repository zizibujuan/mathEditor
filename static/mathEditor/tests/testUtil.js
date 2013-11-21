define({
	
	isPlaceHolder: function(assert, anchor){
		// 判断当前节点是占位符
		
		var node = anchor.node;
		var offset = anchor.offset;
		assert.equal("mn", node.nodeName);
		assert.equal("drip_placeholder_box", node.getAttribute("class"));
		assert.equal(0, offset);
	}
});