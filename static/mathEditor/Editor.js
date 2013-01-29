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
        "mathEditor/View",
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
			
			var contentAssist = this.contentAssist = new ContentAssist({view:this.view});
			aspect.after(contentAssist,"apply", function(input, nodeName, cacheCount, event){
				// FIXME:这里直接获取map值的逻辑不正确，如果处于cache状态，则不应该往model中
				// 输入值。
				// FIXME:1为硬编码值，需要替换。
				model.setData({data:input,nodeName:nodeName, removeCount:cacheCount});
				setTimeout(function() {
					textarea.value = "";
			    });
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
				this.view.blur();
			}));
			
			// FIXME:一种重构思路是将key与方法绑定，然后根据key自动调用方法，即把if改为json对象
			on(textarea, "keydown", lang.hitch(this,function(e){
				console.log(e, e.keyCode);
				if(e.keyCode === keys.LEFT_ARROW){
					this.model.moveLeft();// 注意在move系列方法中不调用model.onChange方法
					this.view.showCursor();
				}else if(e.keyCode === keys.RIGHT_ARROW){
					this.model.moveRight();
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
					//this.model.removeLeft();
					this.model.doDelete(); // TODO:使用removeLeft代替doDelete
				}else if(e.altKey && e.keyCode === 191){
					// ALT+/ 弹出提示信息
					this.contentAssist.open();
					event.stop(e);
				}else if(e.keyCode === keys.ENTER){
					if(this.contentAssist.opened){
						this.contentAssist.enter(e);
					}else{
						this.model.setData({data:"\n"});
					}
					
					// 回车换行。
					event.stop(e);
				}
				
			}));
		},
		
		_onTextInput: function(inputData){
			// TODO：如果用户新输入的值，不在推荐之中，则先执行一个应用操作。
			
			
			var adviceData = this.contentAssist.show(inputData);
			if(adviceData != null){
				// 优先显示提示框中级别最高的数据。而不是直接输入的内容。
				inputData = adviceData;
				//removeCount = 
			}
			// 对输入的内容进行拦截，判断是否有推荐的可选项。
			
			// 当model的内容发生变化时，View自动更新,所以这里不写View相关的代码
			var model = this.model;
			// removeCount
			model.setData({data:inputData});
			
			var textarea = this.textarea;
			setTimeout(function() {
				textarea.value = "";
		    });
		}
	});
	
});