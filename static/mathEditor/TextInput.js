define(["dojo/_base/declare",
        "dojo/_base/lang",
        "dojo/_base/event",
        "dojo/dom-construct",
        "dojo/dom-class",
        "dojo/has",
        "dojo/sniff",
        "dojo/on",
        "dojo/keys"], function(
        		declare,
        		lang,
        		event,
        		domConstruct,
        		domClass,
        		has,
        		sniff,
        		on,
        		keys){
	
	return declare("mathEditor.TextInput", null, {
		
		// parentNode: domNode
		//		父节点
		parentNode: null,
		
		// host: MathEditor
		//		数学编辑器
		host: null,
		
		// textarea: domNode
		//		文本域
		textarea: null,
		
		// _inComposition: Boolean
		//		是否使用IME，输入非英文字符
		_inComposition: false,
		
		constructor: function(args){
			// summary:
			//		创建一个接受用户输入器
			// parentNode: String|DomNode
			//		放置用户输入器的容器
			// host: Editor
			//		编辑器
			// example:
			// |	<div id="container"></div>
			// example:
			// |	var editor = new Editor({});
			// |	var textInput = new TextInput({ parentNode: "container", host: editor });
			
			lang.mixin(this, args);
			keys.EQUAL = (sniff("chrome") || sniff("ie")) ? 187 : 61;// =
			
			var textarea = this.textarea = domConstruct.create("textarea",{style:{position:"absolute"}}, this.parentNode);
			var host = this.host;
			// 测试时的样式
			/*
			domStyle.set(textarea,{opacity:1,
				background:"rgba(0, 250, 0, 0.3)",
				outline:"rgba(0, 250, 0, 0.8) solid 1px",
				"outline-offset":"3px",
				width:"5em",
				"z-index":500});
			*/
			
			// 正式发布时的样式
			domClass.add(textarea, "drip_text_input");
			
			textarea.wrap = "off";
			textarea.autocorrect = "off";
			textarea.autocapitalize = "off";
			textarea.spellcheck = false;
			
			// FIXME:一种重构思路是将key与方法绑定，然后根据key自动调用方法，即把if改为json对象
			// 浏览器通用的事件放在上面。
			on(textarea, "keydown", lang.hitch(this,function(e){
				console.log(e, e.keyCode);
				if(e.keyCode === keys.LEFT_ARROW){
					host.navigateLeft();
				}else if(e.keyCode === keys.RIGHT_ARROW){
					host.navigateRight();
				}else if(e.keyCode === keys.UP_ARROW){
					host.navigateUp();
				}else if(e.keyCode === keys.DOWN_ARROW){
					host.navigateDown();
				}else if(e.keyCode === keys.BACKSPACE){
					host.removeLeft();
				}else if(e.keyCode === keys.DELETE){
					host.removeRight();
				}else if(e.altKey && e.keyCode === 191){
					// ALT+/ 弹出提示信息,因为是根据用户输入，自动弹出提示框，所以不需要这个方法
				}else if(e.altKey && e.keyCode === keys.EQUAL){
					// TODO:测试界面上，text和mathml模式之间的切换。
					// 如果是mathml模式，安小alt =，则切换到text模式。
					// 按下alt =，添加math节点；再次按下，则删除math节点
					// 如果已输入公式，则将光标移到公式的后面。
					
					host.switchInputMode();
					event.stop(e);
				}else if(e.keyCode === keys.ENTER){
					host.inputEnter(e);
					// 回车换行。
					event.stop(e);
				}else if(e.keyCode == keys.TAB){
					host.inputTab();
					event.stop(e);
				}
				
			}));
			
			on(textarea, "blur", lang.hitch(this,function(e){
				console.log("textarea失去焦点");
				host.onBlur();
			}));
			
			on(textarea, "focus", lang.hitch(this,function(e){
				console.log("textarea获取焦点");
				host.onFocus();
			}));
			
			if(sniff("chrome")){
				// chrome
				console.log("chrome");
				on(textarea, "textInput", lang.hitch(this,function(e){
					var inputData = e.data;
					host.onTextInput(inputData);
				}));
				return;
			}
			
			// TODO： 添加支持ie8，ie9和ie10的输入事件。
			if(has("ie") <= 9){
				console.log("ie 9-");
				require(["mathEditor/IEInputEvent"], function(IEInputEvent){
					var inputEvent = new IEInputEvent({target: textarea});
					inputEvent.on(function(inputData){
						textarea.value = "";
						host.onTextInput(inputData);
					});
					on(textarea, "blur", lang.hitch(this,function(e){
						console.log("textarea失去焦点");
						host.onBlur();
					}));
					
					on(textarea, "focus", lang.hitch(this,function(e){
						console.log("textarea获取焦点");
						host.onFocus();
					}));
				});
				return;
			}
			
			if(has("ie") > 9){
				console.log("ie 10+");
				on(textarea, "textinput", lang.hitch(this,function(e){
					console.log("ie 10+ input event", e);
					this._onInput(e);
				}));
				on(textarea, "compositionstart", lang.hitch(this,function(e){
					this._inComposition = true;
				}));
				on(textarea, "compositionend", lang.hitch(this,function(e){
					this._inComposition = false;
				}));
				return;
			}
			
			console.log("other browser");
			// firefox
			on(textarea, "input", lang.hitch(this,function(e){
				console.log("input");
				this._onInput(e);
			}));
			on(textarea, "compositionstart", lang.hitch(this,function(e){
				this._inComposition = true;
			}));
			on(textarea, "compositionend", lang.hitch(this,function(e){
				this._inComposition = false;
			}));
			
			
		},
		
		// 下面三个方法，只有是ie8以下版本时，才用到
		_onCompositionStart: function(){
			
		},
		
		_onCompositionUpdate: function(){
			
		},
		
		_onCompositionEnd: function(){
			
		},
		
		
		_onInput: function(e){
			if(this._inComposition)return;
			
			inputData = this.textarea.value;
			if(inputData == "")return;
			
			this.host.onTextInput(inputData);
			
			this.resetValue();
		},
		
		resetValue: function(){
			var textarea = this.textarea;
			setTimeout(function() {
				textarea.value = "";
		    }, 0);
		},
		
		getElement: function(){
			return this.textarea;
		}
		
	});
});