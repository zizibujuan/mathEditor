define(["dojo/_base/declare",
        "dojo/_base/lang",
        "dojo/_base/array",
        "dojo/_base/event",
        "dojo/_base/window",
        "dojo/dom",
        "dojo/dom-style",
        "dojo/dom-class",
        "dojo/dom-construct",
        "dojo/dom-geometry",
        "dojo/on",
        "dojo/aspect",
        "mathEditor/Model",
        "mathEditor/layer/Cursor",
        "mathEditor/lang",
        "mathEditor/dom"],function(
		declare,
		lang,
		array,
		event,
		win,
		dom,
		domStyle,
		domClass,
		domConstruct,
		domGeom,
		on,
		aspect,
		Model,
		Cursor,
		dripLang,
		dripDom){
	
	// TODO:为view添加一个row属性。每行有个默认的高度，但是高度可以根据内容调整
	
	var ELEMENT = 1, TEXT = 3;
	
	return declare("mathEditor.MathJaxView",null,{
		model: null,
		contentDiv: null,
		parentNode: null,
		textarea: null,
		
		readOnly: false, // 有时，编辑状态和只读状态显示的样式，是不一样的。暂时还没有区分对待。
		
		mathBound: null,
		
		// focused: Boolean
		//		判断当前视图是否已获取焦点
		focused: false,
		
		hScrollBarAlwaysVisible: false,
		
		paddingTop: 0,
		
		paddingLeft: 0,
		
		// borderWidth: int
		//		编辑器边框的宽度
		borderWidth: 0,
		
		constructor: function(options){
			lang.mixin(this, options);
			// 创建一个div容器，然后其中按照垂直层次，罗列各div
			// 不能将style移到class中，因为移到class中让一些样式无效了，FIXME：什么原因呢？
			var scrollerStyle={
				position: "absolute",
				height: "100%",
				width: "100%"/*,
				"overflow-x":"scroll"*/
					//overflow:"hidden"//刚开始的时候不显示scroll
			};
			if(this.hScrollBarAlwaysVisible){
				scrollerStyle["overflow-x"] = "scroll";
			}else{
				scrollerStyle["overflow"] = "auto";
			}
			// FIXME: 当出现滚动条的时候，不要在原有内容之上添加滚动条，而是在原来高度的基础上添加一个滚动条的高度。
			
			var contentStyle = {
				position: "absolute",
				cursor: "text"
			};
			
			// 添加一个处理scroller的div
			var scrollerDiv = this.scrollerDiv = domConstruct.create("div",{"style":scrollerStyle}, this.parentNode);
			
			var contentDiv = this.contentDiv = domConstruct.create("div",{"style":contentStyle}, scrollerDiv);
			var scrollbarWidth = this.scrollbarWidth = dripDom.scrollbarWidth();
//			console.log("scrollbarWidth:",this.scrollbarWidth);
			// 编辑器的padding在contentDiv上设置。
			domStyle.set(contentDiv,{
				"width":(scrollerDiv.clientWidth-this.paddingRight)+"px", 
				"height":(scrollerDiv.clientHeight-this.paddingTop)+"px",
				"paddingTop": this.paddingTop+"px", 
				"paddingRight": this.paddingRight+"px"
			});
			
			this.minHeight = contentDiv.clientHeight;
			this.minWidth = scrollerDiv.clientWidth;
			
			// 内容层
			// 在内容层，通过在右侧使用padding-right为光标预留位置
			var textLayer = this.textLayer = domConstruct.create("div",{"class":"drip_layer drip_text"}, contentDiv);
			// 去掉了textLayer的宽度为100%的设置，需要计算出合适的宽度
			domStyle.set(textLayer, "width", (scrollerDiv.clientWidth-this.paddingRight) + "px");
			
			// 光标层， 看是否需要把光标放到光标层中
			var cursor = this.cursor = new Cursor({parentEl:contentDiv});
			
			on(this.parentNode, "mousedown",lang.hitch(this, this._onMouseDownHandler));
			
			// 初始化视图
			textLayer.innerHTML = this.model.getHTML();
			
			aspect.after(this.model, "onChanged", lang.hitch(this,this._onModelChanged));
			
		},
		
		_onMouseDownHandler: function(e){
			this.focus();
			event.stop(e);
		},
		
		focus: function(){
			// summary:
			//		视图获取焦点后触发的方法
			
			console.log("编辑器获取焦点");
			if(this.focused==false){
				this.focused = true;
				var textarea = this.textarea;
				var cursor = this.cursor;
				//textLayer
				// 将显示获取焦点的样式放在编辑器的最外面
				domClass.add(this.parentNode,"drip_editor_focus");
				
				setTimeout(function() {
					 textarea.focus();
					 cursor.show();
			    },0);
			}
		},
		
		blur: function(){
			// summary:
			//		视图失去焦点后触发的方法
			if(this.focused == true){
				this.focused = false;
				domClass.remove(this.parentNode,"drip_editor_focus");
				this.cursor.hide();
			}
		},
		
		switchInputMode: function(){
			// summary:
			//		切换输入模式，在文本模式和数学公式模式之间切换
			this.model.switchMode();
			this.model.onChanged();	
		},
		
		_onModelChanged: function(){
			this.asyncRender();
			this.asyncShowCursor();
		},
		
		asyncRender: function(){
			// summary:
			//		使用mathjax异步绘制所有的mathml脚本
			
			this.textLayer.innerHTML = this.model.getHTML();
			
			console.log("after set innerHTML");
			console.log("scrollerDiv.clientWidth = ", this.scrollerDiv.clientWidth);
			console.log("scrollerDiv.clientHeight = ", this.scrollerDiv.clientHeight);
			
			this._asyncExecute(["Typeset",MathJax.Hub, this.textLayer]);
		},
		
		
		_asyncExecute: function(callback){
			// summary:
			//		排队执行异步操作， FIXME：重命名函数名
			MathJax.Hub.Queue(callback);
		},
		
		asyncShowCursor: function(){
			// summary:
			//		因为是异步操作，需要把显示光标的方法放在MathJax的异步函数中。
			this._asyncExecute(lang.hitch(this,this.showCursor));
		},
		
		showCursor: function(){
			// summary:
			//		显示光标
			//		TODO：这个方法需要拆分，这里做了不止一件事情。
			
			console.log("Typeset完成后执行此方法");
			console.log(this.contentDiv);
			
			this._autoHeight();
			
			// TODO：宽度可拖拽
			this._scrollToLeft();
			
			
			//在math占位符上显示光标
			var focusInfo = this._getFocusInfo();
			var cursorConfig = this._getCursorConfig(focusInfo);
			this.cursor.move(cursorConfig);
			
			// 每一次移动光标，都移动textarea
			// TODO：一种优化方案是，只有切换到IME输入法时，才移动textarea
			if(this.textarea){
				domStyle.set(this.textarea, {"top":cursorConfig.top+"px","left":cursorConfig.left+"px"});
			}else{
				console.warn(this.declaredClass,"this.textarea为null");
			}
			
			// 如果math获取焦点，则将math周围添加一个边框,FIXME:以下代码和光标无关，应该放在另一个方法中。
			if(this.model.isMathMLMode()){
				var mathContainer = focusInfo.mathNodeContainer;
				// 使用math节点下的mrow节点的样式
				var mathPosition =  domGeom.position(mathContainer);
				var area = this._getMathBound();
				var positionStyle = {
						left:mathPosition.x+"px",
						top:mathPosition.y+"px",
						width:mathPosition.w+"px",
						height:mathPosition.h+"px"
				};
				// 判断math中没有子节点
				var focusNode = this.model.getFocusNode();
				if(focusNode.nodeName === "math" && dripLang.getChildLength(focusNode) ===0/*focusInfo.node == mathNode*/){
					positionStyle["background-color"] = "rgb(204, 203, 203)";
					domStyle.set(area, positionStyle);
				}else{
					// 如果获取了焦点，则去掉背景色。如果math中已经输入内容，则不添加背景色
					positionStyle["background-color"] = "";
					domStyle.set(area, positionStyle);
				}
				
			}else{
				var area = this._getMathBound();
				domStyle.set(area, {left:"-10000px"});
			}
			
		},
		

		/*
		 * 在chrome浏览器的content-box模式下：
		 * 		css height
		 * 		clientHeight = css element height + padding top + padding bottom - height of h scrollbar;
		 * 		offsetHeight = css element height + padding top + padding bottom + border top + border bottom
		 * 		scrollHeight = css conent height + padding top + padding bottom
		 * 
		 * 		有水平滚动条
		 * 		css content height =  margin top + border top + padding top + css element height + padding bottom + border bottom + margin bottom
		 * 		
		 * 		content height是内容的高度，element height是节点本身的高度
		 */
		_autoHeight: function(){
			// summary:
			//		根据内容的高度，自动缩放高度，直到初始高度。

			// contentDiv的宽度和高度，如果scrollWidth和scrollHeight小于scrollerDiv的clientWidth和clientHeight,
			// 则与scrollerDiv的clientWidth和clientHeight的值相等；否则与contentDiv的scrollWidth和scrollHeight的值相等。
			var contentDiv = this.contentDiv;
			var scrollerDiv = this.scrollerDiv;
		
			// 实现方法，增加的时候简单，难点是减少的时候。
			//	记录下最长的宽度（超出部分）
			
			// 或者中间再加一个div，这个div可以自适应高度和宽度。
			// 如果是增加，则直接读取；如果是删除，则根据子节点计算宽度
			//this._scrollCursorIntoView();
			// 在view层如何判断是新增还是删除呢？
			// 如果scrollWidth增加，则是新增；如果scrollWidth不变，则是不变或删除
			// 1.计算scrollLeft
			// 2.让contentDiv中的文本可见
			
			// 宽度要不要也做成可扩展的呢？
			// 高度可扩展
			
			
			
			// 只有当x轴滚动条出现的时候，计算高度时，才加上滚动条的高度
			if(contentDiv.scrollHeight > contentDiv.clientHeight){
				
				// 当高度增加的时候要相应的增加高度
				var pxHeightNoScrollbar = contentDiv.scrollHeight + "px";
				var pxHeightWithScrollbar = (contentDiv.scrollHeight) +"px";// +this.scrollbarWidth
				// 增加高度的时候，把父节点放在上面，这样就不会产生滚动条
				domStyle.set(this.parentNode, "height", (contentDiv.scrollHeight)+"px");
				domStyle.set(scrollerDiv, "height", pxHeightWithScrollbar);
				console.log("scrollerDiv.clientWidth = ", scrollerDiv.clientWidth);
				console.log("scrollerDiv.clientHeight = ", scrollerDiv.clientHeight);
				domStyle.set(contentDiv, "height", (contentDiv.scrollHeight - this.paddingTop)+"px");
				
				if(scrollerDiv.clientHeight < contentDiv.clientHeight){
					// 当每次出现滚动条的时候，都会将scrollerDiv的高度和宽度减去滚动条的宽度，
					// 所以这里需要重新设置scrollerDiv的宽和高
					domStyle.set(scrollerDiv, {height: (contentDiv.scrollHeight + this.scrollbarWidth)+"px"});
					
				}
				
				//domStyle.set(contentDiv,{"width":(this.parentNode.clientWidth-this.scrollbarWidth)+"px"});
				//
			}else{
				// 当行高减少的时候要相应的减少高度
				// 有一个最小高度
				if(contentDiv.clientHeight <= this.minHeight){
					return;
				}
				
				// 计算当前的实际行高
				var lines = this.textLayer.childNodes;
				var lineCount = lines.length;
				var actualHeight = 0;
				for(var i = 0; i < lineCount; i++){
					actualHeight += lines[i].clientHeight;
				}
				// 如果实际行高小于contentDiv.clientHeight,则较小高度
				if(contentDiv.clientHeight > actualHeight){
					var pxHeightNoScrollbar = actualHeight + "px";
					var pxHeightWithScrollbar = (actualHeight+this.scrollbarWidth+1) +"px";// FIXME：为什么需要加1呢？
					// 减少高度的时候，把父节点放在下面，这样就不会产生滚动条
					domStyle.set(contentDiv, "height", pxHeightNoScrollbar);
					domStyle.set(scrollerDiv, "height", pxHeightWithScrollbar);
					domStyle.set(this.parentNode, "height", pxHeightWithScrollbar);
				}
			}
		},
		
		/*
		 * 在chrome浏览器的content-box模式下：
		 * 		css width
		 * 		clientWidth = css element width + padding left + padding right - width of v scrollbar;
		 * 		offsetWidth = css element width + padding left + padding right + border left + border right
		 * 		scrollWidth = css conent Width + padding left + padding right(如果有垂直滚动条则不计算padding right)
		 * 
		 * 		有垂直滚动条
		 * 		css content width = margin left + border left + padding left + css element width + padding right + border right(注意没有margin right)
		 * 
		 * 		content width是内容的宽度，element width是节点本身的宽度
		 */
		_scrollToLeft: function(){
			// summary;
			//		水平移动滚动条。

			//	scrollerDiv.clientWidth-scrollbarWidth
			
			var contentDiv = this.contentDiv;
			var scrollerDiv = this.scrollerDiv;
			
			console.log("contentDiv.scrollWidth:",contentDiv.scrollWidth);
			console.log("contentDiv.clientWidth:",contentDiv.clientWidth);
			console.log("contentDiv.scrollWidth - contentDiv.clientWidth=",contentDiv.scrollWidth - contentDiv.clientWidth);
			
			if(contentDiv.scrollWidth - contentDiv.clientWidth > 0){
				scrollerDiv.scrollLeft += (contentDiv.scrollWidth - contentDiv.clientWidth);
				console.log("scrollerDiv.scrollLeft=", scrollerDiv.scrollLeft);
				domStyle.set(contentDiv, "width", contentDiv.scrollWidth + "px");
			}else{
				// 减小宽度
				if(contentDiv.scrollWidth <= this.minWidth){
					return;
				}
				// 获取当前大于最小宽度的最宽的宽度。
				// 因为子节点宽度随着父节点的缩小而缩小，并且所有子节点的宽度跟父节点的宽度一样宽，
				// 所以这里取contentDiv的宽度即可。
				// 如果需要缩小宽度，只需要缩小contentDiv的宽度，子节点的宽度跟着缩小。
				var lines = this.textLayer.childNodes;
				var lineCount = lines.length;
				var lineIndex = -1;
				var maxWidth = this.minWidth;
				var _w = 0;
				var _ld = null;
				for(var i = 0; i < lineCount; i++){
					if(dripLang.getChildLength(lines[i]) > 0){
						_ld = lines[i].lastChild;
						_w = _ld.offsetLeft + _ld.offsetWidth;
						if(_w > maxWidth){
							maxWidth = _w;
							lineIndex = i;
						}
					}
				}
				// 如果当前行是最宽的行，则减小宽度，并减小scrollLeft
				// 如果当前行不是最宽的行，则宽度不边，但是减小scrollLeft
				// 如果宽度减到跟最小宽度一致，则scrollLeft保持为0
				domStyle.set(contentDiv, "width", maxWidth+"px");
				// 同时也要缩小scrollerDiv的宽度？
				scrollerDiv.scrollLeft = contentDiv.scrollWidth - this.minWidth;
			}
		},
		
		_getMathBound: function(){
			if(this.mathBound)return this.mathBound;
			this.mathBound = domConstruct.create("div", null, win.body());
			var style = {
					position:"absolute",
					border:"solid 1px green",
					"z-index":"-1"};
			domStyle.set(this.mathBound,style);
			return this.mathBound;
		},
		
		moveLeft: function(){
			this.model.moveLeft();
			this.showCursor();
		},
		
		_getFocusInfo: function(){
			// summary:
			//		使用节点和节点中的值的偏移量来表示光标位置
			//		node: domNode
			//			当前获取焦点的节点，html节点
			//		offset: int
			//			相对node的偏移量
			//		mrowNode: domNode,
			//			包装node的mrow节点，如果没有则返回null
			//		mathNodeContainer: domNode
			//			包装所有mathml节点的容器节点
			//
			//		FIXME:倒着遍历，是不是更容易找到光标位置呢？
			// TODO:在支持mathml的浏览器上，或者就在这个view中，
			//	为当前节点添加一个id或者其他标识，就可以快速定位到获取焦点的节点，
			//	而不是下面这样需要各种循环遍历。
			// Q：为什么不直接给focus node一个id，然后就可以根据byId获取html节点？
			// A：在xml上加上节点，但是在序列化的xml字符串中一直没有id标识，待找原因。
			
			// 问题是，如果使用id的话，移动光标的时候，也要重新绘制，这样明显是不合理的。
			// 需要把这段逻辑恢复到根据path来定位节点
			// 最后选择使用path来定位对应关系，因为在移动光标时，使用id定位的方式移动光标时，还需要重新绘制html，
			// 所以使用通过path的方式来定位，现在要做的就是在定位期间尽量减少调用dom.byId的次数。
			var pathes = this.model.path;// TODO:重构，想个更好的方法名，getPath已经被使用。
			
			var focusDomNode = this.textLayer;
			var elementJax = null;
			var mrowNode = null;
			var mathNodeContainer = null;
			// 如果是math节点，则需要先
			array.forEach(pathes, function(path, index){
				// 移除root
				if(path.nodeName == 'root')return;
				if(path.nodeName == "line"){
					focusDomNode = focusDomNode.childNodes[path.offset - 1];
				}else if(path.nodeName == "text"){
					var childNodes = focusDomNode.childNodes;
					focusDomNode = childNodes[path.offset - 1];
				}else if(path.nodeName == "math"){
					// math中包含一个隐含的mrow
					// 如果是math，还需要继续往下找节点
					// 或者根据这个div找到script中的数据，来进行循环
					// 如果已经定位到设置的层级，但是发现是mrow，则需要继续往下走一步。
					var childNodes = focusDomNode.childNodes;
					mathNodeContainer = childNodes[path.offset - 1];
					var scriptNode = mathNodeContainer.lastChild;
					elementJax = scriptNode.MathJax.elementJax.root;
					elementJax = elementJax.data[0];// math下有一个隐含的mrow
				}else{
					// 在mathJax中math，mstyle和mfrac下面必有mrow
					if(elementJax){
						elementJax = elementJax.data[path.offset-1];
						// 这里做一个约定：
						// 只要是elmentJax中包含displayStyle属性，则就认为是mstyle节点。
						
						// 目前只有mfrac外包装mstyle
						if(elementJax.displaystyle){
							// 按照上面的约定，可以确定这是一个mstyle节点
							// 而在mstyle之下会有一个隐含的mrow节点
							// mstyle下的mrow节点
							elementJax = elementJax.data[0];// 目前只支持一个mstyle节点下放一个layout节点的情况
							// mrow下的对应的path几点
							elementJax = elementJax.data[0];
						}
						if(dripLang.containsInferredMrow(path.nodeName)){
							// 找出那些隐含包含一个mrow的节点，math, msqrt, mstyle
							elementJax = elementJax.data[0];
						}
						
					}
				}
			});
			if(elementJax){
				focusDomNode = dom.byId("MathJax-Span-"+elementJax.spanID);
			}
			
			// 注意，如果是mo操作符的话，model中的offset永远为1，但是其中的字符可能会有2或3个。
			var offset = this.model.getOffset();
			// 这里在渲染前需要获取focusNode
			var focusNode = this.model.getFocusNode();
			if(this.model.getFocusNode().nodeName == "mo" && offset != 0){
				offset = dripLang.getText(focusNode).length;
			}
			var mrowNode = null;
			if(focusDomNode.parentNode.className === "mrow"){
				mrowNode = focusDomNode.parentNode;
			}
			return {node: focusDomNode, offset: offset, mrowNode: mrowNode, mathNodeContainer: mathNodeContainer};
		},
		
		_getCursorConfig: function(focusInfo){
			// summary:
			//		使用坐标值表示光标的位置。
			//		使用_getCursorPosition获取的信息进行计算。
			
			var top = 0, left = 0, height = 0, width = 0;
			var node = focusInfo.node;
			var offset = focusInfo.offset;
			var position = null;
			
			var textLayerPosition = this.getTextLayerPosition();
			var mrowNode = focusInfo.mrowNode;
			if(mrowNode){
				var mrowPosition = domGeom.position(mrowNode);
				top = mrowPosition.y - textLayerPosition.y + this.paddingTop;
				height = mrowPosition.h;
				
				position = domGeom.position(node);
				left = position.x - textLayerPosition.x;
			}else{
				position = domGeom.position(node);
				top = position.y - textLayerPosition.y + this.paddingTop;
				height = position.h;
				left = position.x - textLayerPosition.x;
			}
			
			// left += 子节点的宽度
			if(node.nodeType == ELEMENT){
				var childNodes = node.childNodes;
				if(childNodes.length == 1 && childNodes[0].nodeType == TEXT){
					// 如果childNodes的长度不是1，则offset对应的必是这些子节点的偏移量，而不是文本的
					var nodeText = dripLang.getText(node);
					if(nodeText.length == offset){
						left += node.offsetWidth;
					}else{
						// 测宽度
						var width = 0;
						var subText = nodeText.substring(0, offset);
						if(subText != ""){
							// 加上padding-left的值
							// 没有值的时候，不加padding-left值，这样前面是mo标签时，
							// 就能正确的紧贴mo显示光标。
							var paddingLeft = domStyle.get(node, "padding-left");
							left += Math.floor(paddingLeft);
							width = dripLang.measureTextSize(node, subText).width;
						}
						left += width;
					}
				}else{
					// 再加上当前子节点的宽度
					if(offset != 0){
						// 这里处理的是布局节点。
						left += position.w;
					}
					
				}
			}
			left += this.scrollerDiv.scrollLeft;// 在宽度上要预留一个光标
			return {top:top,left:left,height:height, width:width};
		},
		
		getCursorPosition: function(){
			// summary:
			//		相对浏览器视窗的左上角位置
			//		注意这里定位的是提示框弹出前的位置。用在更普遍的场合，是在执行其他操作前的光标位置。
			var textLayerPosition = this.getTextLayerPosition();
			var x = textLayerPosition.x;
			var y = textLayerPosition.y;
			var cursorConfig = this.cursor.getCursorConfig();
			x += cursorConfig.left;
			y += cursorConfig.top + cursorConfig.height;
			return {x:x, y:y};
		},
		
		getTextLayerPosition: function(){
			// summary:
			//		获取文本层相对于视窗左上角的left,top,height,width等信息。
			
			if(!this.textLayerPosition)
				this.textLayerPosition = domGeom.position(this.textLayer);
					
			return this.textLayerPosition;
		}
		
	});
	
});
