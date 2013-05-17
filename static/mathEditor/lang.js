define(["dojo/_base/array"],function(array){
	
	var mathLayoutNodeNames = {"mfrac":1,"mroot":1,"msqrt":1,"msub":1,"msup":1};
	var mathTokenNodeNames = {"mi":1, "mn":1, "mo":1, "mtext":1, "mspace":1, "ms":1};
	var mathLayoutNodeWithInferredMrow = {"math":1, "mstyle":1, "msqrt":1};
	// TODO:重构，这个模块的名称不准确。
	var lang = {};
	
	lang.STRING_FUNCTION_APPLICATION = "&#x2061;";
	
	lang.isNumber = function(text) {
		return !isNaN(parseFloat(text)) && isFinite(text);
	},
	
	lang.isLetter = function(text){
		return text.length == 1 && /[a-zA-Z]/.test(text);
	},
	
	lang.isOperator = function(text){
		if(/\+|-|\*|\/|=|==|<|>|!|!=|&#xD7;|&#xF7;|&#x2A7E;|&#x226B;|&#x2A7D;|&#x226A;|&#x2260;|&#x2248;/.test(text))return true;
		return false;
	},
	
	lang.isTrigonometric = function(text){
		// summary:
		//		判断是不是三角函数
		//	obj: String
		//		输入的字符
	
		return /sin|cos|tan|cot|sec|csc/.test(text);
	},
	
	lang.isGreekLetter = function(numericCharacter){
		// summary:
		//		判断传入的字符是不是希腊字母
		// numericCharacter:
		//		numeric character, 这里只假定传入的是16进制的,格式为&#x1;
		
		var numString = "0"+numericCharacter.substring(2, numericCharacter.length-1);
		var num = parseInt(numString);
		//parseInt("0x391") = 913
		//parseInt("0x3A9") = 937
		//parseInt("0x3B1") = 945
		//parseInt("0x3C9") = 969
		return ( 913 <= num && num <= 937) || (945 <= num && num <= 969);
	},
	
	lang.isNewLine = function(text){
		return text == "\r\n" || text == "\r" || text == "\n"
	},
	
	lang.isTab = function(text){
		return text === "\t";
	},
	
	lang.isFenced = function(text){
		return /\(|\[|\{|\|/.test(text);
	},
	
	lang.isFunctionApplication = function(node){
		return node.nodeName === "mo" && node.textContent === this.STRING_FUNCTION_APPLICATION;
	},
	
	lang.insertNodeAfter = function(newNode, existingNode){
		var parentNode = existingNode.parentNode;
		if(parentNode.lastChild == existingNode){
			parentNode.appendChild(newNode)
		}else{
			parentNode.insertBefore(newNode, existingNode.nextSibling);
		}
	},
	
	lang.insertNodeBefore = function(newNode, existingNode){
		var parentNode = existingNode.parentNode;
		parentNode.insertBefore(newNode, existingNode);
	},
	
	lang._fontStyles = {
			fontFamily : 1,
			fontSize : 1,
			fontWeight : 1,
			fontStyle : 1,
			lineHeight : 1
	},
	
	lang.isMathTokenNode = function(node){
		var nodeName = node.nodeName;
		return this.isMathTokenName(nodeName);
	},
	
	lang.isMathLayoutNode = function(node){
		var nodeName = node.nodeName;
		return this._isMathLayoutNodeName(nodeName);
	},
	
	lang._isMathLayoutNodeName = function(nodeName){
		return mathLayoutNodeNames[nodeName] === 1;
	},
	
	lang.isMathTokenName = function(nodeName){
//		var isTokenNode = false;
		
//		var tokenNames = ["mi","mn","mo","mtext","mspace","ms"];
//		array.forEach(tokenNames, function(name,index){
//			if(nodeName == name){
//				isTokenNode = true;
//				return;
//			}
//		});
//		return isTokenNode;
		// 第二种实现方式
		return mathTokenNodeNames[nodeName]===1;
	},
	
	lang.containsInferredMrow = function(layoutNodeName){
		return mathLayoutNodeWithInferredMrow[layoutNodeName]===1;
	},
		
	lang.measureTextSize = function(elem ,text) {
		if (!this.measureNode) {
			var _measureNode = document.createElement("div");
			var style = _measureNode.style;
			style.width = style.height = "auto";
			style.left = style.top = "-1000px";

			style.visibility = "hidden";
			style.position = "absolute";
			style.overflow = "visible";
			style.whiteSpace = "nowrap";
			document.body.appendChild(_measureNode);
			this.measureNode = _measureNode;
		}
		var measureNode = this.measureNode;
		
		measureNode.innerHTML = text;
		var style = measureNode.style;
		var computedStyle = window.getComputedStyle(elem, null);
		for ( var prop in this._fontStyles) {
			style[prop] = computedStyle[prop];
		}

		var size = {
			height : measureNode.offsetHeight,
			width : measureNode.offsetWidth
		};
		return size;
	}

	return lang;
});