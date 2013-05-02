define(["dojo/_base/declare",
        "dojo/_base/lang",
        "dojo/_base/event",
        "dijit/_WidgetBase",
        "dojo/on",
        "dojo/sniff",
        "dojo/keys",
        "dojo/aspect",
        "dojo/dom-construct",
        "dojo/dom-style",
        "dojo/dom-class",
        "mathEditor/Model",
        "mathEditor/MathJaxView",
        "mathEditor/ContentAssist"],function(
        		 declare,
        		 lang,
        		 event,
        		 _WidgetBase,
        		 on,
        		 sniff,
        		 keys,
        		 aspect,
        		 domConstruct,
        		 domStyle,
        		 domClass,
        		 Model,
        		 View,
        		 ContentAssist){

	return declare("mathEditor.Editor",[_WidgetBase],{
		model : null,
		view : null,
		textarea : null,
		
		// value: String
		//		编辑器的值
		value : "",
		
		_getValueAttr: function(){
			return this.model.getXML();
	    },
		
	    _setValueAttr: function(value){
	    	this.model.clear();
	    	if(value && value != ""){
	    		this.model.setData({data:value});
	    	}
	    },
	    
		postCreate : function(){
			this.inherited(arguments);
			keys.EQUAL = sniff("chrome")?187 : 61;// =
			
			domStyle.set(this.domNode, {position: "relative"});
			var textarea = this.textarea = domConstruct.create("textarea",{style:{position:"absolute"/*,top:"-10000px",left:'-10000px'*/}}, this.domNode);
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
			
			var model = this.model = new Model();
			this.view = new View({
				model:this.model, 
				parentNode : this.domNode,
				textarea : this.textarea
			});
			
			// FIXME：是否需要移动代码到更合适的地方。
			var contentAssist = this.contentAssist = new ContentAssist({view:this.view});
			// 一个错误的理解：现在放在modeChanging中了，应该是不需要在这里重新setData了，而是在半路修改了data的值。
			// 不,因为应用时，之前的setData方法都已经执行完了。
			// 将contentAssist与model.onModelChanging绑定，只是为了更好的在model的上下文中进行推断值，
			// 而不是为了进行实际输入值。
			aspect.after(contentAssist,"apply", function(input, nodeName, cacheCount, event){
				// FIXME:这里直接获取map值的逻辑不正确，如果处于cache状态，则不应该往model中
				// 输入值。
				
				// 而这个逻辑，应该放在onChanged中。FIXME：绑定一个onChanged事件？
				setTimeout(function() {
					textarea.value = "";
			    },0);
			},true);
			
			
			if(sniff("chrome")){
				// chrome
				console.log("chrome");
				on(textarea, "textInput", lang.hitch(this,function(e){
					var inputData = e.data;
					this._onTextInput(inputData);
				}));
			}else{
				console.log("other browser");
				var inCompostion = false;
				// firefox
				on(textarea, "input", lang.hitch(this,function(e){
					if(inCompostion)return;
					
					inputData = textarea.value;
					if(inputData == "")return;
					
					this._onTextInput(inputData);
				}));
				on(textarea, "compositionstart", lang.hitch(this,function(e){
					inCompostion = true;
				}));
				on(textarea, "compositionend", lang.hitch(this,function(e){
					inCompostion = false;
				}));
			}
			
			on(textarea, "blur", lang.hitch(this,function(e){
				console.log("textarea失去焦点");
				this.view.blur();
			}));
			
			on(textarea, "focus", lang.hitch(this,function(e){
				console.log("textarea获取焦点");
				this.view.focus();
			}));
			
			// FIXME:一种重构思路是将key与方法绑定，然后根据key自动调用方法，即把if改为json对象
			on(textarea, "keydown", lang.hitch(this,function(e){
				console.log(e, e.keyCode);
				if(e.keyCode === keys.LEFT_ARROW){
					this.model.moveLeft();// 注意在move系列方法中不调用model.onChanged方法
					this.view.showCursor();
				}else if(e.keyCode === keys.RIGHT_ARROW){
					this.model.moveRight();
					this.view.showCursor();
				}else if(e.keyCode === keys.UP_ARROW){
					if(this.contentAssist.opened){
						this.contentAssist.selectPrev();
					}else{
						this.model.moveUp();
					}
				}else if(e.keyCode === keys.DOWN_ARROW){
					if(this.contentAssist.opened){
						this.contentAssist.selectNext();
					}else{
						this.model.moveDown();
					}
				}else if(e.keyCode === keys.BACKSPACE){
					// FIXME:将onChanged的方法调用放在removeLeft中。
					//		但是，因为在有的情况下，调用removeLeft时，并不需要触发这个事件。如在setData中调用时。
					var removed = this.model.removeLeft();
					if(removed != ""){
						this.model.onChanged();
					}
				}else if(e.keyCode === keys.DELETE){
					var removed = this.model.removeRight();
					if(removed != ""){
						this.model.onChanged();
					}
				}else if(e.altKey && e.keyCode === 191){
					// ALT+/ 弹出提示信息,因为是根据用户输入，自动弹出提示框，所以不需要这个方法
				}else if(e.altKey && e.keyCode === keys.EQUAL){
					// TODO:测试界面上，text和mathml模式之间的切换。
					// 如果是mathml模式，安小alt =，则切换到text模式。
					// 按下alt =，添加math节点；再次按下，则删除math节点
					// 如果已输入公式，则将光标移到公式的后面。
					
					console.log("Alt =");
					this.model.switchMode();
					this.model.onChanged();
					event.stop(e);
				}else if(e.keyCode === keys.ENTER){
					if(this.contentAssist.opened){
						this.contentAssist.enter(e);
					}else{
						this.model.setData({data:"\n"});
					}
					
					// 回车换行。
					event.stop(e);
				}else if(e.keyCode == keys.TAB){
					this.model.setData({data:"\t"});
					
					event.stop(e);
				}
				
			}));
		},
		
		// FIXME：如何测试这个方法中的逻辑呢？
		_onTextInput: function(inputData){
			// TODO: 如果用户新输入的值，不在推荐之中，则先执行一个应用操作。
			// TODO: 如上下标的快捷键，不需要弹出提示框，直接输入即可。这样的情况该如何处理呢？
			// TODO: 将弹出提示框，放在这里有一个弊端，就是不能获取根据model中的上下文推导的数据，然后与提示框中的数据进行比较。
			//		 即比较时机有问题。
			var model = this.model;
			
			
			
			// 对输入的内容进行拦截，判断是否有推荐的可选项。
			
			// 当model的内容发生变化时，View自动更新,所以这里不写View相关的代码
			
			// removeCount
			// 引入新概念，命令模式，如vim的命令模式。
			// 命令要在提示弹出框上面显示，所有命令都用mi封装。
			// 或者更完善的逻辑是，先用mtext封装，如果匹配到了则转用相应的节点封装，如mi等
			// 只要在弹出框打开时输入的内容，都可以看作一个命令指令。
			// 注意，悄悄应用匹配规则的情况，这是我们推荐的。
			var data = {data: inputData};
			model.setData(data);
			
			var textarea = this.textarea;
			setTimeout(function() {
				textarea.value = "";
		    }, 0);
		}
	});
	
});