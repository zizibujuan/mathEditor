define([ "doh","mathEditor/Model" ], function(doh,Model) {

	doh.register("Model.setData number-输入数字",[
	    {
	    	name: "mathml模式下,在空的model中输入一个数字",
  			setUp: function(){
  				this.model = new Model({});
  				this.model.toMathMLMode();
  			},
  			runTest: function(t){
  				var model = this.model;
  				model.setData({data:"1"});
  				
  				var focusNode = model.getFocusNode();
  				
  				t.is("/root/line[1]/math[1]/mn[1]", model.getPath());
  				t.is("mn", model.getFocusNode().nodeName);
  				t.is(1, model.getOffset());
  				t.is("1", focusNode.textContent);
  			},
  			tearDown: function(){
  				
  			}
	    },{
	    	name: "mathml模式,在空的model中输入一个数字，然后再输入一个数字",
  			setUp: function(){
  				this.model = new Model({});
  				this.model.toMathMLMode();
  			},
  			runTest: function(t){
  				var model = this.model;
  				model.setData({data:"1"});
  				model.setData({data:"2"});
  				
  				var focusNode = model.getFocusNode();
  				
  				t.is("/root/line[1]/math[1]/mn[1]", model.getPath());
  				t.is("mn", focusNode.nodeName);
  				t.is(2, model.getOffset());
  				t.is("12", focusNode.textContent);
  			},
  			tearDown: function(){
  				
  			}
	    },{
	    	name: "mathml模式,在空的model中一次性输入两个数字",
  			setUp: function(){
  				this.model = new Model({});
  				this.model.toMathMLMode();
  			},
  			runTest: function(t){
  				var model = this.model;
  				model.setData({data:"12"});
  				
  				var focusNode = model.getFocusNode();
  				
  				t.is("/root/line[1]/math[1]/mn[1]", model.getPath());
  				t.is("mn", focusNode.nodeName);
  				t.is(2, model.getOffset());
  				t.is("12", focusNode.textContent);
  			},
  			tearDown: function(){
  				
  			}
	    },{
	    	name: "mathml模式,在两个数字的中间输入数字",
	    	setUp: function(){
	    		this.model = new Model({});
	    		this.model.toMathMLMode();
	    	},
	    	runTest: function(t){
	    		var model = this.model;
	    		model.setData({data:"12"});
	    		// model中通过什么标识当前光标的位置，或者可插入字符的位置,目前使用anchor定义这个概念。
	    		// 获取需要在model中提取出一个选择区域的概念，在选择区域中存储选择区域的位置与当前光标的位置
	    		// 这样在后面的测试中就可以通过调整选择区域中的值，在改变字符的插入位置
	    		// 这样这个测试用例才能快速的写出来，不需要借助与moveLeft()重量级方法。
	    		model.anchor.offset--;
	    		model.setData({data:"3"});// 虽然是数字，但是data类型只能传入字符串。
	    		t.is("/root/line[1]/math[1]/mn[1]", model.getPath());
	    		var focusNode = model.getFocusNode();
  				t.is("mn", focusNode.nodeName);
  				t.is(2, model.getOffset());
  				t.is("132", focusNode.textContent);
	    	},
	    	tearDown: function(){
	    		
	    	}
	    },{
	    	name: "mathml模式,在一个数字前面输入数字",
	    	setUp: function(){
	    		this.model = new Model({});
	    		this.model.toMathMLMode();
	    	},
	    	runTest: function(t){
	    		var model = this.model;
	    		model.setData({data:"1"});
	    		
	    		model.anchor.offset--;
	    		model.setData({data:"2"});
	    		t.is("/root/line[1]/math[1]/mn[1]", model.getPath());
	    		var focusNode = model.getFocusNode();
  				t.is("mn", focusNode.nodeName);
  				t.is(1, model.getOffset());
  				t.is("21", focusNode.textContent);
	    	},
	    	tearDown: function(){
	    		
	    	}
	    }
	                             
	]);
});