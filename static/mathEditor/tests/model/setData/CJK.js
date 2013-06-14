// CJK 中日韩统一表意文字（CJK Unified Ideographs）
define([ "doh", "mathEditor/Model", "mathEditor/lang" ], function(doh, Model, dripLang) {

	doh.register("Model.setData.CJK 中日韩文字",[
		{
			name: "在空的model中输入一个汉字",
			setUp: function(){
				this.model = new Model({});
			},
			runTest: function(t){
				var model = this.model;
				model.setData({data:"水"});
				t.is("/root/line[1]/text[1]", model.getPath());
				var focusNode = model.getFocusNode();
				t.is(focusNode.nodeName, "text");
				t.is("水", dripLang.getText(focusNode));
				t.is(1, model.getOffset());
			},
			tearDown: function(){
				
			}
		},{
			name: "在空的model中输入连续输入两个汉字",
			setUp: function(){
				this.model = new Model({});
			},
			runTest: function(t){
				var model = this.model;
				model.setData({data:"大海"});
				t.is("/root/line[1]/text[1]", model.getPath());
				var focusNode = model.getFocusNode();
				t.is(focusNode.nodeName, "text");
				t.is("大海", dripLang.getText(focusNode));
				t.is(2, model.getOffset());
			},
			tearDown: function(){
				
			}
		},{
			name: "在空的model中输入一个汉字之后，再输入一个汉字",
			setUp: function(){
				this.model = new Model({});
			},
			runTest: function(t){
				var model = this.model;
				model.setData({data:"大"});
				model.setData({data:"海"});
				t.is("/root/line[1]/text[1]", model.getPath());
				var focusNode = model.getFocusNode();
				t.is(focusNode.nodeName, "text");
				t.is("大海", dripLang.getText(focusNode));
				t.is(2, model.getOffset());
			},
			tearDown: function(){
				
			}
		},{
			name: "在空的model中输入两个汉字，然后在字母中间插入一个汉字",
			setUp: function(){
				this.model = new Model({});
			},
			runTest: function(t){
				var model = this.model;
				model.setData({data:"大海"});
				model.anchor.offset--;
				model.setData({data:"水"});
				t.is("/root/line[1]/text[1]", model.getPath());
				var focusNode = model.getFocusNode();
				t.is(focusNode.nodeName, "text");
				t.is("大水海", dripLang.getText(focusNode));
				t.is(2, model.getOffset());
			},
			tearDown: function(){
				
			}
		},{
			name: "在空的model中输入一个汉字，然后在字母的前面插入一个汉字",
			setUp: function(){
				this.model = new Model({});
			},
			runTest: function(t){
				var model = this.model;
				model.setData({data:"大"});
				model.anchor.offset--;
				model.setData({data:"海"});
				t.is("/root/line[1]/text[1]", model.getPath());
				var focusNode = model.getFocusNode();
				t.is(focusNode.nodeName, "text");
				t.is("海大", dripLang.getText(focusNode));
				t.is(1, model.getOffset());
			},
			tearDown: function(){
				
			}
		}
	                             
	]);
});