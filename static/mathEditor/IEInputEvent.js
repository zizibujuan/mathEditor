define(["dojo/_base/declare",
        "dojo/_base/lang"], function(
        		declare,
        		lang){
	
	var activeElement = null;
	var activeElementValue = null;
	var activeElementValueProp = null;
	var inputHandler = null;
	
	var newValueProp = {
		get: function(){
			return activeElementValueProp.get.call(this);
		},
		set: function(val){
			activeElementValue = val;
			activeElementValueProp.set.call(this, val);
		}
	};
	
	var startWatching = function(target){
		activeElement = target;
		activeElementValue = target.value;
		activeElementValueProp = Object.getOwnPropertyDescriptor(
			target.constructor.prototype,
			"value"
		);
		Object.defineProperty(activeElement, "value", newValueProp);
		activeElement.attachEvent('onpropertychange', handlePropertyChange);
	};
	
	var stopWatching = function(){
		if(!activeElement)return;
		delete activeElement.value;
		activeElement.detachEvent('onpropertychange', handlePropertyChange);
		activeElement = null;
		activeElementId = null;
		activeElementValue = null;
		activeElementValueProp = null;
	};
	
	function handlePropertyChange(nativeEvent){
		var value;
		var abstractEvent;
		if(nativeEvent.propertyName === "value"){
			
			value = nativeEvent.srcElement.value;
			console.log("比较值 ", value, activeElementValue);
			if(value !== activeElementValue){
				activeElementValue = value;
				if(inputHandler){
					inputHandler(activeElementValue);
				}
			}
		}
	}
	
	
	return declare("mathEditor.IEInputEvent", null, {
		// summary:
		//		因为ie8不支持input事件，ie9虽然支持，但是在删除操作时不触发，
		//		所以这里shim一个input事件，用户获取用户输入的字符，包括ime下输入的汉字等。
		//		代码来自：https://github.com/facebook/react/blob/master/src/eventPlugins/TextChangeEventPlugin.js
		
		target: null,
		
		constructor: function(args){
			lang.mixin(this, args);
			
			activeElement = this.target;
			activeElement.attachEvent('onfocus', this._onFocus);
			activeElement.attachEvent('onblur', this._onBlur);
			activeElement.attachEvent('onkeyup', this._onKeyUp);
		},
		
		_onFocus: function(e){
			stopWatching();
			startWatching(e.srcElement);
		},
		
		_onBlur: function(e){
			stopWatching();
		},
		
		_onKeyUp: function(e){
			// summary:
			//		因为基本上每次输入完成后，都要使用js清空textarea的值，所以该方法的调用频率会很高
			if (activeElement && activeElement.value !== activeElementValue) {
				activeElementValue = activeElement.value;
				if(inputHandler){
					inputHandler(activeElementValue);
				}
			}
		},
		
		on: function(callback){
			inputHandler = callback;
		}
	
	
	});
});