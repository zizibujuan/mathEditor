define({
	createEmptyFrac: function(xmlDoc){
		// summary:
		//		创建一个分数，分子已经给定，分母使用占位符。
		//		返回的结果是分子获取焦点。
		
		//<mstyle displaystyle="true">
		var mstyle = xmlDoc.createElement("mstyle");
		mstyle.setAttribute("displaystyle","true");
		var mfrac = xmlDoc.createElement("mfrac");
		
		// 因为mathjax中的mfrac没有自动添加mrow，所以在这里显式添加。
		// 而mrow正是获取正确光标位置的关键。
		var mrow1 = xmlDoc.createElement("mrow");
		var mrow2 = xmlDoc.createElement("mrow");
		var mn1 = this.getPlaceHolder(xmlDoc);
		var mn2 = this.getPlaceHolder(xmlDoc);
		
		mstyle.appendChild(mfrac);
		mfrac.appendChild(mrow1);
		mfrac.appendChild(mrow2);
		mrow1.appendChild(mn1);
		mrow2.appendChild(mn2);
		return {rootNode:mstyle,focusNode:mn1};
	},
	
	createFracWithNumerator: function(xmlDoc, numeratorNode){
		// summary:
		//		创建一个分数，分子已经给定，分母使用占位符。
		//		返回的结果是分母获取焦点。
		
		var mstyle = xmlDoc.createElement("mstyle");
		mstyle.setAttribute("displaystyle","true");
		var mfrac = xmlDoc.createElement("mfrac");
		
		// 因为mathjax中的mfrac没有自动添加mrow，所以在这里显式添加。
		// 而mrow正是获取正确光标位置的关键。
		var mrow1 = xmlDoc.createElement("mrow");
		var mrow2 = xmlDoc.createElement("mrow");
		var mn1 = numeratorNode
		var mn2 = this.getPlaceHolder(xmlDoc);
		
		mstyle.appendChild(mfrac);
		mfrac.appendChild(mrow1);
		mfrac.appendChild(mrow2);
		mrow1.appendChild(mn1);
		mrow2.appendChild(mn2);
		return {rootNode:mstyle,focusNode:mn2};
	},
	
	createScriptingWithBase: function(xmlDoc, baseNode, nodeName){
		// summary:
		//		创建一个上标，base值已存在，superscript为空节点
		//<msup> base superscript </msup>
		
		// summary:
		//		创建一个上标，base值已存在，superscript为空节点
		//<msup> base superscript </msup>

		var container = xmlDoc.createElement(nodeName);
		
		var mrow1 = xmlDoc.createElement("mrow");
		var mrow2 = xmlDoc.createElement("mrow");
		
		var script = this.getPlaceHolder(xmlDoc);
		
		container.appendChild(mrow1);
		container.appendChild(mrow2);
		
		mrow1.appendChild(baseNode);
		mrow2.appendChild(script);
		return {rootNode:container,focusNode:script};
	},
	
	createEmptyScripting: function(xmlDoc, nodeName){
		// summary:
		//		创建一个上标，base值已存在，superscript为空节点
		//<msup> base superscript </msup>
		
		// summary:
		//		创建一个上标，base值已存在，subcript为空节点
		//<msub> base superscript </msub>

		var container = xmlDoc.createElement(nodeName);
		
		var mrow1 = xmlDoc.createElement("mrow");
		var mrow2 = xmlDoc.createElement("mrow");
		var base = this.getPlaceHolder(xmlDoc);
		var script = this.getPlaceHolder(xmlDoc);
		
		container.appendChild(mrow1);
		container.appendChild(mrow2);
		
		mrow1.appendChild(base);
		mrow2.appendChild(script);
		return {rootNode:container,focusNode:script};
	},
	
	createEmptyMsqrt: function(xmlDoc){
		// summary:
		//		创建一个平方根
		// <msqrt> base </msqrt>
		// <mroot> base index </mroot>

		var msqrt = xmlDoc.createElement("msqrt");
		var mrow1 = xmlDoc.createElement("mrow");
		var base = this.getPlaceHolder(xmlDoc);
		msqrt.appendChild(mrow1);
		mrow1.appendChild(base);
		return {rootNode:msqrt,focusNode:base};
	},
	
	createEmptyMroot: function(xmlDoc){
		// summary:
		//		创建一个平方根
		// <msqrt> base </msqrt>
		// <mroot> base index </mroot>

		var mroot = xmlDoc.createElement("mroot");
		var mrow1 = xmlDoc.createElement("mrow");
		var mrow2 = xmlDoc.createElement("mrow");
		
		var base = this.getPlaceHolder(xmlDoc);
		var index = this.getPlaceHolder(xmlDoc);
		mroot.appendChild(mrow1);
		mroot.appendChild(mrow2);
		mrow1.appendChild(base);
		mrow2.appendChild(index);
		return {rootNode:mroot,focusNode:index};
	},
	
	createTrigonometric: function(xmlDoc, parentNode, miText){
		// summary:
		//		创建三角函数
		// xmlDoc: XML
		// parentNode:
		//		因为三角函数是有三个节点组成的，没有一个单一的根节点，所以传入父节点
		// miText: sin/cos/tan/cot等
		/*
		 * <mi>cos</mi>
		 * <mo>&#x2061;</mo> 函数应用
		 * <mrow>
		 * <mn></mn> 占位符统一使用mn表示
		 * </mrow>
		 */
		
		
	},
	
	isPlaceHolder: function(node){
		return node.getAttribute("class") === "drip_placeholder_box";
	},
	
	removePlaceHolder: function(node){
//		node.removeAttribute("class");
//		node.removeAttribute("style");
//		node.textContent = "";
		if(node.parentNode){
			node.parentNode.removeChild(node);
		}
		
	},
	
	getPlaceHolder: function(xmlDoc){
		// summary:
		//		在节点上加上占位框的样式，本想直接添加一个className，但是会被mathjax的样式覆盖，
		//		所以在节点上添加一个className,但是真正的效果是通过style中属性实现的。
		
		var node = xmlDoc.createElement("mn");
		node.setAttribute("class", "drip_placeholder_box");
		node.setAttribute("style", "border:1px dotted black; padding:1px;background-color: #cccccc;color: #cccccc;");
		node.textContent = "8";
		return node;
	}
	
});