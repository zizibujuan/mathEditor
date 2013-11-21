define([ "intern!tdd", 
         "intern/chai!assert",
         "mathEditor/Model",
         "mathEditor/lang" ], function(
        		 tdd,
        		 assert,
        		 Model,
        		 dripLang) {

	// summary:
	//		以下节点下，只能包含一个参数，这个参数就是一个隐含的mrow节点：
	//		msqrt, mstyle, merror, mpadded, mphantom, menclose, mtd, mscarry, and math
	//		因此对于一个参数的节点，不在节点的路径中和节点中显式添加mrow节点。
	
	with(tdd){
		suite("Model.setData.sqrt 平方根", function(){
			
			var model = null;
			beforeEach(function () {
				model = new Model({});
			});
			
			test("mathml模式下，在空的model中输入平方根", function(){
				/*
				 * <msqrt> base </msqrt>
				 * <mroot> base index </mroot>
				 * msqrt、mroot中的内容都使用mrow封装
				 */
				model.toMathMLMode();
				model.setData({data:"", nodeName:"msqrt"});
				assert.equal("/root/line[1]/math[1]/msqrt[1]/mn[1]", model.getPath());
				
				var node = model.getFocusNode();
				assert.equal("mn", node.nodeName);
				assert.equal("drip_placeholder_box", node.getAttribute("class"));
				assert.equal(0, model.getOffset());
				
				var baseNode = node;
				assert.equal("msqrt", baseNode.parentNode.nodeName);// 确保不包含mrow节点
			});
			
			test("mathml模式下，在model中输入数字，然后输入平方根", function(){
				/*
				 * <msqrt> base </msqrt>
				 * <mroot> base index </mroot>
				 * msqrt、mroot中的内容都使用mrow封装
				 */
				model.toMathMLMode();
				model.setData({data:"1"});
				model.setData({data:"", nodeName:"msqrt"});
				assert.equal("/root/line[1]/math[1]/msqrt[2]/mn[1]", model.getPath());
				
				var node = model.getFocusNode();
				assert.equal("mn", node.nodeName);
				assert.equal("drip_placeholder_box", node.getAttribute("class"));
				assert.equal(0, model.getOffset());
			});
			
			test("在平方根下输入数字", function(){
				/*
				 * <msqrt> base </msqrt>
				 * <mroot> base index </mroot>
				 * msqrt、mroot中的内容都使用mrow封装
				 */
				model.toMathMLMode();
				model.setData({data:"", nodeName:"msqrt"});
				model.setData({data:"1"});
				assert.equal("/root/line[1]/math[1]/msqrt[1]/mn[1]", model.getPath());
				
				var node = model.getFocusNode();
				assert.equal("mn", node.nodeName);
				assert.equal(1, model.getOffset());
				assert.equal("1", dripLang.getText(node));
			});
			
			test("在平方根下输入变量", function(){
				model.toMathMLMode();
				model.setData({data:"", nodeName:"msqrt"});
				model.setData({data:"x"});
				assert.equal("/root/line[1]/math[1]/msqrt[1]/mi[1]", model.getPath());
				
				var node = model.getFocusNode();
				assert.equal("mi", node.nodeName);
				assert.equal(1, model.getOffset());
				assert.equal("x", dripLang.getText(node));
			});
			
			test("在平方根下输入mathml操作符", function(){
				model.toMathMLMode();
				model.setData({data:"", nodeName:"msqrt"});
				model.setData({data:"+"});
				assert.equal("/root/line[1]/math[1]/msqrt[1]/mo[1]", model.getPath());
				
				var node = model.getFocusNode();
				assert.equal("mo", node.nodeName);
				assert.equal(1, model.getOffset());
				assert.equal("+", dripLang.getText(node));
			});
			
			test("在平方根下输入平方根", function(){
				model.toMathMLMode();
				model.setData({data:"", nodeName:"msqrt"});
				model.setData({data:"", nodeName:"msqrt"});
				assert.equal("/root/line[1]/math[1]/msqrt[1]/msqrt[1]/mn[1]", model.getPath());
				
				var node = model.getFocusNode();
				assert.equal("mn", node.nodeName);
				assert.equal("drip_placeholder_box", node.getAttribute("class"));
				assert.equal(0, model.getOffset());
			});
			
			test("在平方根下输入平方根,模拟实际的输入场景，先输入s，删除s，再输入msqrt，如此两次", function(){
				model.loadData("<root><line><math></math></line></root>");
				model.mode = "mathml";
				var line = model.getLineAt(0);
				model.anchor.node = line.firstChild;
				model.anchor.offset = 2;
				model.setData({data:"s"});
				model.removeLeft();
				model.setData({data:"", nodeName:"msqrt"});
				assert.equal("/root/line[1]/math[1]/msqrt[1]/mn[1]", model.getPath());
				var node = model.getFocusNode();
				assert.equal("mn", node.nodeName);
				assert.equal("drip_placeholder_box", node.getAttribute("class"));
				assert.equal(0, model.getOffset());
				
				model.setData({data:"s"});
				model.removeLeft();
				model.setData({data:"", nodeName:"msqrt"});
				assert.equal("/root/line[1]/math[1]/msqrt[1]/msqrt[1]/mn[1]", model.getPath());
				
				var node = model.getFocusNode();
				assert.equal("mn", node.nodeName);
				assert.equal("drip_placeholder_box", node.getAttribute("class"));
				assert.equal(0, model.getOffset());
			});
			
			test("在token节点前面输入msqrt", function(){
				model.loadData("<root><line><math><mn>1</mn></math></line></root>");
				model.mode = "mathml";
				var line = model.getLineAt(0);
				model.anchor.node = line.firstChild.firstChild;
				model.anchor.offset = 0;
				model.path = [];
				model.path.push({nodeName:"root"});
				model.path.push({nodeName:"line", offset:1});
				model.path.push({nodeName:"math", offset:1});
				model.path.push({nodeName:"mn", offset:1});
				
				model.setData({data:"", nodeName:"msqrt"});
				assert.equal("/root/line[1]/math[1]/msqrt[1]/mn[1]", model.getPath());
				
				var node = model.getFocusNode();
				assert.equal("mn", node.nodeName);
				assert.equal("drip_placeholder_box", node.getAttribute("class"));
				assert.equal(0, model.getOffset());
				
				// 确保，后面的token节点还在
				assert.equal("mn", node.parentNode.nextSibling.nodeName);
			});
			
			// 在layout节点后输入layout节点
			test("在layout节点后输入msqrt节点，layout没有被mstyle封装", function(){
				model.loadData("<root><line><math><mfrac></mfrac></math></line></root>");
				model.mode = "mathml";
				var line = model.getLineAt(0);
				model.anchor.node = line.firstChild.firstChild;
				model.anchor.offset = 1;
				model.path = [];
				model.path.push({nodeName:"root"});
				model.path.push({nodeName:"line", offset:1});
				model.path.push({nodeName:"math", offset:1});
				model.path.push({nodeName:"mfrac", offset:1});
				
				model.setData({data:"", nodeName:"msqrt"});
				assert.equal("/root/line[1]/math[1]/msqrt[2]/mn[1]", model.getPath());
				
				var node = model.getFocusNode();
				assert.equal("mn", node.nodeName);
				assert.equal("drip_placeholder_box", node.getAttribute("class"));
				assert.equal(0, model.getOffset());
				
				assert.equal(2, dripLang.getChildLength(line.firstChild));
				// msqrt下面不显式放mrow
				assert.equal(node.parentNode, line.firstChild.lastChild);
			});
			
			test("在layout节点后输入msqrt节点，layout被mstyle封装", function(){
				model.loadData("<root><line><math><mstyle><mfrac></mfrac></mstyle></math></line></root>");
				model.mode = "mathml";
				var line = model.getLineAt(0);
				model.anchor.node = line.firstChild.firstChild.firstChild;
				model.anchor.offset = 1;
				model.path = [];
				model.path.push({nodeName:"root"});
				model.path.push({nodeName:"line", offset:1});
				model.path.push({nodeName:"math", offset:1});
				model.path.push({nodeName:"mfrac", offset:1});
				
				model.setData({data:"", nodeName:"msqrt"});
				assert.equal("/root/line[1]/math[1]/msqrt[2]/mn[1]", model.getPath());
				
				var node = model.getFocusNode();
				assert.equal("mn", node.nodeName);
				assert.equal("drip_placeholder_box", node.getAttribute("class"));
				assert.equal(0, model.getOffset());
				
				assert.equal(2, dripLang.getChildLength(line.firstChild));
				assert.equal(node.parentNode, line.firstChild.lastChild);
			});
			
			test("在layout节点后,输入mi节点，然后删除mi节点，然后输入msqrt节点，layout被mstyle封装", function(){
				model.loadData("<root><line><math><mstyle><mfrac><mrow><mn>1</mn></mrow><mrow><mn>1</mn></mrow></mfrac></mstyle></math></line></root>");
				model.mode = "mathml";
				var line = model.getLineAt(0);
				model.anchor.node = line.firstChild.firstChild.firstChild;
				model.anchor.offset = 1;
				model.path = [];
				model.path.push({nodeName:"root"});
				model.path.push({nodeName:"line", offset:1});
				model.path.push({nodeName:"math", offset:1});
				model.path.push({nodeName:"mfrac", offset:1});
				model.setData({data:"s", nodeName:"mi"});
				model.removeLeft();
				model.setData({data:"", nodeName:"msqrt"});
				assert.equal("/root/line[1]/math[1]/msqrt[2]/mn[1]", model.getPath());
				
				var node = model.getFocusNode();
				assert.equal("mn", node.nodeName);
				assert.equal("drip_placeholder_box", node.getAttribute("class"));
				assert.equal(0, model.getOffset());
				
				assert.equal(2, dripLang.getChildLength(line.firstChild));
				assert.equal(node.parentNode, line.firstChild.lastChild);
			});
			
			// 在layout节点前输入layout节点
			test("在layout节点前输入msqrt节点，layout没有被mstyle封装", function(){
				model.loadData("<root><line><math><mfrac></mfrac></math></line></root>");
				model.mode = "mathml";
				var line = model.getLineAt(0);
				model.anchor.node = line.firstChild.firstChild;
				model.anchor.offset = 0;
				model.path = [];
				model.path.push({nodeName:"root"});
				model.path.push({nodeName:"line", offset:1});
				model.path.push({nodeName:"math", offset:1});
				model.path.push({nodeName:"mfrac", offset:1});
				
				model.setData({data:"", nodeName:"msqrt"});
				assert.equal("/root/line[1]/math[1]/msqrt[1]/mn[1]", model.getPath());
				
				var node = model.getFocusNode();
				assert.equal("mn", node.nodeName);
				assert.equal("drip_placeholder_box", node.getAttribute("class"));
				assert.equal(0, model.getOffset());
				
				assert.equal(2, dripLang.getChildLength(line.firstChild));
				// msqrt下面不显式放mrow
				assert.equal(node.parentNode, line.firstChild.firstChild);
			});
			
			test("在layout节点前输入msqrt节点，layout被mstyle封装", function(){
				model.loadData("<root><line><math><mstyle><mfrac></mfrac></mstyle></math></line></root>");
				model.mode = "mathml";
				var line = model.getLineAt(0);
				model.anchor.node = line.firstChild.firstChild.firstChild;
				model.anchor.offset = 0;
				model.path = [];
				model.path.push({nodeName:"root"});
				model.path.push({nodeName:"line", offset:1});
				model.path.push({nodeName:"math", offset:1});
				model.path.push({nodeName:"mfrac", offset:1});
				
				model.setData({data:"", nodeName:"msqrt"});
				assert.equal("/root/line[1]/math[1]/msqrt[1]/mn[1]", model.getPath());
				
				var node = model.getFocusNode();
				assert.equal("mn", node.nodeName);
				assert.equal("drip_placeholder_box", node.getAttribute("class"));
				assert.equal(0, model.getOffset());
				
				assert.equal(2, dripLang.getChildLength(line.firstChild));
				assert.equal(node.parentNode, line.firstChild.firstChild);
			});
			
			test("在layout节点前,输入mi节点，然后删除mi节点，然后输入msqrt节点，layout被mstyle封装", function(){
				model.loadData("<root><line><math><mstyle><mfrac><mrow><mn>1</mn></mrow><mrow><mn>1</mn></mrow></mfrac></mstyle></math></line></root>");
				model.mode = "mathml";
				var line = model.getLineAt(0);
				model.anchor.node = line.firstChild.firstChild.firstChild;
				model.anchor.offset = 0;
				model.path = [];
				model.path.push({nodeName:"root"});
				model.path.push({nodeName:"line", offset:1});
				model.path.push({nodeName:"math", offset:1});
				model.path.push({nodeName:"mfrac", offset:1});
				model.setData({data:"s", nodeName:"mi"});
				model.removeLeft();
				model.setData({data:"", nodeName:"msqrt"});
				assert.equal("/root/line[1]/math[1]/msqrt[1]/mn[1]", model.getPath());
				
				var node = model.getFocusNode();
				assert.equal("mn", node.nodeName);
				assert.equal("drip_placeholder_box", node.getAttribute("class"));
				assert.equal(0, model.getOffset());
				
				assert.equal(2, dripLang.getChildLength(line.firstChild));
				assert.equal(node.parentNode, line.firstChild.firstChild);
			});
		});
	}
	
});