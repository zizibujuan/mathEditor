define([ "intern!tdd", 
         "intern/chai!assert",
         "mathEditor/Model",
         "mathEditor/lang" ], function(
        		 tdd,
        		 assert,
        		 Model,
        		 dripLang) {

	with(tdd){
		suite("Model.setData.root 开根号", function(){
			
			var model = null;
			beforeEach(function () {
				model = new Model({});
			});
			
			test("mathml模式下，在空的数学编辑器上输入N次方根", function(){
				/*
				 * <msqrt> base </msqrt>
				 * <mroot> base index </mroot>
				 * msqrt、mroot中的内容都使用mrow封装
				 * 
				 * 让index获取焦点，因为index的值往往很简单，输入完成后去输入base；如果先输入base，需要倒退到左上角。
				 * 注意，index在界面上显示时在左上角，但是在mathml中显示在base的右边。
				 */
				model.toMathMLMode();
				model.setData({data:"", nodeName:"mroot"});
				assert.equal("/root/line[1]/math[1]/mroot[1]/mrow[2]/mn[1]", model.getPath());
				
				var node = model.getFocusNode();
				assert.equal("mn", node.nodeName);
				assert.equal("drip_placeholder_box", node.getAttribute("class"));
				assert.equal(0, model.getOffset());
				
				var baseNode = node.parentNode.previousSibling.firstChild;
				assert.equal("mn", baseNode.nodeName);
				assert.equal("drip_placeholder_box", baseNode.getAttribute("class"));
			});
			
			// 在layout节点后输入layout节点
			test("在layout节点后输入mroot节点，layout没有被mstyle封装", function(){
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
				
				model.setData({data:"", nodeName:"mroot"});
				assert.equal("/root/line[1]/math[1]/mroot[2]/mrow[2]/mn[1]", model.getPath());// 根次获取焦点
				
				var node = model.getFocusNode();
				assert.equal("mn", node.nodeName);
				assert.equal("drip_placeholder_box", node.getAttribute("class"));
				assert.equal(0, model.getOffset());
				
				assert.equal(2, dripLang.getChildLength(line.firstChild));
				assert.equal(node.parentNode.parentNode, line.firstChild.lastChild);
			});
			
			test("在layout节点后输入mroot节点，layout被mstyle封装", function(){
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
				
				model.setData({data:"", nodeName:"mroot"});
				assert.equal("/root/line[1]/math[1]/mroot[2]/mrow[2]/mn[1]", model.getPath());
				
				var node = model.getFocusNode();
				assert.equal("mn", node.nodeName);
				assert.equal("drip_placeholder_box", node.getAttribute("class"));
				assert.equal(0, model.getOffset());
				
				assert.equal(2, dripLang.getChildLength(line.firstChild));
				assert.equal(node.parentNode.parentNode, line.firstChild.lastChild);
			});
			
			test("在layout节点后,输入mi节点，然后删除mi节点，然后输入mroot节点，layout被mstyle封装", function(){
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
				model.setData({data:"", nodeName:"mroot"});
				assert.equal("/root/line[1]/math[1]/mroot[2]/mrow[2]/mn[1]", model.getPath());
				
				var node = model.getFocusNode();
				assert.equal("mn", node.nodeName);
				assert.equal("drip_placeholder_box", node.getAttribute("class"));
				assert.equal(0, model.getOffset());
				
				assert.equal(2, dripLang.getChildLength(line.firstChild));
				assert.equal(node.parentNode.parentNode, line.firstChild.lastChild);
			});
			
			// 在layout节点前输入layout节点
			test("在layout节点前输入mroot节点，layout没有被mstyle封装", function(){
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
				
				model.setData({data:"", nodeName:"mroot"});
				assert.equal("/root/line[1]/math[1]/mroot[1]/mrow[2]/mn[1]", model.getPath());
				
				var node = model.getFocusNode();
				assert.equal("mn", node.nodeName);
				assert.equal("drip_placeholder_box", node.getAttribute("class"));
				assert.equal(0, model.getOffset());
				
				assert.equal(2, dripLang.getChildLength(line.firstChild));
				assert.equal(node.parentNode.parentNode, line.firstChild.firstChild);
			});
			
			test("在layout节点前输入mroot节点，layout被mstyle封装", function(){
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
				
				model.setData({data:"", nodeName:"mroot"});
				assert.equal("/root/line[1]/math[1]/mroot[1]/mrow[2]/mn[1]", model.getPath());
				
				var node = model.getFocusNode();
				assert.equal("mn", node.nodeName);
				assert.equal("drip_placeholder_box", node.getAttribute("class"));
				assert.equal(0, model.getOffset());
				
				assert.equal(2, dripLang.getChildLength(line.firstChild));
				assert.equal(node.parentNode.parentNode, line.firstChild.firstChild);
			});
			
			test("在layout节点前,输入mi节点，然后删除mi节点，然后输入mroot节点，layout被mstyle封装", function(){
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
				model.setData({data:"", nodeName:"mroot"});
				assert.equal("/root/line[1]/math[1]/mroot[1]/mrow[2]/mn[1]", model.getPath());
				
				var node = model.getFocusNode();
				assert.equal("mn", node.nodeName);
				assert.equal("drip_placeholder_box", node.getAttribute("class"));
				assert.equal(0, model.getOffset());
				
				assert.equal(2, dripLang.getChildLength(line.firstChild));
				assert.equal(node.parentNode.parentNode, line.firstChild.firstChild);
			});
		});
	}
	
});