define([ "intern!tdd", 
         "intern/chai!assert",
         "mathEditor/Model",
         "mathEditor/lang" ], function(
        		 tdd,
        		 assert,
        		 Model,
        		 dripLang) {

	with(tdd){
		suite("Model.setData.mn number-输入数字", function(){
			
			var model = null;
			beforeEach(function () {
				model = new Model({});
			});
			
			test("mathml模式下,在空的model中输入一个数字", function(){
				model.toMathMLMode();
				model.setData({data:"1"});
  				
  				var focusNode = model.getFocusNode();
  				
  				assert.equal("/root/line[1]/math[1]/mn[1]", model.getPath());
  				assert.equal("mn", model.getFocusNode().nodeName);
  				assert.equal(1, model.getOffset());
  				assert.equal("1", dripLang.getText(focusNode));
			});
			
			test("mathml模式,在空的model中输入一个数字，然后再输入一个数字", function(){
				model.toMathMLMode();
				model.setData({data:"1"});
  				model.setData({data:"2"});
  				
  				var focusNode = model.getFocusNode();
  				
  				assert.equal("/root/line[1]/math[1]/mn[1]", model.getPath());
  				assert.equal("mn", focusNode.nodeName);
  				assert.equal(2, model.getOffset());
  				assert.equal("12", dripLang.getText(focusNode));
			});
			
			test("mathml模式,在空的model中一次性输入两个数字", function(){
				model.toMathMLMode();
  				model.setData({data:"12"});
  				
  				var focusNode = model.getFocusNode();
  				
  				assert.equal("/root/line[1]/math[1]/mn[1]", model.getPath());
  				assert.equal("mn", focusNode.nodeName);
  				assert.equal(2, model.getOffset());
  				assert.equal("12", dripLang.getText(focusNode));
			});
			
			test("mathml模式,在两个数字的中间输入数字", function(){
				model.toMathMLMode();
	    		model.setData({data:"12"});
	    		// model中通过什么标识当前光标的位置，或者可插入字符的位置,目前使用anchor定义这个概念。
	    		// 获取需要在model中提取出一个选择区域的概念，在选择区域中存储选择区域的位置与当前光标的位置
	    		// 这样在后面的测试中就可以通过调整选择区域中的值，在改变字符的插入位置
	    		// 这样这个测试用例才能快速的写出来，不需要借助与moveLeft()重量级方法。
	    		model.anchor.offset--;
	    		model.setData({data:"3"});// 虽然是数字，但是data类型只能传入字符串。
	    		assert.equal("/root/line[1]/math[1]/mn[1]", model.getPath());
	    		var focusNode = model.getFocusNode();
  				assert.equal("mn", focusNode.nodeName);
  				assert.equal(2, model.getOffset());
  				assert.equal("132", dripLang.getText(focusNode));
			});
			
			test("mathml模式,在一个数字前面输入数字", function(){
				model.toMathMLMode();
	    		model.setData({data:"1"});
	    		
	    		model.anchor.offset--;
	    		model.setData({data:"2"});
	    		assert.equal("/root/line[1]/math[1]/mn[1]", model.getPath());
	    		var focusNode = model.getFocusNode();
  				assert.equal("mn", focusNode.nodeName);
  				assert.equal(1, model.getOffset());
  				assert.equal("21", dripLang.getText(focusNode));
			});
			
			test("在mn和mo之间插入数字，光标在mo的最前面", function(){
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
				assert.equal("/root/line[1]/math[1]/mo[2]", model.getPath());
				var focusNode = model.getFocusNode();
				assert.equal("mo", focusNode.nodeName);
				assert.equal(0, model.getOffset());
				assert.equal("123", dripLang.getText(focusNode.previousSibling));
			});
			
			test("在mo和mn之间插入数字，光标在mo的最后面", function(){
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
				assert.equal("/root/line[1]/math[1]/mo[1]", model.getPath());
				var focusNode = model.getFocusNode();
				assert.equal("mo", focusNode.nodeName);
				assert.equal(1, model.getOffset());
				assert.equal("123", dripLang.getText(focusNode.nextSibling));
			});
			
			test("在mo和mo之间插入数字，光标在第一个mo的后面", function(){
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
				assert.equal("/root/line[1]/math[1]/mn[2]", model.getPath());
				var focusNode = model.getFocusNode();
				assert.equal("mn", focusNode.nodeName);
				assert.equal(1, model.getOffset());
				assert.equal("1", dripLang.getText(focusNode));
				assert.equal(3, focusNode.parentNode.childNodes.length);
			});
			
			test("在mo和mo之间插入数字，光标在第二个mo的前面", function(){
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
				assert.equal("/root/line[1]/math[1]/mo[3]", model.getPath());
				var focusNode = model.getFocusNode();
				assert.equal("mo", focusNode.nodeName);
				assert.equal(0, model.getOffset());
				assert.equal("1", dripLang.getText(focusNode.previousSibling));
				assert.equal(3, focusNode.parentNode.childNodes.length);
			});
			
			test("在layout节点之后插入数字，layout没有被mstyle封装", function(){
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
				model.path.push({nodeName:"mfrac", offset:1});
				model.setData({data:"1"});
				assert.equal("/root/line[1]/math[1]/mn[2]", model.getPath());
				var focusNode = model.getFocusNode();
				assert.equal("mn", focusNode.nodeName);
				assert.equal(1, model.getOffset());
				assert.equal("1", dripLang.getText(focusNode));
				assert.equal(2, dripLang.getChildLength(focusNode.parentNode));
			});
			
			test("在layout节点之后插入数字，layout被mstyle封装,layout是mfrac", function(){
				model.loadData("<root><line>" +
  						"<math>" +
	  						"<mstyle><mfrac><mrow><mn>1</mn></mrow><mrow><mn>2</mn></mrow></mfrac></mstyle>" +
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
				model.setData({data:"1"});
				assert.equal("/root/line[1]/math[1]/mn[2]", model.getPath());
				var focusNode = model.getFocusNode();
				assert.equal("mn", focusNode.nodeName);
				assert.equal(1, model.getOffset());
				assert.equal("1", dripLang.getText(focusNode));
				assert.equal(2, dripLang.getChildLength(line.firstChild));
			});
			
			test("在layout节点之后插入数字，layout被mstyle封装,layout是msqrt", function(){
				model.loadData("<root><line>" +
  						"<math>" +
	  						"<mstyle><msqrt><mrow><mn>1</mn></mrow><mrow><mn>2</mn></mrow></msqrt></mstyle>" +
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
				model.path.push({nodeName:"msqrt", offset:1});
				model.setData({data:"1"});
				assert.equal("/root/line[1]/math[1]/mn[2]", model.getPath());
				var focusNode = model.getFocusNode();
				assert.equal("mn", focusNode.nodeName);
				assert.equal(1, model.getOffset());
				assert.equal("1", dripLang.getText(focusNode));
				assert.equal(2, dripLang.getChildLength(line.firstChild));
			});
			
			test("在layout节点之前插入数字，layout没有被mstyle封装", function(){
				model.loadData("<root><line>" +
  						"<math>" +
	  						"<mfrac></mfrac>" +
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
				model.setData({data:"1"});
				assert.equal("/root/line[1]/math[1]/mfrac[2]", model.getPath());
				var focusNode = model.getFocusNode();
				assert.equal("mfrac", focusNode.nodeName);
				assert.equal(0, model.getOffset());
				assert.equal(2, dripLang.getChildLength(line.firstChild));
				assert.equal(focusNode, line.firstChild.firstChild.nextSibling);
			});
			
			test("在layout节点之前插入数字，layout被mstyle封装", function(){
				model.loadData("<root><line>" +
  						"<math>" +
	  						"<mstyle><mfrac></mfrac></mstyle>" +
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
				model.setData({data:"1"});
				assert.equal("/root/line[1]/math[1]/mfrac[2]", model.getPath());
  				var focusNode = model.getFocusNode();
  				assert.equal("mfrac", focusNode.nodeName);
  				assert.equal(0, model.getOffset());
  				assert.equal(2, dripLang.getChildLength(line.firstChild));
  				assert.equal(focusNode, line.firstChild.firstChild.nextSibling.firstChild);
			});
		});
	}
	
});