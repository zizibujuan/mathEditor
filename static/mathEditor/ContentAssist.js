define(["dojo/_base/declare",
        "dojo/_base/array",
        "dojo/_base/lang",
        "dojo/on",
        "dojo/aspect",
        "dojo/dom-construct",
        "dojo/dom-class",
        "dojo/dom-style",
        "dijit/popup",
        "dijit/DropDownMenu",
        "dijit/MenuItem",
        "mathEditor/mathContentAssist"], function(
		declare,
		array,
		lang,
		on,
		aspect,
		domConstruct,
		domClass,
		domStyle,
		popup,
		DropDownMenu,
		MenuItem,
		mathContentAssist) {

	// 默认是ACTIVE状态，在将提示信息写入model前，设置为INACTIVE状态，写入完成后，恢复为ACTIVE状态
	// ACTIVE --- contentAssist apply 前 ---INACTIVE ---apply 后 ---ACTIVE
	var State = {
		INACTIVE: 1,
		ACTIVE: 2,
		FILTERING: 3
	};
	
	return declare("mathEditor.ContentAssist",DropDownMenu,{
		// summary:
		//		弹出的建议输入列表提示框
		// 提示框关闭的时机：
		//		1.按下ESC
		//		2.鼠标点击弹出框之外的区域
		//		3.用户用鼠标点击一个建议的值
		//		4.用户选择一个建议值，并按下回车键
		//		5.用户忽略弹出的提示框，新输入的值与前面的缓存值找不出建议项，
		//		  则保留用户的输入，并关闭提示框（这个可提高用户的输入效率）。
		
		proposals : null,
		view: null,
		
		// summary:
		//		缓存的字符串，因为这个字符串中约定不包含unicode字符，所以直接使用字符串存储。
		cacheString: "",
		opened: false,
		
		
		postCreate: function(){
			this.inherited(arguments);
			this.state = State.ACTIVE;
			
			on(this.view.contentDiv, "mousedown", lang.hitch(this,function(e){
				if(this.opened){
					popup.close(this);
				}
			}));
			aspect.after(this.view.model, "onChanging", lang.hitch(this, this._onModelChanging), true);
		},
		
		_onModelChanging: function(e){
			var inputData = e.data;
			if(inputData == null || inputData=="")return;
			
			console.log("contentAssist: model changing", e);
			if(this.state === State.INACTIVE)return;
			// 只有是 mathml模式时，提示框才生效.
			// 这里的逻辑是，只有mathml模式下，才触发该事件。
			
			var adviceData = this.show(inputData);
			e.newData = adviceData;
			console.log("提示框中推荐的字符", adviceData);
//				if(adviceData != null){
//					// 优先显示提示框中级别最高的数据。而不是直接输入的内容。
//					inputData = adviceData;
//					//removeCount = 
//				}
			
		},
		
		startup: function(){
			this.inherited(arguments);
		},
		
		// 来自dijit/Menu
		_scheduleOpen: function(/*DomNode?*/ target, x, y){
			// summary:
			//		Set timer to display myself.  Using a timer rather than displaying immediately solves
			//		two problems:
			//
			//		1. IE: without the delay, focus work in "open" causes the system
			//		context menu to appear in spite of stopEvent.
			//
			//		2. Avoid double-shows on linux, where shift-F10 generates an oncontextmenu event
			//		even after a event.stop(e).  (Shift-F10 on windows doesn't generate the
			//		oncontextmenu event.)

			view = this.view;
			var self = this;
			if(!this._openTimer){
				this._openTimer = this.defer(function(){
					this._openTimer.remove();
					delete this._openTimer;
					
					popup.open({
						popup : target,
						x : x,
						y : y,
						onExecute : function() {
							popup.close(target);
							// 编辑器获取焦点
							view.focus();
							self.opened = false;
						},
						onCancel : function() {
							popup.close(target);
							self.opened = false;
							// 编辑器获取焦点
							view.focus();
						},
						onClose : function() {
							// 编辑器获取焦点
							view.focus();
							self.opened = false;
						}
					});
					this.opened = true;
					//target.focus();
					// focus是选中加上获取焦点；而select只选中，但不获取焦点。
					target.select();
				}, 0);
			}
		},
		
		_open: function(){
			var cursorPosition = this.view.getCursorPosition();
			var x = cursorPosition.x;
			var y = cursorPosition.y;
			this._scheduleOpen(this, x, y);
			this.opened = true;
		},
		
		_clear: function(){
			var children = this.getChildren();
			array.forEach(children, lang.hitch(this,function(child, index){
				this.removeChild(child);
			}));
		},
		
		_setProposals: function(proposals){
			// summary:
			//		往弹出面板中添加数据。
			// data: Array
			
			this._clear();
			
			this.proposals = proposals;
			array.forEach(proposals,lang.hitch(this,function(jsonObject,index){
				// 显示出快捷键，input中存储的就是快捷键。
				var menuItem = new MenuItem({label:jsonObject.label+" ( \\"+jsonObject.input+" )", iconClass:jsonObject.iconClass});
				// jsonObject
				menuItem.on("click", lang.hitch(this,this._onApplyProposal,jsonObject.map, jsonObject.nodeName));
				this.addChild(menuItem);
			}));
		},

		// TODO:需要弹出框与编辑器之间切换焦点
		// 当弹出框时，弹出框获取焦点；当关闭弹出狂框，编辑器获取焦点。
		show: function(data){
			// summary:
			//		判断输入的内容是否可以获取到建议的映射值
			// data: String
			//		输入的字符
			// return:String
			//		推荐的值，如果没有则返回null。
			
			//1. 新输入的data，如何追加。
			//2. 如果用户已经默认某些值，在这里调用应用方法，并关闭打开的提示框。
			console.log("ContentAssist.opened",this.opened);
			if(this.opened==false){
				this.cacheString = data;
			}else{
				// 重新定义查询条件
				// 如果提示框已打开，输入的值与前一次的值组合没有找到提示信息
				// 则让前一次的值输入，然后根据新值重新查询。
				var queryString = this.cacheString + data;
				var proposals = mathContentAssist.getProposals(queryString);
				if(proposals.length == 0){
					this.cacheString = data;
				}else{
					this.cacheString += data;
				}
			}
			
			console.log("查询条件为：", this.cacheString);
			var proposals = mathContentAssist.getProposals(this.cacheString);
			console.log("查询到的提示信息：", proposals);
			this._setProposals(proposals);
			if(proposals.length > 0){
				this._open();
				// 推荐的字符，仅当为字符时，才有效，如加号；如果推荐的字符是一个布局运算符，如根号，
				// 则这个字符还是取默认输入的字符。
				var result = proposals[0].map;
				var single = proposals[0].single; // 是单字符
				// 当字符数相同的时候，直接推荐，不等的时候，只推荐当前输入的值。
				if(!result || result === "" || !single){
					result = data;
				}
				return {data:result, nodeName:proposals[0].nodeName};
			}else{
				this.cacheString = "";
				if(this.opened){
					popup.close(this);
					this.opened = false;
				}
				return null;
			}
		},
		
		_onApplyProposal: function(data,nodeName, evt){
			// 因为cacheString的值是实时变化的，所以需要在外面加一层方法调用。
			this.apply(data, nodeName, this.cacheString.length,evt);
		},
		
		apply: function(data, nodeName, cacheCount,evt){
			// summary:
			//		应用某个建议的值，将其最终存入到model中。
			//		在将推荐的数据写入model之前，要先关闭提示框；写入完成之后，再打开提示框。
			// data：
			//		当前item对应的数据
			// nodeName:
			//		用那个mathml标签封装data
			// cacheCount:
			//		缓存的字符的个数，这些字符已经在view中显示，需要根据这个数字删除
			// evt：
			//		事件对象
			
			this.state = State.INACTIVE;
			this.view.model.setData({data: data, nodeName: nodeName, removeCount: cacheCount});
			this.state = State.ACTIVE;
			
			console.log(data, cacheCount, evt);
		},
		
		enter: function(evt){
			this.onItemClick(this.selectedChild, evt);
		},
		
		
		/*************************下面是select相关的代码****************************/
		select: function(){
			this.selectFirstChild();
		},
		
		selectFirstChild: function(){
			this.selectChild(this._getFirstSelectableChild());
		},
		
		selectPrev: function(){
			this.selectChild(this._getNextSelectableChild(this.selectedChild, -1), true);
		},
		
		selectNext: function(){
			this.selectChild(this._getNextSelectableChild(this.selectedChild, 1));
		},
		
		_getFirstSelectableChild: function(){
			// summary:
			//		Returns first child that can be focused
			return this._getNextSelectableChild(null, 1);	// dijit/_WidgetBase
		},

		_getLastFocusableChild: function(){
			// summary:
			//		Returns last child that can be focused
			return this._getNextSelectableChild(null, -1);	// dijit/_WidgetBase
		},

		_getNextSelectableChild: function(child, dir){
			// summary:
			//		Returns the next or previous selected child, compared
			//		to "child"
			// child: Widget
			//		The current widget
			// dir: Integer
			//		- 1 = after
			//		- -1 = before
			
			if(child){
				child = this._getSiblingOfChild(child, dir);
			}
			var children = this.getChildren();
			for(var i=0; i < children.length; i++){
				if(!child){
					child = children[(dir>0) ? 0 : (children.length-1)];
				}
				if(child.isFocusable()){
					return child;	// dijit/_WidgetBase
				}
				child = this._getSiblingOfChild(child, dir);
			}
			// no focusable child found
			return null;	// dijit/_WidgetBase
		},
		
		selectChild: function(/*dijit/_WidgetBase*/ widget, /*Boolean*/ last){
			// summary:
			//		选中指定的子部件
			// widget:
			//		子部件
			// last:
			//		If true and if widget has multiple focusable nodes, focus the
			//		last one instead of the first one
			// tags:
			//		protected

			if(!widget){ return; }

			if(this.selectedChild && widget !== this.selectedChild){
				this.selectedChild._setSelected(false);
			}
			
			this.selectedChild = widget;
			widget._setSelected(true);
		}
		
		
	});
	
});