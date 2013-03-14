define([ "doh","mathEditor/Model" ], function(doh,Model) {

	function testSupportOperator(t, model, operator){
		// summary:
		//		只是用来测试是否支持某个操作符
		model.setData({data:operator});
		t.is("/root/line[1]/math[1]/mo[1]", model.getPath());
		var focusNode = model.getFocusNode();
		t.is(focusNode.nodeName, "mo");
		t.is(operator, focusNode.textContent);
		t.is(1, model.getOffset());
	}
	
	doh.register("Model.setData operator",[
	    {
	    	name: "在空的model中插入多个 +",
  			setUp: function(){
  				this.model = new Model({});
  				this.model._toMathMLMode();
  			},
  			runTest: function(t){
  				var model = this.model;
  				model.setData({data:"+"});
  				model.setData({data:"+"});
  				t.is("/root/line[1]/math[1]/mo[2]", model.getPath());
  				var focusNode = model.getFocusNode();
  				t.is(focusNode.nodeName, "mo");
  				t.is("+", focusNode.textContent);
  				t.is(1, model.getOffset());
  				
  				// 判断有两个mo节点
  				t.is(2, focusNode.parentNode.childNodes.length);
  			},
  			tearDown: function(){
  				
  			}
	    },{
  			name: "mathml模式，在空的model中，判断是否支持输入以下符号，包括Unicode操作符",
  			setUp: function(){
  				this.model = new Model({});
  			},
  			runTest: function(t){
  				var model = this.model;
  				// 加号
  				model._toMathMLMode();
  				testSupportOperator(t, model, "+");
  				model.clear();
  				// 减号
  				model._toMathMLMode();
  				testSupportOperator(t, model, "-");
  				model.clear();
  				// 乘号
  				model._toMathMLMode();
  				testSupportOperator(t, model, "&#xD7;");
  				model.clear();
  				// 除号 
  				model._toMathMLMode();
  				testSupportOperator(t, model, "&#xF7;");
  				model.clear();
  				// 等号
  				model._toMathMLMode();
  				testSupportOperator(t, model, "=");
  				model.clear();
  				
  				// 比较运算符
  				// 两者相等
  				// 这个比较特殊，用户可能先输入一个=，然后再输入一个=，这个时候要合并为一个==
  				// 		一次性输入==
  				model._toMathMLMode();
  				testSupportOperator(t, model, "==");
  				model.clear();
  				
  				//		输入两个=
  				model._toMathMLMode();
  				model.setData({data:"="});
  				model.setData({data:"="});
  				t.is("/root/line[1]/math[1]/mo[1]", model.getPath());
  				var focusNode = model.getFocusNode();
  				t.is(focusNode.nodeName, "mo");
  				t.is(focusNode.textContent, "==");
  				t.is(1, model.getOffset());
  				t.is(1, focusNode.parentNode.childNodes.length);
  				model.clear();
  				
  				//  	输入三个=
  				model._toMathMLMode();
  				model.setData({data:"="});
  				model.setData({data:"="});
  				model.setData({data:"="});
  				t.is("/root/line[1]/math[1]/mo[2]", model.getPath());
  				var focusNode = model.getFocusNode();
  				t.is(focusNode.nodeName, "mo");
  				t.is(focusNode.textContent, "=");
  				t.is(1, model.getOffset());
  				t.is(2, focusNode.parentNode.childNodes.length);
  				model.clear();
  				//  	输入四个=
  				model._toMathMLMode();
  				model.setData({data:"="});
  				model.setData({data:"="});
  				model.setData({data:"="});
  				model.setData({data:"="});
  				t.is("/root/line[1]/math[1]/mo[2]", model.getPath());
  				var focusNode = model.getFocusNode();
  				t.is(focusNode.nodeName, "mo");
  				t.is(focusNode.textContent, "==");
  				t.is(1, model.getOffset());
  				t.is(2, focusNode.parentNode.childNodes.length);
  				model.clear();
  				
  				
  				// >
  				model._toMathMLMode();
  				testSupportOperator(t, model, ">");
  				model.clear();
  				// <
  				model._toMathMLMode();
  				testSupportOperator(t, model, "<");
  				model.clear();
	  			// 大于等于
  				model._toMathMLMode();
  				testSupportOperator(t, model, "&#x2A7E;");
  				model.clear();
	  			// 远大于
  				model._toMathMLMode();
  				testSupportOperator(t, model, "&#x226B;");
  				model.clear();
	  			// 小于等于
  				model._toMathMLMode();
  				testSupportOperator(t, model, "&#x2A7D;");
  				model.clear();
	  			// 远小于
  				model._toMathMLMode();
  				testSupportOperator(t, model, "&#x226A;");
  				model.clear();
	  			// 不等于
  				model._toMathMLMode();
  				testSupportOperator(t, model, "&#x2260;");
  				model.clear();
	  			// 约等于
  				model._toMathMLMode();
  				testSupportOperator(t, model, "&#x2248;");
  				model.clear();
  				
  				// !=
  				//		一次性输入
  				model._toMathMLMode();
  				testSupportOperator(t, model, "!=");
  				model.clear();
  				
  				//  	分两次输入
  				model._toMathMLMode();
  				model.setData({data:"!"});
  				model.setData({data:"="});
  				t.is("/root/line[1]/math[1]/mo[1]", model.getPath());
  				var focusNode = model.getFocusNode();
  				t.is(focusNode.nodeName, "mo");
  				t.is(focusNode.textContent, "!=");
  				t.is(1, model.getOffset());
  				t.is(1, focusNode.parentNode.childNodes.length);
  				model.clear();
  				
  				//  	输入!==
  				model._toMathMLMode();
  				model.setData({data:"!"});
  				model.setData({data:"="});
  				model.setData({data:"="});
  				t.is("/root/line[1]/math[1]/mo[2]", model.getPath());
  				var focusNode = model.getFocusNode();
  				t.is(focusNode.nodeName, "mo");
  				t.is(focusNode.textContent, "=");
  				t.is(1, model.getOffset());
  				t.is(2, focusNode.parentNode.childNodes.length);
  				model.clear();
  				//  	输入!=!=
  				model._toMathMLMode();
  				model.setData({data:"!"});
  				model.setData({data:"="});
  				model.setData({data:"!"});
  				model.setData({data:"="});
  				t.is("/root/line[1]/math[1]/mo[2]", model.getPath());
  				var focusNode = model.getFocusNode();
  				t.is(focusNode.nodeName, "mo");
  				t.is(focusNode.textContent, "!=");
  				t.is(1, model.getOffset());
  				t.is(2, focusNode.parentNode.childNodes.length);
  				model.clear();
  			},
  			tearDown: function(){
  				
  			}
  		},
	    /*********************以下是操作符与其他字符混合输入的测试用例************************/
  		{
  			name: "在已有一个中文字符的model中添加操作符+",
  			setUp: function(){
  				this.model = new Model({});
  			},
  			runTest: function(t){
  				// 结果是在line中先加一个text节点，然后再加一个math节点
  				var model = this.model;
  				// 如果是中文，则放在text节点中
  				model.setData({data:"中"});
  				model._toMathMLMode();
  				model.setData({data:"+"});
  				t.is("/root/line[1]/math[2]/mo[1]", model.getPath());
  				var focusNode = model.getFocusNode();
  				t.is(focusNode.nodeName, "mo");
  				t.is(1, model.getOffset());
  				t.is(2, model.getLineAt(0).childNodes.length);
  			},
  			tearDown: function(){
  				
  			}
  		}
	                             
	]);
});