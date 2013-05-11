define([ "doh","mathEditor/Model" ], function(doh,Model) {

	doh.register("Model.setData.mn number-输入数字",[
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
	    },{
	    	name: "在mn和mo之间插入数字，光标在mo的最前面",
  			setUp: function(){
  				this.model = new Model({});
  			},
  			runTest: function(t){
  				var model = this.model;
  				model.loadData("<root><line>" +
	  						"<math>" +
		  						"<mn>12</mn>" +
		  						"<mo>+</mo>" +
	  						"</math>" +
  						"</line></root>");
  				model.mode = "mathml";
  				var line = model.getLineAt(0);
  				model.anchor.node = line.firstChild.lastChild;
  				model.anchor.offset = 0;
  				model.path = [];
  				model.path.push({nodeName:"root"});
  				model.path.push({nodeName:"line", offset:1});
  				model.path.push({nodeName:"math", offset:1});
  				model.path.push({nodeName:"mo", offset:2});
  				model.setData({data:"3"});
  				// 光标的位置保持不变，依然停留在mo的前面，但是输入的值追加在mn最后
  				t.is("/root/line[1]/math[1]/mo[2]", model.getPath());
  				var focusNode = model.getFocusNode();
  				t.is("mo", focusNode.nodeName);
  				t.is(0, model.getOffset());
  				t.is("123", focusNode.previousSibling.textContent);
  			},
  			tearDown: function(){
  				
  			}
	    },{
	    	name: "在mo和mn之间插入数字，光标在mo的最后面",
  			setUp: function(){
  				this.model = new Model({});
  			},
  			runTest: function(t){
  				var model = this.model;
  				model.loadData("<root><line>" +
	  						"<math>" +
		  						"<mo>+</mo>" +
		  						"<mn>23</mn>" +
	  						"</math>" +
  						"</line></root>");
  				model.mode = "mathml";
  				var line = model.getLineAt(0);
  				model.anchor.node = line.firstChild.firstChild;
  				model.anchor.offset = 1;
  				model.path = [];
  				model.path.push({nodeName:"root"});
  				model.path.push({nodeName:"line", offset:1});
  				model.path.push({nodeName:"math", offset:1});
  				model.path.push({nodeName:"mo", offset:1});
  				model.setData({data:"1"});
  				// 光标的位置保持不变，依然停留在mo的后面，但是输入的值放在mn前面
  				t.is("/root/line[1]/math[1]/mo[1]", model.getPath());
  				var focusNode = model.getFocusNode();
  				t.is("mo", focusNode.nodeName);
  				t.is(1, model.getOffset());
  				t.is("123", focusNode.nextSibling.textContent);
  			},
  			tearDown: function(){
  				
  			}
	    },{
	    	name: "在mo和mo之间插入数字，光标在第一个mo的后面",
  			setUp: function(){
  				this.model = new Model({});
  			},
  			runTest: function(t){
  				var model = this.model;
  				model.loadData("<root><line>" +
	  						"<math>" +
		  						"<mo>-</mo>" +
		  						"<mo>+</mo>" +
	  						"</math>" +
  						"</line></root>");
  				model.mode = "mathml";
  				var line = model.getLineAt(0);
  				model.anchor.node = line.firstChild.firstChild;
  				model.anchor.offset = 1;
  				model.path = [];
  				model.path.push({nodeName:"root"});
  				model.path.push({nodeName:"line", offset:1});
  				model.path.push({nodeName:"math", offset:1});
  				model.path.push({nodeName:"mo", offset:1});
  				model.setData({data:"1"});
  				// 光标的位置保持不变，依然停留在mo的前面，但是输入的值追加在mn最后
  				t.is("/root/line[1]/math[1]/mn[2]", model.getPath());
  				var focusNode = model.getFocusNode();
  				t.is("mn", focusNode.nodeName);
  				t.is(1, model.getOffset());
  				t.is("1", focusNode.textContent);
  				t.is(3, focusNode.parentNode.childNodes.length);
  			},
  			tearDown: function(){
  				
  			}
	    },{
	    	name: "在mo和mo之间插入数字，光标在第二个mo的前面",
  			setUp: function(){
  				this.model = new Model({});
  			},
  			runTest: function(t){
  				var model = this.model;
  				model.loadData("<root><line>" +
	  						"<math>" +
		  						"<mo>-</mo>" +
		  						"<mo>+</mo>" +
	  						"</math>" +
  						"</line></root>");
  				model.mode = "mathml";
  				var line = model.getLineAt(0);
  				model.anchor.node = line.firstChild.lastChild;
  				model.anchor.offset = 0;
  				model.path = [];
  				model.path.push({nodeName:"root"});
  				model.path.push({nodeName:"line", offset:1});
  				model.path.push({nodeName:"math", offset:1});
  				model.path.push({nodeName:"mo", offset:2});
  				model.setData({data:"1"});
  				// 光标的位置保持不变，依然停留在mo的前面，但是输入的值追加在mn最后
  				t.is("/root/line[1]/math[1]/mo[3]", model.getPath());
  				var focusNode = model.getFocusNode();
  				t.is("mo", focusNode.nodeName);
  				t.is(0, model.getOffset());
  				t.is("1", focusNode.previousSibling.textContent);
  				t.is(3, focusNode.parentNode.childNodes.length);
  			},
  			tearDown: function(){
  				
  			}
	    },{
	    	name: "在layout节点之后插入数字，layout没有被mstyle封装",
  			setUp: function(){
  				this.model = new Model({});
  			},
  			runTest: function(t){
  				var model = this.model;
  				model.loadData("<root><line>" +
	  						"<math>" +
		  						"<mfrac></mfrac>" +
	  						"</math>" +
  						"</line></root>");
  				model.mode = "mathml";
  				var line = model.getLineAt(0);
  				model.anchor.node = line.firstChild.firstChild;
  				model.anchor.offset = 1;
  				model.path = [];
  				model.path.push({nodeName:"root"});
  				model.path.push({nodeName:"line", offset:1});
  				model.path.push({nodeName:"math", offset:1});
  				model.path.push({nodeName:"mo", offset:2});
  				model.setData({data:"1"});
  				// 光标的位置保持不变，依然停留在mo的前面，但是输入的值追加在mn最后
  				t.is("/root/line[1]/math[1]/mo[3]", model.getPath());
  				var focusNode = model.getFocusNode();
  				t.is("mo", focusNode.nodeName);
  				t.is(0, model.getOffset());
  				t.is("1", focusNode.previousSibling.textContent);
  				t.is(3, focusNode.parentNode.childNodes.length);
  			},
  			tearDown: function(){
  				
  			}
	    },{
	    	name: "在layout节点之后插入数字，layout被mstyle封装",
  			setUp: function(){
  				this.model = new Model({});
  			},
  			runTest: function(t){
  				var model = this.model;
  				model.loadData("<root><line>" +
	  						"<math>" +
		  						"<mo>-</mo>" +
		  						"<mo>+</mo>" +
	  						"</math>" +
  						"</line></root>");
  				model.mode = "mathml";
  				var line = model.getLineAt(0);
  				model.anchor.node = line.firstChild.lastChild;
  				model.anchor.offset = 0;
  				model.path = [];
  				model.path.push({nodeName:"root"});
  				model.path.push({nodeName:"line", offset:1});
  				model.path.push({nodeName:"math", offset:1});
  				model.path.push({nodeName:"mo", offset:2});
  				model.setData({data:"1"});
  				// 光标的位置保持不变，依然停留在mo的前面，但是输入的值追加在mn最后
  				t.is("/root/line[1]/math[1]/mo[3]", model.getPath());
  				var focusNode = model.getFocusNode();
  				t.is("mo", focusNode.nodeName);
  				t.is(0, model.getOffset());
  				t.is("1", focusNode.previousSibling.textContent);
  				t.is(3, focusNode.parentNode.childNodes.length);
  			},
  			tearDown: function(){
  				
  			}
	    }
	    // 在节点之前插入数字
	    
	                             
	]);
});