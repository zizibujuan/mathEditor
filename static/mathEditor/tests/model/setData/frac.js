define([ "intern!tdd", 
         "intern/chai!assert", 
         "mathEditor/tests/testUtil", 
         "mathEditor/Model",
         "mathEditor/lang" ], function(
        		 tdd,
        		 assert,
        		 testUtil,
        		 Model,
        		 dripLang) {

	// summary:
	//		1.在空math中输入frac
	//		2.在token节点后输入frac
	//		3.在layout节点后输入frac,layout没有被mstyle封装
	//		4.在layout节点后输入frac,layout被mstyle封装
	//		5.在token节点前输入frac
	//		6.在layout节点前输入frac，layout没有被mstyle封装
	//		7.在layout节点前输入frac，layout被mstyle封装
	//		2.在任何空的layout节点中输入frac
	//		3.在mn节点中输入frac
	
	with(tdd){
		suite("Model.setData.frac 分数", function(){
			
			var model = null;
			beforeEach(function () {
				model = new Model({});
			});
			
			test("mathml模式下，在一个空的model中加入一个空的分数，分子获取焦点", function(){
				/**
  				 * <pre>
  				 * <math>
  				 * <mstyle>
  				 * 	<mfrac>
  				 *    <mrow><mn>8</mn></mrow>
  				 *    <mrow><mn></mn></mrow>
  				 *  <mfrac>
  				 *  </mstyle>
  				 * </math>
  				 * </pre>
  				 */
				model.loadData("<root><line><math></math></line></root>");
				model.mode = "mathml";
				var line = model.getLineAt(0);
				model.anchor.node = line.firstChild;
				model.anchor.offset = 2;// layoutOffset.select
				model.path = [];
				model.path.push({nodeName: "root"});
				model.path.push({nodeName: "line", offset: 1});
				model.path.push({nodeName: "math", offset: 1});
				model.setData({data:"", nodeName:"mfrac"});
				
				assert.equal("/root/line[1]/math[1]/mfrac[1]/mrow[1]/mn[1]", model.getPath()); //创建完成后，让分子先获取焦点
				var node = model.getFocusNode();
				// 确保选中的是分子节点
				assert.ok(node.parentNode.previousSibling == null);
				testUtil.isPlaceHolder(assert, model.anchor);
			});
			
			test("在token节点后输入frac", function(){
				model.loadData("<root><line><math><mn>12</mn></math></line></root>");
				model.mode = "mathml";
				var line = model.getLineAt(0);
				model.anchor.node = line.firstChild.firstChild;
				model.anchor.offset = 2;
				model.path = [];
				model.path.push({nodeName: "root"});
				model.path.push({nodeName: "line", offset: 1});
				model.path.push({nodeName: "math", offset: 1});
				model.path.push({nodeName: "mn", offset: 1});
				model.setData({data:"", nodeName:"mfrac"});
				//创建完成后，让分子先获取焦点
				assert.equal("/root/line[1]/math[1]/mfrac[2]/mrow[1]/mn[1]", model.getPath()); 
				var node = model.getFocusNode();
				// 确保选中的是分子节点
				assert.ok(node.parentNode.previousSibling == null);
				testUtil.isPlaceHolder(assert, model.anchor);
				// 判断新的mfrac是添加在mstyle之后，而不是mstyle中
				assert.equal(2, dripLang.getChildLength(line.firstChild));
				// 确定新插入的mfrac在layout后
				assert.equal(node.parentNode.parentNode.parentNode, line.firstChild.lastChild);
			});
			
			test("在layout节点后输入frac,layout节点没有被mstyle封装", function(){
				model.loadData("<root><line>" +
						"<math>" +
						"<mfrac><mrow><mn>1</mn></mrow><mrow><mn>2</mn></mrow></mfrac>" +
						"</math>" +
						"</line></root>");
				model.mode = "mathml";
				var line = model.getLineAt(0);
				model.anchor.node = line.firstChild.firstChild;
				model.anchor.offset = 1;
				model.path = [];
				model.path.push({nodeName: "root"});
				model.path.push({nodeName: "line", offset: 1});
				model.path.push({nodeName: "math", offset: 1});
				model.path.push({nodeName: "mfrac", offset: 1});
				model.setData({data:"", nodeName:"mfrac"});
				//创建完成后，让分子先获取焦点
				assert.equal("/root/line[1]/math[1]/mfrac[2]/mrow[1]/mn[1]", model.getPath()); 
				var node = model.getFocusNode();
				// 确保选中的是分子节点
				assert.ok(node.parentNode.previousSibling == null);
				testUtil.isPlaceHolder(assert, model.anchor);
				// 判断新的mfrac是添加在mstyle之后，而不是mstyle中
				assert.equal(2, dripLang.getChildLength(line.firstChild));
				// 确定新插入的mfrac在layout后
				assert.equal(node.parentNode.parentNode.parentNode, line.firstChild.lastChild);
			});
			
			test("在layout节点后输入frac,layout节点被mstyle封装", function(){
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
				model.path.push({nodeName: "root"});
				model.path.push({nodeName: "line", offset: 1});
				model.path.push({nodeName: "math", offset: 1});
				model.path.push({nodeName: "mfrac", offset: 1});
				model.setData({data:"", nodeName:"mfrac"});
				//创建完成后，让分子先获取焦点
				assert.equal("/root/line[1]/math[1]/mfrac[2]/mrow[1]/mn[1]", model.getPath()); 
				var node = model.getFocusNode();
				// 确保选中的是分子节点
				assert.ok(node.parentNode.previousSibling == null);
				testUtil.isPlaceHolder(assert, model.anchor);
				// 判断新的mfrac是添加在mstyle之后，而不是mstyle中
				assert.equal(2, dripLang.getChildLength(line.firstChild));
				// 确定新插入的mfrac在layout后
				assert.equal(node.parentNode.parentNode.parentNode, line.firstChild.lastChild);
			});
			
			test("在token节点前输入frac", function(){
				model.loadData("<root><line><math><mn>12</mn></math></line></root>");
				model.mode = "mathml";
				var line = model.getLineAt(0);
				model.anchor.node = line.firstChild.firstChild;
				model.anchor.offset = 0;
				model.path = [];
				model.path.push({nodeName: "root"});
				model.path.push({nodeName: "line", offset: 1});
				model.path.push({nodeName: "math", offset: 1});
				model.path.push({nodeName: "mn", offset: 1});
				model.setData({data:"", nodeName:"mfrac"});
				//创建完成后，让分子先获取焦点
				assert.equal("/root/line[1]/math[1]/mfrac[1]/mrow[1]/mn[1]", model.getPath()); 
				var node = model.getFocusNode();
				// 确保选中的是分子节点
				assert.ok(node.parentNode.previousSibling == null);
				testUtil.isPlaceHolder(assert, model.anchor);
				// 确定新插入的mfrac在layout前
				assert.equal(node.parentNode.parentNode.parentNode, line.firstChild.firstChild);
			});
			
			test("在layout节点前输入frac,layout节点没有被mstyle封装", function(){
				model.loadData("<root><line>" +
						"<math>" +
						"<mfrac><mrow><mn>1</mn></mrow><mrow><mn>2</mn></mrow></mfrac>" +
						"</math>" +
						"</line></root>");
				model.mode = "mathml";
				var line = model.getLineAt(0);
				model.anchor.node = line.firstChild.firstChild;
				model.anchor.offset = 0;
				model.path = [];
				model.path.push({nodeName: "root"});
				model.path.push({nodeName: "line", offset: 1});
				model.path.push({nodeName: "math", offset: 1});
				model.path.push({nodeName: "mfrac", offset: 1});
				model.setData({data:"", nodeName:"mfrac"});
				//创建完成后，让分子先获取焦点
				assert.equal("/root/line[1]/math[1]/mfrac[1]/mrow[1]/mn[1]", model.getPath()); 
				var node = model.getFocusNode();
				// 确保选中的是分子节点
				assert.ok(node.parentNode.previousSibling == null);
				testUtil.isPlaceHolder(assert, model.anchor);
				// 确定新插入的mfrac在layout前
				assert.equal(node.parentNode.parentNode.parentNode, line.firstChild.firstChild);
			});
			
			test("在layout节点前输入frac,layout节点被mstyle封装", function(){
				model.loadData("<root><line>" +
						"<math>" +
						"<mstyle><mfrac><mrow><mn>1</mn></mrow><mrow><mn>2</mn></mrow></mfrac></mstyle>" +
						"</math>" +
						"</line></root>");
				model.mode = "mathml";
				var line = model.getLineAt(0);
				model.anchor.node = line.firstChild.firstChild.firstChild;
				model.anchor.offset = 0;
				model.path = [];
				model.path.push({nodeName: "root"});
				model.path.push({nodeName: "line", offset: 1});
				model.path.push({nodeName: "math", offset: 1});
				model.path.push({nodeName: "mfrac", offset: 1});
				model.setData({data:"", nodeName:"mfrac"});
				//创建完成后，让分子先获取焦点
				assert.equal("/root/line[1]/math[1]/mfrac[1]/mrow[1]/mn[1]", model.getPath()); 
				var node = model.getFocusNode();
				// 确保选中的是分子节点
				assert.ok(node.parentNode.previousSibling == null);
				testUtil.isPlaceHolder(assert, model.anchor);
				// 判断新的mfrac是添加在mstyle之后，而不是mstyle中
				assert.equal(2, dripLang.getChildLength(line.firstChild));
				// 确定新插入的mfrac在layout前
				assert.equal(node.parentNode.parentNode.parentNode, line.firstChild.firstChild);
			});
			
			test("在mn节点中输入mfrac", function(){
				model.loadData("<root><line>" +
						"<math>" +
						"<mn>123</mn>" +
						"</math>" +
						"</line></root>");
				model.mode = "mathml";
				var line = model.getLineAt(0);
				model.anchor.node = line.firstChild.firstChild;
				model.anchor.offset = 1;
				model.path = [];
				model.path.push({nodeName: "root"});
				model.path.push({nodeName: "line", offset: 1});
				model.path.push({nodeName: "math", offset: 1});
				model.path.push({nodeName: "mn", offset: 1});
				model.setData({data:"", nodeName:"mfrac"});
				//创建完成后，让分子先获取焦点
				assert.equal("/root/line[1]/math[1]/mfrac[2]/mrow[1]/mn[1]", model.getPath()); 
				var node = model.getFocusNode();
				// 确保选中的是分子节点
				assert.ok(node.parentNode.previousSibling == null);
				testUtil.isPlaceHolder(assert, model.anchor);
				// 判断新的mfrac是添加在mstyle之后，而不是mstyle中
				assert.equal(3, dripLang.getChildLength(line.firstChild));
				// 确定新插入的mfrac在layout前
				assert.equal(node.parentNode.parentNode.parentNode, line.firstChild.firstChild.nextSibling);
			});
			
			test("在一个已输入中文的model中加入一个空的分数", function(){
				model.setData({data:"你"});
  				model.toMathMLMode();
  				model.setData({data:"", nodeName:"mfrac"});
  				assert.equal("/root/line[1]/math[2]/mfrac[1]/mrow[1]/mn[1]", model.getPath()); //创建完成后，让分子先获取焦点
  				var node = model.getFocusNode();
  				// 确保选中的是分子节点
  				assert.ok(node.parentNode.previousSibling == null);
  				assert.equal("mn", node.nodeName);
  				assert.equal("drip_placeholder_box", node.getAttribute("class"));
  				assert.equal(0, model.getOffset());
			});
			
			test("在两个已输入中文中间加入一个空的分数", function(){
				model.setData({data:"你我"});
  				model.anchor.offset--;
  				model.toMathMLMode();
  				model.setData({data:"", nodeName:"mfrac"});
  				assert.equal("/root/line[1]/math[2]/mfrac[1]/mrow[1]/mn[1]", model.getPath()); //创建完成后，让分子先获取焦点
  				var node = model.getFocusNode();
  				// 确保选中的是分子节点
  				assert.ok(node.parentNode.previousSibling == null);
  				assert.equal("mn", node.nodeName);
  				assert.equal("drip_placeholder_box", node.getAttribute("class"));
  				assert.equal(0, model.getOffset());
  				
  				var children = model.getLineAt(0).childNodes;
  				assert.equal(3, children.length);
  				assert.equal("text", children[0].nodeName);
  				assert.equal("math", children[1].nodeName);
  				assert.equal("text", children[2].nodeName);
  				
  				assert.equal("你", dripLang.getText(children[0]));
  				assert.equal("我", dripLang.getText(children[2]));
			});
			
			test("mathml模式下，在空的分数上的分子上输入第一个字符，清除占位符样式，并显示输入的字符", function(){
				/**
  				 * <pre>
  				 * <math>
  				 * 	<mfrac>
  				 *    <mrow><mn>1</mn></mrow>
  				 *    <mrow><mn></mn></mrow>
  				 *  <mfrac>
  				 * </math>
  				 * </pre>
  				 */
  				model.toMathMLMode();
  				model.setData({data:"", nodeName:"mfrac"});
  				model.setData({data:"1"});
  				assert.equal("/root/line[1]/math[1]/mfrac[1]/mrow[1]/mn[1]", model.getPath());
  				var node = model.getFocusNode();
  				assert.equal("mn", node.nodeName);
  				assert.notEqual("drip_placeholder_box", node.getAttribute("class"));
  				assert.equal(1, model.getOffset());
  				
  				// 判断分子的值为1
  				assert.equal("mn", node.nodeName);
  				assert.equal("1", dripLang.getText(node));
			});
		});
	}
	
});