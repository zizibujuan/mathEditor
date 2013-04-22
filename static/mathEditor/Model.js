define([ "dojo/_base/declare",
         "dojo/_base/lang",
         "dojo/_base/array",
         "dojo/dom-construct",
         "dojox/xml/parser",
         "mathEditor/string",
         "mathEditor/dataUtil",
         "mathEditor/lang",
         "mathEditor/xmlUtil"], function(
        		 declare,
        		 lang,
        		 array,
        		 domConstruct,
        		 xmlParser,
        		 dripString,
        		 dataUtil,
        		 dripLang,
        		 xmlUtil) {
	var EMPTY_XML = "<root><line></line></root>";
	
	var STRING_FUNCTION_APPLICATION = dripLang.STRING_FUNCTION_APPLICATION;
	
	return declare(null,{
		// summary:
		//		存储当前聚焦点的完整路径
		// nodeName:
		//		节点名称
		// offset:
		//		节点在父节点中的位置，从1开始计数。
		path: null,
		xmlString: null,
		doc: null,
		
		// mode： 输入模式
		//		表示编辑器的输入模式，默认是“text”，输入公式的模式是"mathml",
		//		目前支持这两种模式。
		//		模式之间的切换：
		//		text-->mathml 
		//			使用Alt+"="
		//			如果用户输入的字符是公式专用的，则智能切换到mathml模式
		//		mathml --> text 强制使用Alt+"="，则光标跳到公式外面
		//						或者用户移动光标，移到公式外面。
		mode: "text",
		
		
		// summary:
		//		一个在文本内容间浮动的锚，用来定位当前的输入点。
		// node:
		//		光标所在的节点。
		//		节点分三种类型：
		//		1. 一种是token节点，里面放置文本内容；
		//		2. 一种是layout节点，用来布局token节点；
		//		3. 一种是line节点，表示行。
		// offset：
		//		offset的值，根据三种类型，各有不同的计算逻辑。
		//		1. 如果是token节点，offset指光标在node节点中文本的偏移量；
		//		2. 如果是layout节点，offset只有两个值，0表示在node之前，1表示在node之后；
		//		3. 如果是line节点，则offset的值永远为0。
		//
		//		layout节点本来应该遵循与token节点相同的方式，但是那样就多饶了一道，还需要计算出实际获取焦点的节点。
		//		layout节点，除了mathml中的layout节点，也包括math节点。
		//		TODO：考虑是否需要再添加一个type属性，来标识node的类型：token和layout
		//node: null, offset: -1
		anchor: null,
		
		// 当前节点在xml文件中的具体路径
		
		
		// 调用顺序
		//		如果是新建，则直接new即可
		//		如果已存在内容，则先新建，然后通过loadData，加载内容
		//		因为包含普通文本和math文本，使用span包含普通文本
		//		<root><line><text></text><math></math></line></root>
		//		在构造函数中初始化到位，如果有传入xml文本，则读取文本进行初始化；
		//		如果什么也没有传，则初始化为默认值。
		constructor: function(options){
			this._init();
			lang.mixin(this, options);
		},
		
		_init: function(){
			// 注意：在类中列出的属性，都必须在这里进行初始化。
			this.doc = xmlParser.parse(EMPTY_XML);
			this.path = [];
			this.anchor = {};
			// FIXME:如何存储呢？
			
			this._updateAnchor(this.doc.documentElement.firstChild, 0);
			
			this.toTextMode();
			
			this.path.push({nodeName:"root"});
			// offset 偏移量，从1开始
			this.path.push({nodeName:"line", offset:1});
		},
		
		clear: function(){
			this._init();
			this.onChanged();
		},
		
		// 如果没有内容，则创建一个新行
		// 如果存在内容，则加载内容，并将光标移到最后
		loadData: function(xmlString){
			this.clear();
			var xml = xmlString || "";
			if(xml === ""){
				return this._init();
			}
			else{
				this.doc = xmlParser.parse(xmlString);
				this.path = [];
				this.anchor = {};
			}
		},
		
		isTextMode: function(){
			return this.mode === "text";
		},
		
		isMathMLMode: function(){
			return this.mode === "mathml";
		},
		
		toTextMode: function(){
			this.mode = "text";
			
			var nodeName = this.anchor.node.nodeName;
			if(nodeName != "line" && nodeName != "text"){
				this.anchor = this.mathMLToTextMode(this.anchor);
			}
		},
		
		toMathMLMode: function(){
			this.mode = "mathml";
			
			var nodeName = this.anchor.node.nodeName;
			if(nodeName == "line" || nodeName == "text"){
				this.anchor = this.textToMathMLMode(this.anchor, "math");
				// 在mathml中添加占位符
				var placeHolder = xmlUtil.getPlaceHolder(this.doc);
				this.anchor.node.appendChild(placeHolder);
				this.anchor.node = placeHolder;
				//this.anchor.offset = 0; 因为值没有变，所以不再赋值。
				this.path.push({nodeName:placeHolder.nodeName, offset:1});
			}
		},
		
		mathMLToTextMode: function(anchor){
			var node = anchor.node;
			var offset = anchor.offset;
			
			var pos = null;
			do{
				pos = this.path.pop();
			}while(pos && pos.nodeName != "math");
			var textSpanNode = this.doc.createElement("text");
			
			// 获取math节点，然后将新节点插入到math节点之后
			var mathNode = node;
			while(mathNode.nodeName != "math"){
				mathNode = mathNode.parentNode;
			}
			
			dripLang.insertNodeAfter(textSpanNode, mathNode);
			this.path.push({nodeName:"text", offset:pos.offset+1});
			return {node: textSpanNode, offset:0};
		},
		
		textToMathMLMode: function(anchor, nodeName){
			// summary:
			//		从text模式切换到mathml模式。当切换完成之后，当前获取焦点的节点就不再可能是text和line。
			//		最外围的就是math节点。
			
			var node = anchor.node;
			var offset = anchor.offset;
			var xmlDoc = this.doc;
			
			if(this._isLineNode(node)){
				// 如果在line节点下，则先切换到math节点下。
				var mathNode = xmlDoc.createElement("math");
				node.appendChild(mathNode);
				this.path.push({nodeName:"math", offset:1});
				node = mathNode;
				offset = 0;
			}else if(this._isTextNode(node)){
				// FIXME:调通代码，并添加更多的测试用例
				this._splitNodeIfNeed(nodeName);
				
				var mathNode = xmlDoc.createElement("math");
				var pathOffset = 0;// 分为pathOffset和focusOffset
				
				var pos = this.path.pop();
				if(offset > 0){
					pathOffset = pos.offset + 1;
					dripLang.insertNodeAfter(mathNode, node);
				}else{
					// 如果等于0，则放在节点之前
					pathOffset = pos.offset;
					dripLang.insertNodeBefore(mathNode, node);
				}
				this.path.push({nodeName: "math", offset: pathOffset});
				node = mathNode;
				offset = 0;
			}
			return {node: node, offset: offset};
		},
		
		
		_split: function(text){
			return text.split(/\r\n|\r|\n/);
		},
		
		_splitNodeByNewLine: function(focusNode, offset, firstLine, lastLine){
			var beforeNode=null,afterNode=null;
			var xmlDoc = this.doc;
			var textLen = focusNode.textContent.length;
			if(offset == 0){
				var previousNode = focusNode.previousSibling;
				if(!previousNode || previousNode.nodeName != "text"){
					beforeNode = xmlDoc.createElement("text");
					beforeNode.textContent = firstLine;
					dripLang.insertNodeBefore(beforeNode, focusNode);
					afterNode = focusNode;
				}else{
					previousNode.textContent += firstLine;
					beforeNode = previousNode;
					afterNode = focusNode;
				}
				
				if(lastLine && lastLine != ""){
					afterNode.textContent = lastLine + afterNode.textContent;
				}
			}else if(offset == textLen){
				var nextNode = focusNode.nextSibling;
				if(!nextNode || nextNode.nodeName != "text"){
					beforeNode = focusNode;
					beforeNode.textContent += firstLine;
					
					if(lastLine.length > 0){
						afterNode = xmlDoc.createElement("text");
						afterNode.textContent = lastLine;
						dripLang.insertNodeAfter(afterNode, focusNode);
					}
				}else{
					focusNode.textContent += firstLine;
					beforeNode = focusNode;
					afterNode = nextNode;
					afterNode.textContent = lastLine + afterNode.textContent;
				}
			}else if(0 < offset && offset < textLen){
				var oldText = focusNode.textContent;
				focusNode.textContent = oldText.substring(0, offset)+firstLine;
				beforeNode = focusNode;
				afterNode = xmlDoc.createElement("text");
				afterNode.textContent = lastLine + oldText.substring(offset);
				dripLang.insertNodeAfter(afterNode, focusNode);
			}
			return {beforeNode: beforeNode, afterNode: afterNode};
		},
		
		insertText: function(anchor, text){
			// summary:
			//		插入普通文本，用于text模式下。
			// anchor: Object {node:node, offset:offset}
			//		光标的位置
			// text: String
			//		插入的文本
			// returns：
			//		返回新的anchor
			// TODO:逐步重构这个方法，先实现添加单个字符，然后再实现添加多行字符，然后重构
			
			if(!text || text.length == 0){
				return anchor;
			}
			
			var node = anchor.node;
			var offset = anchor.offset;
			var xmlDoc = this.doc;
			// 第一行和最后一行需要特殊处理，中间的行数全部使用line节点添加在两者中间即可，没有其他处理逻辑。
			var lines = this._split(text);
			
			if(lines.length == 1){
				var line = lines[0];
				if(this._isLineNode(node)){
					var nodeName = "text";
					var newNode = xmlDoc.createElement(nodeName);
					node.appendChild(newNode);
					node = newNode;
					this.path.push({nodeName: nodeName, offset: 1});
				}
				
				var oldText = node.textContent;
				node.textContent = dripString.insertAtOffset(oldText, offset, line);
				offset += line.length;
				return {node: node, offset: offset};
			}
			
			// 从lines中移除第一行，第一行代码需要与光标前面的代码对接
			var firstLine = lines.splice(0,1)[0];
			// 从lines中移除最后一行，最后一行代码需要与光标后面的代码对接
			var lastLine = lines.splice(lines.length-1, lines.length)[0];

			// 为beforeNode追加值，将afterNode及其后面的节点都挪到最后一行。
			var beforeNode = null, afterNode = null, lastLineNode = null;
			
			// 因为需要跳转行，所以先给出光标所在行，这样中间就不用反复设置path了。
			
			var pos = null;
			var lineCount = 0;
			if(this._isLineNode(node)){
				pos = this.path.pop();
			}else if(this._isTextNode(node)){
				this.path.pop();
				pos = this.path.pop();
			}
			
			if(firstLine.length == 0){
				if(this._isLineNode(node)){
					// beforeNode和afterNode都为null
					
					if(lastLine && lastLine != ""){
						afterNode = xmlDoc.createElement("text");
						afterNode.textContent = lastLine;
						node.appendChild(afterNode);
					}
				}else{
					var splitNode = this._splitNodeByNewLine(node, offset, firstLine, lastLine);
					beforeNode = splitNode.beforeNode;
					afterNode = splitNode.afterNode;
				}
			}else if(firstLine.length > 0){
				if(this._isLineNode(node)){
					var nodeName = "text";
					var newNode = xmlDoc.createElement(nodeName);
					newNode.textContent = firstLine;
					
					node.appendChild(newNode);
					
					beforeNode = newNode;
					afterNode = newNode.nextSibling
					
					if(lastLine && lastLine != ""){
						if(!afterNode){
							afterNode = xmlDoc.createElement("text");
							dripLang.insertNodeAfter(afterNode, beforeNode);
						}
						afterNode.textContent = lastLine + afterNode.textContent;
					}
					
				}else{
					var splitNode = this._splitNodeByNewLine(node, offset, firstLine, lastLine);
					beforeNode = splitNode.beforeNode;
					afterNode = splitNode.afterNode;
				}
			}
			
			
			lineCount = lines.length+1;
			var nodeName = "line";
			var focusedLine = this._getFocusLine();
			
			// 插入中间行
			var traceLine = focusedLine;
			if(lines.length > 0){
				array.forEach(lines, function(line){
					var newLineNode = xmlDoc.createElement(nodeName);
					newLineNode.textContent = line;
					dripLang.insertNodeAfter(newLineNode, traceLine);
					traceLine = newLineNode;
				});
			}
			
			// 插入最后一行
			var nodeName = "line";
			lastLineNode = xmlDoc.createElement(nodeName);
			dripLang.insertNodeAfter(lastLineNode, traceLine);
			if(afterNode){
				var nextNode = afterNode;
				do{
					lastLineNode.appendChild(nextNode);
				}while(nextNode = nextNode.nextSibling);
			}
			
			if(afterNode){
				this.path.push({nodeName:"line", offset:pos.offset+lineCount});
				this.path.push({nodeName:"text", offset:1});
				node = afterNode;
				offset = lastLine.length;
			}else{
				this.path.push({nodeName:"line", offset:pos.offset+lineCount});
				node = lastLineNode;
				offset = 0;
			}

			return {node:node, offset:offset};
		},
		
		findTrigonometric: function(anchor, miContext){
			// summary:
			//		如果preMis的长度为1，则再往后找一位,往前找一位，往后找一位,往后找两位.
			
			var preMis = [];
			var nextMis = [];
			var functionName = null;
			
			var node = anchor.node;
			var preNode = node;
			var nodeName = "mi";
			
			// 往前找两位
			while(preNode && preNode.nodeName == nodeName && preNode.textContent.length == 1){
				preMis.unshift(preNode.textContent);
				preNode = node.previousSibling;
				if(preMis.length == 2){
					break;
				}
			}
			if(preMis.length == 2){
				var text = preMis.join("")+miContext;
				if(dripLang.isTrigonometric(text)){
					return {functionName: text, preMis: preMis, nextMis: nextMis};
				}
			}else if(preMis.length == 1){
				var nextNode = node.nextSibling;
				if(nextNode && nextNode.nodeName == nodeName && nextNode.textContent.length == 1){
					var nextMi = nextNode.textContent;
					var text = preMis[0]+miContext+nextMi;
					if(dripLang.isTrigonometric(text)){
						return {functionName: text, preMis: preMis, nextMis: nextMis};
					}
				}
			}else if(preMis.length == 0){
				var nextNode = node.nextSibling;
				var nextMis = [];
				while(nextNode && nextNode.nodeName == nodeName && nextNode.textContent.length == 1){
					nextMis.push(nextNode.textContent);
					nextNode = nextNode.nextSibling;
					if(nextMis.length == 2){
						break;
					}
				}
				if(nextMis.length == 2){
					var text = miContext + nextMis.join("");
					if(dripLang.isTrigonometric(text)){
						return {functionName: text, preMis: preMis, nextMis: nextMis};
					}
				}
			}
			return null;
		},
		
		removeExistTrigonometricPart: function(anchor, tri){
			var node = anchor.node;
			var offset = anchor.offset;
			var preLength = tri.preMis.length;
			if(preLength == 2){
				var willFocusNode = node.previousSibling.previousSibling;
				node.parentNode.removeChild(node.previousSibling);
				node.parentNode.removeChild(node);
				
				var pos = this.path.pop();
				pos.offset-=2;
				this.path.push(pos);
				
				node = willFocusNode;
				if(node.nodeName == "mi" || node.nodeName == "mo"){
					offset = 1;
				}else{
					offset = node.textContent.length;
				}
			}else if(preLength == 1){
				// 此时，nextMis.length == 2
				var willFocusNode = node.previousSibling
				node.parentNode.removeChild(node.nextSibling);
				node.parentNode.removeChild(node);
				
				var pos = this.path.pop();
				pos.offset--;
				this.path.push(pos);
				
				node = willFocusNode;
				if(node.nodeName == "mi" || node.nodeName == "mo"){
					offset = 1;
				}else{
					offset = node.textContent.length;
				}
			}else if(preLength == 0){
				// 删除前面的字符
				node.parentNode.removeChild(node.nextSibling);
				node.parentNode.removeChild(node.nextSibling);
				
				// 不对path做任何处理
				
				if(node.nodeName == "mi" || node.nodeName == "mo"){
					offset = 1;
				}else{
					offset = node.textContent.length;
				}
			}
			
			return {node:node, offset:offset};
		},
		
		insertMi: function(anchor, miContext, nodeName){
			// 这里只处理单个英文字母的情况
			// 注意如果获取焦点的节点是mi节点，则offset的值要么是0， 要么是1，
			// 分别代表在mi的前或后
			
			// 通常一个完整的mi类型的字符占用一个mi
			
			var node = anchor.node;
			var offset = anchor.offset;
			var xmlDoc = this.doc;
			
			if(node.nodeName === "math"){
				// FIXME: math下的节点的处理代码，大多是一样的，需要重构
				var newNode = xmlDoc.createElement(nodeName);
				newNode.textContent = miContext;
				node.appendChild(newNode);
				this.path.push({nodeName:nodeName, offset:1});
				node = newNode;
				offset = 1; // mi的offset要么是1，要么是0
			}else{
				// 以下只处理node也为mi节点的情况，FIXME：等需要的时候加上这个条件约束
				var newNode = xmlDoc.createElement(nodeName);
				newNode.textContent = miContext;
				if(offset == 0){
					var pos = this.path.pop();
					// 也就是没有改变，可以不做这一步操作
					this.path.push({nodeName:nodeName, offset:pos.offset});
					dripLang.insertNodeBefore(newNode,node);
				}else if(offset == 1){
					var pos = this.path.pop();
					this.path.push({nodeName:nodeName, offset:pos.offset+1});
					dripLang.insertNodeAfter(newNode,node);
				}
				node = newNode;
				offset = 1;
			}
			return {node:node, offset:offset};
		},
		
		insertMn: function(anchor, mnContent, nodeName){
			// 按照以下思路重构。
			// 添加一个数据，分以下几步：
			//		如果指定了nodeName，则直接使用；如果没有指定，则先推导
			//		比较要输入的值和当前输入的环境
			//		确定可以执行哪些动作
			//		新建节点
			//		设置当前节点，将anchor改为context
			//		在新节点中插入内容
			//		修正当前的path值
			
			var node = anchor.node;
			var offset = anchor.offset;
			var xmlDoc = this.doc;
			
			// FIXME: 将所有mathml方法中的对line和text的切换提取到公共一个单独方法中，不要放在每个insert方法中。
			// 等提交的时候，把这段文字作为注释输入。
			
			// FIXME: 在进入mathml模式时，应该不再在line和text节点中。
			// 暂时先放在这里处理，但是这里的逻辑还是添加一个math节点。
			
			if(node.nodeName === "math" || node.nodeName === "mrow"){
				// FIXME:是否需要根据offset定位插入点呢？等写了相应的测试用例之后，再添加这个逻辑
				var newNode = xmlDoc.createElement(nodeName);
				newNode.textContent = mnContent;
				node.appendChild(newNode);
				this.path.push({nodeName:nodeName, offset:1});
				node = newNode;
				offset = mnContent.length;
			}else{
				if(node.nodeName != nodeName){
					var mnNode = xmlDoc.createElement(nodeName);
					mnNode.textContent = mnContent;
					
					dripLang.insertNodeAfter(mnNode,node);
					
					var pos = this.path.pop();
					this.path.push({nodeName:nodeName, offset:pos.offset+1});
					
					node = mnNode;
					offset = mnContent.length;
				}else{
					var oldText = node.textContent;
					node.textContent = dripString.insertAtOffset(oldText, offset, mnContent);
					offset += mnContent.length;
				}
			}
			
			return {node:node, offset:offset};
		},
		
		insertMo: function(anchor, moContent, nodeName){
			var node = anchor.node;
			var offset = anchor.offset;
			var xmlDoc = this.doc;

			if(node.nodeName == "math"){
				// FIXME:是否需要根据offset定位插入点呢？等写了相应的测试用例之后，再添加这个逻辑
				var newNode = xmlDoc.createElement(nodeName);
				newNode.textContent = moContent;
				node.appendChild(newNode);
				this.path.push({nodeName:nodeName, offset:1});
				node = newNode;
				offset = 1; // 操作符号的offset要么是1，要么是0
			}else{
				// 所有的操作符，都是一个单独的符号，用一个mo封装。
				if(moContent == "=" && node.nodeName == "mo" && node.textContent == "="){
					node.textContent += "=";
				}else if(moContent == "=" && node.nodeName == "mo" && node.textContent == "!"){
					node.textContent += "=";
				}else{
					var newNode = xmlDoc.createElement(nodeName);
					newNode.textContent = moContent;
					dripLang.insertNodeAfter(newNode,node);
					
					node = newNode;
					offset = 1;
					
					var pos = this.path.pop();
					this.path.push({nodeName:nodeName, offset:pos.offset+1});
				}
			}
			
			return {node: node, offset: offset};
		},
		
		insertFenced: function(anchor, fencedContent, nodeName){
			/*
			 * <mfenced open="[" close="}" separators="sep#1 sep#2 ... sep#(n-1)">
			 * <mrow><mi>x</mi></mrow>
			 * <mrow><mi>y</mi></mrow>
			 * </mfenced>
			 */
			var node = anchor.node;
			var offset = anchor.offset;
			var xmlDoc = this.doc;
			
			if(node.nodeName == "math"){
				this.path.push({nodeName:nodeName, offset:1});
				this.path.push({nodeName:"mrow", offset:1});
				this.path.push({nodeName:"mn", offset:1});
				
				var mfenced = xmlDoc.createElement(nodeName);
				
				var fenced = {
					"{":{left:"{", right:"}"},
					"[":{left:"[", right:"]"},
					"|":{left:"|", right:"|"}
				};
				if(fencedContent != "("){
					mfenced.setAttribute("open",fenced[fencedContent].left);
					mfenced.setAttribute("close",fenced[fencedContent].right);
				}
				var mrow = xmlDoc.createElement("mrow");
				var placeHolder = xmlUtil.getPlaceHolder(xmlDoc);
				mfenced.appendChild(mrow);
				mrow.appendChild(placeHolder);
				
				node.appendChild(mfenced);
				
				node = placeHolder;
				offset = 0;
			}else{
				
			}
			
			return {node: node, offset: offset};
		},
		
		insertTrigonometric: function(anchor, data, nodeName){
			var node = anchor.node;
			var offset = anchor.offset;
			var xmlDoc = this.doc;
			
			if(node.nodeName === "math"){
				this.path.push({nodeName:"mrow", offset:3});
				this.path.push({nodeName:"mn", offset:1});
				
				var mi = xmlDoc.createElement(nodeName);
				var mo = xmlDoc.createElement("mo");
				var mrow = xmlDoc.createElement("mrow");
				var placeHolder = xmlUtil.getPlaceHolder(xmlDoc);
				
				mi.textContent = data;
				mo.textContent = STRING_FUNCTION_APPLICATION;
				
				mrow.appendChild(placeHolder);
				
				node.appendChild(mi);
				node.appendChild(mo);
				node.appendChild(mrow);
				
				node = placeHolder;
				offset = 0;
			}else{
				var pos = this.path.pop();
				this.path.push({nodeName:"mrow", offset:pos.offset + 3});
				this.path.push({nodeName:"mn", offset:1});
				
				var mi = xmlDoc.createElement(nodeName);
				var mo = xmlDoc.createElement("mo");
				var mrow = xmlDoc.createElement("mrow");
				var placeHolder = xmlUtil.getPlaceHolder(xmlDoc);
				
				mi.textContent = data;
				mo.textContent = STRING_FUNCTION_APPLICATION;
				mrow.appendChild(placeHolder);

				dripLang.insertNodeAfter(mi, node);
				dripLang.insertNodeAfter(mo, mi);
				dripLang.insertNodeAfter(mrow, mo);
				
				node = placeHolder;
				offset = 0;
			}
			return {node: node, offset:offset};
		},
		
		insertMfrac: function(anchor, data, nodeName){
			var node = anchor.node;
			var offset = anchor.offset;
			
			// FIXME: 重构，这段代码有重复的地方
			var xmlDoc = this.doc;
			
			
			if(node.nodeName === "math"){
				this.path.push({nodeName:"mfrac", offset:1});
				this.path.push({nodeName:"mrow", offset:1});
				this.path.push({nodeName:"mn", offset:1});
				
				var fracData = xmlUtil.createEmptyFrac(xmlDoc);
				node.appendChild(fracData.rootNode);
				
				node = fracData.focusNode;
				offset = 0;
			}else{
				// FIXME：需要推断，前面那些组合可以做分子
				// 在数学公式中
				//		1.将当前的math节点从原有的父节点中移除
				//		2.创建一个mfrac
				//		3.将刚才移除的节点作为mfrac的分子
				//		4.将焦点放在分母上
				/**
  				 * <pre>
  				 * FROM
  				 * <math>
  				 * 	<mn>1</mn>
  				 * </math>
  				 *   TO
  				 * <math>
  				 * 	<mfrac>
  				 *    <mrow><mn>1</mn></mrow>
  				 *    <mrow><mn></mn></mrow>
  				 *  <mfrac>
  				 * </math>
  				 * </pre>
  				 */
				var newOffset = 1;
				var position = "last";
				
				this.path.pop();
				this.path.push({nodeName:"mfrac", offset:newOffset});// 替换刚才节点的位置
				this.path.push({nodeName:"mrow", offset:2});
				this.path.push({nodeName:"mn", offset:1});
				
				
				
				var parent = node.parentNode;
				position = newOffset - 1; // FIXME：为什么是0呢？
				// node为当前获取焦点的节点，该节点将作为mfrac的分子节点
				var fracData = xmlUtil.createFracWithNumerator(xmlDoc, node);
				domConstruct.place(fracData.rootNode, parent, position);
				
				node = fracData.focusNode;
				offset = 0;
			}
			return {node: node, offset: offset};
		},
		
		insertMsqrt: function(anchor, data, nodeName){
			var node = anchor.node;
			var offset = anchor.offset;
			
			var xmlDoc = this.doc;
			
			if(node.nodeName == "math"){
				this.path.push({nodeName:"msqrt", offset:1});
				this.path.push({nodeName:"mrow", offset:1});
				this.path.push({nodeName:"mn", offset:1});
				
				var sqrtData = xmlUtil.createEmptyMsqrt(xmlDoc);
				node.appendChild(sqrtData.rootNode);

				node = sqrtData.focusNode;
				offset = 0;
			}else{
				var newOffset = 1;
				var position = "last";
				
				this.path.pop();
				this.path.push({nodeName:"msqrt", offset:offset+1});
				this.path.push({nodeName:"mrow", offset:1});
				this.path.push({nodeName:"mn", offset:1});
				
				var parent = node.parentNode;
				var sqrtData = xmlUtil.createEmptyMsqrt(xmlDoc);
				domConstruct.place(sqrtData.rootNode, parent, offset);
				
				node = sqrtData.focusNode;
				offset = 0;
			}
			
			return {node: node, offset: offset};
		},
		
		insertMroot: function(anchor, data, nodeName){
			var node = anchor.node;
			var offset = anchor.offset;
			
			var xmlDoc = this.doc;
			
			if(node.nodeName === "math"){
				this.path.push({nodeName:"mroot", offset:1});
				this.path.push({nodeName:"mrow", offset:2});
				this.path.push({nodeName:"mn", offset:1});
				
				var rootData = xmlUtil.createEmptyMroot(xmlDoc);
				node.appendChild(rootData.rootNode);

				node = rootData.focusNode;
				offset = 0;
			}else{
				var newOffset = 1;
				var position = "last";
				
				this.path.pop();
				this.path.push({nodeName:"mroot", offset:offset+1});
				this.path.push({nodeName:"mrow", offset:2});
				this.path.push({nodeName:"mn", offset:1});
				
				var parent = node.parentNode;
				var rootData = xmlUtil.createEmptyMroot(xmlDoc);
				domConstruct.place(rootData.rootNode, parent, offset);
				
				node = rootData.focusNode;
				offset = 0;
			}
			return {node: node, offset: offset};
		},
		
		insertScripting: function(anchor, data, nodeName){
			// summary:
			//		插入上下标
			var node = anchor.node;
			var offset = anchor.offset;
			
			var xmlDoc = this.doc;
			
			if(node.nodeName === "math"){
				this.path.push({nodeName: nodeName, offset: 1});
				this.path.push({nodeName: "mrow", offset: 2});
				this.path.push({nodeName: "mn", offset: 1});
				
				var scriptingData = xmlUtil.createEmptyScripting(xmlDoc, nodeName);
				node.appendChild(scriptingData.rootNode);

				node = scriptingData.focusNode;
				offset = 0;
			}else{
				// TODO:总结是不是General Layout Schema 和 Script and Limit Schema的path处理逻辑都一样呢
				var newOffset = 1;
				var position = "last";
				
				this.path.pop();
				this.path.push({nodeName: nodeName, offset: 1});// TODO:计算出offset
				this.path.push({nodeName: "mrow", offset: 2});
				this.path.push({nodeName: "mn", offset: 1});
				
				var parent = node.parentNode;
				// node为将作为sup中的base节点
				var scriptingData = xmlUtil.createScriptingWithBase(xmlDoc, node, nodeName);
				domConstruct.place(scriptingData.rootNode, parent, 0);
				
				node = scriptingData.focusNode;
				offset = 0;
			}
			return {node: node, offset: offset};
		},
		
		_splitNodeIfNeed: function(nodeName){
			// summary:
			//		如果节点满足被拆分的条件，则将节点拆分为两个。
			//		只能用在放置文本节点的节点中，如text节点和mathml的token节点。
			//		FIXME:名字还不够具体
			// 注意：这里只是split，anchor的值并不改变。
			
			var offset = this.anchor.offset;
			var node = this.anchor.node;
			
			// 如果当前的nodeName与传入的值相同，则不拆分。
			if(node.nodeName == nodeName){
				return;
			}
			
			var textContent = node.textContent;
			var textLength = textContent.length;
			
			if(0 < offset && offset < textLength){
				// 拆分
				var part1 = textContent.substring(0, offset);
				var part2 = textContent.substring(offset);
				
				var node2 = this.doc.createElement(node.nodeName);//因为是拆分
				
				node.textContent = part1;
				node2.textContent = part2;
				
				dripLang.insertNodeAfter(node2, node);
			}
		},
		
		/***********以下两个事件什么也不做，View在该方法执行完毕后，执行刷新操作********/
		onChanging: function(modelChangingEvent){
			// summary:
			//		准备好所有信息，可以修改model时，触发的事件。
			
		},
		
		onChanged: function(modelChangedEvent){
			// summary:
			//		model修改完成后触发的事件。
		},
		
		// 如果是中文，则放在text节点中
		// 注意，当调用setData的时候，所有数据都是已经处理好的。
		// 两种判断数据类型的方法：1是系统自动判断；2是人工判断
		// 所以setData应该再加一个参数，表示人工判断的结果，表明数据是什么类型。
		// 如果没有这个参数，则系统自动判断
		// TODO：需要加入位置参数，指明在什么地方插入, FIXME now!!
		// TODO: 该方法需要重构，因为太多的针对不同类型的节点名称进行编程，而不是
		//		 经过抽象后的逻辑。
		// FIXME：拆开两种模式之后，就要准确显示哪些字符可以在哪种模式下输入。
		setData: function(insertInfo){
			// summary:
			//		往model中插入数据。
			// insertInfo: JSON Object
			//		插入数据的详情。
			//		data: String || Array
			//			要插入的内容	
			// 		nodeName：String
			//			将data作为什么节点插入，这个通常由人工选择，如果没有值，则系统自动判断。
			//		removeCount: Int
			//			默认为0，要移除的字符的数量，在新增data前，从当前聚焦位置往前删除removeCount个字符。
			
			var data = insertInfo.data;
			var nodeName = insertInfo.nodeName;
			var removeCount = insertInfo.removeCount;
			
			if(removeCount && removeCount > 0){
				for(var i = 0; i < removeCount; i++){
					this.removeLeft();
				}
			}

			// TODO:提取一个document作为总的model
			//	然后将mathml和text各自的操作拆分开
			if(this.isTextMode()){
				
				// FIXME: 是不是在要切换模式时，就把节点也切换好呢？
				// 如果节点不在text模式下，则切换到text节点下。
				
				var node = this.anchor.node;
				if(node.nodeName != "text" && node.nodeName != "line"){
					this.anchor = this.mathMLToTextMode(this.anchor);
				}
				
				this.anchor = this.insertText(this.anchor, data);
				this.onChanged(data);
				return;
			}else if(this.isMathMLMode()){
				if(dripLang.isNewLine(data)){
					return; // 输入回车符号，则什么也不做。
				}
				
				var node = this.anchor.node;
				var isNumericCharacter = false;
				var isTrigonometric = false;
				var isCommandString = insertInfo.isCommandString;
				if(!nodeName){
					if(dripLang.isLetter(data)){
						nodeName = "mi";
					}else if(dripLang.isNumber(data)){
						nodeName = "mn";
					}else if(dripLang.isOperator(data)){
						nodeName = "mo";
					}else if(dripLang.isFenced(data)){
						nodeName = "mfenced";
					}
				}else{
					if(dripLang.isGreekLetter(data)){
						// 传入的nodeName必须是mi
						isNumericCharacter = true;
					}else if(dripLang.isTrigonometric(data)){
						// 传入的nodeName必须是mi
						isTrigonometric = true;
					}
				}
				
				if(node.nodeName == "text" || node.nodeName == "line"){
					// 先把nodeName确认下来
					// TODO:在0.0.2版本中，根据输入的字符智能判定进入哪个输入模式。
					this.anchor = this.textToMathMLMode(this.anchor, nodeName);
				}
				
				// 移除占位符
				var node = this.anchor.node;
				if(xmlUtil.isPlaceHolder(node)){
					// TODO:重构，提取方法
					var pos = this.path.pop();
					var pathOffset = pos.offset;
					if(pathOffset == 1){
						this.anchor.node = node.parentNode;
						this.anchor.offset = 0
					}
					xmlUtil.removePlaceHolder(node);
				}
				
				var modelChangingEvent = {};
				modelChangingEvent.data = data;
				// 传入event
				// event.data
				// event.canceled
				this.onChanging(modelChangingEvent);
				var newData = modelChangingEvent.newData;
				if(newData){
					data = newData.data;// 在onChanging事件中变化输入的值。
					nodeName = newData.nodeName;
				}
//				if(canceled){
//					return;
//				}
				
				// 因为letter只是一个字符，所以不需要循环处理
				if(nodeName === "mi"){
					// 推断周围的字符，如果能够拼够一个三角函数，则插入三角函数
					if(isCommandString){
						// 当是命令字符串时，将由n个字符构成的命令放在一个mi中。
						// FIXME：这个判断还有没有存在的必要呢？
						this.anchor = this.insertMi(this.anchor, data, nodeName);
					}
					else if(isNumericCharacter){
						this.anchor = this.insertMi(this.anchor, data, nodeName);
					}else if(isTrigonometric){
						this.anchor = this.insertTrigonometric(this.anchor, data, nodeName);
					}else{
						// FIXME：将推断逻辑，放在这里是不是不太合适呢？
						// 因为需要将推导的值，与提示的值进行比较。
						var tri = this.findTrigonometric(this.anchor, data, nodeName);
						this.onChanging(tri);
						if(tri){
							this.anchor = this.removeExistTrigonometricPart(this.anchor, tri);
							this.anchor = this.insertTrigonometric(this.anchor, tri.functionName, nodeName);
						}else{
							this.anchor = this.insertMi(this.anchor, data, nodeName);
						}
					}
					this.onChanged(data);
					return;
				}else if(nodeName === "mn"){
					// 目前只支持输入数字时，剔除占位符。
					this.anchor = this.insertMn(this.anchor, data, nodeName);
					this.onChanged(data);
					return;
				}else if(nodeName === "mo"){
					this.anchor = this.insertMo(this.anchor, data, nodeName);
					this.onChanged(data);
					return;
				}else if(nodeName === "mfenced"){
					this.anchor = this.insertFenced(this.anchor, data, nodeName);
					this.onChanged(data);
					return;
				}else if(nodeName === "mfrac"){
					this._splitNodeIfNeed(nodeName);
					this.anchor = this.insertMfrac(this.anchor, data, nodeName);
					this.onChanged(data);
					return;
				}else if(nodeName === "msqrt"){
					this._splitNodeIfNeed(nodeName);
					this.anchor = this.insertMsqrt(this.anchor, data, nodeName);
					this.onChanged(data);
					return;
				}else if(nodeName === "mroot"){
					this._splitNodeIfNeed(nodeName);
					this.anchor = this.insertMroot(this.anchor, data, nodeName);
					this.onChanged(data);
					return;
				}else if(nodeName === "msub" || nodeName == "msup"){
					this._splitNodeIfNeed(nodeName);
					this.anchor = this.insertScripting(this.anchor, data, nodeName);
					this.onChanged(data);
					return;
				}
			}
		},
		
		_updateAnchor: function(focusNode, offset){
			// FIXME：在0.0.2时删除。
			// 判断focusNode与node是否相等，是不是判断引用呢？
			// 如果是的话，两者相等，就无需重新赋值。
			this.anchor.node = focusNode;
			this.anchor.offset = offset;
		},
		
		doDelete: function(){
			// 暂时让do系列方法作为共有接口暴露，当_removeLeft调通之后，使用removeLeft作为公用接口
			var removed = this.removeLeft();
			if(removed != ""){
				this.onChanged();
			}
		},
		
		removeLeft: function(){
			// summary:
			//		删除当前聚焦点的前一个字符
			// return:String
			//		删除的字符
			
			var offset = this.anchor.offset;
			var node = this.anchor.node;
			var oldText = node.textContent;
			
			console.log("removeLeft", node, offset);
			
			// TODO:如果是text节点（dom的），则把值先split为数组，然后再删除
			// 或者删除前，先判断当前要删除的内容是否为unicode，注意在&和;中间不能包含这两个字符。
			
			if(offset == 0){
				var _node = node;
				if(node.nodeName != "text" && node.nodeName != "line"){
					// FIXME:这里需要重构，使用与下面相同的逻辑
					while(_node.nodeName != "math"){
						_node = _node.parentNode;
					}
					var previousNode = _node.previousSibling;
					if(previousNode){
						var textContent = previousNode.textContent;
						var oldLength = textContent.length;
						var newText = dripString.insertAtOffset(textContent, oldLength, "", 1);
						var newLength = oldLength - 1; //newText.length; 
						if(newText == ""){
							// 如果节点中没有内容，则删除节点
							previousNode.parentNode.removeChild(previousNode);
							this.path.pop();
						}else{
							previousNode.textContent = newText;
							this.anchor.node = previousNode;
							this.anchor.offset = newLength;
						}
						var removed = textContent.charAt(newLength);
						// 注意这里不设置anchor，因为要与之前的值保持一致。
						return removed;
					}
				}else if(node.nodeName == "line"){
					// FIXME:在后面的重构中需要认识到，也许遇到line时，offset都等于0。还需进一步验证。
					if(this.getLineCount() > 1){
						// 删除一个空行
						var previousNode = node.previousSibling;
						var childCount = previousNode.childNodes.length;
						//如果前一行也是空行
						if(childCount == 0){
							this.anchor.node = previousNode;
							this.anchor.offset = 0;
							var lastPath = this.path.pop();
							lastPath.offset--;
							this.path.push(lastPath);
							node.parentNode.removeChild(node);
						}else{
							// FIXME：提取一个方法，获取一行最后一个有效的节点，将div等的逻辑都封装进去
							// 需要支持将math看作一个整体，这样可以删除整个math节点
							previousNode = previousNode.lastChild;
							
							if(previousNode.nodeName == "text"){
								this.anchor.node = previousNode;
								this.anchor.offset = previousNode.textContent.length;
								
								var lastPath = this.path.pop();
								lastPath.offset--;
								this.path.push(lastPath);
								this.path.push({nodeName:previousNode.nodeName, offset: childCount});
								node.parentNode.removeChild(node);
							}else if(previousNode.nodeName == "math"){
								// FIXME：math节点中的移动逻辑，因为这里涉及到了层次之间的移动。寻找最佳实践。
								var mathChildCount = previousNode.childNodes.length;
								previousNode = previousNode.lastChild;
								
								this.anchor.node = previousNode;
								this.anchor.offset = previousNode.textContent.length;
								
								var lastPath = this.path.pop();
								lastPath.offset--;
								this.path.push(lastPath);
								this.path.push({nodeName:"math", offset:childCount});
								this.path.push({nodeName:previousNode.nodeName, offset: mathChildCount});
								node.parentNode.removeChild(node);
							}
							
						}
						
						return "\n";
					}else{
						return "";// 只剩下一行时，什么也不做。
					}
					
				}
				return "";
			}else{
				var removed = "";
				var newText = "";
				
				if(node.nodeName == "mo"){
					// 因为现在只有操作符使用unicode表示，所以不需要专门处理unicode，遇到mo直接整个删除就可以。
					removed = node.textContent;
					newText = "";
				}else{
					removed = oldText.charAt(offset - 1);
					newText = dripString.insertAtOffset(oldText, offset, "", 1);
				}
				
				if(newText == ""){
					var previousNode = node.previousSibling;
					var _offset = 0;
					if(previousNode){
						if(previousNode.nodeName == "math"){
							var mathChildCount = previousNode.childNodes.length;
							previousNode = previousNode.lastChild;
							
							this.anchor.node = previousNode;
							this.anchor.offset = previousNode.textContent.length;
							
							var lastPath = this.path.pop();
							var lastOffset = lastPath.offset - 1;
							this.path.push({nodeName:"math", offset:lastOffset});
							this.path.push({nodeName:previousNode.nodeName, offset: mathChildCount});
							node.parentNode.removeChild(node);
						}else{
							this.anchor.node = previousNode;
							this.anchor.offset = previousNode.textContent.length;
							node.parentNode.removeChild(node);
							var old = this.path.pop();
							this.path.push({nodeName:this.anchor.node.nodeName, offset:old.offset-1});
						}
						
					}else{
						var p = node;
						var c = node;
						// 如果是mathml节点，则追溯到math节点
						if(node.nodeName != "text" && node.nodeName != "line"){
							while(c.nodeName != "math"){
								p = c.parentNode;
								p.removeChild(c);
								c = p;
								this.path.pop();
							}
						}
						
						previousNode = c.previousSibling;
						p = c.parentNode;
						p.removeChild(c);
						var oldOffset = this.path.pop().offset;
						
						if(previousNode){
							this.anchor.node = previousNode;
							this.anchor.offset = previousNode.textContent.length;
							this.path.push({nodeName:this.anchor.node.nodeName, offset:oldOffset-1});
						}else{
							this.anchor.node = p;
							this.anchor.offset = p.childElementCount;
						}
					}
				}else{
					this.anchor.node.textContent = newText;
					this.anchor.offset -= 1;
				}
				
				return removed;
			}
		},
		
		_isTokenNode: function(nodeName){
			return dripLang.isMathTokenName(nodeName) || nodeName === "text";
		},
		
		_isDenominatorMrow: function(node/*mrow*/){
			// summary:
			//		判断当前节点是分母所在的mrow节点
			
			return node && node.nodeName === "mrow" && node.parentNode.nodeName === "mfrac" && node.previousSibling;
		},
		
		_isNumeratorMrow: function(node/*mrow*/){
			// summary:
			//		判断当前节点是分子所在的mrow节点
			
			return node && node.nodeName === "mrow" && node.parentNode.nodeName === "mfrac" && node.nextSibling;
		},
		
		_isSqrtBaseMrow: function(node/*mrow*/){
			// summary:
			//		判断当前节点是不是平方根的根数所在的mrow节点
			
			return node && node.nodeName === "mrow" && node.parentNode.nodeName === "msqrt";
		},
		
		_isRootIndexMrow: function(rootIndexMrow/*mrow*/){
			// summary:
			//		判断当前节点是不是根式的根次所在的mrow节点
			//		<mroot>base index</mroot>
			
			return rootIndexMrow && 
				rootIndexMrow.nodeName === "mrow" && 
				rootIndexMrow.parentNode.nodeName === "mroot" && 
				rootIndexMrow.previousSibling;
		},
		
		_isRootBaseMrow: function(rootBaseMrow){
			// summary:
			//		判断当前节点是不是根式的根数所在的mrow节点
			//		<mroot>base index</mroot>
			
			return rootBaseMrow && 
				rootBaseMrow.nodeName === "mrow" && 
				rootBaseMrow.parentNode.nodeName === "mroot" && 
				rootBaseMrow.nextSibling;
		},
		
		_moveLeftDenominatorToNumerator: function(denominatorMrow/*分母*/){
			// summary
			//		左移，从分母最前面，移动到分子最后面

			// 移到分子中
			// 如果遇到mrow，则停止往左外层走，开始找分子节点
			var numeratorMrow = denominatorMrow.previousSibling;
			this._movePathToPreviousSibling(numeratorMrow);
			var lastChild = numeratorMrow.lastChild;
			if(this._isTokenNode(lastChild.nodeName)){
				this.path.push({nodeName: lastChild.nodeName, offset:numeratorMrow.childNodes.length});
				this.anchor.node = lastChild;
				this.anchor.offset = this._getTextLength(lastChild);
			}else{
				if(lastChild.nodeName === "mstyle"){
					lastChild = lastChild.lastChild;
				}
				this.path.push({nodeName: lastChild.nodeName, offset:lastChild.parentNode.childNodes.length});
				this.anchor.node = lastChild;
				this.anchor.offset = 1;
			}
		},
		
		_moveRightNumeratorToDenominator: function(numeratorMrow/*分子*/){
			// summary
			//		右移，从分子最后面，移动到分母最前面
			
			var denominatorMrow = numeratorMrow.nextSibling;
			this._movePathToNextSibling(denominatorMrow);
			var firstChild = denominatorMrow.firstChild;
			if(this._isTokenNode(firstChild.nodeName)){
				
			}else{
				if(firstChild.nodeName === "mstyle"){
					firstChild = firstChild.firstChild;
				}
			}
			this.path.push({nodeName: firstChild.nodeName, offset: 1});
			this.anchor.node = firstChild;
			this.anchor.offset = 0;
		},
		
		_moveToTopRight: function(node/*mrow*/){
			// summary:
			//		往右上外层移动
			this.path.pop();
			this.anchor.node = node.parentNode;
			this.anchor.offset = 1; // 往上移动时，节点为layout节点。
		},
		
		_moveToTopLeft: function(node/*mrow*/){
			// summary:
			//		往左上内层移动
			this.path.pop();
			this.anchor.node = node.parentNode;
			this.anchor.offset = 0; // 往上移动时，节点为layout节点。
		},
		
		_moveRightMrootIndexToBase: function(rootIndexMrow/*mroot index mrow*/){
			var rootBaseMrow = rootIndexMrow.previousSibling;
			this._movePathToPreviousSibling(rootBaseMrow);
			var firstChild = rootBaseMrow.firstChild;
			this.path.push({nodeName: firstChild.nodeName, offset: 1});
			this.anchor.node = firstChild;
			this.anchor.offset = 0;
		},
		
		_getTextLength: function(tokenNode){
			// summary:
			//		获取节点中有效符号的个数，注意这个长度不是字符的长度。
			//		如sin是一个三角函数，它的长度是1，而不是3。
			
			var length = 0;
			if(xmlUtil.isPlaceHolder(tokenNode)){
				// 占位符中内容的长度为0
				return 0;
			}else{
				// 只有token节点，才需要计算
				var nodeName = tokenNode.nodeName;
				if(nodeName === "mn" || nodeName === "text"){
					length = tokenNode.textContent.length;
				}else if(nodeName === "mo" || nodeName === "mi"){
					// mo和mi的长度永远为1
					length = 1;
				}
			}
			return length;
		},
		
		_movePathToNextSibling: function(nextSibling){
			// summary:
			//		将path的值设为下一个兄弟节点。
			//		注意：在一个token节点中移动光标时，不需要调整path的值。
			
			var pos = this.path.pop();
			pos.offset++;
			pos.nodeName = nextSibling.nodeName;
			this.path.push(pos);
		},
		
		_movePathToPreviousSibling: function(nextSibling){
			// summary:
			//		将path的值设为下一个兄弟节点。
			//		注意：在一个token节点中移动光标时，不需要调整path的值。
			
			var pos = this.path.pop();
			pos.offset--;
			pos.nodeName = nextSibling.nodeName;
			this.path.push(pos);
		},
		
		_isLineNode: function(node){
			return node.nodeName === "line";
		},
		
		_isLineStart: function(anchor){
			// summary:
			//		处理所有处于行首的判断。
			//		有三种情况：
			//		1. 处于一个空行中
			//		2. 行中第一个节点是text节点，并且offset的值为0
			//		3. 行中第一个节点是math节点，并且offset的值为0
			//
			//		在判断逻辑中调节path。
			// 		如果不是行尾，则返回false；如果是行尾则返回当前行。
			//		FIXME:在这个方法中处理了两个逻辑，为的是减少条件判断。寻找更好的重构手段。
			
			var node = anchor.node;
			var offset = anchor.offset;
			
			var nodeName = node.nodeName;
			if(nodeName === "line"){
				return node;
			}else if(nodeName === "text" && offset === 0 && !node.previousSibling){
				this.path.pop();
				return node.parentNode;
			}else if(nodeName === "math" && offset === 0 && !node.previousSibling){
				this.path.pop();
				return node.parentNode;
			}
			return false;
		},
		
		_isLineEnd: function(anchor){
			// summary：
			//		在判断逻辑中调节path。
			// 		如果不是行尾，则返回false；如果是行尾则返回当前行。
			//		FIXME:在这个方法中处理了两个逻辑，为的是减少条件判断。寻找更好的重构手段。
			var node = anchor.node;
			var offset = anchor.offset;
			var nodeName = node.nodeName;
			if(nodeName === "line"){
				return node;
			}else if(nodeName === "text" && offset === node.textContent.length  && !node.nextSibling){
				this.path.pop();// 从路径中移除text节点
				return node.parentNode;
			}else if(nodeName === "math" && offset === 1 && !node.nextSibling){
				this.path.pop();
				return node.parentNode;
			}
			
			return false;
		},
		
		_moveLineStart: function(line){
			// summary:
			//		移到行首
			var childCount = line.childNodes.length;
			if(childCount === 0){
				this.anchor.node = line;
				this.anchor.offset = 0;
				return;
			}
			var firstChild = line.firstChild;
			var firstChildNodeName = firstChild.nodeName;
			if(firstChildNodeName === "text"){
				this.anchor.node = firstChild;
				this.anchor.offset = 0;
				this.path.push({nodeName: firstChildNodeName, offset: 1});
				return;
			}
			
			if(firstChildNodeName === "math"){
				this.anchor.node = firstChild;
				this.anchor.offset = 0;
				this.path.push({nodeName: firstChildNodeName, offset: 1});
				return;
			}
			
			console.error("没有添加第一个节点是"+firstChildNodeName+"时，进入行首的逻辑");
		},
		
		_moveLineEnd: function(line){
			// summary:
			//		移到行尾，不处理调整行的path
			var childCount = line.childNodes.length;
			if(childCount === 0){
				this.anchor.node = line;
				this.anchor.offset = 0;
				return;
			}
			var lastChild = line.lastChild;
			var lastChildNodeName = lastChild.nodeName;
			if(lastChildNodeName === "text"){
				this.anchor.node = lastChild;
				this.anchor.offset = lastChild.textContent.length;
				this.path.push({nodeName: lastChildNodeName, offset: childCount});
				return;
			}
			
			if(lastChildNodeName === "math"){
				this.anchor.node = lastChild;
				this.anchor.offset = 1;
				this.path.push({nodeName: lastChildNodeName, offset: childCount});
				return;
			}
			
			console.error("没有添加最后一个节点是"+lastChildNodeName+"时，进入行尾的逻辑");
		},
		
		_canMoveRightWithInToken: function(anchor){
			var node = anchor.node;
			if(xmlUtil.isPlaceHolder(node))return false;
			var offset = anchor.offset;
			
			if(this._isTokenNode(node.nodeName) && 0 <= offset && offset < node.textContent.length){
				return true;
			}
			
			return false;
		},
		
		_canMoveLeftWithInToken: function(anchor){
			var node = anchor.node;
			if(xmlUtil.isPlaceHolder(node))return false;
			var offset = anchor.offset;
			
			if(this._isTokenNode(node.nodeName) && 0 < offset && offset <= node.textContent.length){
				return true;
			}
			
			return false;
		},
		
		_moveRightToMsqrtBaseStart: function(node/*msqrt节点*/){
			// summary:
			//		右移，往根式里层走，走到根数最前面。约定：msqrt中有且只有一个mrow节点。
			var baseMrow = node.firstChild;// mrow
			this.path.push({nodeName: baseMrow.nodeName, offset: 1});
			var firstChild = baseMrow.firstChild;
			this.path.push({nodeName: firstChild.nodeName, offset: 1});
			this.anchor.node = firstChild;
			this.anchor.offset = 0; // 如果前一个节点是token节点时，需要显式赋值。
		},
		
		_moveLeftToMsqrtBaseEnd: function(node/*msqrt节点*/){
			// summary:
			//		左移，往根式里走，走到根数的最后面。约定：msqrt中有且只有一个mrow节点。
			var baseMrow = node.firstChild; //mrow，只有调用firstChild才能保证永远正确
			this.path.push({nodeName: baseMrow.nodeName, offset: 1/*因为msqrt中有且只有一个mrow节点*/});
			var lastChild = baseMrow.lastChild;
			this.path.push({nodeName: lastChild.nodeName, offset: lastChild.childNodes.length});
			this.anchor.node = lastChild;
			if(this._isTokenNode(lastChild.nodeName)){
				this.anchor.offset = this._getTextLength(lastChild);
			}else{
				this.anchor.offset = 1;
			}
		},
		
		_moveRightToMrootIndexStart: function(node/*mroot节点*/){
			// summary:
			//		右移，往根式里层走，走到根次最前面。约定：mroot中有且只有两个mrow节点，第一个为base节点，第二个为index节点
			
			var indexMrow = node.lastChild; // mrow
			this.path.push({nodeName: indexMrow.nodeName, offset: 2/*因为index mrow是mroot中的第二个节点*/});
			var firstChild = indexMrow.firstChild;
			this.path.push({nodeName: firstChild.nodeName, offset:1});
			this.anchor.node = firstChild;
			this.anchor.offset = 0;
		},
		
		// TODO:重命名，因为左移，有左移一个字母和左移一个单词之分，所以需要命名的更具体。
		// 只有英文才有这种情况。
		moveLeft: function(){
			var node = this.anchor.node;
			var offset = this.anchor.offset;
			
			var line = this._isLineStart(this.anchor);
			if(line){
				var prev = line.previousSibling;
				if(prev){
					this._movePathToPreviousSibling(prev);
					// 因为只支持排版方向为从左到右的情况，所以是移到上一行的最后位置。
					this._moveLineEnd(prev);
				}else{
					// 因为在_isLineStart中删除了之前的节点，
					// 但是我们需要焦点停留在原来的位置，因此重新加上。
					// FIXME：暂时重新加上，要是能不做这一步操作，也能完成同样的功能，最好。
					this._moveLineStart(line);
				}
				return;
			}
			// 在token之内移动
			if(this._canMoveLeftWithInToken(this.anchor)){
				this.anchor.offset--;
				return;
			}
			
			// 以下是节点之间的移动，现在约定math节点和text节点必须是交替出现的，不会同时出现两个math或两个text
			// text到math
			var prev = node.previousSibling;
			if(prev && node.nodeName === "text" && prev.nodeName === "math"){
				this._movePathToPreviousSibling(prev);
				this.anchor.node = prev;
				this.anchor.offset = 1;
				this.mode = "mathml";
				return;
			}
			// math到text
			if(prev && node.nodeName === "math" && prev.nodeName === "text"){
				this._movePathToPreviousSibling(prev);
				this.anchor.node = prev;
				this.anchor.offset = prev.textContent.length;
				this.mode = "text";
				return;
			}
			// TODO：从math往里层走。
			// 先分两种情况考虑，一个是token节点，一个是lyaout节点
			// 都是在节点之间移动。
			// 先单个情况具体处理，然后找出共性再提取。
			var nodeName = node.nodeName;
			if(nodeName === "math" && offset === 1){
				// 往里层移动
				var lastChild = node.lastChild;
				if(lastChild.nodeName === "mstyle"){
					lastChild = lastChild.lastChild;
				}
				this.path.push({nodeName: lastChild.nodeName, offset: node.childNodes.length});
				this.anchor.node = lastChild;
				if(this._isTokenNode(lastChild.nodeName)){
					// 往里层走，所以path是追加 moveIn
					this.anchor.offset = this._getTextLength(lastChild);
				}else{
					// 不是token节点，就是layout节点，获取是msytle等节点
					// 注意，如果是layout节点，往左边移动时，offset会一直保持为1
					// this.anchor.offset = 1;
				}
				return;
			}

			if(nodeName === "mfrac" && offset ===1){
				// 往里层走
				var lastChild = node.lastChild;
				if(lastChild.nodeName === "mrow"){
					this.path.push({nodeName: lastChild.nodeName, offset: node.childNodes.length});
					// mfrac中的mrow要放在path中
					lastChild = lastChild.lastChild;
					if(lastChild.nodeName === "mstyle"){
						// 分数中嵌套分数的情况
						lastChild = lastChild.lastChild;
					}
					this.path.push({nodeName: lastChild.nodeName, offset: lastChild.parentNode.childNodes.length});
				}
				
				this.anchor.node = lastChild;
				if(this._isTokenNode(lastChild.nodeName)){
					// 往里层走，所以path是追加 moveIn
					this.anchor.offset = this._getTextLength(lastChild);
				}else{
					// 不是token节点，就是layout节点，获取是msytle等节点
					// 注意，如果是layout节点，往左边移动时，offset会一直保持为1
					// this.anchor.offset = 1;
					
				}
				return;
			}
			
			if(nodeName === "msqrt" && offset === 1){				
				this._moveLeftToMsqrtBaseEnd(node);
				return;
			}
			
			// TODO:需不需要将token与layout的代码合并起来
			if(this._isTokenNode(nodeName) && offset === 0){
				// 先找前一个兄弟节点
				var prev = node.previousSibling;
				if(prev){
					this._movePathToPreviousSibling(prev);
					// 如果上一个节点是msqrt节点
					if(prev.nodeName === "msqrt"){
						this._moveLeftToMsqrtBaseEnd(prev);
						return;
					}
				}
				
				// 如果没有前一个兄弟节点，则往上寻找。
				// 往外层移动
				// 从path中移出token
				this.path.pop();
				
				var parentNode = node.parentNode;// 找token的父节点，则一定是layout节点，无需做判断
				if(parentNode && parentNode.nodeName === "mstyle"){
					parentNode = parentNode.parentNode;
				}
				if(this._isDenominatorMrow(parentNode)){
					this._moveLeftDenominatorToNumerator(parentNode);
					return;
				}
				
				if(this._isNumeratorMrow(parentNode)){
					// 往左上移
					this.path.pop();
					this.anchor.node = parentNode.parentNode;
					// this.anchor.offset = 0;
					return;
				}
				if(this._isSqrtBaseMrow(parentNode)){
					// 往左外层移动
					this._moveToTopLeft(parentNode);
					return;
				}
				
				if(parentNode){
					this.anchor.node = parentNode;
					// this.anchor.offset = 0;
				}
				return;
			}
			
			// TODO：尝试是否可将mfrac改为所有的layout节点名称
			if((nodeName === "mfrac" || nodeName === "msqrt") && offset === 0){
				var prev = node.previousSibling;
				if(prev){
					this._movePathToPreviousSibling(prev);
					// 如果下一个节点是msqrt节点
					if(prev.nodeName === "msqrt"){
						this._moveLeftToMsqrtBaseEnd(prev);
						return;
					}
				}
				
				// 往外层移动
				this.path.pop();
				
				var parentNode = node.parentNode;// 找token的父节点，则一定是layout节点，无需做判断
				if(parentNode.nodeName === "mstyle"){
					parentNode = parentNode.parentNode;
				}
				
				if(this._isDenominatorMrow(parentNode)){
					this._moveLeftDenominatorToNumerator(parentNode);
					return;
				}
				
				if(this._isNumeratorMrow(parentNode)){
					// 往左上移
					this.path.pop();
					this.anchor.node = parentNode.parentNode;
					// this.anchor.offset = 0;
					return;
				}
				if(this._isSqrtBaseMrow(parentNode)){
					// 往左外层移动
					this._moveToTopLeft(parentNode);
					return;
				}
				
				if(parentNode){
					
					this.anchor.node = parentNode;
					// this.anchor.offset = 0;
				}
				return;
			}
			
			
			// 执行到这里的时候，只能是this.anchor.offset == 0，这个时候要么是平行左移，要么是往左上层移，要么是往左下层移
			
			
			
			
			
			
			function isTokenFirst(offset){
				// summary:
				//		已经到了token节点的最前面
				return offset === 0;
			}
			
			if(this._isTokenNode(nodeName)){
				// 当前节点为token节点
				if(isTokenFirst(offset)){
					// FIXME：重构
					// 先往前寻找兄弟节点
					
					// 判断是不是已经到了页首

					// 判断是不是已经到了页尾
					
					// FIXME：判断当前节点是什么类型的节点， 判断找到的下一个节点是什么类型的节点。
					
					var previousNode = node.previousSibling;
					if(previousNode){
						if(previousNode.nodeName == "math"){
							// 从text节点跳转到math节点
							this.mode = "mathml"; // FIXME:提取方法
							
							var pos = this.path.pop();
							pos.offset--;
							pos.nodeName = previousNode.nodeName;
							this.path.push(pos);
							
							this.anchor.node = previousNode;
							this.anchor.offset = 1;
							return;
						}else{
							var textContent = previousNode.textContent;
							
							this.anchor.node = previousNode;
							this.anchor.offset = textContent.length - 1;
							
							var pos = this.path.pop();
							pos.offset--;
							pos.nodeName = previousNode.nodeName;
							this.path.push(pos);
							return;
						}
					}else{
						var parentNode = node.parentNode;
						
						if(parentNode){
							if(parentNode.nodeName === "mstyle"){
								parentNode = parentNode.parentNode;
							}
							previousNode = parentNode.previousSibling;
						}
						
						if(previousNode){
							if(previousNode.nodeName == "mrow"){
								var layoutNode = previousNode.parentNode;
								if(layoutNode && layoutNode.nodeName === "mroot"){
									// 进入这里，说明当前是mroot的index获取节点，需要跳到根式之前
									this.path.pop();
									this.path.pop();
									
									previousNode = layoutNode;
									this.anchor.offset = 0;
								}else{
									previousNode = previousNode.lastChild;
									this.path.pop();
									var pos = this.path.pop();
									pos.offset--;
									this.path.push(pos);
									this.path.push({nodeName: previousNode.nodeName, offset: previousNode.parentNode.childElementCount});
									
									if(xmlUtil.isPlaceHolder(node)){
										this.anchor.offset = 0;
									}else{
										this.anchor.offset = previousNode.textContent.length;
									}
								}
							}else if(dripLang.isFunctionApplication(previousNode)){
								// FIXME:不要一次性的移除path，而是每做一次操作就移除一层
								previousNode = previousNode.previousSibling;
								this.path.pop();
								var pos = this.path.pop();
								pos.offset-=2;
								pos.nodeName = previousNode.nodeName;
								this.path.push(pos);
							}else{
								if(previousNode.nodeName === "text"){
									this.path.pop();
									var pos = this.path.pop();
									pos.offset--;
									pos.nodeName = previousNode.nodeName;
									this.path.push(pos);
									
									this.anchor.node = previousNode;
									this.anchor.offset = previousNode.textContent.length;
								}else{
									previousNode = previousNode.lastChild;
									this.path.pop();
									var pos = this.path.pop();
									pos.offset--;
									this.path.push(pos);
									this.path.push({nodeName: previousNode.nodeName, offset: previousNode.parentNode.childElementCount});
									
									this.anchor.offset = previousNode.textContent.length;
								}
							}
							this.anchor.node = previousNode;
							return;
						}else{
							var layoutNode = parentNode.parentNode;
							if(layoutNode){
								// 说明这是个布局节点
								var layoutNodeName = layoutNode.nodeName;
								if(layoutNodeName === "mfrac"){
									// 移到分数之前
									this.path.pop();
									this.path.pop();
									this.anchor.node = parentNode.parentNode;
									this.anchor.offset = 0;
								}else if(layoutNodeName === "mroot"){
									// 从base节点移动到index节点
									node = parentNode.nextSibling.firstChild;
									this.path.pop();
									var pos = this.path.pop();
									pos.offset++;
									this.path.push(pos);
									this.path.push({nodeName: node.nodeName, offset: 1});
									
									this.anchor.node = node;
									if(xmlUtil.isPlaceHolder(node)){
										this.anchor.offset = 0;
									}else{
										// token节点
										this.anchor.offset = node.textContent.length;
									}
								}else if(layoutNodeName === "line"){
									this.path.pop();
									this.anchor.node = parentNode;// 此时是math节点，这个时候需要从mathml模式切换到text模式。
									this.anchor.offset = 0;
								}
							}
							
							return;
						}
					}
				}else{
					// 如果还没有到token节点的边界
					this.anchor.offset--;
				}
			}else{
				// 当前节点是布局节点，math,mfrac,mroot,msqrt,msub,msup等
				if(offset === 0){
					// 如果已经到了当前节点的左边界， 处理离开当前节点，进入另一个节点或另一层节点的逻辑
					var previousNode = node.previousSibling;
					
					if(previousNode){
						// 如果是平行前移，则弹出当前的节点信息，并加入新节点信息
						var pos = this.path.pop();
						pos.offset--;
						pos.nodeName = previousNode.nodeName;
						this.path.push(pos);
						
						//this.anchor.node = previousNode;
					}else{
						// 没有前一个兄弟节点的时候，找父节点
						var parentNode = node.parentNode;
						if(parentNode){
							// 跳过一些节点，FIXME：提取函数
							if(parentNode.nodeName === "mstyle"){
								parentNode = parentNode.parentNode;
							}
							
							previousNode = parentNode.previousSibling;
							if(previousNode){
								this.path.pop();
								// 前一个节点
								var pos = this.path.pop();
								pos.offset--;
								pos.nodeName = previousNode.nodeName;
								this.path.push(pos);
								this.anchor.node = previousNode;
								if(previousNode.nodeName === "text"){
									this.anchor.offset = previousNode.textContent.length;
								}else{
									
								}
							}else{
								if(parentNode.nodeName === "math"){
									this.path.pop();
									this.anchor.node = parentNode;
								}else{
									previousNode = parentNode.parentNode;
									if(previousNode){
										// 往上移动时，只是把当前的节点信息移除
										this.path.pop();
										this.anchor.node = previousNode;
										// this.anchor.offset 一直保持为0
									}
								}
								
								//FIXME:需要重构调整逻辑。
							}
							
						}
					}
				}else{
					// 处理进入节点的逻辑
					var prev = node.lastChild;
					if(prev && prev.nodeName === "mstyle"){
						prev = prev.lastChild;
					}
					if(prev){
						this.path.push({nodeName:prev.nodeName, offset: node.childNodes.length});
						if(prev.nodeName === "mfrac"){
							// 定位到做后一个可编辑的节点上，定义一个完整的节点信息，需要父节点和子节点两个信息。
							var parent = prev;
							prev = prev.lastChild;// mrow
							this.path.push({nodeName:prev.nodeName, offset: parent.childNodes.length});
							
							parent = prev;
							prev = prev.lastChild;// 定位到mrow的最后一个节点上。
							if(prev.nodeName === "mn"){
								this.path.push({nodeName:prev.nodeName, offset: parent.childNodes.length});
								this.anchor.node = prev;
								if(xmlUtil.isPlaceHolder(prev)){
									this.anchor.offset = 0;
								}else{
									this.anchor.offset = prev.textContent.length;
								}
								
							}
						}
					}
				}
			}
		},
		
		moveRight: function(){
			// summary:
			//		右移时，有的情况是要往外层走；有的时候是要往内层走。
			//		左移也是。
			//	在其中做三件事情：
			//	1. 找到下一个节点
			//	2. 设置当前节点和偏移量
			//	3. 存储当前节点的路径信息
			//
			//	移动路径分析：
			//	1. 由一个token节点移到另一个token节点
			//	2. 由一个token节点移到一个layout节点
			//	3. 由一个layout节点移到token节点
			//	4. 由token节点移到line节点
			//	5. 由layout节点移到line节点
			//	6. 由line节点移到line节点
			//	7. 由line节点移到layout节点
			//	8. 由line节点移到token节点
			//
			//	也谈重构：
			//		不要指望一下子就能发现事物的本质，做事情的第一步就是从现象的累计开始，从琐碎的细节开始，
			//		随着工作的进行，轮廓逐渐的清晰，这个时候本质的真容跃然纸上，这个时候可以重构了。
			//		即使没有重构，至少我们把握住了一些现象，系统依然是可以运行的。
			//		所以说初级系统是首先运行于各种现象的累积之上的；也可进一步优化和重构，让其运行在事务的本质之上。
			//		要抓本质，首先抓事物之间的关系，不要限于同一事物的琐碎中去。
			//
			//	目前支持的有效节点有：
			//	line,text, mathml token, mathml layout(frac)
			//	把移动的特殊情况都罗列出来，然后逐个实现（这就是编辑器的需求）
			//	1. mathml token内部移动：只需调整偏移量 +1
			//	2. text节点内部移动：只需调整偏移量 +1
			//	3. 空行之间移动：node为下一行；偏移量为0；path移到一行
			//	4. text节点移到math节点：移到math上，整个math用另一个背景色显示，或用边框扩住（获取焦点）。
			//	5. math节点移到text节点：math不再获取焦点，移到text的最前面。
			//	6. mathml token节点之间移动：下一个节点获取焦点，偏移量为1；path也移到下一个节点。
			//	7. 从math节点进入其中的第一个有效节点（往内层走）：
			//		找到第一个有效节点：token节点、分数、根号、上下标、括号等。（TODO：补充）
			//	8. 分数
			//		移动到分数前
			//		从分数前移动到分子前
			//		从分子后移动到分母前
			//		从分母后移动到分数后
			//		离开分数后(面)
			//	9. 根号
			//		移到根号前
			//		从根号前移动到根次前
			//		从根次后移动到根式前
			//		从根式后移动到根号后
			//		离开根号后
			//	10. 上下坐标
			//		移到上下坐标前
			//		从上下坐标前直接移到base中（注意差别是直接进入内容）
			//		从base后移到sup/sub前
			//		由sup/sub后移到上下坐标后
			//	11. 括号
			//		移到括号前
			//		从括号前移到括号里的第一个节点前（有效节点）
			//		从最后一个节点后移到括号后
			//		离开括号后
			//	12. ……
			
			// 当需要换行时。
			var line = this._isLineEnd(this.anchor);
			if(line){
				var next = line.nextSibling;
				if(next){
					this._movePathToNextSibling(next);
					// 因为只支持排版方向为从左到右的情况，所以是移到上一行的最后位置。
					this._moveLineStart(next);
				}else{
					// 因为在_isLineEnd中删除了之前的节点，
					// 但是我们需要焦点停留在原来的位置，因此重新加上。
					// FIXME：暂时重新加上，要是能不做这一步操作，也能完成同样的功能，最好。
					this._moveLineEnd(line);
				}
				return;
			}
			// 如果在token节点之内
			if(this._canMoveRightWithInToken(this.anchor)){
				this.anchor.offset++;
				return;
			}
			
			var node = this.anchor.node;
			var offset = this.anchor.offset;
			// 以下是节点之间的移动，现在约定math节点和text节点必须是交替出现的，不会同时出现两个math或两个text
			// text到math
			var next = node.nextSibling;
			if(next && node.nodeName === "text" && next.nodeName === "math"){
				this._movePathToNextSibling(next);
				this.anchor.node = next;
				this.anchor.offset = 0;
				this.mode = "mathml";
				return;
			}
			// math到text
			if(next && node.nodeName === "math" && next.nodeName === "text"){
				this._movePathToNextSibling(next);
				this.anchor.node = next;
				this.anchor.offset = 0;
				this.mode = "text";
				return;
			}
			
			var nodeName = node.nodeName;
			if(nodeName === "math" && offset === 0){
				var firstChild = node.firstChild;
				if(firstChild.nodeName === "mstyle"){
					firstChild = firstChild.firstChild;
				}
				this.path.push({nodeName: firstChild.nodeName, offset: 1});
				this.anchor.node = firstChild;
				if(this._isTokenNode(firstChild.nodeName)){
					// 往里层走，所以path是追加 moveIn
					this.anchor.offset = 0;
				}else{
					// 不是token节点，就是layout节点，获取是msytle等节点
					// 注意，如果是layout节点，往右边移动时，offset会一直保持为0
					// this.anchor.offset = 0;
				}
				return;
			}
			// 移进mfrac
			if(nodeName === "mfrac" && offset ===0){
				// 往里层走 FIXME：重构方法
				var firstChild = node.firstChild;
				if(firstChild.nodeName === "mrow"){
					this.path.push({nodeName: firstChild.nodeName, offset: 1});
					// mfrac中的mrow要放在path中
					firstChild = firstChild.firstChild;
					if(firstChild.nodeName === "mstyle"){
						// 分数中嵌套分数的情况
						firstChild = firstChild.firstChild;
					}
					this.path.push({nodeName: firstChild.nodeName, offset: 1});
				}
				
				this.anchor.node = firstChild;
				//this.anchor.offset = 0;
				return;
			}
			if(nodeName === "msqrt" && offset ===0){
				this._moveRightToMsqrtBaseStart(node);
				return;
			}
			if(nodeName === "mroot" && offset === 0){
				this._moveRightToMrootIndexStart(node);
				return;
			}
			
			// TODO:需不需要将token与layout的代码合并起来
			// FIXME:需要统一layout部件的处理逻辑。
			// 这里需要切换到下一个节点，下一个节点是什么类型的节点，需要再做判断。
			if((nodeName === "msqrt" || nodeName === "mfrac" || nodeName === "mroot") && offset === 1){
				// 先找下一个节点
				var next = node.nextSibling;
				if(next){
					this._movePathToNextSibling(next);
					// 如果下一个节点是msqrt节点
					if(next.nodeName === "msqrt"){
						this._moveRightToMsqrtBaseStart(next);
						return;
					}
					if(next.nodeName === "mroot"){
						this._moveRightToMrootIndexStart(next);
						return;
					}
				}
				
				// 往外层移动
				this.path.pop();
				
				var parentNode = node.parentNode;// 找token的父节点，则一定是layout节点，无需做判断
				if(parentNode.nodeName === "mstyle"){
					parentNode = parentNode.parentNode;
				}
				if(this._isNumeratorMrow(parentNode)){
					this._moveRightNumeratorToDenominator(parentNode);
					return;
				}
				if(this._isDenominatorMrow(parentNode)){
					this._moveToTopRight(parentNode);
					return;
				}
				if(this._isSqrtBaseMrow(parentNode)){
					// 往外层移动
					this._moveToTopRight(parentNode);
					return;
				}
				if(this._isRootIndexMrow(parentNode)){
					this._moveRightMrootIndexToBase(parentNode);
					return;
				}
				if(this._isRootBaseMrow(parentNode)){
					this._moveToTopRight(parentNode);
					return;
				}
				
				if(parentNode){
					this.anchor.node = parentNode;
					// this.anchor.offset = 1;
				}
				return;
			}
			
			
			if(this._isTokenNode(nodeName) && offset === this._getTextLength(node)){
				// 往外层移动
				// 从path中移出token,先寻找有没有下一个节点，如果没有下一个节点，则移到父节点
				var next = node.nextSibling;
				if(next){
					this._movePathToNextSibling(next);
					// 如果下一个节点是msqrt节点
					if(next.nodeName === "msqrt"){
						this._moveRightToMsqrtBaseStart(next);
						return;
					}
					if(next.nodeName === "mroot"){
						this._moveRightToMrootIndexStart(next);
						return;
					}
					
				}
				
				// 没有找到下一个节点，开始往上需找父节点，以下的逻辑都是处理父节点的逻辑
				this.path.pop();
				
				var parentNode = node.parentNode;// 找token的父节点，则一定是layout节点，无需做判断
				if(parentNode && parentNode.nodeName === "mstyle"){
					parentNode = parentNode.parentNode;
				}
				if(this._isNumeratorMrow(parentNode)){
					this._moveRightNumeratorToDenominator(parentNode);
					return;
				}
				if(this._isDenominatorMrow(parentNode)){
					this._moveToTopRight(parentNode);
					return;
				}
				if(this._isSqrtBaseMrow(parentNode)){
					// 往外层移动
					this._moveToTopRight(parentNode);
					return;
				}
				if(this._isRootIndexMrow(parentNode)){
					this._moveRightMrootIndexToBase(parentNode);
					return;
				}
				if(this._isRootBaseMrow(parentNode)){
					this._moveToTopRight(parentNode);
					return;
				}
				
				
				if(parentNode){
					this.anchor.node = parentNode;
					this.anchor.offset = 1;
				}
				return;
			}
			
			
			
			
			
			
			var nodeName = node.nodeName;
			if(this._isTokenNode(nodeName)){
				var contentLength = this._getTextLength(node);
				if(offset < contentLength){
					// 在token节点内移动。
					this.anchor.offset++;
					return;
				}else{
					// TODO：开始跨出token节点，往右移
					// 注意获取两个节点的信息（当前节点和下一个节点），以及两个节点之间的路径。
					var nextNode = node.nextSibling;
					if(nextNode){
//						if(this._isLineNode(nextNode)){
//							// 移动到下一行
//							node = nextNode;
//							offset = 0;
//							this._movePathToNextSibling(nextNode);
//						}else if(this._isTokenNode(nextNode.nodeName)){
//							node = nextNode;
//							offset = 1;
//							this._movePathToNextSibling(nextNode);
//						}
//						return;
					}
				}
			}

			
			
			// 已经到了一个节点的最后了
			// 找到下一个合适的节点
			// 如果没有找到，则进入下一行
			
			var nextNode = node.nextSibling;
			if(nextNode){
				// 如果下一个节点中没有子节点，应该只有line节点才会出现这种情况
				// FIXME：这个判断条件不严谨
				if(nextNode.childNodes.length == 0){
					node = nextNode;
					offset = 0;
					// 移动到下一行
					this._movePathToNextSibling(nextNode);
				}else{
					node = nextNode;
					if(node.nodeName === "text"){
						// 从math节点移到text节点。
						// 如果之前的模式是mathml，则转换为text
						this.mode = "text";
						offset = 0;
					}
					this._movePathToNextSibling(nextNode);
				}
			}else{
				// 分两步:
				//		1. 不断往上找，直到找到下一个有效的节点;
				//		2. 然后再在这个节点上往内层查找
				
				// 以下实现的是从里往外层移动。这是token节点才有的特征
				var parentNode = node.parentNode;
				// 目前需要跳过的节点有mstyle和mrow，而mrow只是在有些情况下才需要跳过。
				if(parentNode.nodeName === "mstyle"){
					// FIXME：这里的逻辑不正确，不应该直接跳转到父节点，跳到mstyle中的下一个节点。
					// 但是这个逻辑，已经在前面判断了，所以逻辑没有错，说明已经到了mstyle的最后一个节点了。
					parentNode = parentNode.parentNode;
				}
				// 注意，mstyle现在只有mfrac才有
				// mfrac的固定路径为 mfrac/mstyle/mrow
				if(parentNode.nodeName === "mrow"){
					// 如果是mrow节点，则需要根据mrow的节点的类别决定后续的操作
					// parent可定是layout节点
					var parent = parentNode.parentNode;
					var child = parentNode;
					
					if(parent.nodeName === "mfrac"){
						if(child.nextSibling){
							// 从分子末尾向分母起始移动
							node = child.nextSibling.firstChild;
							this.path.pop();
							var pos = this.path.pop();
							pos.offset++;
							this.path.push(pos);
							this.path.push({nodeName:node.nodeName, offset:1});
							
							offset = 0;
						}else{
							// 说明已经移到分母最后，要移到整个分数后面。
							this.path.pop(); // 弹出mn
							this.path.pop(); // 弹出mrow
							// 剩下的path保持不变。
							node = parent;
							// offset的值与path中的offset相同
							offset = this.path[this.path.length-1].offset;
						}
					}else if(parent.nodeName === "mroot"){
						if(child.previousSibling){
							// 从根式的index移到base中，在mathml中，<mroot>base index</mroot>
							node = child.previousSibling.firstChild;
							offset = 0;
							
							this.path.pop();
							var pos = this.path.pop();
							pos.offset--;
							this.path.push(pos);
							this.path.push({nodeName: node.nodeName, offset: 1});
						}else{
							// 从base节点移到根式之外
							this.path.pop();
							this.path.pop();
							
							node = parent;
							offset = 1;
						}
					}else if(parent.nodeName === "msup" || parent.nodeName === "msub"){
						if(child.nextSibling){
							node = child.nextSibling.firstChild;
							offset = 0;
							
							this.path.pop();
							var pos = this.path.pop();
							pos.offset++;
							this.path.push(pos);
							this.path.push({nodeName: node.nodeName, offset: 1});
						}
					}
				}else if(parentNode.nodeName == "line"){
					var nextNode = parentNode.nextSibling;
					if(nextNode){
						if(nextNode.childNodes.length == 0){
							this.path.pop();
							var pos = this.path.pop();
							pos.offset++;
							this.path.push(pos);
							
							node = nextNode;
							offset = 0;
						}else{
							var firstChild = nextNode.firstChild;
							
							this.path.pop();
							var pos = this.path.pop();
							pos.offset++;
							this.path.push(pos);
							this.path.push({nodeName: node.nodeName, offset:1});
							
							node = firstChild;
							offset = 0;
						}
					}else{
						// 说明已经到了边界了，什么也不做。
						
					}
				}else{
					var nextNode = parentNode.nextSibling;
					if(nextNode){
						this.path.pop();
						var pos = this.path.pop();
						pos.offset++;
						this.path.push(pos);
						
						node = nextNode;
						offset = 0;
					}else{
						if(parentNode.nodeName === "math"){
							if(offset === 1){
								this.path.pop();
								node = parentNode;
								offset = 1;
								// 已经到了math的边界，这个时候默认切换到text模式
								this.mode = "text";
							}else if(offset === 0){
								var next = parentNode.firstChild;
								if(next.nodeName === "mstyle"){
									next = next.firstChild;
								}
								
								this.path.push({nodeName: next.nodeName, offset: 1});
								if(next.nodeName === "mfrac"){
									// 定位到做后一个可编辑的节点上，定义一个完整的节点信息，需要父节点和子节点两个信息。
									next = next.firstChild;// mrow
									this.path.push({nodeName:next.nodeName, offset: 1});
									
									next = next.firstChild;// 定位到mrow的第一个节点上。
									if(next.nodeName === "mn"){
										this.path.push({nodeName:next.nodeName, offset: 1});
										this.anchor.node = next;
										this.anchor.offset = 0;
									}
								}
							}
							
						}
						// 说明已经到了边界了，什么也不做。
					}
					
				}
			}
			
			this.anchor.node = node;
			this.anchor.offset = offset;
		},
		
		moveUp: function(){
			
		},
		
		moveDown: function(){
			
		},
		
		_getFocusLine: function(){
			// summary:
			//		当前节点往上追溯，获取nodeName为line的行
			
			var focusNode = this.getFocusNode();
			var lineNode = focusNode;
			while(lineNode && lineNode.nodeName != "line"){
				lineNode = lineNode.parentNode;
			}
			
			return lineNode;
		}, 
		
		_isNotSameNode: function(newNodeName, node){
			var nodeName = node.nodeName;
			return newNodeName == nodeName;
		},
		
		_isLineNode: function(node){
			return node.nodeName == "line";
		},
		
		// TODO：起更好的名字，因为textNode容易与document中定义的Text类型的Node混淆
		_isTextNode: function(node){
			return node.nodeName == "text";
		},
		
		_insertChar: function(charData){
			// summary:
			//		在聚焦的节点中，当前光标新的字符，并移动当前光标的位置。
			// FIXME：这个函数做了两件事情
			var focusNode = this.anchor.node;
			var offset = this.anchor.offset;
			
			var oldText = focusNode.textContent;
			var newText = dripString.insertAtOffset(oldText, offset, charData);
			focusNode.textContent = newText;
			// 注意，这里输入的char，不管几个字符都当作一个长度处理，如&123;也当作一个字符处理。
			offset += 1;
			
			this._updateAnchor(focusNode, offset);
		},
		
		// 获取xml文件的字符串值。没有没有输入任何内容则返回空字符串。
		getXML: function(){
			var doc = this.doc;
			if(doc.firstChild.firstChild.childNodes.length == 0){
				return "";
			}
			
			return xmlParser.innerXML(this.doc);
		},
		
		isEmpty: function(){
			// summary:
			//		判断model中是否有内容，如果没有值则返回true，否则返回false。
			
			return this.getXML() == "";
		},
		
		// summary:
		//		获取当前获取焦点的节点相对于根节点的path值.
		//		注意，获取的值与xpath并不一致，这里只是将nodeName和offset用字符串形式表示出来。
		getPath: function(){
			var xpath = "";
			array.forEach(this.path, function(path, index){
				xpath += "/";
				xpath += path.nodeName;
				
				if(path.offset){
					xpath += "[" + path.offset + "]";
				}
			});
			return xpath;
		},
		
		getFocusNode: function(){
			return this.anchor.node;
		},
		
		getOffset: function(){
			return this.anchor.offset;
		},
		
		getLines: function(){
			return this.doc.documentElement.childNodes;
		},
		
		getLineAt: function(lineIndex){
			// summary: 
			//		获取行节点。
			// lineIndex: Number
			//		行节点的索引，从0开始
			
			return this.getLines()[lineIndex];
		},
		
		getLineCount: function(){
			return this.getLines().length;
		},
		
		// 习题 line 获取html格式的数据
		//		展示页面时使用
		// FIXME:是不是应该移到view中呢？
		getHTML: function(){
			return dataUtil.xmlDocToHtml(this.doc);
		}
	
	});
	
});