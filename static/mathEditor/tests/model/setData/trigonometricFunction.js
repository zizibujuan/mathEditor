// 三角函数
define([ "intern!tdd", 
         "intern/chai!assert", 
         "mathEditor/Model", 
         "mathEditor/lang" ], function(
        		 tdd,
        		 assert, 
        		 Model, 
        		 dripLang) {

	with(tdd){
		suite("Model.setData.trigonometricFunction 三角函数", function(){
			
			var model = null;
			beforeEach(function () {
				model = new Model({});
			});
			
			function testSupport(model, tri){
				model.setData({data:tri, nodeName:"mi"});
				isTri(model, tri);
			}
			
			function isTri(model, tri){
				assert.equal("/root/line[1]/math[1]/mrow[3]/mn[1]", model.getPath());
				
				var node = model.getFocusNode();
				assert.equal("mn", node.nodeName);
				assert.equal("drip_placeholder_box", node.getAttribute("class"));
				assert.equal(0, model.getOffset());
				
				var funNode = node.parentNode.previousSibling;
				assert.equal("mo",funNode.nodeName);
				assert.equal("&#x2061;",dripLang.getText(funNode));
				
				var triNode = funNode.previousSibling;
				assert.equal("mi", triNode.nodeName);
				assert.equal(tri, dripLang.getText(triNode));
			}
			
			
			test("在空的数学编辑器上输入sin/cos/tan/cot/sec/csc", function(){
				/*
  				 * <mi>cos</mi>
  				 * <mo>&#x2061;</mo> 函数应用
  				 * <mrow>
  				 * <mn></mn> 占位符统一使用mn表示
  				 * </mrow>
  				 */
  				// 其实下面这些都属于一类，一个测试用例足够。
  				// 但是在单个输入字符时，需要对每个三角函数进行判断，所以这里全部测试，
  				// 防止在代码实现时，遗漏处理的情况。
  				model.toMathMLMode();
  				testSupport(model,"sin");
  				model.clear();
  				
  				model.toMathMLMode();
  				testSupport(model,"cos");
  				model.clear();
  				
  				model.toMathMLMode();
  				testSupport(model,"tan");
  				model.clear();
  				
  				model.toMathMLMode();
  				testSupport(model,"cot");
  				model.clear();
  				
  				model.toMathMLMode();
  				testSupport(model,"sec");
  				model.clear();
  				
  				model.toMathMLMode();
  				testSupport(model,"csc");
  				model.clear();
			});
			
			test("mathml模式下，在已输入数字的model中输入三角函数", function(){
				model.toMathMLMode();
  				model.setData({data:"1"});
  				model.setData({data:"sin", nodeName:"mi"});
  				
  				assert.equal("/root/line[1]/math[1]/mrow[4]/mn[1]", model.getPath());
  				var node = model.getFocusNode();
  				assert.equal("mn", node.nodeName);
  				assert.equal("drip_placeholder_box", node.getAttribute("class"));
  				assert.equal(0, model.getOffset());
  				
  				var funNode = node.parentNode.previousSibling;
  				assert.equal("mo",funNode.nodeName);
  				assert.equal("&#x2061;",dripLang.getText(funNode));
  				
  				var triNode = funNode.previousSibling;
  				assert.equal("mi", triNode.nodeName);
  				assert.equal("sin", dripLang.getText(triNode));
			});
			
			// 分为一次性输入，和单个字符串的输入，
		    // 注意，删除的时候，敲一次删除键，删除整个操作符
			test("逐个字母的连续输入一个三角函数sin", function(){
				model.toMathMLMode();
  				model.setData({data:"1"});
  				
  				model.setData({data:"s"});
  				assert.equal("/root/line[1]/math[1]/mi[2]", model.getPath());
  				
  				var node = model.getFocusNode();
  				assert.equal("mi", node.nodeName);
  				assert.equal("s", dripLang.getText(node));
  				assert.equal(1, model.getOffset());
  				
  				model.setData({data:"i"});
  				node = model.getFocusNode();
  				assert.equal("/root/line[1]/math[1]/mi[3]", model.getPath());
  				assert.equal("mi", node.nodeName);
  				assert.equal("i", dripLang.getText(node));
  				assert.equal(1, model.getOffset());
  				
  				model.setData({data:"n"});
  				assert.equal("/root/line[1]/math[1]/mrow[4]/mn[1]", model.getPath());
  				var node = model.getFocusNode();
  				assert.equal("mn", node.nodeName);
  				assert.equal("drip_placeholder_box", node.getAttribute("class"));
  				assert.equal(0, model.getOffset());
  				
  				var funNode = node.parentNode.previousSibling;
  				assert.equal("mo",funNode.nodeName);
  				assert.equal("&#x2061;",dripLang.getText(funNode));
  				
  				var triNode = funNode.previousSibling;
  				assert.equal("mi", triNode.nodeName);
  				assert.equal("sin", dripLang.getText(triNode));
			});
			
			test("mathml下，输入s，接着输入n，然后在n前面输入i，则组合成sin", function(){
				model.toMathMLMode();
  				model.setData({data:"1"});
  				
  				model.setData({data:"s"});
  				assert.equal("/root/line[1]/math[1]/mi[2]", model.getPath());
  				
  				var node = model.getFocusNode();
  				assert.equal("mi", node.nodeName);
  				assert.equal("s", dripLang.getText(node));
  				assert.equal(1, model.getOffset());
  				
  				model.setData({data:"n"});
  				node = model.getFocusNode();
  				assert.equal("/root/line[1]/math[1]/mi[3]", model.getPath());
  				assert.equal("mi", node.nodeName);
  				assert.equal("n", dripLang.getText(node));
  				assert.equal(1, model.getOffset());
  				
  				// 在mi之间往前移动的逻辑是offset不变，node改变
  				// 如果移动offset的话，则offset的值为0，表示在node的左边，
  				// 这个时候的处理逻辑是不一样的。
  				// FIXME：如果统一这个逻辑呢？是都在右边定位呢，还是允许在左边定位呢，只能选择其中一种
  				// 如果只能在右边定位，则往左移动到最前面时，则往上找父节点。
  				// 目前使用在右边定位
  				model.anchor.node = model.anchor.node.previousSibling;
  				// 注意，移动时，如果节点发生了变化，则也要调整model.path
  				var pos = model.path.pop();
  				pos.offset--;
  				model.path.push(pos);
  				
  				model.setData({data:"i"});
  				assert.equal("/root/line[1]/math[1]/mrow[4]/mn[1]", model.getPath());
  				var node = model.getFocusNode();
  				assert.equal("mn", node.nodeName);
  				assert.equal("drip_placeholder_box", node.getAttribute("class"));
  				assert.equal(0, model.getOffset());
  				
  				var funNode = node.parentNode.previousSibling;
  				assert.equal("mo",funNode.nodeName);
  				assert.equal("&#x2061;",dripLang.getText(funNode));
  				
  				var triNode = funNode.previousSibling;
  				assert.equal("mi", triNode.nodeName);
  				assert.equal("sin", dripLang.getText(triNode));
			});
			
			test("mathml下，输入i，接着输入n，然后在i前面输入s，则组合成sin", function(){
				model.toMathMLMode();
  				model.setData({data:"1"});
  				
  				model.setData({data:"i"});
  				assert.equal("/root/line[1]/math[1]/mi[2]", model.getPath());
  				
  				var node = model.getFocusNode();
  				assert.equal("mi", node.nodeName);
  				assert.equal("i", dripLang.getText(node));
  				assert.equal(1, model.getOffset());
  				
  				model.setData({data:"n"});
  				node = model.getFocusNode();
  				assert.equal("/root/line[1]/math[1]/mi[3]", model.getPath());
  				assert.equal("mi", node.nodeName);
  				assert.equal("n", dripLang.getText(node));
  				assert.equal(1, model.getOffset());
  				
  				model.anchor.node = model.anchor.node.previousSibling;
  				var pos = model.path.pop();
  				pos.offset--;
  				model.path.push(pos);
  				
  				model.anchor.node = model.anchor.node.previousSibling;
  				var pos = model.path.pop();
  				pos.offset--;
  				pos.nodeName = model.anchor.node.nodeName;
  				model.path.push(pos);
  				
  				model.setData({data:"s"});
  				assert.equal("/root/line[1]/math[1]/mrow[4]/mn[1]", model.getPath());
  				var node = model.getFocusNode();
  				assert.equal("mn", node.nodeName);
  				assert.equal("drip_placeholder_box", node.getAttribute("class"));
  				assert.equal(0, model.getOffset());
  				
  				var funNode = node.parentNode.previousSibling;
  				assert.equal("mo",funNode.nodeName);
  				assert.equal("&#x2061;",dripLang.getText(funNode));
  				
  				var triNode = funNode.previousSibling;
  				assert.equal("mi", triNode.nodeName);
  				assert.equal("sin", dripLang.getText(triNode));
			});
			
			// 在这里把带有推荐词条的输入模式走通。有两种应用推荐词条的方法，一是直接调用apply方法，另一个是在输入完全之后自动应用。
			test("在空的math节点中，输入三角函数sin，输入的时候会给出推荐词条", function(){
				model.loadData("<root><line>" +
  						"<math>" +
  						"</math>" +
						"</line></root>");
				model.mode = "mathml";
				var line = model.getLineAt(0);
				model.anchor.node = line.firstChild;
				model.anchor.offset = 2;// math处于选中状态
				model.path = [];
				model.path.push({nodeName:"root"});
				model.path.push({nodeName:"line", offset:1});
				model.path.push({nodeName:"math", offset:1});
//				aspect.after(model, "onChanging", function(e){
//					if(e.data == "s"){
//						e.newData = {data: "", nodeName: "msqrt"};
//					}else if(e.data == "i"){
//						e.newData = {data: "sin", nodeName: "mi"};
//					}else if(e.data == "n"){
//						e.newData = {data: "sin", nodeName: "mi", match: true};
//					}
//				},true);
				
				model.setData({data:"s"});
				assert.equal("/root/line[1]/math[1]/mi[1]", model.getPath());
				var focusNode = model.getFocusNode();
				assert.equal("mi", focusNode.nodeName);
				assert.equal(1, model.getOffset());
				assert.equal("s", dripLang.getText(focusNode));
				assert.equal(1, line.firstChild.childNodes.length);
				
				model.setData({data:"i"});
				assert.equal("/root/line[1]/math[1]/mi[2]", model.getPath());
				var focusNode = model.getFocusNode();
				assert.equal("mi", focusNode.nodeName);
				assert.equal(1, model.getOffset());
				assert.equal("i", dripLang.getText(focusNode));
				assert.equal(2, line.firstChild.childNodes.length);
				
				model.setData({data:"n"});
				assert.equal("/root/line[1]/math[1]/mrow[3]/mn[1]", model.getPath());
				var node = model.getFocusNode();
				assert.equal("mn", node.nodeName);
				assert.equal("drip_placeholder_box", node.getAttribute("class"));
				assert.equal(0, model.getOffset());
				
				var funNode = node.parentNode.previousSibling;
				assert.equal("mo",funNode.nodeName);
				assert.equal("&#x2061;",dripLang.getText(funNode));
				
				var triNode = funNode.previousSibling;
				assert.equal("mi", triNode.nodeName);
				assert.equal("sin", dripLang.getText(triNode));
			});
		});
	}
	
});
