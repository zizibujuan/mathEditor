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
		//		光标所在的节点
		// offset：
		//		光标在node节点中的偏移量，主要是node的子节点或者文本节点内容的偏移量
		//node:null, offset : -1
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
			this.onChange();
		},
		
		// 如果没有内容，则创建一个新行
		// 如果存在内容，则加载内容，并将光标移到最后
		loadData: function(xmlString){
			
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
				mo.textContent = "&#x2061;";
				
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
				mo.textContent = "&#x2061;";
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
			//			默认为0，要移除的字符的数量，在新增data钱，从当前聚焦位置往前删除removeCount个字符。
			
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
				this.onChange(data);
				return;
			}else if(this.isMathMLMode()){
				var node = this.anchor.node;
				var isNumericCharacter = false;
				var isTrigonometric = false;
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
				
				// 因为letter只是一个字符，所以不需要循环处理
				if(nodeName === "mi"){
					// 推断周围的字符，如果能够拼够一个三角函数，则插入三角函数
					if(isNumericCharacter){
						this.anchor = this.insertMi(this.anchor, data, nodeName);
					}else if(isTrigonometric){
						this.anchor = this.insertTrigonometric(this.anchor, data, nodeName);
					}else{
						var tri = this.findTrigonometric(this.anchor, data, nodeName);
						if(tri){
							this.anchor = this.removeExistTrigonometricPart(this.anchor, tri);
							this.anchor = this.insertTrigonometric(this.anchor, tri.functionName, nodeName);
						}else{
							this.anchor = this.insertMi(this.anchor, data, nodeName);
						}
					}
					this.onChange(data);
					return;
				}else if(nodeName === "mn"){
					// 目前只支持输入数字时，剔除占位符。
					this.anchor = this.insertMn(this.anchor, data, nodeName);
					this.onChange(data);
					return;
				}else if(nodeName === "mo"){
					this.anchor = this.insertMo(this.anchor, data, nodeName);
					this.onChange(data);
					return;
				}else if(nodeName === "mfenced"){
					this.anchor = this.insertFenced(this.anchor, data, nodeName);
					this.onChange(data);
					return;
				}else if(nodeName === "mfrac"){
					this._splitNodeIfNeed(nodeName);
					this.anchor = this.insertMfrac(this.anchor, data, nodeName);
					this.onChange(data);
					return;
				}else if(nodeName === "msqrt"){
					this._splitNodeIfNeed(nodeName);
					this.anchor = this.insertMsqrt(this.anchor, data, nodeName);
					this.onChange(data);
					return;
				}else if(nodeName === "mroot"){
					this._splitNodeIfNeed(nodeName);
					this.anchor = this.insertMroot(this.anchor, data, nodeName);
					this.onChange(data);
					return;
				}else if(nodeName === "msub" || nodeName == "msup"){
					this._splitNodeIfNeed(nodeName);
					this.anchor = this.insertScripting(this.anchor, data, nodeName);
					this.onChange(data);
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
				this.onChange();
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
		
		_lineUpForLineNode: function(anchor){
			// summary:
			//		这个方法只能用于node的nodeName为line的情况
			var node = anchor.node;
			var offset = anchor.offset;
			
			var previousNode = node.previousSibling;
			if(!previousNode){
				return anchor;
			}
			
			if(previousNode.lastChild){
				previousNode = previousNode.lastChild;
				
				if(previousNode.nodeName == "math"){
					previousNode = previousNode.lastChild;
				}
				var textContent = previousNode.textContent;
				
				var pos = this.path.pop();
				pos.offset--;
				this.path.push(pos);
				this.path.push({nodeName: previousNode.nodeName, offset:previousNode.parentNode.childElementCount});
				
				return {node: previousNode, offset: textContent.length};
			}else{
				var pos = this.path.pop();
				pos.offset--;
				this.path.push(pos);
				
				return {node: previousNode, offset: 0};
			}
		},
		
		moveLeft: function(){
			var node = this.anchor.node;
			var offset = this.anchor.offset;
			
			var nodeName = node.nodeName;
			if(nodeName == "line"){
				// FIXME：重构
				this.anchor = this._lineUpForLineNode(this.anchor);
				return;
			}
			
			if(offset > 0){
				this.anchor.offset--;
				return;
			}
			
			if(offset == 0){
				// FIXME：重构
				// 先往前寻找兄弟节点
				
				// 判断是不是已经到了页首
				if(node.previousNode == null){
					var parent = node.parentNode;
					if(!parent.previousSibling){
						return;
					}
				}
				
				// 判断是不是已经到了页尾
				
				
				var previousNode = node.previousSibling;
				if(previousNode){
					if(previousNode.nodeName == "math"){
						previousNode = previousNode.lastChild;
					}
					var textContent = previousNode.textContent;
					
					this.anchor.node = previousNode;
					this.anchor.offset = textContent.length - 1;
					return;
				}else{
					var parentNode = node.parentNode;
					
					if(parentNode){
						previousNode = parentNode.previousSibling;
					}
					
					if(previousNode && previousNode.nodeName == "mrow"){
						previousNode = previousNode.lastChild;
					}
					
					this.path.pop();
					var pos = this.path.pop();
					pos.offset--;
					this.path.push(pos);
					this.path.push({nodeName: previousNode.nodeName, offset: previousNode.parentNode.childElementCount})
					
					this.anchor.node = previousNode;
					return;
				}
				// 如果找不到兄弟节点，则寻找父节点
				var parentNode = node.parentNode;
				var previousNode = parentNode.previousSibling;
				if(previousNode){
					if(previousNode.nodeName == "line"){
						previousNode = previousNode.lastChild;
						if(previousNode.nodeName == "math"){
							previousNode = previousNode.lastChild;
						}
						var textContent = previousNode.textContent;
						
						this.anchor.node = previousNode;
						this.anchor.offset = textContent.length;
						
						this.path.pop(); // 弹出text
						var pos = this.path.pop();
						pos.offset--;
						this.path.push(pos);
						this.path.push({nodeName: previousNode.nodeName, offset:previousNode.parentNode.childElementCount});
					}else{
						var textContent = previousNode.textContent;
						
						this.anchor.node = previousNode;
						this.anchor.offset = textContent.length - 1;
					}
					
				}
			}
			
		},
		
		moveRight: function(){
			var node = this.anchor.node;
			var offset = this.anchor.offset;
			
			var contentLength = node.textContent.length;// FIXME:mo和mi的长度永远为1
			if(offset < contentLength){
				this.anchor.offset++;
				return;
			}
			
			var nextNode = node.nextSibling;
			if(!nextNode){
				var parentNode = node.parentNode;
				if(parentNode.nodeName == "mrow"){
					var layoutNode = parentNode.parentNode;
					if(layoutNode.nodeName == "mfrac"){
						node = parentNode.nextSibling.firstChild;
						this.path.pop();
						var pos = this.path.pop();
						pos.offset++;
						this.path.push(pos);
						this.path.push({nodeName:node.nodeName, offset:1});
					}
				}
			}
			
			this.anchor.node = node;
		},
		
		moveUp: function(){
			
		},
		
		moveDown: function(){
			
		},
		
		getLineCount: function(){
			return this.doc.documentElement.childNodes.length;
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
		
		getLineAt: function(lineIndex){
			// summary: 
			//		获取行节点。
			// lineIndex: Number
			//		行节点的索引，从0开始
			
			return this.getLines()[lineIndex];
		},
		
		getLines: function(){
			return this.doc.documentElement.childNodes;
		},
		
		// 习题 line 获取html格式的数据
		//		展示页面时使用
		getHTML: function(){
			return dataUtil.xmlDocToHtml(this.doc);
		},
		
		
		
		onChange: function(data){
			// 什么也不做，View在该方法执行完毕后，执行刷新操作
		}
	
	});
	
});