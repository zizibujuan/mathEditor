define({
	scrollbarWidth: function(){
		// summary:
		//		计算滚动条的宽度。
		var doc = document;
		var inner = doc.createElement("div");
	    inner.style.width = "100%";
	    inner.style.minWidth = "0px";
	    inner.style.height = "200px";
	    inner.style.display = "block";

	    var outer = doc.createElement("div");
	    var style = outer.style;

	    style.position = "absolute";
	    style.left = "-10000px";
	    style.overflow = "hidden";
	    style.width = "200px";
	    style.minWidth = "0px";
	    style.height = "150px";
	    style.display = "block";

	    outer.appendChild(inner);

	    var body = doc.documentElement;
	    body.appendChild(outer);

	    var noScrollbar = inner.offsetWidth;

	    style.overflow = "scroll";
	    var withScrollbar = inner.offsetWidth;

	    if (noScrollbar == withScrollbar) {
	        withScrollbar = outer.clientWidth;
	    }

	    body.removeChild(outer);

	    return noScrollbar-withScrollbar;
	}
	 
});