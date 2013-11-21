// 输入英文字母
define([ "intern!tdd", 
         "intern/chai!assert", 
         "dojo/aspect", 
         "mathEditor/Model",
         "mathEditor/lang" ], function(
        		 tdd,
        		 assert,
        		 aspect,
        		 Model,
        		 dripLang) {
	
	// 现在的逻辑改为，如果在一个节点之前插入一个新节点，则光标的位置保持不变，即还是在原来节点之前，而不是调整到新节点之后。
	// FIXME:到底是选哪种好呢？
	
	with(tdd){
		suite("Model.setData.mi 输入变量", function(){
			
			var model = null;
			beforeEach(function () {
				model = new Model({});
			});
			
			/********************mathml模式下*******************/
			test("mathml模式下，在空的model中输入一个英文字母", function(){
				model.toMathMLMode();
				model.setData({data:"x"});
				assert.equal("/root/line[1]/math[1]/mi[1]", model.getPath());
				var focusNode = model.getFocusNode();
				assert.equal("mi", focusNode.nodeName);
				assert.equal("x", dripLang.getText(focusNode));
				assert.equal(1, model.getOffset());
			});
			
			test("mathml模式下，在空的model中输入一个字母之后，再输入一个字母", function(){
				model.toMathMLMode();
				model.setData({data:"x"});
				model.setData({data:"y"});
				assert.equal("/root/line[1]/math[1]/mi[2]", model.getPath());
				var focusNode = model.getFocusNode();
				assert.equal("mi", focusNode.nodeName);
				assert.equal("y", dripLang.getText(focusNode));
				assert.equal(1, model.getOffset());
				
				var previous = focusNode.previousSibling;
				assert.equal("mi", previous.nodeName);
				assert.equal("x", dripLang.getText(previous));
			});
			
			test("mathml模式下，在空的model中输入一个字母之后，然后在这个字母前输入一个字母", function(){
				model.toMathMLMode();
				model.setData({data:"x"});
				model.anchor.offset--;
				model.setData({data:"y"});
				assert.equal("/root/line[1]/math[1]/mi[2]", model.getPath());
				// 现在的逻辑改为，如果在一个节点之前插入一个新节点，则光标的位置保持不变，即还是在原来节点之前，而不是调整到新节点之后。
				// FIXME:到底是选哪种好呢？
				var focusNode = model.getFocusNode();
				assert.equal("mi", focusNode.nodeName);
				assert.equal("x", dripLang.getText(focusNode));
				assert.equal(0, model.getOffset());
				
				var previous = focusNode.previousSibling;
				assert.equal("mi", previous.nodeName);
				assert.equal("y", dripLang.getText(previous));
			});
			
			test("mathml模式下，在空的model中输入两个字母，然后在两个字母中间输入一个字母", function(){
				model.toMathMLMode();
				model.setData({data:"x"});
				model.setData({data:"y"});
				model.anchor.offset--;
				model.setData({data:"z"});
				assert.equal("/root/line[1]/math[1]/mi[3]", model.getPath());
				var focusNode = model.getFocusNode();
				assert.equal("mi", focusNode.nodeName);
				assert.equal("y", dripLang.getText(focusNode));
				assert.equal(0, model.getOffset());
				
				var previous = focusNode.previousSibling;
				assert.equal("mi", previous.nodeName);
				assert.equal("z", dripLang.getText(previous));
				
				var next = focusNode.previousSibling.previousSibling;
				assert.equal("mi", next.nodeName);
				assert.equal("x", dripLang.getText(next));
			});
			
			test("在mn中间插入mi节点", function(){
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
				model.setData({data:"x"});
				// 光标的位置保持不变，依然停留在mo的前面，但是输入的值追加在mn最后
				assert.equal("/root/line[1]/math[1]/mi[2]", model.getPath());
				var focusNode = model.getFocusNode();
				assert.equal("mi", focusNode.nodeName);
				assert.equal(1, model.getOffset());
				assert.equal("x", dripLang.getText(focusNode));
				assert.equal(3, focusNode.parentNode.childNodes.length);
				assert.equal("1", dripLang.getText(focusNode.previousSibling));
				assert.equal("2", dripLang.getText(focusNode.nextSibling));
			});
			
			test("在mn前面追加mi节点", function(){
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
				model.setData({data:"x"});
				// 光标的位置保持不变，依然停留在mo的前面
				assert.equal("/root/line[1]/math[1]/mn[2]", model.getPath());
				var focusNode = model.getFocusNode();
				assert.equal("mn", focusNode.nodeName);
				assert.equal(0, model.getOffset());
				assert.equal("x", dripLang.getText(focusNode.previousSibling));
				assert.equal(2, focusNode.parentNode.childNodes.length);
				assert.equal("12", dripLang.getText(focusNode));
			});
			
			test("在mn后面追加mi节点", function(){
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
				model.setData({data:"x"});
				// 光标的位置保持不变，依然停留在mo的前面，但是输入的值追加在mn最后
				assert.equal("/root/line[1]/math[1]/mi[2]", model.getPath());
				var focusNode = model.getFocusNode();
				assert.equal("mi", focusNode.nodeName);
				assert.equal(1, model.getOffset());
				assert.equal("x", dripLang.getText(focusNode));
				assert.equal(2, focusNode.parentNode.childNodes.length);
				assert.equal("12", dripLang.getText(focusNode.previousSibling));
			});
			
			test("在layout节点之后插入变量，layout没有被mstyle封装", function(){
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
				model.setData({data:"x"});
				assert.equal("/root/line[1]/math[1]/mi[2]", model.getPath());
				var focusNode = model.getFocusNode();
				assert.equal("mi", focusNode.nodeName);
				assert.equal(1, model.getOffset());
				assert.equal("x", dripLang.getText(focusNode));
				assert.equal(2, dripLang.getChildLength(focusNode.parentNode));
			});
			
			test("在layout节点之后插入变量，layout被mstyle封装", function(){
				model.loadData("<root><line>" +
  						"<math>" +
	  						"<mstyle><mfrac></mfrac></mstyle>" +
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
				model.setData({data:"x"});
				assert.equal("/root/line[1]/math[1]/mi[2]", model.getPath());
				var focusNode = model.getFocusNode();
				assert.equal("mi", focusNode.nodeName);
				assert.equal(1, model.getOffset());
				assert.equal("x", dripLang.getText(focusNode));
				assert.equal(2, dripLang.getChildLength(line.firstChild));
			});
			
			test("在layout节点之前插入变量，layout没有被mstyle封装", function(){
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
				model.setData({data:"x"});
				assert.equal("/root/line[1]/math[1]/mfrac[2]", model.getPath());
				var focusNode = model.getFocusNode();
				assert.equal("mfrac", focusNode.nodeName);
				assert.equal(0, model.getOffset());
				assert.equal(2, dripLang.getChildLength(line.firstChild));
				assert.equal(focusNode, line.firstChild.firstChild.nextSibling);
			});
			
			test("在layout节点之前插入变量，layout被mstyle封装", function(){
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
				model.setData({data:"x"});
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