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
	
	doh.register("Model.setData.mo 操作符",[
	    {
	    	name: "mathml模式下，在空的model中插入多个 +",
  			setUp: function(){
  				this.model = new Model({});
  				this.model.toMathMLMode();
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
  				model.toMathMLMode();
  				testSupportOperator(t, model, "+");
  				model.clear();
  				// 减号
  				model.toMathMLMode();
  				testSupportOperator(t, model, "-");
  				model.clear();
  				// 乘号
  				model.toMathMLMode();
  				testSupportOperator(t, model, "&#xD7;");
  				model.clear();
  				// 除号 
  				model.toMathMLMode();
  				testSupportOperator(t, model, "&#xF7;");
  				model.clear();
  				// 等号
  				model.toMathMLMode();
  				testSupportOperator(t, model, "=");
  				model.clear();
  				
  				// 比较运算符
  				// 两者相等
  				// 这个比较特殊，用户可能先输入一个=，然后再输入一个=，这个时候要合并为一个==
  				// 		一次性输入==
  				model.toMathMLMode();
  				testSupportOperator(t, model, "==");
  				model.clear();
  				
  				//		输入两个=
  				model.toMathMLMode();
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
  				model.toMathMLMode();
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
  				model.toMathMLMode();
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
  				model.toMathMLMode();
  				testSupportOperator(t, model, ">");
  				model.clear();
  				// <
  				model.toMathMLMode();
  				testSupportOperator(t, model, "<");
  				model.clear();
	  			// 大于等于
  				model.toMathMLMode();
  				testSupportOperator(t, model, "&#x2A7E;");
  				model.clear();
	  			// 远大于
  				model.toMathMLMode();
  				testSupportOperator(t, model, "&#x226B;");
  				model.clear();
	  			// 小于等于
  				model.toMathMLMode();
  				testSupportOperator(t, model, "&#x2A7D;");
  				model.clear();
	  			// 远小于
  				model.toMathMLMode();
  				testSupportOperator(t, model, "&#x226A;");
  				model.clear();
	  			// 不等于
  				model.toMathMLMode();
  				testSupportOperator(t, model, "&#x2260;");
  				model.clear();
	  			// 约等于
  				model.toMathMLMode();
  				testSupportOperator(t, model, "&#x2248;");
  				model.clear();
  				
  				// !=
  				//		一次性输入
  				model.toMathMLMode();
  				testSupportOperator(t, model, "!=");
  				model.clear();
  				
  				//  	分两次输入
  				model.toMathMLMode();
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
  				model.toMathMLMode();
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
  				model.toMathMLMode();
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
  				model.toMathMLMode();
  				model.setData({data:"+"});
  				t.is("/root/line[1]/math[2]/mo[1]", model.getPath());
  				var focusNode = model.getFocusNode();
  				t.is(focusNode.nodeName, "mo");
  				t.is(1, model.getOffset());
  				t.is(2, model.getLineAt(0).childNodes.length);
  			},
  			tearDown: function(){
  				
  			}
  		},{
	    	name: "在mn中间插入mo节点",
  			setUp: function(){
  				this.model = new Model({});
  			},
  			runTest: function(t){
  				var model = this.model;
  				model.loadData("<root><line>" +
	  						"<math>" +
		  						"<mn>12</mn>" +
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
  				model.path.push({nodeName:"mn", offset:1});
  				model.setData({data:"+"});
  				// 光标的位置保持不变，依然停留在mo的前面，但是输入的值追加在mn最后
  				t.is("/root/line[1]/math[1]/mo[2]", model.getPath());
  				var focusNode = model.getFocusNode();
  				t.is("mo", focusNode.nodeName);
  				t.is(1, model.getOffset());
  				t.is("+", focusNode.textContent);
  				t.is(3, focusNode.parentNode.childNodes.length);
  				t.is("1", focusNode.previousSibling.textContent);
  				t.is("2", focusNode.nextSibling.textContent);
  			},
  			tearDown: function(){
  				
  			}
	    },{
	    	name: "在mn前插入mo节点",
  			setUp: function(){
  				this.model = new Model({});
  			},
  			runTest: function(t){
  				var model = this.model;
  				model.loadData("<root><line>" +
	  						"<math>" +
		  						"<mn>12</mn>" +
	  						"</math>" +
  						"</line></root>");
  				model.mode = "mathml";
  				var line = model.getLineAt(0);
  				model.anchor.node = line.firstChild.firstChild;
  				model.anchor.offset = 0;
  				model.path = [];
  				model.path.push({nodeName:"root"});
  				model.path.push({nodeName:"line", offset:1});
  				model.path.push({nodeName:"math", offset:1});
  				model.path.push({nodeName:"mn", offset:1});
  				model.setData({data:"+"});
  				// 光标的位置不变
  				t.is("/root/line[1]/math[1]/mn[2]", model.getPath());
  				var focusNode = model.getFocusNode();
  				t.is("mn", focusNode.nodeName);
  				t.is(0, model.getOffset());
  				t.is("+", focusNode.previousSibling.textContent);
  				t.is(2, focusNode.parentNode.childNodes.length);
  			},
  			tearDown: function(){
  				
  			}
	    },{
	    	name: "在mn后插入mo节点",
  			setUp: function(){
  				this.model = new Model({});
  			},
  			runTest: function(t){
  				var model = this.model;
  				model.loadData("<root><line>" +
	  						"<math>" +
		  						"<mn>12</mn>" +
	  						"</math>" +
  						"</line></root>");
  				model.mode = "mathml";
  				var line = model.getLineAt(0);
  				model.anchor.node = line.firstChild.firstChild;
  				model.anchor.offset = 2;
  				model.path = [];
  				model.path.push({nodeName:"root"});
  				model.path.push({nodeName:"line", offset:1});
  				model.path.push({nodeName:"math", offset:1});
  				model.path.push({nodeName:"mn", offset:1});
  				model.setData({data:"+"});
  				t.is("/root/line[1]/math[1]/mo[2]", model.getPath());
  				var focusNode = model.getFocusNode();
  				t.is("mo", focusNode.nodeName);
  				t.is(1, model.getOffset());
  				t.is("+", focusNode.textContent);
  				t.is(2, focusNode.parentNode.childNodes.length);
  				t.is("12", focusNode.previousSibling.textContent);
  			},
  			tearDown: function(){
  				
  			}
	    },{
	    	name: "在没有被mstyle封装的layout节点后插入mo节点",
  			setUp: function(){
  				this.model = new Model({});
  			},
  			runTest: function(t){
  				var model = this.model;
  				model.loadData("<root><line>" +
	  						"<math>" +
		  						"<mfrac><mrow><mn></mn></mrow><mrow><mn></mn></mrow></mfrac>" +
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
  				model.path.push({nodeName:"mfrac", offset:1});
  				model.setData({data:"+"});
  				t.is("/root/line[1]/math[1]/mo[2]", model.getPath());
  				var focusNode = model.getFocusNode();
  				t.is("mo", focusNode.nodeName);
  				t.is(1, model.getOffset());
  				t.is("+", focusNode.textContent);
  				t.is(2, focusNode.parentNode.childNodes.length);
  				// 确保mo是mstyle的兄弟节点
  				t.is(focusNode, line.firstChild.lastChild);
  			},
  			tearDown: function(){
  				
  			}
	    },{
	    	name: "在被mstyle封装的layout节点后插入mo节点",
  			setUp: function(){
  				this.model = new Model({});
  			},
  			runTest: function(t){
  				var model = this.model;
  				model.loadData("<root><line>" +
	  						"<math>" +
		  						"<mstyle><mfrac><mrow><mn></mn></mrow><mrow><mn></mn></mrow></mfrac></mstyle>" +
	  						"</math>" +
  						"</line></root>");
  				model.mode = "mathml";
  				var line = model.getLineAt(0);
  				model.anchor.node = line.firstChild.firstChild.firstChild;
  				model.anchor.offset = 1;
  				model.path = [];
  				model.path.push({nodeName:"root"});
  				model.path.push({nodeName:"line", offset:1});
  				model.path.push({nodeName:"math", offset:1});
  				model.path.push({nodeName:"mfrac", offset:1});
  				model.setData({data:"+"});
  				t.is("/root/line[1]/math[1]/mo[2]", model.getPath());
  				var focusNode = model.getFocusNode();
  				t.is("mo", focusNode.nodeName);
  				t.is(1, model.getOffset());
  				t.is("+", focusNode.textContent);
  				t.is(2, focusNode.parentNode.childNodes.length);
  				// 确保mo是mstyle的兄弟节点
  				t.is(focusNode, line.firstChild.lastChild);
  			},
  			tearDown: function(){
  				
  			}
	    },{
	    	name: "在没有被mstyle封装的layout节点前插入mo节点",
  			setUp: function(){
  				this.model = new Model({});
  			},
  			runTest: function(t){
  				var model = this.model;
  				model.loadData("<root><line>" +
	  						"<math>" +
		  						"<mfrac><mrow><mn></mn></mrow><mrow><mn></mn></mrow></mfrac>" +
	  						"</math>" +
  						"</line></root>");
  				model.mode = "mathml";
  				var line = model.getLineAt(0);
  				model.anchor.node = line.firstChild.firstChild;
  				model.anchor.offset = 0;
  				model.path = [];
  				model.path.push({nodeName:"root"});
  				model.path.push({nodeName:"line", offset:1});
  				model.path.push({nodeName:"math", offset:1});
  				model.path.push({nodeName:"mfrac", offset:1});
  				model.setData({data:"+"});
  				t.is("/root/line[1]/math[1]/mfrac[2]", model.getPath());
  				var focusNode = model.getFocusNode();
  				t.is("mfrac", focusNode.nodeName);
  				t.is(0, model.getOffset());
  				t.is(2, focusNode.parentNode.childElementCount);
  				t.is(focusNode, line.firstChild.firstChild.nextSibling);
  			},
  			tearDown: function(){
  				
  			}
	    },{
	    	name: "在被mstyle封装的layout节点前插入mo节点",
  			setUp: function(){
  				this.model = new Model({});
  			},
  			runTest: function(t){
  				var model = this.model;
  				model.loadData("<root><line>" +
	  						"<math>" +
		  						"<mstyle><mfrac><mrow><mn></mn></mrow><mrow><mn></mn></mrow></mfrac></mstyle>" +
	  						"</math>" +
  						"</line></root>");
  				model.mode = "mathml";
  				var line = model.getLineAt(0);
  				model.anchor.node = line.firstChild.firstChild.firstChild;
  				model.anchor.offset = 0;
  				model.path = [];
  				model.path.push({nodeName:"root"});
  				model.path.push({nodeName:"line", offset:1});
  				model.path.push({nodeName:"math", offset:1});
  				model.path.push({nodeName:"mfrac", offset:1});
  				model.setData({data:"+"});
  				t.is("/root/line[1]/math[1]/mfrac[2]", model.getPath());
  				var focusNode = model.getFocusNode();
  				t.is("mfrac", focusNode.nodeName);
  				t.is(0, model.getOffset());
  				t.is(2, focusNode.parentNode.parentNode.childElementCount);
  				t.is(focusNode, line.firstChild.firstChild.nextSibling.firstChild);
  			},
  			tearDown: function(){
  				
  			}
	    }
	   
	                             
	]);
});