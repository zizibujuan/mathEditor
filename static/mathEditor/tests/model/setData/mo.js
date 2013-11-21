define([ "intern!tdd", 
         "intern/chai!assert",
         "mathEditor/Model",
         "mathEditor/lang" ], function(
        		 tdd,
        		 assert,
        		 Model,
        		 dripLang) {

	
	
	with(tdd){
		suite("Model.setData.mo 操作符", function(){
			
			var model = null;
			beforeEach(function () {
				model = new Model({});
			});
			
			function testSupportOperator(model, operator){
				// summary:
				//		只是用来测试是否支持某个操作符
				model.setData({data:operator});
				assert.equal("/root/line[1]/math[1]/mo[1]", model.getPath());
				var focusNode = model.getFocusNode();
				assert.equal(focusNode.nodeName, "mo");
				assert.equal(operator, dripLang.getText(focusNode));
				assert.equal(1, model.getOffset());
			}
			
			test("mathml模式下，在空的model中插入多个 +", function(){
				model.toMathMLMode();
  				model.setData({data:"+"});
  				model.setData({data:"+"});
  				assert.equal("/root/line[1]/math[1]/mo[2]", model.getPath());
  				var focusNode = model.getFocusNode();
  				assert.equal(focusNode.nodeName, "mo");
  				assert.equal("+", dripLang.getText(focusNode));
  				assert.equal(1, model.getOffset());
  				
  				// 判断有两个mo节点
  				assert.equal(2, focusNode.parentNode.childNodes.length);
			});
			
			test("mathml模式，在空的model中，判断是否支持输入以下符号，包括Unicode操作符", function(){
				// 加号
  				model.toMathMLMode();
  				testSupportOperator(model, "+");
  				model.clear();
  				// 减号
  				model.toMathMLMode();
  				testSupportOperator(model, "-");
  				model.clear();
  				// 乘号
  				model.toMathMLMode();
  				testSupportOperator(model, "&#xD7;");
  				model.clear();
  				// 除号 
  				model.toMathMLMode();
  				testSupportOperator(model, "&#xF7;");
  				model.clear();
  				// 等号
  				model.toMathMLMode();
  				testSupportOperator(model, "=");
  				model.clear();
  				
  				// 比较运算符
  				// 两者相等
  				// 这个比较特殊，用户可能先输入一个=，然后再输入一个=，这个时候要合并为一个==
  				// 		一次性输入==
  				model.toMathMLMode();
  				testSupportOperator(model, "==");
  				model.clear();
  				
  				//		输入两个=
  				model.toMathMLMode();
  				model.setData({data:"="});
  				model.setData({data:"="});
  				assert.equal("/root/line[1]/math[1]/mo[1]", model.getPath());
  				var focusNode = model.getFocusNode();
  				assert.equal(focusNode.nodeName, "mo");
  				assert.equal("==", dripLang.getText(focusNode));
  				assert.equal(1, model.getOffset());
  				assert.equal(1, focusNode.parentNode.childNodes.length);
  				model.clear();
  				
  				//  	输入三个=
  				model.toMathMLMode();
  				model.setData({data:"="});
  				model.setData({data:"="});
  				model.setData({data:"="});
  				assert.equal("/root/line[1]/math[1]/mo[2]", model.getPath());
  				var focusNode = model.getFocusNode();
  				assert.equal(focusNode.nodeName, "mo");
  				assert.equal("=", dripLang.getText(focusNode));
  				assert.equal(1, model.getOffset());
  				assert.equal(2, focusNode.parentNode.childNodes.length);
  				model.clear();
  				//  	输入四个=
  				model.toMathMLMode();
  				model.setData({data:"="});
  				model.setData({data:"="});
  				model.setData({data:"="});
  				model.setData({data:"="});
  				assert.equal("/root/line[1]/math[1]/mo[2]", model.getPath());
  				var focusNode = model.getFocusNode();
  				assert.equal(focusNode.nodeName, "mo");
  				assert.equal("==", dripLang.getText(focusNode));
  				assert.equal(1, model.getOffset());
  				assert.equal(2, focusNode.parentNode.childNodes.length);
  				model.clear();
  				
  				
  				// >
  				model.toMathMLMode();
  				testSupportOperator(model, ">");
  				model.clear();
  				// <
  				model.toMathMLMode();
  				testSupportOperator(model, "<");
  				model.clear();
	  			// 大于等于
  				model.toMathMLMode();
  				testSupportOperator(model, "&#x2A7E;");
  				model.clear();
	  			// 远大于
  				model.toMathMLMode();
  				testSupportOperator(model, "&#x226B;");
  				model.clear();
	  			// 小于等于
  				model.toMathMLMode();
  				testSupportOperator(model, "&#x2A7D;");
  				model.clear();
	  			// 远小于
  				model.toMathMLMode();
  				testSupportOperator(model, "&#x226A;");
  				model.clear();
	  			// 不等于
  				model.toMathMLMode();
  				testSupportOperator(model, "&#x2260;");
  				model.clear();
	  			// 约等于
  				model.toMathMLMode();
  				testSupportOperator(model, "&#x2248;");
  				model.clear();
  				
  				// !=
  				//		一次性输入
  				model.toMathMLMode();
  				testSupportOperator(model, "!=");
  				model.clear();
  				
  				//  	分两次输入
  				model.toMathMLMode();
  				model.setData({data:"!"});
  				model.setData({data:"="});
  				assert.equal("/root/line[1]/math[1]/mo[1]", model.getPath());
  				var focusNode = model.getFocusNode();
  				assert.equal(focusNode.nodeName, "mo");
  				assert.equal("!=", dripLang.getText(focusNode));
  				assert.equal(1, model.getOffset());
  				assert.equal(1, focusNode.parentNode.childNodes.length);
  				model.clear();
  				
  				//  	输入!==
  				model.toMathMLMode();
  				model.setData({data:"!"});
  				model.setData({data:"="});
  				model.setData({data:"="});
  				assert.equal("/root/line[1]/math[1]/mo[2]", model.getPath());
  				var focusNode = model.getFocusNode();
  				assert.equal(focusNode.nodeName, "mo");
  				assert.equal("=", dripLang.getText(focusNode));
  				assert.equal(1, model.getOffset());
  				assert.equal(2, focusNode.parentNode.childNodes.length);
  				model.clear();
  				//  	输入!=!=
  				model.toMathMLMode();
  				model.setData({data:"!"});
  				model.setData({data:"="});
  				model.setData({data:"!"});
  				model.setData({data:"="});
  				assert.equal("/root/line[1]/math[1]/mo[2]", model.getPath());
  				var focusNode = model.getFocusNode();
  				assert.equal(focusNode.nodeName, "mo");
  				assert.equal("!=", dripLang.getText(focusNode));
  				assert.equal(1, model.getOffset());
  				assert.equal(2, focusNode.parentNode.childNodes.length);
  				model.clear();
			});
			
			/*********************以下是操作符与其他字符混合输入的测试用例************************/
			test("在已有一个中文字符的model中添加操作符+", function(){
				// 如果是中文，则放在text节点中
  				model.setData({data:"中"});
  				model.toMathMLMode();
  				model.setData({data:"+"});
  				assert.equal("/root/line[1]/math[2]/mo[1]", model.getPath());
  				var focusNode = model.getFocusNode();
  				assert.equal(focusNode.nodeName, "mo");
  				assert.equal(1, model.getOffset());
  				assert.equal(2, model.getLineAt(0).childNodes.length);
			});
			
			test("在mn中间插入mo节点", function(){
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
				assert.equal("/root/line[1]/math[1]/mo[2]", model.getPath());
				var focusNode = model.getFocusNode();
				assert.equal("mo", focusNode.nodeName);
				assert.equal(1, model.getOffset());
				assert.equal("+", dripLang.getText(focusNode));
				assert.equal(3, focusNode.parentNode.childNodes.length);
				assert.equal("1", dripLang.getText(focusNode.previousSibling));
				assert.equal("2", dripLang.getText(focusNode.nextSibling));
			});
			
			test("在mn前插入mo节点", function(){
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
				assert.equal("/root/line[1]/math[1]/mn[2]", model.getPath());
				var focusNode = model.getFocusNode();
				assert.equal("mn", focusNode.nodeName);
				assert.equal(0, model.getOffset());
				assert.equal("+", dripLang.getText(focusNode.previousSibling));
				assert.equal(2, focusNode.parentNode.childNodes.length);
			});
			
			test("在mn后插入mo节点", function(){
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
				assert.equal("/root/line[1]/math[1]/mo[2]", model.getPath());
				var focusNode = model.getFocusNode();
				assert.equal("mo", focusNode.nodeName);
				assert.equal(1, model.getOffset());
				assert.equal("+", dripLang.getText(focusNode));
				assert.equal(2, focusNode.parentNode.childNodes.length);
				assert.equal("12", dripLang.getText(focusNode.previousSibling));
			});
			
			test("在没有被mstyle封装的layout节点后插入mo节点", function(){
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
				assert.equal("/root/line[1]/math[1]/mo[2]", model.getPath());
				var focusNode = model.getFocusNode();
				assert.equal("mo", focusNode.nodeName);
				assert.equal(1, model.getOffset());
				assert.equal("+", dripLang.getText(focusNode));
				assert.equal(2, focusNode.parentNode.childNodes.length);
				// 确保mo是mstyle的兄弟节点
				assert.equal(focusNode, line.firstChild.lastChild);
			});
			
			test("在被mstyle封装的layout节点后插入mo节点", function(){
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
				assert.equal("/root/line[1]/math[1]/mo[2]", model.getPath());
				var focusNode = model.getFocusNode();
				assert.equal("mo", focusNode.nodeName);
				assert.equal(1, model.getOffset());
				assert.equal("+", dripLang.getText(focusNode));
				assert.equal(2, focusNode.parentNode.childNodes.length);
				// 确保mo是mstyle的兄弟节点
				assert.equal(focusNode, line.firstChild.lastChild);
			});
			
			test("在没有被mstyle封装的layout节点前插入mo节点", function(){
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
				assert.equal("/root/line[1]/math[1]/mfrac[2]", model.getPath());
				var focusNode = model.getFocusNode();
				assert.equal("mfrac", focusNode.nodeName);
				assert.equal(0, model.getOffset());
				assert.equal(2, dripLang.getChildLength(focusNode.parentNode));
				assert.equal(focusNode, line.firstChild.firstChild.nextSibling);
			});
			
			test("在被mstyle封装的layout节点前插入mo节点", function(){
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
				assert.equal("/root/line[1]/math[1]/mfrac[2]", model.getPath());
				var focusNode = model.getFocusNode();
				assert.equal("mfrac", focusNode.nodeName);
				assert.equal(0, model.getOffset());
				assert.equal(2, dripLang.getChildLength(focusNode.parentNode.parentNode));
				assert.equal(focusNode, line.firstChild.firstChild.nextSibling.firstChild);
			});
			
		});
	}
	
});