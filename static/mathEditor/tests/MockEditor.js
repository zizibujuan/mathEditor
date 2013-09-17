define(["dojo/_base/declare",
        "dijit/_WidgetBase"], function(
        		declare,
        		_WidgetBase){
	
	return declare("mathEditor.tests.MockEditor", [_WidgetBase], {
		
		onTextInput: function(inputData){
			this.domNode.innerHTML = inputData;
		},
		
		onFocus: function(){
			
		},
		
		onBlur: function(){
			
		}
	});
	
});