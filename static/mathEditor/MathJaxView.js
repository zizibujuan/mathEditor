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
        "mathEditor/lang"],function(
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
		dripLang){
	
	// TODO:为view添加一个row属性。每行有个默认的高度，但是高度可以根据内容调整
	
	var ELEMENT = 1, TEXT = 3;
	
	return declare("mathEditor.MathJaxView",null,{
		model : null,
		editorDiv : null,
		parentNode : null,
		textarea : null,
		
		readOnly: false, // 有时，编辑状态和只读状态显示的样式，是不一样的。暂时还没有区分对待。
		
		mathBound: null,
		
		// focused: Boolean
		//		判断当前视图是否已获取焦点
		focused: false,
		
		constructor: function(options){
			lang.mixin(this, options);
			// 创建一个div容器，然后其中按照垂直层次，罗列各div
			// 不能将style移到class中，因为移到class中让一些样式无效了，FIXME：什么原因呢？
			var style={
				"border-radius":"3px",
				height:"100%",
				width:"100%",
				border:"solid 1px #CCC",
				position:"absolute",
				cursor:"text"
			};
			var editorDiv = this.editorDiv = domConstruct.create("div",{"style":style}, this.parentNode);
			
			// 内容层
			var textLayer = this.textLayer = domConstruct.create("div",{"class":"drip_layer drip_text"}, editorDiv);
			
			// 光标层， 看是否需要把光标放到光标层中
			var cursor = this.cursor = new Cursor({parentEl:editorDiv});
			
			on(editorDiv, "mousedown",lang.hitch(this, this._onMouseDownHandler));
			
			// 初始化视图
			textLayer.innerHTML = this.model.getHTML();
			
			aspect.after(this.model, "onChanged", lang.hitch(this,this._onModelChanged));
		},
		
		_onMouseDownHandler: function(e){
			this._focus();
			event.stop(e);
		},
		
		_focus: function(){
			console.log("编辑器获取焦点");
			if(this.focused==false){
				this.focused = true;
				var textarea = this.textarea;
				var cursor = this.cursor;
				//textLayer
				domClass.add(this.editorDiv,"drip_editor_focus");
				
				setTimeout(function() {
					 textarea.focus();
					 cursor.show();
			    },0);
			}
		},
		
		focus: function(){
			this._focus();
		},
		
		_onModelChanged : function(){
			this.asyncRender();
			this.asyncShowCursor();
		},
		
		asyncRender: function(){
			// summary:
			//		使用mathjax异步绘制所有的mathml脚本
			
			// 为focus node设置id
			this._setFocusNodeId();
			this.textLayer.innerHTML = this.model.getHTML();
			this.model.anchor.node.removeAttribute("id");
			this._asyncExecute(["Typeset",MathJax.Hub, this.textLayer]);
		},
		
		_setFocusNodeId: function(){
			this.model.anchor.node.setAttribute("id", FOCUS_NODE_ID);
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
		
		// summary
		//		编辑器失去焦点之后调用该方法
		blur: function(){
			if(this.focused == true){
				this.focused = false;
				domClass.remove(this.editorDiv,"drip_editor_focus");
				this.cursor.hide();
			}
		},
		
		showCursor: function(){
			console.log("Typeset完成后执行此方法");
			console.log(this.editorDiv);
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
				if(focusNode.nodeName === "math" && focusNode.childElementCount ===0/*focusInfo.node == mathNode*/){
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
			
			// 在转换成html后，获取对应的获取焦点的节点
			var htmlFocusNode = dom.byId(FOCUS_NODE_ID);
			// 注意，如果是mo操作符的话，model中的offset永远为1，但是其中的字符可能会有2或3个。
			var offset = this.model.getOffset();
			// 这里在渲染前需要获取focusNode
			var focusNode = this.model.getFocusNode();
			if(this.model.getFocusNode().nodeName == "mo" && offset != 0){
				offset = focusNode.textContent.length;
			}
			// 两种寻找方式，1是通过model.path;2是通过htmlFocusNode往上查找。
			// 这里采取第一种方式。
			var mathNodeContainer = null;
			var pathes = this.model.path;
			if(pathes.length >2 && pathes[2].nodeName === "math"){
				mathNodeContainer = this.textLayer.childNodes[pathes[1].offset-1].childNodes[pathes[2].offset-1];
			}
			var mrowNode = null;
			var maybeMrowNode = htmlFocusNode.parentNode;
			if(maybeMrowNode.className === "mrow"){
				mrowNode = maybeMrowNode;
			}
			return {node: htmlFocusNode, offset: offset, mrowNode: mrowNode, mathNodeContainer: mathNodeContainer};
			
			
			
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
					focusDomNode = childNodes[path.offset - 1];
					mathNodeContainer = focusDomNode;
					
					focusDomNode = focusDomNode.firstChild;
					var scriptNode = focusDomNode.nextSibling;
					elementJax = scriptNode.MathJax.elementJax.root;
					elementJax = elementJax.data[0];// math下必有一个mrow
				}else{
					// 在mathJax中math，mstyle和mfrac下面必有mrow
					if(elementJax){
						
						var hintNode = dom.byId("MathJax-Span-"+elementJax.spanID);
						// 获取有效的elementJax
						// FIXME:是否需要在path和xmldoc中补全mrow和mstyle等。
						// 如果不补全的话，如果查找。
						
						// 如果是style，则style下面必有一个mrow
						/*if(domClass.contains(hintNode, "mstyle")){
							if(path.nodeName != "mstyle"){
								elementJax = elementJax.data[0];// 假定mstyle的父容器只有一个子节点，就是mstyle
								// mstyle下面必有一个mrow
								elementJax = elementJax.data[path.offset - 1];
								hintNode = dom.byId("MathJax-Span-"+elementJax.spanID);
							}
						}else */
						if(domClass.contains(hintNode, "mrow")){
							if(path.nodeName != "mrow"){
								var mstyleElementJax = elementJax.data[path.offset - 1];
								var nextHintNode = dom.byId("MathJax-Span-"+mstyleElementJax.spanID);
								if(domClass.contains(nextHintNode, "mstyle")){
									if(path.nodeName != "mstyle"){
										// mstyle下面必有一个mrow
										elementJax = mstyleElementJax.data[0];
										// path中缺少mstyle，会不会逻辑不完整？
										// 如果不要mstyle的话，这里就需要一个假定：一个mstyle中只能封装一个mfrac
										// mstyle[1]/mrow/mfrac = mfrac[1]
										// mstyle[2]/mrow/mfrac = mfrac[2]
										elementJax = elementJax.data[0];// path.nodeName对应的节点
										hintNode = dom.byId("MathJax-Span-"+elementJax.spanID);
									}
								}else{
									
									// 出现mrow/mstyle/mrow的情况，或者仅仅是mrow的情况
									// 如果是mrow，则下面直接对应放在path中的节点。
									mrowNode = hintNode; // FIXME：位置判断错误
									
									elementJax = elementJax.data[path.offset - 1];// 假定mstyle的父容器只有一个子节点，就是mstyle
									hintNode = dom.byId("MathJax-Span-"+elementJax.spanID);
								}
							}else{
								mrowNode = hintNode;
								elementJax = elementJax.data[path.offset - 1];
							}
						}else{
							if(dripLang.isMathTokenName(path.nodeName)){
								elementJax = elementJax.data[0];
							}else{
								elementJax = elementJax.data[path.offset - 1];
							}
						}
						
						focusDomNode = dom.byId("MathJax-Span-"+elementJax.spanID);
					}
				}
			});
			
			// 注意，如果是mo操作符的话，model中的offset永远为1，但是其中的字符可能会有2或3个。
			var offset = this.model.getOffset();
			// 这里在渲染前需要获取focusNode
			var focusNode = this.model.getFocusNode();
			if(this.model.getFocusNode().nodeName == "mo" && offset != 0){
				offset = focusNode.textContent.length;
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
				top = mrowPosition.y - textLayerPosition.y;
				height = mrowPosition.h;
				
				position = domGeom.position(node);
				left = position.x - textLayerPosition.x;
			}else{
				position = domGeom.position(node);
				top = position.y - textLayerPosition.y;
				height = position.h;
				left = position.x - textLayerPosition.x;
			}
			
			// left += 子节点的宽度
			if(node.nodeType == ELEMENT){
				var childNodes = node.childNodes;
				if(childNodes.length == 1 && childNodes[0].nodeType == TEXT){
					// 如果childNodes的长度不是1，则offset对应的必是这些子节点的偏移量，而不是文本的
					if(node.textContent.length == offset){
						left += node.offsetWidth;
					}else{
						// 测宽度
						var width = 0;
						var text = node.textContent.substring(0, offset);
						if(text != ""){
							// 加上padding-left的值
							// 没有值的时候，不加padding-left值，这样前面是mo标签时，
							// 就能正确的紧贴mo显示光标。
							var paddingLeft = domStyle.get(node, "padding-left");
							left += Math.floor(paddingLeft);
							width = dripLang.measureTextSize(node, text).width;
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