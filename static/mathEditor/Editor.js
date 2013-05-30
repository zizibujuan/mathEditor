define(["dojo/_base/declare",
        "dojo/_base/lang",
        "dijit/_WidgetBase",
        "dojo/aspect",
        "dojo/dom-class",
        "dojo/dom-style",
        "mathEditor/dom",
        "mathEditor/Model",
        "mathEditor/MathJaxView",
        "mathEditor/TextInput",
        "mathEditor/ContentAssist"],function(
        		 declare,
        		 lang,
        		 _WidgetBase,
        		 aspect,
        		 domClass,
        		 domStyle,
        		 dripDom,
        		 Model,
        		 View,
        		 TextInput,
        		 ContentAssist){

	return declare("mathEditor.Editor",[_WidgetBase],{
		model: null,
		view: null,
		textarea: null,
		
		// rows: int
		//		编辑器中的行数，默认是两行。注意，既可以通过指定行来设置编辑器的高度，也可以通过设置height样式来设置。
		//		height的优先级高于rows。
		// 不建议使用style来设置编辑器的高度，建议通过rows来计算出实际内容的高度。
		rows: 2,
		
		// width: int
		//		编辑器的宽度，这里设置的是实际内容的宽度。
		//		不建议使用style样式来设置宽度
		width: 100,
		
		// minLineHeight: int
		//		行的最小高度，这个值来自drip_layer样式。
		minLineHeight: 15,
		
		// 默认不显示下拉滚动条，当显示的时候也要不影响高度。
		hScrollBarAlwaysVisible: false,

		// paddingTop: int
		//		编辑器的边框距离编辑器内内容最顶处的距离
		paddingTop: 2,
		
		// paddingRight: int
		//		编辑器的边框距离编辑器内内容最右边的距离
		paddingRight: 4,
		
		// value: String
		//		编辑器的值
		value: "",
		
		_getValueAttr: function(){
			return this.model.getXML();
	    },
		
	    _setValueAttr: function(value){
	    	this.model.clear();
	    	if(value && value != ""){
	    		this.model.setData({data:value});
	    	}
	    },
	    
		postCreate: function(){
			this.inherited(arguments);
			
			var domNode = this.domNode;
			domClass.add(domNode, "drip_editor");
			// 计算滚动条的宽度
			this.scrollbarWidth = dripDom.scrollbarWidth();
			// 编辑器的边框宽度
			var borderWidth = this.borderWidth = domStyle.get(domNode, "border-width");
			console.log("border-width",this.borderWidth);
			
			var height = this._computeEditorHeight();
			var width = this._computeEditorWidth();
			domStyle.set(domNode, {"height": height + "px", "width": width + "px"});
			
			var textInput = new TextInput({parentNode: this.domNode, host: this});
			var model = this.model = new Model();
			this.view = new View({
				model: this.model, 
				parentNode: this.domNode,
				textarea: textInput.getElement(),
				borderWidth: borderWidth,
				paddingTop: this.paddingTop,
				paddingRight: this.paddingRight
			});
			this.view.hScrollBarAlwaysVisible = this.hScrollBarAlwaysVisible;
			
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
				textInput.resetValue();
			},true);
			
		},
		
		_computeEditorHeight: function(){
			// summary:
			//		根据行数计算编辑器的初始高度,客户可以设置的高度属性，设置的都是内容的实际高度
			//		这里不需要加上边框的宽度。因为我们要设置的是clientWidth
			
			var rows = this.rows;
			if(rows < 1){
				rows = 1;
			}
			var minLineHeight = this.minLineHeight;
			// 由rows计算出的是放置内容的高度
			var height = rows * minLineHeight;
			// 还要加上边框的高度，滚动条的高度，才是最后编辑器的高度
			//		编辑器的上边框和下边框，都在最外围的div上，即this.domNode上
			height += this.paddingTop;
			if(this.hScrollBarAlwaysVisible == true){
				height += this.scrollbarWidth;
			}
			return height;
		},
		
		_computeEditorWidth: function(){
			// summary:
			//		计算编辑器的宽度，用户可以设置的宽度属性，设置的都是内容的实际宽度
			//		
			
			return this.width + this.paddingRight;
		},
		
		onBlur: function(){
			// summary:
			//		当编辑器失去焦点时触发
			this.view.blur();
		},
		
		onFocus: function(){
			// summary:
			//		当编辑器获取焦点时触发
			this.view.focus();
		},
		
		/*************************************************************************/
		/** 需要在Editor中定义一套公用的api，作为所有访问的入口                          */
		/** 所以下面的这些方法，有两种调用方式，一种是由第三方程序调用，一种是由TextInput调用。*/
		/** 即一种是程序调用，一种是通用人的输入来触发调用。                              */ 
		/*************************************************************************/
		navigateLeft: function(){
			// summary:
			//		往左移 TODO：添加参数times,来控制移动次数
			//		有两种移动场景，一种是在编辑器获取焦点时，一种是在提示框获取焦点时。
			
			this.model.moveLeft();// 注意在move系列方法中不调用model.onChanged方法
			this.view.showCursor();
		},
		
		navigateRight: function(){
			// summary:
			//		往右移。有两种移动场景，一种是在编辑器获取焦点时，一种是在提示框获取焦点时。
			this.model.moveRight();
			this.view.showCursor();
		},
		
		navigateUp: function(){
			// summary:
			//		上移。有两种移动场景，一种是在编辑器获取焦点时，一种是在提示框获取焦点时。
			
			if(this.contentAssist.opened){
				this.contentAssist.selectPrev();
			}else{
				this.model.moveUp();
			}
		},
		
		navigateDown: function(){
			// summary:
			//		下移。有两种移动场景，一种是在编辑器获取焦点时，一种是在提示框获取焦点时。
			
			if(this.contentAssist.opened){
				this.contentAssist.selectNext();
			}else{
				this.model.moveDown();
			}
		},
		
		removeLeft: function(){
			// FIXME:将onChanged的方法调用放在removeLeft中。
			//		但是，因为在有的情况下，调用removeLeft时，并不需要触发这个事件。如在setData中调用时。
			var removed = this.model.removeLeft();
			if(removed != ""){
				this.model.onChanged();
			}
		},
		
		removeRight: function(){
			var removed = this.model.removeRight();
			if(removed != ""){
				this.model.onChanged();
			}
		},
		
		inputEnter: function(){
			// summary:
			//		输入回车符号
			
			if(this.contentAssist.opened){
				this.contentAssist.enter(e);
			}else{
				this.model.setData({data:"\n"});
			}
		},
		
		inputTab: function(){
			// summary:
			//		输入制表符
			
			this.model.setData({data:"\t"});
		},
		
		// FIXME：如何测试这个方法中的逻辑呢？
		onTextInput: function(inputData){
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
		},
		
		destroy: function(){
			console.log("destroy");
			this.inherited(arguments);
		}
	});
	
});