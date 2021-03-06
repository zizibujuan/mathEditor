define([ "intern!tdd", 
         "intern/chai!assert", 
         "mathEditor/Model", 
         "mathEditor/lang" ], function(
        		 tdd,
        		 assert,
        		 Model, 
        		 dripLang) {
	// 原则：在移动光标时，出现在两个节点之间时，根据移动方向的就近原则来放置，但是不管放在哪里，他们都表示相同的位置。
	// summary
	//		右移的测试逻辑有：
	//		1.在空的分数下
	//			由分数前面右移到分子前面
	//			由分子后面右移到分母前面
	//			由分母后面右移到分数后面
	//		2.涉及到两种模式之间的切换
	//			由text节点左移到math节点上
	//			由math节点左移到text节点上
	with(tdd){
		suite("Model.moveRight.frac frac在分数之间右移光标", function(){
			
			var model = null;
			beforeEach(function () {
				model = new Model({});
			});
			
			test("mathml模式下，由分数前面右移到分子前面，当分子里第一个元素是token节点时，分数前没有节点", function(){
				model.loadData("<root><line>" +
						"<math>" +
							"<mstyle>" +
								"<mfrac>" +
									"<mrow><mn>11</mn></mrow>" +
									"<mrow><mn>22</mn></mrow>" +
								"</mfrac>" +
							"</mstyle>" +
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
				model.moveRight();
				assert.equal("/root/line[1]/math[1]/mfrac[1]/mrow[1]/mn[1]", model.getPath());
				var node = model.getFocusNode();
				assert.ok(node.parentNode.previousSibling == null); // 证明是分子。
				assert.equal("mn", node.nodeName);
				assert.equal(0, model.getOffset());
				assert.equal("11", dripLang.getText(node));
			});
			
			test("mathml模式下，由分数前面右移到分子前面，当分子里第一个元素是layout节点时,layout节点没有被mstyle封装，分数前没有节点", function(){
				model.loadData("<root><line>" +
						"<math>" +
							"<mstyle>" +
								"<mfrac>" +
									"<mrow><mroot><mrow><mn>1</mn></mrow><mrow><mn>2</mn></mrow></mroot></mrow>" +
									"<mrow><mn>11</mn></mrow>" +
								"</mfrac>" +
							"</mstyle>" +
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
				model.moveRight();
				assert.equal("/root/line[1]/math[1]/mfrac[1]/mrow[1]/mroot[1]", model.getPath());
				var node = model.getFocusNode();
				assert.ok(node.parentNode.previousSibling == null); // 证明是分子。
				assert.equal("mroot", node.nodeName);
				assert.equal(0, model.getOffset());
			});
			
			test("mathml模式下，由分数前面右移到分子前面，当分子里第一个元素是layout节点时,layout节点被mstyle封装，分数前没有节点", function(){
				model.loadData("<root><line>" +
						"<math>" +
							"<mstyle>" +
								"<mfrac>" +
									"<mrow><mstyle><mfrac><mrow><mn>1</mn></mrow><mrow><mn>2</mn></mrow></mfrac></mstyle></mrow>" +
									"<mrow><mn>11</mn></mrow>" +
								"</mfrac>" +
							"</mstyle>" +
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
				model.moveRight();
				assert.equal("/root/line[1]/math[1]/mfrac[1]/mrow[1]/mfrac[1]", model.getPath());
				var node = model.getFocusNode();
				assert.ok(node.parentNode.previousSibling == null); // 证明是分子。
				assert.equal("mfrac", node.nodeName);
				assert.equal(0, model.getOffset());
			});
			
			test("mathml模式下，由分数前面右移到分子前面，当分子里第一个元素是token节点时，分数前有一个token节点", function(){
				model.loadData("<root><line>" +
						"<math>" +
							"<mn>12</mn>" +
							"<mstyle>" +
								"<mfrac>" +
									"<mrow><mn>11</mn></mrow>" +
									"<mrow><mn>22</mn></mrow>" +
								"</mfrac>" +
							"</mstyle>" +
						"</math>" +
				"</line></root>");
				model.mode = "mathml";
				var line = model.getLineAt(0);
				model.anchor.node = line.firstChild.firstChild;
				model.anchor.offset = 2;
				model.path = [];
				model.path.push({nodeName: "root"});
				model.path.push({nodeName: "line", offset: 1});
				model.path.push({nodeName: "math", offset: 1});
				model.path.push({nodeName: "mn", offset: 1});
				model.moveRight();
				assert.equal("/root/line[1]/math[1]/mfrac[2]/mrow[1]/mn[1]", model.getPath());
				var node = model.getFocusNode();
				assert.ok(node.parentNode.previousSibling == null); // 证明是分子。
				assert.equal("mn", node.nodeName);
				assert.equal(0, model.getOffset());
				assert.equal("11", dripLang.getText(node));
			});
			
			test("mathml模式下，由分数前面右移到分子前面，当分子里第一个元素是layout节点时,layout节点没有被mstyle封装，分数前有一个token节点", function(){
				model.loadData("<root><line>" +
						"<math>" +
							"<mn>12</mn>" +
							"<mstyle>" +
								"<mfrac>" +
									"<mrow><mroot><mrow><mn>1</mn></mrow><mrow><mn>2</mn></mrow></mroot></mrow>" +
									"<mrow><mn>11</mn></mrow>" +
								"</mfrac>" +
							"</mstyle>" +
						"</math>" +
				"</line></root>");
				model.mode = "mathml";
				var line = model.getLineAt(0);
				model.anchor.node = line.firstChild.firstChild;
				model.anchor.offset = 2;
				model.path = [];
				model.path.push({nodeName: "root"});
				model.path.push({nodeName: "line", offset: 1});
				model.path.push({nodeName: "math", offset: 1});
				model.path.push({nodeName: "mn", offset: 1});
				model.moveRight();
				assert.equal("/root/line[1]/math[1]/mfrac[2]/mrow[1]/mroot[1]", model.getPath());
				var node = model.getFocusNode();
				assert.ok(node.parentNode.previousSibling == null); // 证明是分子。
				assert.equal("mroot", node.nodeName);
				assert.equal(0, model.getOffset());
			});
			
			test("mathml模式下，由分数前面右移到分子前面，当分子里第一个元素是layout节点时,layout节点被mstyle封装，分数前有一个token节点", function(){
				model.loadData("<root><line>" +
						"<math>" +
							"<mn>12</mn>" +
							"<mstyle>" +
								"<mfrac>" +
									"<mrow><mstyle><mfrac><mrow><mn>1</mn></mrow><mrow><mn>2</mn></mrow></mfrac></mstyle></mrow>" +
									"<mrow><mn>11</mn></mrow>" +
								"</mfrac>" +
							"</mstyle>" +
						"</math>" +
				"</line></root>");
				model.mode = "mathml";
				var line = model.getLineAt(0);
				model.anchor.node = line.firstChild.firstChild;
				model.anchor.offset = 2;
				model.path = [];
				model.path.push({nodeName: "root"});
				model.path.push({nodeName: "line", offset: 1});
				model.path.push({nodeName: "math", offset: 1});
				model.path.push({nodeName: "mfrac", offset: 1});
				model.moveRight();
				assert.equal("/root/line[1]/math[1]/mfrac[2]/mrow[1]/mfrac[1]", model.getPath());
				var node = model.getFocusNode();
				assert.ok(node.parentNode.previousSibling == null); // 证明是分子。
				assert.equal("mfrac", node.nodeName);
				assert.equal(0, model.getOffset());
			});
			
			test("mathml模式下，由分数前面右移到分子前面，当分子里第一个元素是token节点时，分数前有一个layout节点,该layout没有被mstyle封装", function(){
				model.loadData("<root><line>" +
						"<math>" +
							"<mroot>" +
								"<mrow><mn>1</mn></mrow>" +
								"<mrow><mn>2</mn></mrow>" +
							"</mroot>" +
							"<mstyle>" +
								"<mfrac>" +
									"<mrow><mn>34</mn></mrow>" +
									"<mrow><mn>22</mn></mrow>" +
								"</mfrac>" +
							"</mstyle>" +
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
				model.path.push({nodeName: "mroot", offset: 1});
				model.moveRight();
				assert.equal("/root/line[1]/math[1]/mfrac[2]/mrow[1]/mn[1]", model.getPath());
				var node = model.getFocusNode();
				assert.ok(node.parentNode.previousSibling == null); // 证明是分子。
				assert.equal("mn", node.nodeName);
				assert.equal(0, model.getOffset());
				assert.equal("34", dripLang.getText(node));
			});
			
			test("mathml模式下，由分数前面右移到分子前面，当分子里第一个元素是layout节点时,该节点没有被mstyle封装，" +
						"分数前有一个layout节点,前面的layout没有被mstyle封装", function(){
				model.loadData("<root><line>" +
						"<math>" +
							"<mroot>" +
								"<mrow><mn>1</mn></mrow>" +
								"<mrow><mn>2</mn></mrow>" +
							"</mroot>" +
							"<mstyle>" +
								"<mfrac>" +
									"<mrow>" +
										"<mroot>" +
											"<mrow><mn>1</mn></mrow>" +
											"<mrow><mn>2</mn></mrow>" +
										"</mroot>" +
									"</mrow>" +
									"<mrow><mn>22</mn></mrow>" +
								"</mfrac>" +
							"</mstyle>" +
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
				model.path.push({nodeName: "mroot", offset: 1});
				model.moveRight();
				assert.equal("/root/line[1]/math[1]/mfrac[2]/mrow[1]/mroot[1]", model.getPath());
				var node = model.getFocusNode();
				assert.ok(node.parentNode.previousSibling == null); // 证明是分子。
				assert.equal("mroot", node.nodeName);
				assert.equal(0, model.getOffset());
			});
			
			test("mathml模式下，由分数前面右移到分子前面，当分子里第一个元素是layout节点时,该节点没有被mstyle封装，" +
						"分数前有一个layout节点,前面的layout没有被mstyle封装", function(){
				model.loadData("<root><line>" +
						"<math>" +
							"<mroot>" +
								"<mrow><mn>1</mn></mrow>" +
								"<mrow><mn>2</mn></mrow>" +
							"</mroot>" +
							"<mstyle>" +
								"<mfrac>" +
									"<mrow>" +
										"<mstyle>" +
											"<mfrac>" +
												"<mrow><mn>1</mn></mrow>" +
												"<mrow><mn>2</mn></mrow>" +
											"</mfrac>" +
										"</mstyle>" +
									"</mrow>" +
									"<mrow><mn>22</mn></mrow>" +
								"</mfrac>" +
							"</mstyle>" +
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
				model.path.push({nodeName: "mroot", offset: 1});
				model.moveRight();
				assert.equal("/root/line[1]/math[1]/mfrac[2]/mrow[1]/mfrac[1]", model.getPath());
				var node = model.getFocusNode();
				assert.ok(node.parentNode.previousSibling == null); // 证明是分子。
				assert.equal("mfrac", node.nodeName);
				assert.equal(0, model.getOffset());
			});
			
			test("mathml模式下，由分数前面右移到分子前面，当分子里第一个元素是token节点时，分数前有一个layout节点,该layout被mstyle封装", function(){
				model.loadData("<root><line>" +
						"<math>" +
							"<mstyle>" +
								"<mfrac>" +
									"<mrow><mn>1</mn></mrow>" +
									"<mrow><mn>2</mn></mrow>" +
								"</mfrac>" +
							"</mstyle>" +
							"<mstyle>" +
								"<mfrac>" +
									"<mrow><mn>11</mn></mrow>" +
									"<mrow><mn>22</mn></mrow>" +
								"</mfrac>" +
							"</mstyle>" +
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
				model.moveRight();
				assert.equal("/root/line[1]/math[1]/mfrac[2]/mrow[1]/mn[1]", model.getPath());
				var node = model.getFocusNode();
				assert.ok(node.parentNode.previousSibling == null); // 证明是分子。
				assert.equal("mn", node.nodeName);
				assert.equal(0, model.getOffset());
				assert.equal("11", dripLang.getText(node));
			});
			
			test("mathml模式下，由分数前面右移到分子前面，当分子里第一个元素是layout节点时,该layout节点没有被mstyle封装，" +
						"分数前有一个layout节点,前面的layout被mstyle封装", function(){
				model.loadData("<root><line>" +
						"<math>" +
							"<mstyle>" +
								"<mfrac>" +
									"<mrow><mn>1</mn></mrow>" +
									"<mrow><mn>2</mn></mrow>" +
								"</mfrac>" +
							"</mstyle>" +
							"<mstyle>" +
								"<mfrac>" +
									"<mrow>" +
										"<mroot>" +
											"<mrow><mn>1</mn></mrow>" +
											"<mrow><mn>2</mn></mrow>" +
										"</mroot>" +
									"</mrow>" +
									"<mrow><mn>22</mn></mrow>" +
								"</mfrac>" +
							"</mstyle>" +
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
				model.moveRight();
				assert.equal("/root/line[1]/math[1]/mfrac[2]/mrow[1]/mroot[1]", model.getPath());
				var node = model.getFocusNode();
				assert.ok(node.parentNode.previousSibling == null); // 证明是分子。
				assert.equal("mroot", node.nodeName);
				assert.equal(0, model.getOffset());
			});
			
			test("mathml模式下，由分数前面右移到分子前面，当分子里第一个元素是layout节点时,该layout节点被mstyle封装，" +
						"分数前有一个layout节点,前面的layout被mstyle封装", function(){
				model.loadData("<root><line>" +
						"<math>" +
							"<mstyle>" +
								"<mfrac>" +
									"<mrow><mn>1</mn></mrow>" +
									"<mrow><mn>2</mn></mrow>" +
								"</mfrac>" +
							"</mstyle>" +
							"<mstyle>" +
								"<mfrac>" +
									"<mrow>" +
										"<mstyle>" +
											"<mfrac>" +
												"<mrow><mn>1</mn></mrow>" +
												"<mrow><mn>2</mn></mrow>" +
											"</mfrac>" +
										"</mstyle>" +
									"</mrow>" +
									"<mrow><mn>22</mn></mrow>" +
								"</mfrac>" +
							"</mstyle>" +
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
				model.moveRight();
				assert.equal("/root/line[1]/math[1]/mfrac[2]/mrow[1]/mfrac[1]", model.getPath());
				var node = model.getFocusNode();
				assert.ok(node.parentNode.previousSibling == null); // 证明是分子。
				assert.equal("mfrac", node.nodeName);
				assert.equal(0, model.getOffset());
			});
			
			test("mathml模式下，由分数前面右移到分子前面，当分子里第一个元素是layout节点时", function(){
				model.loadData("<root><line>" +
						"<math>" +
							"<mstyle>" +
								"<mfrac>" +
									"<mrow><mstyle><mfrac><mrow><mn>22</mn></mrow><mrow><mn>33</mn></mrow></mfrac></mstyle></mrow>" +
									"<mrow><mn>1</mn></mrow>" +
								"</mfrac>" +
							"</mstyle>" +
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
				model.moveRight();
				assert.equal("/root/line[1]/math[1]/mfrac[1]/mrow[1]/mfrac[1]", model.getPath());
				var node = model.getFocusNode();
				assert.ok(node.parentNode.previousSibling == null); // 证明是分子。
				assert.equal("mfrac", node.nodeName);
				assert.equal(0, model.getOffset());
			});
			
			test("mathml模式下，执行右移，从分子最后面移到分母最前面，分子尾节点是token节点，分母首节点是token节点", function(){
				model.loadData("<root><line>" +
						"<math>" +
							"<mstyle>" +
		  						"<mfrac>" +
			  						"<mrow><mn>11</mn></mrow>" +
			  						"<mrow><mn>22</mn></mrow>" +
		  						"</mfrac>" +
							"</mstyle>" +
						"</math>" +
				"</line></root>");
				model.mode = "mathml";
				var line = model.getLineAt(0);
				model.anchor.node = line.firstChild.firstChild.firstChild.firstChild.firstChild;
				model.anchor.offset = 2;
				model.path = [];
				model.path.push({nodeName: "root"});
				model.path.push({nodeName: "line", offset: 1});
				model.path.push({nodeName: "math", offset: 1});
				model.path.push({nodeName: "mfrac", offset: 1});
				model.path.push({nodeName: "mrow", offset: 1});
				model.path.push({nodeName: "mn", offset: 1});
				model.moveRight();
				assert.equal("/root/line[1]/math[1]/mfrac[1]/mrow[2]/mn[1]", model.getPath());
				var node = model.getFocusNode();
				assert.ok(node.parentNode.nextSibling == null); // 证明是分母。
				assert.equal("mn", node.nodeName);
				assert.equal(0, model.getOffset());
				assert.equal("22", dripLang.getText(node));
			});
			
			test("mathml模式下，执行右移，从分子最后面移到分母最前面，分子尾节点是layout节点，分母首节点是token节点", function(){
				model.loadData("<root><line>" +
						"<math>" +
							"<mstyle>" +
	  						"<mfrac>" +
		  						"<mrow><mstyle><mfrac><mrow><mn>123</mn></mrow><mrow><mn>456</mn></mrow></mfrac></mstyle></mrow>" +
		  						"<mrow><mn>22</mn></mrow>" +
	  						"</mfrac>" +
							"</mstyle>" +
						"</math>" +
				"</line></root>");
				model.mode = "mathml";
				var line = model.getLineAt(0);
				model.anchor.node = line.firstChild.firstChild.firstChild.firstChild.firstChild.firstChild;
				model.anchor.offset = 1;
				model.path = [];
				model.path.push({nodeName: "root"});
				model.path.push({nodeName: "line", offset: 1});
				model.path.push({nodeName: "math", offset: 1});
				model.path.push({nodeName: "mfrac", offset: 1});
				model.path.push({nodeName: "mrow", offset: 1});
				model.path.push({nodeName: "mfrac", offset: 1});
				model.moveRight();
				assert.equal("/root/line[1]/math[1]/mfrac[1]/mrow[2]/mn[1]", model.getPath());
				var node = model.getFocusNode();
				assert.ok(node.parentNode.nextSibling == null); // 证明是分母。
				assert.equal("mn", node.nodeName);
				assert.equal(0, model.getOffset());
				assert.equal("22", dripLang.getText(node));
			});
			
			test("mathml模式下，执行右移，从分子最后面移到分母最前面，分子尾节点是token节点，分母首节点是layout节点", function(){
				model.loadData("<root><line>" +
						"<math>" +
							"<mstyle>" +
	  						"<mfrac>" +
		  						"<mrow><mn>22</mn></mrow>" +
		  						"<mrow><mstyle><mfrac><mrow><mn>123</mn></mrow><mrow><mn>456</mn></mrow></mfrac></mstyle></mrow>" +
	  						"</mfrac>" +
							"</mstyle>" +
						"</math>" +
				"</line></root>");
				model.mode = "mathml";
				var line = model.getLineAt(0);
				model.anchor.node = line.firstChild.firstChild.firstChild.firstChild.firstChild;
				model.anchor.offset = 2;
				model.path = [];
				model.path.push({nodeName: "root"});
				model.path.push({nodeName: "line", offset: 1});
				model.path.push({nodeName: "math", offset: 1});
				model.path.push({nodeName: "mfrac", offset: 1});
				model.path.push({nodeName: "mrow", offset: 1});
				model.path.push({nodeName: "mn", offset: 1});
				model.moveRight();
				assert.equal("/root/line[1]/math[1]/mfrac[1]/mrow[2]/mfrac[1]", model.getPath());
				var node = model.getFocusNode();
				assert.ok(node.parentNode.nextSibling == null); // 证明是分母。
				assert.equal("mfrac", node.nodeName);
				assert.equal(0, model.getOffset());
			});
			
			test("mathml模式下，执行右移，从分子最后面移到分母最前面，分子尾节点是layout节点，分母首节点是layout节点", function(){
				model.loadData("<root><line>" +
						"<math>" +
							"<mstyle>" +
	  						"<mfrac>" +
		  						"<mrow><mstyle><mfrac><mrow><mn>111</mn></mrow><mrow><mn>222</mn></mrow></mfrac></mstyle></mrow>" +
		  						"<mrow><mstyle><mfrac><mrow><mn>123</mn></mrow><mrow><mn>456</mn></mrow></mfrac></mstyle></mrow>" +
	  						"</mfrac>" +
							"</mstyle>" +
						"</math>" +
				"</line></root>");
				model.mode = "mathml";
				var line = model.getLineAt(0);
				model.anchor.node = line.firstChild.firstChild.firstChild.firstChild.firstChild.firstChild;
				model.anchor.offset = 1;
				model.path = [];
				model.path.push({nodeName: "root"});
				model.path.push({nodeName: "line", offset: 1});
				model.path.push({nodeName: "math", offset: 1});
				model.path.push({nodeName: "mfrac", offset: 1});
				model.path.push({nodeName: "mrow", offset: 1});
				model.path.push({nodeName: "mfrac", offset: 1});
				model.moveRight();
				assert.equal("/root/line[1]/math[1]/mfrac[1]/mrow[2]/mfrac[1]", model.getPath());
				var node = model.getFocusNode();
				assert.ok(node.parentNode.nextSibling == null); // 证明是分母。
				assert.equal("mfrac", node.nodeName);
				assert.equal(0, model.getOffset());
			});
			
			test("mathml模式下，由分母后右移到分数后，当分母上的最后一个元素是token节点时", function(){
				model.loadData("<root><line>" +
						"<math>" +
							"<mstyle>" +
	  						"<mfrac>" +
		  						"<mrow><mn>1</mn></mrow>" +
		  						"<mrow><mn>22</mn></mrow>" +
	  						"</mfrac>" +
							"</mstyle>" +
						"</math>" +
						"</line></root>");
				model.mode = "mathml";
				var line = model.getLineAt(0);
				model.anchor.node = line.firstChild.firstChild.firstChild.lastChild.firstChild;
				model.anchor.offset = 2;
				model.path = [];
				model.path.push({nodeName: "root"});
				model.path.push({nodeName: "line", offset: 1});
				model.path.push({nodeName: "math", offset: 1});
				model.path.push({nodeName: "mfrac", offset: 1});
				model.path.push({nodeName: "mrow", offset: 2});
				model.path.push({nodeName: "mn", offset: 1});
				model.moveRight();
				assert.equal("/root/line[1]/math[1]/mfrac[1]", model.getPath());
				var node = model.getFocusNode();
				assert.equal("mfrac", node.nodeName);
				assert.equal(1, model.getOffset());
			});
			
			test("mathml模式下，由分母后右移到分数后，当分母上的最后一个元素是layout节点时", function(){
				model.loadData("<root><line>" +
						"<math>" +
							"<mstyle>" +
	  						"<mfrac>" +
	  						"<mrow><mn>1</mn></mrow>" +
	  						"<mrow><mstyle><mfrac><mrow><mn>22</mn></mrow><mrow><mn>33</mn></mrow></mfrac></mstyle></mrow>" +
	  						"</mfrac>" +
							"</mstyle>" +
						"</math>" +
						"</line></root>");
				model.mode = "mathml";
				var line = model.getLineAt(0);
				model.anchor.node = line.firstChild.firstChild.firstChild.lastChild.firstChild.firstChild;
				model.anchor.offset = 1;
				model.path = [];
				model.path.push({nodeName: "root"});
				model.path.push({nodeName: "line", offset: 1});
				model.path.push({nodeName: "math", offset: 1});
				model.path.push({nodeName: "mfrac", offset: 1});
				model.path.push({nodeName: "mrow", offset: 2});
				model.path.push({nodeName: "mfrac", offset: 1});
				model.moveRight();
				assert.equal("/root/line[1]/math[1]/mfrac[1]", model.getPath());
				var node = model.getFocusNode();
				assert.equal("mfrac", node.nodeName);
				assert.equal(1, model.getOffset());
			});
			
			test("mathml模式下，在一个空的分子上右移光标", function(){
				model.toMathMLMode();
  				model.setData({data:"", nodeName:"mfrac"});
  				model.moveRight();
  				
  				assert.equal("/root/line[1]/math[1]/mfrac[1]/mrow[2]/mn[1]", model.getPath());
				var node = model.getFocusNode();
				
				assert.ok(node.parentNode.previousSibling != null);
				assert.ok(node.parentNode.nextSibling == null);
				assert.equal("mn", node.nodeName);
				assert.equal("drip_placeholder_box", node.getAttribute("class"));
				assert.equal(0, model.getOffset());
			});
			
			test("mathml模式下，在一个空的分子上输入一个数字，然后右移光标", function(){
				model.toMathMLMode();
  				model.setData({data:"", nodeName:"mfrac"});
  				model.setData({data:"1"});
  				
  				model.moveRight();
  				
  				assert.equal("/root/line[1]/math[1]/mfrac[1]/mrow[2]/mn[1]", model.getPath());
				var node = model.getFocusNode();
				
				assert.ok(node.parentNode.previousSibling != null);
				assert.ok(node.parentNode.nextSibling == null);
				assert.equal("mn", node.nodeName);
				assert.equal("drip_placeholder_box", node.getAttribute("class"));
				assert.equal(0, model.getOffset());
			});
			
			test("mathml模式下，在空的分数上输入分子，右移光标到分母，在分母上输入一个数字，然后左移光标两次，然后右移光标一次，此时光标在分母最前面。", function(){
				model.toMathMLMode();
  				model.setData({data: "", nodeName: "mfrac"});
  				model.setData({data: "1"});
  				model.moveRight();
  				model.setData({data: "2"});
  				
  				model.moveLeft();
  				model.moveLeft();
  				model.moveRight();
  				assert.equal("/root/line[1]/math[1]/mfrac[1]/mrow[2]/mn[1]", model.getPath());
				var node = model.getFocusNode();
				assert.ok(node.parentNode.previousSibling != null);
				assert.equal("mn", node.nodeName);
				assert.equal(0, model.getOffset());
				assert.equal("2", dripLang.getText(node));
			});
			
			test("mathml模式下，在空的分数上，右移一次光标到分母占位符，再右移一次到整个分数之后", function(){
				model.toMathMLMode();
  				model.setData({data: "", nodeName: "mfrac"});
  				model.moveRight();
  				model.moveRight();
  				assert.equal("/root/line[1]/math[1]/mfrac[1]", model.getPath());
				var node = model.getFocusNode();
				// 如果是layout mathml节点获取焦点，则0表示所在节点之前，1表示所在节点之后。
				assert.equal("mfrac", node.nodeName);
				assert.equal(1, model.getOffset());
			});
			
			// 为什么不把放表放在math之后呢？因为之前假定只要node为line，则其中没有内容。FIXME：看需不需要调节。
			test("mathml模式下，将光标移出分数，如果分数后面没有任何内容，则光标就停留在分数之后", function(){
				// TODO：重构，将移动方法进行拆分，先找到合适的下一个节点，然后再移动。
  				model.toMathMLMode();
  				model.setData({data: "", nodeName: "mfrac"});
  				model.moveRight();
  				model.moveRight();
  				model.moveRight();
  				assert.equal("/root/line[1]/math[1]", model.getPath());
				var node = model.getFocusNode();
				assert.equal("math", node.nodeName);
				assert.equal(1, model.getOffset());// 1表示在节点之后
			});
			
			test("从math节点右移到text节点，将光标移出分数，如果分数后面有text文本，则光标就停留在text的第0字符位置", function(){
				model.toMathMLMode();
  				model.setData({data: "", nodeName: "mfrac"});
  				// 另一种写法是，不再调用moveRight方法，而是直接通过赋值anchor和path，跳转到期望的位置。
  				model.moveRight();// 移到分母
  				model.moveRight();// 移到整个分数后面
  				model.moveRight();// 移出数学公式编辑区域
  				assert.ok(model.isTextMode());
  				model.setData({data: "a"});
  				model.moveLeft();// 移到a字母前面
  				model.moveLeft();// 模式切换，移到mfrac节点后
  				model.moveRight();// 模式切换，移到math节点后
  				assert.equal("/root/line[1]/math[1]", model.getPath());// 遵循就近原则，放置光标
				var node = model.getFocusNode();
				assert.equal("math", node.nodeName);
				assert.equal(1, model.getOffset());
			});
			
			test("mathml模式下，在空的分数中，将光标从分数前面移到分数的分子上", function(){
				model.toMathMLMode();
  				model.setData({data: "", nodeName: "mfrac"});
  				model.moveLeft();
  				model.moveRight();
  				assert.equal("/root/line[1]/math[1]/mfrac[1]/mrow[1]/mn[1]", model.getPath());
				var node = model.getFocusNode();
				assert.equal("mn", node.nodeName);
				assert.equal(0, model.getOffset());
				assert.equal("drip_placeholder_box", node.getAttribute("class"));
			});
			
			 // 在分数中输入字母和操作符号等。
		    // TODO：从分数外面移到分数里面
			
		});
	}
	
});