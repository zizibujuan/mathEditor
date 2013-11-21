define([ "intern!tdd", 
         "intern/chai!assert",
         "mathEditor/Model",
         "mathEditor/lang" ], function(
        		 tdd,
        		 assert,
        		 Model,
        		 dripLang) {

	with(tdd){
		suite("Model.setData.fence fence对称的括号", function(){
			
			var model = null;
			beforeEach(function () {
				model = new Model({});
			});
			
			test("mathml模式下，在空的model上输入()/[]/{}/||", function(){
				/**
				 * <mfenced open="[" close="}" separators="sep#1 sep#2 ... sep#(n-1)">
				 * <mrow><mi>x</mi></mrow>
				 * <mrow><mi>y</mi></mrow>
				 * </mfenced>
				 * 
				 * 注意，参数个数的区别，多个参数的话，使用指定的分割符号分开，默认为",".
				 * open和close默认为()
				 * 
				 * 括号，不弹出提示，自动完成。不要在提示框中添加就可以实现。
				 */
				model.toMathMLMode();
				model.setData({data:"("});
				assert.equal("/root/line[1]/math[1]/mfenced[1]/mrow[1]/mn[1]", model.getPath());
				
				var node = model.getFocusNode();
				assert.equal("mn", node.nodeName);
				assert.equal("drip_placeholder_box", node.getAttribute("class"));
				assert.equal(0, model.getOffset());
			
				var mfencedNode = node.parentNode.parentNode;
				assert.equal("mfenced",mfencedNode.nodeName);
			});
			
			test("在token节点后添加mfenced", function(){
				model.loadData("<root><line><math><mn>12</mn></math></line></root>");
				model.mode = "mathml";
				var line = model.getLineAt(0);
				model.anchor.node = line.firstChild.firstChild;
				model.anchor.offset = 2;
				model.path = [];
				model.path.push({nodeName:"root"});
				model.path.push({nodeName:"line", offset:1});
				model.path.push({nodeName:"math", offset:1});
				model.path.push({nodeName:"mn", offset:1});
				
				model.setData({data:"("});
				assert.equal("/root/line[1]/math[1]/mfenced[2]/mrow[1]/mn[1]", model.getPath());
				
				var node = model.getFocusNode();
				assert.equal("mn", node.nodeName);
				assert.equal("drip_placeholder_box", node.getAttribute("class"));
				assert.equal(0, model.getOffset());
			
				var mfencedNode = node.parentNode.parentNode;
				assert.equal("mfenced",mfencedNode.nodeName);
				assert.equal(2, dripLang.getChildLength(line.firstChild));
				assert.equal("mn", line.firstChild.firstChild.nodeName);
				assert.equal("mfenced", line.firstChild.firstChild.nextSibling.nodeName);
			});
			
			test("在token节点前添加mfenced", function(){
				model.loadData("<root><line><math><mn>12</mn></math></line></root>");
				model.mode = "mathml";
				var line = model.getLineAt(0);
				model.anchor.node = line.firstChild.firstChild;
				model.anchor.offset = 0;
				model.path = [];
				model.path.push({nodeName:"root"});
				model.path.push({nodeName:"line", offset:1});
				model.path.push({nodeName:"math", offset:1});
				model.path.push({nodeName:"mn", offset:1});
				
				model.setData({data:"("});
				assert.equal("/root/line[1]/math[1]/mfenced[1]/mrow[1]/mn[1]", model.getPath());
				
				var node = model.getFocusNode();
				assert.equal("mn", node.nodeName);
				assert.equal("drip_placeholder_box", node.getAttribute("class"));
				assert.equal(0, model.getOffset());
			
				var mfencedNode = node.parentNode.parentNode;
				assert.equal("mfenced",mfencedNode.nodeName);
				assert.equal(2, dripLang.getChildLength(line.firstChild));
				assert.equal("mfenced", line.firstChild.firstChild.nodeName);
				assert.equal("mn", line.firstChild.firstChild.nextSibling.nodeName);
			});
			
			test("在mn节点之间添加mfenced", function(){
				model.loadData("<root><line><math><mn>123</mn></math></line></root>");
				model.mode = "mathml";
				var line = model.getLineAt(0);
				model.anchor.node = line.firstChild.firstChild;
				model.anchor.offset = 2;
				model.path = [];
				model.path.push({nodeName:"root"});
				model.path.push({nodeName:"line", offset:1});
				model.path.push({nodeName:"math", offset:1});
				model.path.push({nodeName:"mn", offset:1});
				
				model.setData({data:"("});
				assert.equal("/root/line[1]/math[1]/mfenced[2]/mrow[1]/mn[1]", model.getPath());
				
				var node = model.getFocusNode();
				assert.equal("mn", node.nodeName);
				assert.equal("drip_placeholder_box", node.getAttribute("class"));
				assert.equal(0, model.getOffset());
			
				var mfencedNode = node.parentNode.parentNode;
				assert.equal("mfenced",mfencedNode.nodeName);
				assert.equal(3, dripLang.getChildLength(line.firstChild));
				assert.equal("mn", line.firstChild.firstChild.nodeName);
				assert.equal("mfenced", line.firstChild.firstChild.nextSibling.nodeName);
				assert.equal("mn", line.firstChild.lastChild.nodeName);
			});
			
			// TODO: 在mn之间插入fenced
		});
	}

});