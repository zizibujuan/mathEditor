define([ "intern!tdd", 
         "intern/chai!assert",
         "mathEditor/Model",
         "mathEditor/lang" ], function(
        		 tdd,
        		 assert,
        		 Model,
        		 dripLang) {

	// summary:
	//		model.setData({data:"^"});与model.setData({data:"", nodeName:"msup"});的效果是一样的。
	//		在操作符后输入上标，不将操作符号作为base。如果要输入有上下标的符号，通过符号名称输入。
	//		1.在mi和mn节点后输入^，将mi和mn作为base
	//		2.在mo节点后输入^,则创建一个base为空的上下标
	//		3.在layout节点后输入^,将layout作为base
	//		4.在token/layout节点前输入^，则寻找前一个节点，然后按照1-3进行处理；如果没有前一个节点，则输入base为空的上标。
	//		调整base的内容（约定只取最近的一个节点作为base）是否适合做base，需要做一个判断。
	//	
	with(tdd){
		suite("Model.setData.sup 上标", function(){
			
			var model = null;
			beforeEach(function () {
				model = new Model({});
			});
			
			test("mathml模式下，在空的数学编辑器上直接输入上标", function(){
				/*
				 * <msup> base superscript </msup>
				 * msup中的内容都使用mrow封装
				 * 如果直接输入上标，并且适配不到base，则添加一个空的base和superscript，让superscript获取焦点
				 */
				model.toMathMLMode();
				model.setData({data:"", nodeName:"msup"});
				assert.equal("/root/line[1]/math[1]/msup[1]/mrow[2]/mn[1]", model.getPath());
				
				var node = model.getFocusNode();
				assert.equal("mn", node.nodeName);
				assert.equal("drip_placeholder_box", node.getAttribute("class"));
				assert.equal(0, model.getOffset());
				
				var superscriptNode = node;
				assert.equal("msup", superscriptNode.parentNode.parentNode.nodeName);
				
				var baseNode = superscriptNode.parentNode.previousSibling.firstChild;
				assert.equal("mn", baseNode.nodeName);
				assert.equal("drip_placeholder_box", baseNode.getAttribute("class"));
			});
			
			test("mathml模式下，在空的数学编辑器上输入数字和上标", function(){
				/*
				 * <msup> base superscript </msup>
				 * msup中的内容都使用mrow封装
				 */
				model.toMathMLMode();
				model.setData({data:"1"});
				model.setData({data:"", nodeName:"msup"});
				assert.equal("/root/line[1]/math[1]/msup[1]/mrow[2]/mn[1]", model.getPath());
				
				var node = model.getFocusNode();
				assert.equal("mn", node.nodeName);
				assert.equal("drip_placeholder_box", node.getAttribute("class"));
				assert.equal(0, model.getOffset());
				
				var superscriptNode = node;
				assert.equal("msup", superscriptNode.parentNode.parentNode.nodeName);
				
				var baseNode = superscriptNode.parentNode.previousSibling.firstChild;
				assert.equal("mn", baseNode.nodeName);
				assert.equal("1", dripLang.getText(baseNode));
			});
			
			test("mathml模式下，在空的数学编辑器上输入变量和上标", function(){
				/*
				 * <msup> base superscript </msup>
				 * msup中的内容都使用mrow封装
				 */
				model.toMathMLMode();
				model.setData({data:"x"});
				model.setData({data:"", nodeName:"msup"});
				assert.equal("/root/line[1]/math[1]/msup[1]/mrow[2]/mn[1]", model.getPath());
				
				var node = model.getFocusNode();
				assert.equal("mn", node.nodeName);
				assert.equal("drip_placeholder_box", node.getAttribute("class"));
				assert.equal(0, model.getOffset());
				
				var superscriptNode = node;
				assert.equal("msup", superscriptNode.parentNode.parentNode.nodeName);
				
				var baseNode = superscriptNode.parentNode.previousSibling.firstChild;
				assert.equal("mi", baseNode.nodeName);
				assert.equal("x", dripLang.getText(baseNode));
			});
			
			test("mathml模式下，在空的数学编辑器上输入不带上标的操作符和上标", function(){
				/*
				 * <msup> base superscript </msup>
				 * msup中的内容都使用mrow封装
				 */
				model.toMathMLMode();
				model.setData({data:"+"});
				model.setData({data:"", nodeName:"msup"});
				assert.equal("/root/line[1]/math[1]/msup[2]/mrow[2]/mn[1]", model.getPath());
				
				var node = model.getFocusNode();
				assert.equal("mn", node.nodeName);
				assert.equal("drip_placeholder_box", node.getAttribute("class"));
				assert.equal(0, model.getOffset());
				
				var superscriptNode = node;
				assert.equal("msup", superscriptNode.parentNode.parentNode.nodeName);
				
				var baseNode = superscriptNode.parentNode.previousSibling.firstChild;
				assert.equal("mn", baseNode.nodeName);
				assert.equal("drip_placeholder_box", baseNode.getAttribute("class"));
				
				var line = model.getLineAt(0);
				assert.equal("+", dripLang.getText(line.firstChild.firstChild));
				assert.equal(2, dripLang.getChildLength(line.firstChild));
			});
			
			test("mathml模式下，输入数字，输入^", function(){
				/*
				 * <msup> base superscript </msup>
				 * msup中的内容都使用mrow封装
				 */
				model.toMathMLMode();
				model.setData({data:"1"});
				model.setData({data:"^"});
				assert.equal("/root/line[1]/math[1]/msup[1]/mrow[2]/mn[1]", model.getPath());
				
				var node = model.getFocusNode();
				assert.equal("mn", node.nodeName);
				assert.equal("drip_placeholder_box", node.getAttribute("class"));
				assert.equal(0, model.getOffset());
				
				var superscriptNode = node;
				assert.equal("msup", superscriptNode.parentNode.parentNode.nodeName);
				
				var baseNode = superscriptNode.parentNode.previousSibling.firstChild;
				assert.equal("mn", baseNode.nodeName);
				assert.equal("1", dripLang.getText(baseNode));
			});
			
			test("光标停留在一个节点之前，而这个节点前面没有兄弟节点", function(){
				/*
				 * <msup> base superscript </msup>
				 * msup中的内容都使用mrow封装
				 */
				model.loadData("<root><line><math><mn>12</mn></math></line></root>");
				model.mode = "mathml";
				var line = model.getLineAt(0);
				model.anchor.node = line.firstChild.firstChild;
				model.anchor.offset = 0;
				model.path = [];
				model.path.push({nodeName:"root"});
				model.path.push({nodeName:"line", offset: 1});
				model.path.push({nodeName:"math", offset: 1});
				model.path.push({nodeName:"mn", offset: 1});
				model.setData({data:"", nodeName:"msup"});
				assert.equal("/root/line[1]/math[1]/msup[1]/mrow[2]/mn[1]", model.getPath());
				
				var node = model.getFocusNode();
				assert.equal("mn", node.nodeName);
				assert.equal("drip_placeholder_box", node.getAttribute("class"));
				assert.equal(0, model.getOffset());
				
				var superscriptNode = node;
				assert.equal("msup", superscriptNode.parentNode.parentNode.nodeName);
				
				var baseNode = superscriptNode.parentNode.previousSibling.firstChild;
				assert.equal("mn", baseNode.nodeName);
				assert.equal("drip_placeholder_box", baseNode.getAttribute("class"));
				
				assert.equal(2, dripLang.getChildLength(line.firstChild));
			});
			
			test("光标停留在一个节点之前，而这个节点前面有一个mn节点", function(){
				/*
				 * <msup> base superscript </msup>
				 * msup中的内容都使用mrow封装
				 */
				model.loadData("<root><line><math><mn>12</mn><mn>34</mn></math></line></root>");
				model.mode = "mathml";
				var line = model.getLineAt(0);
				model.anchor.node = line.firstChild.lastChild;
				model.anchor.offset = 0;
				model.path = [];
				model.path.push({nodeName:"root"});
				model.path.push({nodeName:"line", offset: 1});
				model.path.push({nodeName:"math", offset: 1});
				model.path.push({nodeName:"mn", offset: 2});
				model.setData({data:"", nodeName:"msup"});
				assert.equal("/root/line[1]/math[1]/msup[1]/mrow[2]/mn[1]", model.getPath());
				
				var node = model.getFocusNode();
				assert.equal("mn", node.nodeName);
				assert.equal("drip_placeholder_box", node.getAttribute("class"));
				assert.equal(0, model.getOffset());
				
				var superscriptNode = node;
				assert.equal("msup", superscriptNode.parentNode.parentNode.nodeName);
				
				var baseNode = superscriptNode.parentNode.previousSibling.firstChild;
				assert.equal("mn", baseNode.nodeName);
				assert.equal("12", dripLang.getText(baseNode));
				
				assert.equal(2, dripLang.getChildLength(line.firstChild));
			});
			
			test("base中有一个mn节点，在base起始部分输入一个mo节点", function(){
				/*
				 * <msup> base superscript </msup>
				 * msup中的内容都使用mrow封装
				 */
				model.loadData("<root><line><math>" +
							"<msup>" +
								"<mrow><mn>12</mn></mrow>" +
								"<mrow><mn>2</mn></mrow>" +
							"</msup>" +
						"</math></line></root>");
				model.mode = "mathml";
				var line = model.getLineAt(0);
				model.anchor.node = line.firstChild.firstChild.firstChild.firstChild;
				model.anchor.offset = 0;
				model.path = [];
				model.path.push({nodeName:"root"});
				model.path.push({nodeName:"line", offset: 1});
				model.path.push({nodeName:"math", offset: 1});
				model.path.push({nodeName:"msup", offset: 1});
				model.path.push({nodeName:"mrow", offset: 1});
				model.path.push({nodeName:"mn", offset: 1});
				model.setData({data:"+"});
				// 输入完成后，就将光标从msup的base中移出来
				assert.equal("/root/line[1]/math[1]/msup[2]", model.getPath());
				
				// 输入完成后，光标还是停留在msup前
				var node = model.getFocusNode();
				assert.equal("msup", node.nodeName);
				assert.equal(0, model.getOffset());
				assert.equal(2, dripLang.getChildLength(line.firstChild));
				assert.equal(node.previousSibling, line.firstChild.firstChild);
			});
			
			test("base中有一个mn节点，在base起始部分输入一个mn节点，则将数字合并在一起", function(){
				model.loadData("<root><line><math>" +
						"<msup>" +
							"<mrow><mn>23</mn></mrow>" +
							"<mrow><mn>2</mn></mrow>" +
						"</msup>" +
					"</math></line></root>");
				model.mode = "mathml";
				var line = model.getLineAt(0);
				model.anchor.node = line.firstChild.firstChild.firstChild.firstChild;
				model.anchor.offset = 0;
				model.path = [];
				model.path.push({nodeName:"root"});
				model.path.push({nodeName:"line", offset: 1});
				model.path.push({nodeName:"math", offset: 1});
				model.path.push({nodeName:"msup", offset: 1});
				model.path.push({nodeName:"mrow", offset: 1});
				model.path.push({nodeName:"mn", offset: 1});
				model.setData({data:"1"});
				// 输入完成后，就将光标从msup的base中移出来
				assert.equal("/root/line[1]/math[1]/msup[1]/mrow[1]/mn[1]", model.getPath());
				
				var node = model.getFocusNode();
				assert.equal("mn", node.nodeName);
				assert.equal(1, model.getOffset());
				assert.equal(1, dripLang.getChildLength(line.firstChild));
				assert.equal("123", dripLang.getText(node));
			});
			
			test("base中有一个mn节点，在base起始部分输入一个layout节点", function(){
				model.loadData("<root><line><math>" +
						"<msup>" +
							"<mrow><mn>23</mn></mrow>" +
							"<mrow><mn>2</mn></mrow>" +
						"</msup>" +
					"</math></line></root>");
				model.mode = "mathml";
				var line = model.getLineAt(0);
				model.anchor.node = line.firstChild.firstChild.firstChild.firstChild;
				model.anchor.offset = 0;
				model.path = [];
				model.path.push({nodeName:"root"});
				model.path.push({nodeName:"line", offset: 1});
				model.path.push({nodeName:"math", offset: 1});
				model.path.push({nodeName:"msup", offset: 1});
				model.path.push({nodeName:"mrow", offset: 1});
				model.path.push({nodeName:"mn", offset: 1});
				model.setData({data:"", nodeName:"msqrt"});
				// 输入完成后，就将光标从msup的base中移出来
				assert.equal("/root/line[1]/math[1]/msqrt[1]/mn[1]", model.getPath());
				
				var node = model.getFocusNode();
				assert.equal("mn", node.nodeName);
				assert.equal(0, model.getOffset());
				assert.equal(2, dripLang.getChildLength(line.firstChild));
				assert.equal("msqrt", line.firstChild.firstChild.nodeName);
			});
			
			test("base中有一个mn节点，在base结尾部分输入一个mn节点，则将数字合并在一起", function(){
				model.loadData("<root><line><math>" +
						"<msup>" +
							"<mrow><mn>12</mn></mrow>" +
							"<mrow><mn>2</mn></mrow>" +
						"</msup>" +
					"</math></line></root>");
				model.mode = "mathml";
				var line = model.getLineAt(0);
				model.anchor.node = line.firstChild.firstChild.firstChild.firstChild;
				model.anchor.offset = 2;
				model.path = [];
				model.path.push({nodeName:"root"});
				model.path.push({nodeName:"line", offset: 1});
				model.path.push({nodeName:"math", offset: 1});
				model.path.push({nodeName:"msup", offset: 1});
				model.path.push({nodeName:"mrow", offset: 1});
				model.path.push({nodeName:"mn", offset: 1});
				model.setData({data:"3"});
				// 输入完成后，就将光标从msup的base中移出来
				assert.equal("/root/line[1]/math[1]/msup[1]/mrow[1]/mn[1]", model.getPath());
				
				var node = model.getFocusNode();
				assert.equal("mn", node.nodeName);
				assert.equal(3, model.getOffset());
				assert.equal(1, dripLang.getChildLength(line.firstChild));
				assert.equal("123", dripLang.getText(node));
			});
			
			test("base中有一个mn节点，在base结尾部分输入一个mi节点", function(){
				/*
				 * <msup> base superscript </msup>
				 * msup中的内容都使用mrow封装
				 */
				model.loadData("<root><line><math>" +
							"<msup>" +
								"<mrow><mn>12</mn></mrow>" +
								"<mrow><mn>2</mn></mrow>" +
							"</msup>" +
						"</math></line></root>");
				model.mode = "mathml";
				var line = model.getLineAt(0);
				model.anchor.node = line.firstChild.firstChild.firstChild.firstChild;
				model.anchor.offset = 2;
				model.path = [];
				model.path.push({nodeName:"root"});
				model.path.push({nodeName:"line", offset: 1});
				model.path.push({nodeName:"math", offset: 1});
				model.path.push({nodeName:"msup", offset: 1});
				model.path.push({nodeName:"mrow", offset: 1});
				model.path.push({nodeName:"mn", offset: 1});
				model.setData({data:"x"});
				// 输入完成后，就将光标从msup的base中移出来
				assert.equal("/root/line[1]/math[1]/msup[2]/mrow[1]/mi[1]", model.getPath());
				
				// 输入完成后，光标还是停留在msup前
				var node = model.getFocusNode();
				assert.equal("mi", node.nodeName);
				assert.equal(1, model.getOffset());
				assert.equal(2, dripLang.getChildLength(line.firstChild));
				assert.equal("mn", line.firstChild.firstChild.nodeName);
			});
			
			test("base中有一个mn节点，在base结尾部分输入一个mo节点,将mo和之前的节点都移到base外面，让空的base获取焦点", function(){
				/*
				 * <msup> base superscript </msup>
				 * msup中的内容都使用mrow封装
				 */
				model.loadData("<root><line><math>" +
							"<msup>" +
								"<mrow><mn>12</mn></mrow>" +
								"<mrow><mn>2</mn></mrow>" +
							"</msup>" +
						"</math></line></root>");
				model.mode = "mathml";
				var line = model.getLineAt(0);
				model.anchor.node = line.firstChild.firstChild.firstChild.firstChild;
				model.anchor.offset = 2;
				model.path = [];
				model.path.push({nodeName:"root"});
				model.path.push({nodeName:"line", offset: 1});
				model.path.push({nodeName:"math", offset: 1});
				model.path.push({nodeName:"msup", offset: 1});
				model.path.push({nodeName:"mrow", offset: 1});
				model.path.push({nodeName:"mn", offset: 1});
				model.setData({data:"+"});
				// 输入完成后，就将光标从msup的base中移出来
				assert.equal("/root/line[1]/math[1]/msup[3]/mrow[1]/mn[1]", model.getPath());
				
				// 输入完成后，光标还是停留在msup前
				var node = model.getFocusNode();
				assert.equal("mn", node.nodeName);
				assert.equal(0, model.getOffset());
				
				assert.equal(3, dripLang.getChildLength(line.firstChild));
				assert.equal("mn", line.firstChild.firstChild.nodeName);
				assert.equal("mo", line.firstChild.firstChild.nextSibling.nodeName);
			});
			
			test("base中有一个mn节点，在base结尾部分输入layout节点", function(){
				/*
				 * <msup> base superscript </msup>
				 * msup中的内容都使用mrow封装
				 */
				model.loadData("<root><line><math>" +
							"<msup>" +
								"<mrow><mn>12</mn></mrow>" +
								"<mrow><mn>2</mn></mrow>" +
							"</msup>" +
						"</math></line></root>");
				model.mode = "mathml";
				var line = model.getLineAt(0);
				model.anchor.node = line.firstChild.firstChild.firstChild.firstChild;
				model.anchor.offset = 2;
				model.path = [];
				model.path.push({nodeName:"root"});
				model.path.push({nodeName:"line", offset: 1});
				model.path.push({nodeName:"math", offset: 1});
				model.path.push({nodeName:"msup", offset: 1});
				model.path.push({nodeName:"mrow", offset: 1});
				model.path.push({nodeName:"mn", offset: 1});
				model.setData({data:"", nodeName:"msqrt"});
				assert.equal("/root/line[1]/math[1]/msup[2]/mrow[1]/msqrt[1]/mn[1]", model.getPath());
				
				// 输入完成后，光标还是停留在msup前
				var node = model.getFocusNode();
				assert.equal("mn", node.nodeName);
				assert.equal(0, model.getOffset());
				
				assert.equal(2, dripLang.getChildLength(line.firstChild));
				assert.equal("mn", line.firstChild.firstChild.nodeName);
				assert.equal("msup", line.firstChild.firstChild.nextSibling.nodeName);
			});
			
			test("前面有一个msup，在其后输入一个变量，然后输入^", function(){
				model.loadData("<root><line>" +
  						"<math>" +
	  						"<msup>" +
		  						"<mrow><mn>2</mn></mrow>" + // base
		  						"<mrow><mn>1</mn></mrow>" + // superscript
	  						"</msup>" +
	  						"<mi>x</mi>" +
  						"</math>" +
  				"</line></root>");
  				model.mode = "mathml";
  				var line = model.getLineAt(0);
  				model.anchor.node = line.firstChild.lastChild;
  				model.anchor.offset = 1;
  				model.path = [];
  				model.path.push({nodeName: "root"});
  				model.path.push({nodeName: "line", offset: 1});
  				model.path.push({nodeName: "math", offset: 1});
  				model.path.push({nodeName: "mn", offset: 2});
  				model.setData({data:"", nodeName:"msup"});
  				assert.equal("/root/line[1]/math[1]/msup[2]/mrow[2]/mn[1]", model.getPath());
				var node = model.getFocusNode();
				assert.equal("mn", node.nodeName);
				assert.equal(0, model.getOffset());
				// 占位符
				assert.equal("x", dripLang.getText(line.firstChild.lastChild.firstChild.firstChild));
			});
		});
	}
	
});