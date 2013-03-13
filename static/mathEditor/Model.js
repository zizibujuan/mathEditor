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
		
		_isTextMode: function(){
			return this.mode === "text";
		},
		
		_isMathMLMode: function(){
			return this.mode === "mathml";
		},
		
		_toTextMode: function(){
			this.mode = "text";
		},
		
		_toMathMLMode: function(){
			this.mode = "mathml";
		},
		
		
		_init: function(){
			// 注意：在类中列出的属性，都必须在这里进行初始化。
			this.doc = xmlParser.parse(EMPTY_XML);
			this.path = [];
			this.anchor = {};
			// FIXME:如何存储呢？
			
			this._updateAnchor(this.doc.documentElement.firstChild, 0);
			
			this._toTextMode();
			
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
			
			// 第一行和最后一行需要特殊处理，中间的行数全部使用line节点添加在两者中间即可，没有其他处理逻辑。
			var lines = this._split(text);
			// 从lines中移除第一行，第一行代码需要与光标前面的代码对接
			var firstLine = lines.splice(0,1)[0];
			// 从lines中移除最后一行，最后一行代码需要与光标后面的代码对接
			var lastLine = lines.splice(lines.length-1, lines.length)[0];
			
			
			var xmlDoc = this.doc;
			
			if(this._isLineNode(node)){
				var nodeName = "text";
				// 这里有一个假定，只要是line,则必是一个空行。
				var newNode = xmlDoc.createElement(nodeName);
				node.appendChild(newNode);
				
				// FIXME：如何避免多次设置path呢？
				node = newNode;
				offset = 0;
				this.path.push({nodeName:nodeName,offset:0});
			}
			
			// 如果第一行中有内容，则添加第一行
			if(firstLine.length > 0){
				var oldText = node.textContent;
				node.textContent = dripString.insertAtOffset(oldText, offset, firstLine);
				offset += firstLine.length;
				// 注意只是在行中增加内容，不改变路径
				var pos = this.path.pop();
				if(pos.offset == 0){
					pos.offset = 1;
				}
				this.path.push(pos);
			}
			if(lastLine != null){
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
				var newLineNode = xmlDoc.createElement(nodeName);
				dripLang.insertNodeAfter(newLineNode, traceLine);
				if(lastLine.length == 0){
					node = newLineNode;
					offset = 0;
					this.path.pop();
					var pos = this.path.pop();
					this.path.push({nodeName:nodeName, offset:pos.offset+1});
				}else{
					var nodeName = "text";
					// 这里有一个假定，只要是line,则必是一个空行。
					var newNode = xmlDoc.createElement(nodeName);
					newNode.textContent = lastLine;
					
					newLineNode.appendChild(newNode);
					
					node = newNode;
					offset = lastLine.length;
					// 剔除text
					this.path.pop();
					// 将line追加
					var pos = this.path.pop();
					pos.offset++;
					this.path.push(pos);
					this.path.push({nodeName:nodeName,offset:1});
				}
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
		
		insertMi: function(anchor, miContext){
			// 这里只处理单个英文字母的情况
			// 注意如果获取焦点的节点是mi节点，则offset的值要么是0， 要么是1，
			// 分别代表在mi的前或后
			
			// 通常一个完整的mi类型的字符占用一个mi
			
			var nodeName = "mi";
			var node = anchor.node;
			var offset = anchor.offset;
			var xmlDoc = this.doc;
			
			// 以下是处理mi的正常逻辑
			if(this._isLineNode(node)){
				this.path.push({nodeName:"math", offset:1});
				this.path.push({nodeName:nodeName, offset:1});
				
				var math = xmlDoc.createElement("math");
				var newNode = xmlDoc.createElement(nodeName);
				newNode.textContent = miContext;
				
				math.appendChild(newNode);
				node.appendChild(math);
				
				node = newNode;
				offset = 1;
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
		
		insertMn: function(anchor, mnContent){
			// 按照以下思路重构。
			// 添加一个数据，分以下几步：
			//		如果指定了nodeName，则直接使用；如果没有指定，则先推导
			//		比较要输入的值和当前输入的环境
			//		确定可以执行哪些动作
			//		新建节点
			//		设置当前节点，将anchor改为context
			//		在新节点中插入内容
			//		修正当前的path值
			
			var nodeName = "mn";
			var node = anchor.node;
			var offset = anchor.offset;
			var xmlDoc = this.doc;
			
			// FIXME:在进入mathml模式时，应该不再在line和text节点中。
			// 暂时先放在这里处理，但是这里的逻辑还是添加一个math节点。
			if(this._isLineNode(node)){
				// 如果在line节点下，则先切换到math节点下。
				var mathNode = xmlDoc.createElement("math");
				var newNode = xmlDoc.createElement(nodeName);
				newNode.textContent = mnContent;
				mathNode.appendChild(newNode);
				node.appendChild(mathNode);
				
				this.path.push({nodeName:"math", offset:1});
				this.path.push({nodeName:nodeName, offset:1});
				
				node = newNode;
				offset = mnContent.length;
			}else if(this._isTextNode(node)){
				
			}else{
				var oldText = node.textContent;
				node.textContent = dripString.insertAtOffset(oldText, offset, mnContent);
				offset += mnContent.length;
			}
			
			return {node:node, offset:offset};
		},
		
		insertMo: function(anchor, moContent){
			var nodeName = "mo";
			var node = anchor.node;
			var offset = anchor.offset;
			var xmlDoc = this.doc;

			if(this._isLineNode(node)){
				var mathNode = xmlDoc.createElement("math");
				var newNode = xmlDoc.createElement(nodeName);
				newNode.textContent = moContent;
				mathNode.appendChild(newNode);
				node.appendChild(mathNode);
				
				node = newNode;
				offset = 1; // 操作符号的offset要么是1，要么是0
				
				this.path.push({nodeName:"math", offset:1});
				this.path.push({nodeName:nodeName, offset:1});
			}else if(this._isTextNode(node)){
				// math应该放在textNode之后
				var mathNode = xmlDoc.createElement("math");
				var newNode = xmlDoc.createElement(nodeName);
				newNode.textContent = moContent;
				mathNode.appendChild(newNode);
				dripLang.insertNodeAfter(mathNode, node);
								
				node = newNode;
				offset = 1;

				var pos = this.path.pop();
				this.path.push({nodeName:"math", offset:pos.offset+1});
				this.path.push({nodeName:nodeName, offset:1});
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
		
		insertTrigonometric: function(anchor, data, nodeName){
			var node = anchor.node;
			var offset = anchor.offset;
			var xmlDoc = this.doc;
			
			if(this._isLineNode(node) || this._isTextNode(node)){
				this.path.push({nodeName:"math", offset:offset+1});
				this.path.push({nodeName:"mrow", offset:3});
				this.path.push({nodeName:"mn", offset:1});
				
				var math = xmlDoc.createElement("math");
				var mi = xmlDoc.createElement(nodeName);
				var mo = xmlDoc.createElement("mo");
				var mrow = xmlDoc.createElement("mrow");
				var placeHolder = xmlUtil.getPlaceHolder(xmlDoc);
				
				mi.textContent = data;
				mo.textContent = "&#x2061;";
				
				mrow.appendChild(placeHolder);
				
				math.appendChild(mi);
				math.appendChild(mo);
				math.appendChild(mrow);
				domConstruct.place(math, node, offset);
				
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
			var newOffset = 1;
			var position = "last";
			
			if(this._isTextNode(node)){
				var _offset = this.path.pop().offset;
				newOffset = _offset + 1;
				position = "after";
			}
			
			if(this._isLineNode(node) || this._isTextNode(node)){
				this.path.push({nodeName:"math", offset:newOffset});
				this.path.push({nodeName:"mfrac", offset:1});
				this.path.push({nodeName:"mrow", offset:1});
				this.path.push({nodeName:"mn", offset:1});
				
				var math = xmlDoc.createElement("math");
				var fracData = xmlUtil.createEmptyFrac(xmlDoc);
				math.appendChild(fracData.rootNode);
				domConstruct.place(math, node, position);
				
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
				
				this.path.pop();
				this.path.push({nodeName:"mfrac", offset:newOffset});// 替换刚才节点的位置
				this.path.push({nodeName:"mrow", offset:2});
				this.path.push({nodeName:"mn", offset:1});
				
				var parent = node.parentNode;
				position = newOffset - 1;
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
			
			var newOffset = 1;
			var position = "last";
			
			if(this._isTextNode(node)){
				var _offset = this.path.pop().offset;
				newOffset = _offset + 1;
				position = "after";
			}

			if(this._isLineNode(node) || this._isTextNode(node)){
				this.path.push({nodeName:"math", offset:newOffset});
				this.path.push({nodeName:"msqrt", offset:1});
				this.path.push({nodeName:"mrow", offset:1});
				this.path.push({nodeName:"mn", offset:1});
				
				var math = xmlDoc.createElement("math");
				var sqrtData = xmlUtil.createEmptyMsqrt(xmlDoc);
				math.appendChild(sqrtData.rootNode);
				domConstruct.place(math, node, position);

				node = sqrtData.focusNode;
				offset = 0;
			}else{
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
			
			var newOffset = 1;
			var position = "last";
			
			if(this._isTextNode(node)){
				var _offset = this.path.pop().offset;
				newOffset = _offset + 1;
				position = "after";
			}
			
			if(this._isLineNode(node) || this._isTextNode(node)){
				this.path.push({nodeName:"math", offset:newOffset});
				this.path.push({nodeName:"mroot", offset:1});
				this.path.push({nodeName:"mrow", offset:2});
				this.path.push({nodeName:"mn", offset:1});
				
				var math = xmlDoc.createElement("math");
				var rootData = xmlUtil.createEmptyMroot(xmlDoc);
				math.appendChild(rootData.rootNode);
				domConstruct.place(math, node, position);

				node = rootData.focusNode;
				offset = 0;
			}else{
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
			
			var newOffset = 1;
			var position = "last";
			
			if(this._isTextNode(node)){
				var _offset = this.path.pop().offset;
				newOffset = _offset + 1;
				position = "after";
			}
			
			if(this._isLineNode(node) || this._isTextNode(node)){
				this.path.push({nodeName: "math", offset: newOffset});
				this.path.push({nodeName: nodeName, offset: 1});
				this.path.push({nodeName: "mrow", offset: 2});
				this.path.push({nodeName: "mn", offset: 1});
				
				var math = xmlDoc.createElement("math");
				var scriptingData = xmlUtil.createEmptyScripting(xmlDoc, nodeName);
				math.appendChild(scriptingData.rootNode);
				domConstruct.place(math, node, position);
				node = scriptingData.focusNode;
				offset = 0;
			}else{
				// TODO:总结是不是General Layout Schema 和 Script and Limit Schema的path处理逻辑都一样呢
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
			if(this._isTextMode()){
				this.anchor = this.insertText(this.anchor, data);
				this.onChange(data);
				return;
			}else if(this._isMathMLMode()){
				// 因为letter只是一个字符，所以不需要循环处理
				if(dripLang.isLetter(data)){
					// 推断周围的字符，如果能够拼够一个三角函数，则插入三角函数
					var tri = this.findTrigonometric(this.anchor, data);
					if(tri){
						this.anchor = this.removeExistTrigonometricPart(this.anchor, tri);
						this.anchor = this.insertTrigonometric(this.anchor, tri.functionName, nodeName||"mi");
					}else{
						this.anchor = this.insertMi(this.anchor, data);
					}
					this.onChange(data);
					return;
				}else if(dripLang.isNumber(data)){
					// 目前只支持输入数字时，剔除占位符。
					var node = this.anchor.node;
					if(xmlUtil.isPlaceHolder(node)){
						xmlUtil.removePlaceHolder(node);
					}
					
					this.anchor = this.insertMn(this.anchor, data);
					this.onChange(data);
					return;
				}else if(dripLang.isOperator(data)){
					this.anchor = this.insertMo(this.anchor, data);
					this.onChange(data);
					return;
				}else if(dripLang.isTrigonometric(data)){
					this.anchor = this.insertTrigonometric(this.anchor, data, nodeName);
					this.onChange(data);
					return;
				}else if(dripLang.isGreekLetter(data)){
					this.anchor = this.insertMi(this.anchor, data);
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
			
			var xmlDoc = this.doc;
			
			// FIXME:只有在节点不同时才需要拆分。
			// this._splitNodeIfNeed();
			var node = this.anchor.node;
			var offset = this.anchor.offset;
			
			if(nodeName && nodeName != ""){
				
				
				var newOffset = 1;
				var position = "last";
				
				if(this._isTextNode(node)){
					var _offset = this.path.pop().offset;
					newOffset = _offset + 1;
					position = "after";
				}
				
				if(nodeName == "mfrac"){
					
				}else if(nodeName == "msup"){
					
				}else if(nodeName == "msub"){
					
				}else if(nodeName == "msqrt"){
					
				}else if(nodeName == "mroot"){
					
				}else if(nodeName == "mi"){
					// 对sin/cos等特殊字符的处理
					// TODO：删除
					if(dripLang.isTrigonometric(data)){
						/*
		  				 * <mi>cos</mi>
		  				 * <mo>&#x2061;</mo> 函数应用
		  				 * <mrow>
		  				 * <mn></mn> 占位符统一使用mn表示
		  				 * </mrow>
		  				 */
						if(this._isLineNode(node) || this._isTextNode(node)){
							this.path.push({nodeName:"math", offset:offset+1});
							this.path.push({nodeName:"mrow", offset:3});
							this.path.push({nodeName:"mn", offset:1});
							
							var math = xmlDoc.createElement("math");
							var mi = xmlDoc.createElement("mi");
							var mo = xmlDoc.createElement("mo");
							var mrow = xmlDoc.createElement("mrow");
							var placeHolder = xmlUtil.getPlaceHolder(xmlDoc);
							
							mi.textContent = data;
							mo.textContent = "&#x2061;";
							
							mrow.appendChild(placeHolder);
							
							math.appendChild(mi);
							math.appendChild(mo);
							math.appendChild(mrow);
							domConstruct.place(math, node, offset);
							
							this._updateAnchor(placeHolder, 0);
							
						}else{
							
						}
					}
				}
				
				this.onChange();
				return;
			}
			
			
			if(dripLang.isFenced(data)){
				if(this._isLineNode(node) || this._isTextNode(node)){
					/*
					 * <mfenced open="[" close="}" separators="sep#1 sep#2 ... sep#(n-1)">
	  				 * <mrow><mi>x</mi></mrow>
	  				 * <mrow><mi>y</mi></mrow>
	  				 * </mfenced>
	  				 */
					this.path.push({nodeName:"math", offset:offset+1});
					this.path.push({nodeName:"mfenced", offset:1});
					this.path.push({nodeName:"mrow", offset:1});
					this.path.push({nodeName:"mn", offset:1});
					
					var math = xmlDoc.createElement("math");
					var mfenced = xmlDoc.createElement("mfenced");
					
					var fenced = {
						"{":{left:"{", right:"}"},
						"[":{left:"[", right:"]"},
						"|":{left:"|", right:"|"}
					};
					if(data != "("){
						mfenced.setAttribute("open",fenced[data].left);
						mfenced.setAttribute("close",fenced[data].right);
					}
					var mrow = xmlDoc.createElement("mrow");
					var placeHolder = xmlUtil.getPlaceHolder(xmlDoc);
					
					math.appendChild(mfenced);
					mfenced.appendChild(mrow);
					mrow.appendChild(placeHolder);
					
					domConstruct.place(math, node, offset);
					
					this.anchor.node = placeHolder;
					this.anchor.offset = 0;
				}else{
					
				}
				
				this.onChange();
				return;
			}
			
			
			// 这里需要对data做一个加工，&#xD7;只能看作一个字符。
			// 走到这一步，dataArray的每个元素都只能看作一个字符
			var dataArray = [];
			if(lang.isString(data)){
				dataArray = dripString.splitData(data);
			}else if(lang.isArray(data)){
				dataArray = data;
			}
				
			
			
			
			// 注意：把对数据类型的判断放在判断节点类型的外面。除非有充分的理由不要修改这个逻辑
			// 先循环字符，再判断当前要插入字符的环境。
			// data中可能包含多个字符，通过循环，单独处理每个字符
			array.forEach(dataArray,lang.hitch(this,function(eachData, index){
				var c = eachData;
				var node = this.anchor.node;
				
				if(dripLang.isNumber(c)){
					
					// TODO: 删除
					
					// 按照以下思路重构。
					// 添加一个数据，分以下几步：
					//		如果指定了nodeName，则直接使用；如果没有指定，则先推导
					//		比较要输入的值和当前输入的环境
					//		确定可以执行哪些动作
					//		新建节点
					//		设置当前节点，将anchor改为context
					//		在新节点中插入内容
					//		修正当前的path值
					
					nodeName = "mn";
					
					function isLineOrText(node){
						var nodeName = node.nodeName;
						return nodeName == "line" || nodeName == "text";
					}
					
					if(isLineOrText(node)){
						var offset = this.anchor.offset;
						// 这两个默认的值，是根据lineNode的值设置的，所以可以删除对lineNode的判断。
						var position = "last";
						var pathOffset = 1;
						if(this._isLineNode(node)){
							position = "last";
							pathOffset = 1;
						}else if(this._isTextNode(node)){
							// 如果光标在文本中间，则先拆分文本节点
							this._splitNodeIfNeed();
							
							var pos = this.path.pop();
							
							if(offset > 0){
								position = "after";
								pathOffset = pos.offset+1;
							}else{
								position = "before";
							}
						}
						
						var mathNode = xmlDoc.createElement("math");
						var newNode = xmlDoc.createElement(nodeName);
						mathNode.appendChild(newNode);
						
						domConstruct.place(mathNode, node, position);
						
						
						this.anchor.node = newNode;
						this.anchor.offset = 0;
						
						this._insertChar(c);
						
						this.path.push({nodeName:"math", offset:pathOffset});
						this.path.push({nodeName:nodeName, offset:1});
						
					}else if(dripLang.isMathTokenNode(node)){
						// FIXME：重构，可抽象出一个逻辑，期望新建的节点与当前节点的类型不同。
						//如果当前节点不是操作符节点，则新建一个操作符节点
						var node = this.anchor.node;
						if(xmlUtil.isPlaceHolder(node)){
							xmlUtil.removePlaceHolder(node);
						}
						
						if(node.nodeName != nodeName){
							var mnNode = xmlDoc.createElement(nodeName);
							
							// 需要判断是否需要拆分节点。
							dripLang.insertNodeAfter(mnNode,node);
							
							this.anchor.node = mnNode;
							this.anchor.offset = 0;
							
							var pos = this.path.pop();
							this.path.push({nodeName:nodeName, offset:pos.offset+1});
						}else{
							
						}
						
						this._insertChar(c);
					}
				}else if(dripLang.isOperator(c)){
					// TODO: 删除
					var nodeName = "mo";
					if(this._isLineNode(node)){
						var mathNode = xmlDoc.createElement("math");
						
						var newNode = xmlDoc.createElement(nodeName);
						mathNode.appendChild(newNode);
						
						this._updateAnchor(newNode, 0);
						this._insertChar(c);
						
						this.path.push({nodeName:"math", offset:1});
						this.path.push({nodeName:nodeName, offset:1});
						// 既然约定只要遇到line，则其中必然为空的，则直接使用appendChild方法。暂不修改。
						domConstruct.place(mathNode, node, offset);
						
					}else if(dripLang.isMathTokenNode(node)){
						// 所有的操作符，都是一个单独的符号，用一个mo封装。
						if(c == "=" && node.nodeName == "mo" && node.textContent == "="){
							node.textContent += "=";
						}else if(c == "=" && node.nodeName == "mo" && node.textContent == "!"){
							node.textContent += "=";
						}else{
							var newNode = xmlDoc.createElement(nodeName);
							this._updateAnchor(newNode, 0);
							this._insertChar(c);
							
							var pos = this.path.pop();
							this.path.push({nodeName:nodeName, offset:pos.offset+1});
							
							dripLang.insertNodeAfter(newNode,node);
						}
					}else if(this._isTextNode(node)){
						// FIXME：重构出一个方法
						var mathNode = xmlDoc.createElement("math");
						// math应该放在textNode之后
						
						var newNode = xmlDoc.createElement(nodeName);
						mathNode.appendChild(newNode);
						this._updateAnchor(newNode, 0);
						
						this._insertChar(c);
						
						var pos = this.path.pop();
						this.path.push({nodeName:"math", offset:pos.offset+1});
						this.path.push({nodeName:nodeName, offset:1});
						
						dripLang.insertNodeAfter(mathNode, node);
					}
				}else{
					// FIXME：可提取，容器部件，子节点的tagName
					if(this._isLineNode(node)){
						// 这里的逻辑是往父节点中插入一个新的子节点
						var parentNode = node;
						var position = offset;
						
						var nodeName = "text";
						// 这里有一个假定，只要是line,则必是一个空行。
						var newNode = xmlDoc.createElement(nodeName);
						this._updateAnchor(newNode, 0);
						// 这里的offset是nodeName为text的节点在父节点中位置。
						this.path.push({nodeName:nodeName,offset:1});
						// insertChar中自动调整focusNode中的偏移量，即在该方法中focusNode不会改变。
						this._insertChar(c);
						
						// 最后添加到界面上，从性能的角度考虑。
						domConstruct.place(newNode, parentNode, position);
					}else if(this._isTextNode(node)){
						// 这里的逻辑是修改当前焦点的值
						this._insertChar(c);
					}else if(dripLang.isMathTokenNode(node)){
						// 要往上移到math节点之外
						var pos = null;
						
						do{
							pos = this.path.pop();
						}while(pos && pos.nodeName != "math");
						
						var textSpanNode = xmlDoc.createElement("text");
						// 获取math节点，然后将新节点插入到math节点之后
						var mathNode = node;
						while(mathNode.nodeName != "math"){
							mathNode = mathNode.parentNode;
						}
						dripLang.insertNodeAfter(textSpanNode, mathNode);
						
						this.anchor.node = textSpanNode;
						this.anchor.offset = 0;
						
						this._insertChar(c);
						
						this.path.push({nodeName:"text", offset:pos.offset+1});
					}
				}
				// TODO:重构 moveNext
			}));
			
			this.onChange(data);
		},
		
		_updateAnchor: function(focusNode, offset){
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
		
		moveLeft: function(){
			var node = this.anchor.node;
			var offset = this.anchor.offset;
			
			var nodeName = node.nodeName;
			if(nodeName == "line"){
				var previousNode = node.previousSibling;
				if(!previousNode){
					return;
				}
				
				previousNode = previousNode.lastChild;
				if(previousNode.nodeName == "math"){
					previousNode = previousNode.lastChild;
				}
				var textContent = previousNode.textContent;
				
				this.anchor.node = previousNode;
				this.anchor.offset = textContent.length;
				return;
			}
			
			if(offset > 0){
				this.anchor.offset--;
				return;
			}
			
			if(offset == 0){
				// 先往前寻找兄弟节点
				var previousNode = node.previousSibling;
				if(previousNode){
					if(previousNode.nodeName == "math"){
						previousNode = previousNode.lastChild;
					}
					var textContent = previousNode.textContent;
					
					this.anchor.node = previousNode;
					this.anchor.offset = textContent.length - 1;
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
					}else{
						var textContent = previousNode.textContent;
						
						this.anchor.node = previousNode;
						this.anchor.offset = textContent.length - 1;
					}
					
				}
			}
			
		},
		
		moveRight: function(){
			
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