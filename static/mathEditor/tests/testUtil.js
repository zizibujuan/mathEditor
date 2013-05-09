define({
	
	isPlaceHolder: function(t, anchor){
		// 判断当前节点是占位符
		
		var node = anchor.node;
		var offset = anchor.offset;
		t.is("mn", node.nodeName);
		t.is("drip_placeholder_box", node.getAttribute("class"));
		t.is(0, offset);
	}
});