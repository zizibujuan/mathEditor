define([ "intern!tdd", 
         "intern/chai!assert", 
         "mathEditor/Model", 
         "mathEditor/lang" ], function(
        		 tdd,
        		 assert, 
        		 Model, 
        		 dripLang) {

	// TODO：需要考虑光标在两个节点的交接处，在交接处有两个表现方式，一个是在前一个节点之后，另一个是在后一个节点之前。
	//		通过高亮区域切换来过渡？
	// 在插入分数时，如果在两个节点交接处，也要判断是追加在前一个节点的后面、放在后一个节点的前面，还是新增一个节点。
	
	// summary:
	//		要测试，mfrac外有mstyle的情况和没有mstyle的情况
	//		删除整个分数（因为此时，光标已经移到frac上，所以优先从frac后面寻找光标的放置位置）
	//		1.光标在整个分数之前，右删除删除整个分数，math中只有一个分数节点
	//		2.光标在整个分数之前，右删除删除整个分数，分数后是一个token节点
	//		3.光标在整个分数之前，右删除删除整个分数，分数后是一个layout节点
	//		4.光标在整个分数之前，右删除删除整个分数，分数后没有节点，分数前有一个token节点
	//		5.光标在整个分数之前，右删除删除整个分数，分数后没有节点，分数前有一个layout节点
	//		删除分母（TODO: 在如何处理删除空的分子和分母的逻辑，这里提供多种方式，最后根据用户投票来设置一个默认方式）
	//		1.光标在分母上，分母里没有内容，右删除删掉分数结构，留下分子中的内容，光标在后面，分子的最后一个节点是token节点
	//		2.光标在分母上，分母里没有内容，右删除删掉分数结构，留下分子中的内容，光标在后面，分子的最后一个节点是layout节点
	//		删除分子
	//		1.光标在分子上，分子里没有内容，右删除删掉分子结构，留下分母中的内容，光标在前面，分母的第一个节点是token节点
	//		2.光标在分子上，分子里没有内容，右删除删掉分子结构，留下分母中的内容，光标在前面，分母的第一个节点是layout节点
	//		分子中只剩一个节点时
	//		1.节点是token节点，节点中只剩下一个字符，删除该字符后，显示占位符
	//		2.节点是layout节点，删除该节点后，显示占位符
	//		分母中只剩一个节点时
	//		1.节点是token节点，节点中只剩下一个字符，删除该字符后，显示占位符
	//		2.节点是layout节点，删除该节点后，显示占位符
	with(tdd){
		suite("Model.removeRight.frac 右删除分数中的内容或整个分数", function(){
			
			var model = null;
			beforeEach(function () {
				model = new Model({});
			});
			
			test("光标在整个分数之前，右删除删除整个分数，math中只有一个分数节点", function(){
				model.loadData("<root><line><math>" +
  						"<mfrac><mrow><mn>1</mn></mrow><mrow><mn>2</mn></mrow></mfrac>" +
  				"</math></line></root>");
  				model.mode = "mathml";
  				var line = model.getLineAt(0);
  				model.anchor.node = line.firstChild.firstChild;
  				model.anchor.offset = 0;
  				model.path = [];model.path.push({nodeName: "root"});
  				model.path.push({nodeName: "line", offset: 1});
  				model.path.push({nodeName: "math", offset: 1});
  				model.path.push({nodeName: "mfrac", offset: 1});
  				model.removeRight();
  				// 空的math，在获取焦点时，才显示；否则只占位，不显示。不在空的math中添加mn占位符。
  				var focusNode = model.getFocusNode();
  				assert.equal("/root/line[1]/math[1]", model.getPath());
  				assert.equal("math", focusNode.nodeName);
  				assert.equal(2, model.getOffset()); // layoutOffset.select
  				assert.equal(0, focusNode.childNodes.length)// 确保mfrac节点从math中删除
			});
			
			test("光标在整个分数之前，右删除删除整个分数，math中只有一个分数节点(分数被mstyle封装)", function(){
				model.loadData("<root><line><math>" +
  						"<mstyle>" +
	  						"<mfrac>" +
		  						"<mrow><mn>1</mn></mrow>" +
		  						"<mrow><mn>2</mn></mrow>" +
	  						"</mfrac>" +
  						"</mstyle>" +
  				"</math></line></root>");
  				model.mode = "mathml";
  				var line = model.getLineAt(0);
  				model.anchor.node = line.firstChild.firstChild.firstChild;
  				model.anchor.offset = 0;
  				model.path = [];model.path.push({nodeName: "root"});
  				model.path.push({nodeName: "line", offset: 1});
  				model.path.push({nodeName: "math", offset: 1});
  				model.path.push({nodeName: "mfrac", offset: 1});
  				model.removeRight();
  				// 空的math，在获取焦点时，才显示；否则只占位，不显示。不在空的math中添加mn占位符。
  				var focusNode = model.getFocusNode();
  				assert.equal("/root/line[1]/math[1]", model.getPath());
  				assert.equal("math", focusNode.nodeName);
  				assert.equal(2, model.getOffset()); // 因为没有内容，所以偏移量为0
  				assert.equal(0, focusNode.childNodes.length)// 确保mfrac节点从math中删除
			});
			
			//注意光标在整个分数之前有两种表现形式
			test("光标在整个分数之前，右删除整个分数，分数后是一个token节点", function(){
				model.loadData("<root><line><math>" +
  						"<mfrac><mrow><mn>1</mn></mrow><mrow><mn>2</mn></mrow></mfrac>" +
  						"<mn>1234</mn>" +
  				"</math></line></root>");
  				model.mode = "mathml";
  				var line = model.getLineAt(0);
  				model.anchor.node = line.firstChild.firstChild;
  				model.anchor.offset = 0;
  				model.path = [];model.path.push({nodeName: "root"});
  				model.path.push({nodeName: "line", offset: 1});
  				model.path.push({nodeName: "math", offset: 1});
  				model.path.push({nodeName: "mfrac", offset: 1});
  				model.removeRight();
  				var focusNode = model.getFocusNode();
  				assert.equal("/root/line[1]/math[1]/mn[1]", model.getPath());
  				assert.equal("mn", focusNode.nodeName);
  				assert.equal(0, model.getOffset());
  				assert.equal("1234", dripLang.getText(focusNode));
  				assert.equal(1, line.firstChild.childNodes.length)// 确保mfrac节点从math中删除
			});
			
			//注意光标在整个分数之前有两种表现形式
			test("光标在整个分数之前，右删除整个分数(分数被mstyle封装)，分数后是一个token节点", function(){
				model.loadData("<root><line><math>" +
  						"<mstyle><mfrac><mrow><mn>1</mn></mrow><mrow><mn>2</mn></mrow></mfrac></mstyle>" +
  						"<mn>1234</mn>" +
  				"</math></line></root>");
  				model.mode = "mathml";
  				var line = model.getLineAt(0);
  				model.anchor.node = line.firstChild.firstChild.firstChild;
  				model.anchor.offset = 0;
  				model.path = [];model.path.push({nodeName: "root"});
  				model.path.push({nodeName: "line", offset: 1});
  				model.path.push({nodeName: "math", offset: 1});
  				model.path.push({nodeName: "mfrac", offset: 1});
  				model.removeRight();
  				var focusNode = model.getFocusNode();
  				assert.equal("/root/line[1]/math[1]/mn[1]", model.getPath());
  				assert.equal("mn", focusNode.nodeName);
  				assert.equal(0, model.getOffset());
  				assert.equal("1234", dripLang.getText(focusNode));
  				assert.equal(1, line.firstChild.childNodes.length)// 确保mfrac节点从math中删除
			});
			
			test("光标在整个分数之前，右删除删除整个分数，分数后是一个layout节点", function(){
				model.loadData("<root><line><math>" +
  						"<mfrac><mrow><mn>1</mn></mrow><mrow><mn>2</mn></mrow></mfrac>" +
  						"<mfrac><mrow><mn>3</mn></mrow><mrow><mn>4</mn></mrow></mfrac>" +
  				"</math></line></root>");
  				model.mode = "mathml";
  				var line = model.getLineAt(0);
  				model.anchor.node = line.firstChild.firstChild;
  				model.anchor.offset = 0;
  				model.path = [];model.path.push({nodeName: "root"});
  				model.path.push({nodeName: "line", offset: 1});
  				model.path.push({nodeName: "math", offset: 1});
  				model.path.push({nodeName: "mfrac", offset: 1});
  				model.removeRight();
  				// 空的math，在获取焦点时，才显示；否则只占位，不显示。不在空的math中添加mn占位符。
  				var focusNode = model.getFocusNode();
  				assert.equal("/root/line[1]/math[1]/mfrac[1]", model.getPath());
  				assert.equal("mfrac", focusNode.nodeName);
  				assert.equal(0, model.getOffset());
  				assert.equal(1, line.firstChild.childNodes.length)// 确保mfrac节点从math中删除
			});
			
			test("光标在整个分数之前，右删除删除整个分数，分数后是一个layout节点(两个layout节点都被封装在mstyle中)", function(){
				model.loadData("<root><line><math>" +
  						"<mstyle><mfrac><mrow><mn>1</mn></mrow><mrow><mn>2</mn></mrow></mfrac></mstyle>" +
  						"<mstyle><mfrac><mrow><mn>3</mn></mrow><mrow><mn>4</mn></mrow></mfrac></mstyle>" +
  				"</math></line></root>");
  				model.mode = "mathml";
  				var line = model.getLineAt(0);
  				model.anchor.node = line.firstChild.firstChild.firstChild;
  				model.anchor.offset = 0;
  				model.path = [];model.path.push({nodeName: "root"});
  				model.path.push({nodeName: "line", offset: 1});
  				model.path.push({nodeName: "math", offset: 1});
  				model.path.push({nodeName: "mfrac", offset: 1});
  				model.removeRight();
  				// 空的math，在获取焦点时，才显示；否则只占位，不显示。不在空的math中添加mn占位符。
  				var focusNode = model.getFocusNode();
  				assert.equal("/root/line[1]/math[1]/mfrac[1]", model.getPath());
  				assert.equal("mfrac", focusNode.nodeName);
  				assert.equal(0, model.getOffset());
  				assert.equal(1, line.firstChild.childNodes.length)// 确保mfrac节点从math中删除
			});
			
			test("光标在整个分数之前，右删除删除整个分数，分数后没有节点，分数前有一个token节点", function(){
				model.loadData("<root><line><math>" +
  						"<mn>1234</mn>" +
  						"<mfrac><mrow><mn>1</mn></mrow><mrow><mn>2</mn></mrow></mfrac>" +
  				"</math></line></root>");
  				model.mode = "mathml";
  				var line = model.getLineAt(0);
  				model.anchor.node = line.firstChild.lastChild;
  				model.anchor.offset = 0;
  				model.path = [];model.path.push({nodeName: "root"});
  				model.path.push({nodeName: "line", offset: 1});
  				model.path.push({nodeName: "math", offset: 1});
  				model.path.push({nodeName: "mfrac", offset: 2});
  				model.removeRight();
  				// 空的math，在获取焦点时，才显示；否则只占位，不显示。不在空的math中添加mn占位符。
  				var focusNode = model.getFocusNode();
  				assert.equal("/root/line[1]/math[1]/mn[1]", model.getPath());
  				assert.equal("mn", focusNode.nodeName);
  				assert.equal(4, model.getOffset());
  				assert.equal(1, line.firstChild.childNodes.length)// 确保mfrac节点从math中删除
			});
			
			test("光标在整个分数之前，右删除删除整个分数(分数被mstyle封装)，分数后没有节点，分数前有一个token节点", function(){
				model.loadData("<root><line><math>" +
  						"<mn>1234</mn>" +
  						"<mstyle><mfrac><mrow><mn>1</mn></mrow><mrow><mn>2</mn></mrow></mfrac></mstyle>" +
  				"</math></line></root>");
  				model.mode = "mathml";
  				var line = model.getLineAt(0);
  				model.anchor.node = line.firstChild.lastChild.firstChild;
  				model.anchor.offset = 0;
  				model.path = [];model.path.push({nodeName: "root"});
  				model.path.push({nodeName: "line", offset: 1});
  				model.path.push({nodeName: "math", offset: 1});
  				model.path.push({nodeName: "mfrac", offset: 2});
  				model.removeRight();
  				// 空的math，在获取焦点时，才显示；否则只占位，不显示。不在空的math中添加mn占位符。
  				var focusNode = model.getFocusNode();
  				assert.equal("/root/line[1]/math[1]/mn[1]", model.getPath());
  				assert.equal("mn", focusNode.nodeName);
  				assert.equal(4, model.getOffset());
  				assert.equal(1, line.firstChild.childNodes.length)// 确保mfrac节点从math中删除
			});
			
			test("光标在整个分数之前，右删除删除整个分数，分数后没有节点，分数前有一个layout节点", function(){
				model.loadData("<root><line><math>" +
  						"<mfrac><mrow><mn>1</mn></mrow><mrow><mn>2</mn></mrow></mfrac>" +
  						"<mfrac><mrow><mn>3</mn></mrow><mrow><mn>4</mn></mrow></mfrac>" +
  				"</math></line></root>");
  				model.mode = "mathml";
  				var line = model.getLineAt(0);
  				model.anchor.node = line.firstChild.lastChild;
  				model.anchor.offset = 0;
  				model.path = [];model.path.push({nodeName: "root"});
  				model.path.push({nodeName: "line", offset: 1});
  				model.path.push({nodeName: "math", offset: 1});
  				model.path.push({nodeName: "mfrac", offset: 2});
  				model.removeRight();
  				// 空的math，在获取焦点时，才显示；否则只占位，不显示。不在空的math中添加mn占位符。
  				var focusNode = model.getFocusNode();
  				assert.equal("/root/line[1]/math[1]/mfrac[1]", model.getPath());
  				assert.equal("mfrac", focusNode.nodeName);
  				assert.equal(1, model.getOffset());
  				assert.equal("12", dripLang.getText(focusNode));// 确保是第一个分数
  				assert.equal(1, line.firstChild.childNodes.length)// 确保mfrac节点从math中删除
			});
			
			test("光标在整个分数之前，右删除删除整个分数，分数后没有节点，分数前有一个layout节点(两个layout节点都被mstyle封装)", function(){
				model.loadData("<root><line><math>" +
  						"<mstyle><mfrac><mrow><mn>1</mn></mrow><mrow><mn>2</mn></mrow></mfrac></mstyle>" +
  						"<mstyle><mfrac><mrow><mn>3</mn></mrow><mrow><mn>4</mn></mrow></mfrac></mstyle>" +
  				"</math></line></root>");
  				model.mode = "mathml";
  				var line = model.getLineAt(0);
  				model.anchor.node = line.firstChild.lastChild.firstChild;
  				model.anchor.offset = 0;
  				model.path = [];model.path.push({nodeName: "root"});
  				model.path.push({nodeName: "line", offset: 1});
  				model.path.push({nodeName: "math", offset: 1});
  				model.path.push({nodeName: "mfrac", offset: 2});
  				model.removeRight();
  				// 空的math，在获取焦点时，才显示；否则只占位，不显示。不在空的math中添加mn占位符。
  				var focusNode = model.getFocusNode();
  				assert.equal("/root/line[1]/math[1]/mfrac[1]", model.getPath());
  				assert.equal("mfrac", focusNode.nodeName);
  				assert.equal(1, model.getOffset());
  				assert.equal("12", dripLang.getText(focusNode));// 确保是第一个分数
  				assert.equal(1, line.firstChild.childNodes.length)// 确保mfrac节点从math中删除
			});
			
			test("删除分母,光标在分母上，分母里没有内容，右删除删掉分数结构，留下分子中的内容，光标在后面，分子的最后一个节点是token节点", function(){
				model.loadData("<root><line><math>" +
  						"<mfrac><mrow><mn>12</mn></mrow><mrow><mn class=\"drip_placeholder_box\">8</mn></mrow></mfrac>" +
  						"<mn>34</mn>" +
  				"</math></line></root>");
  				model.mode = "mathml";
  				var line = model.getLineAt(0);
  				model.anchor.node = line.firstChild.firstChild.lastChild.firstChild;
  				model.anchor.offset = 0;
  				model.path = [];model.path.push({nodeName: "root"});
  				model.path.push({nodeName: "line", offset: 1});
  				model.path.push({nodeName: "math", offset: 1});
  				model.path.push({nodeName: "mfrac", offset: 1});
  				model.path.push({nodeName: "mrow", offset: 2});
  				model.path.push({nodeName: "mn", offset: 1});
  				model.removeRight();
  				// 空的math，在获取焦点时，才显示；否则只占位，不显示。不在空的math中添加mn占位符。
  				var focusNode = model.getFocusNode();
  				assert.equal("/root/line[1]/math[1]/mn[1]", model.getPath());
  				assert.equal("mn", focusNode.nodeName);
  				assert.equal(2, model.getOffset());
  				assert.equal("12", dripLang.getText(focusNode));
  				assert.equal(2, line.firstChild.childNodes.length);// 确保是两个节点
  				assert.equal("mn", line.firstChild.firstChild.nodeName);// 确保mfrac被删掉
			});
			
			test("删除分母,光标在分母上，分母里没有内容，右删除删掉分数结构，留下分子中的内容，光标在后面，分子的最后一个节点是token节点(分数封装在mstyle中)", function(){
				model.loadData("<root><line><math>" +
  						"<mstyle>" +
  							"<mfrac>" +
  								"<mrow><mn>12</mn></mrow>" +
  								"<mrow><mn class=\"drip_placeholder_box\">8</mn></mrow>" +
  							"</mfrac>" +
  						"</mstyle>" +
  						"<mn>34</mn>" +
  				"</math></line></root>");
  				model.mode = "mathml";
  				var line = model.getLineAt(0);
  				model.anchor.node = line.firstChild.firstChild.firstChild.lastChild.firstChild;
  				model.anchor.offset = 0;
  				model.path = [];model.path.push({nodeName: "root"});
  				model.path.push({nodeName: "line", offset: 1});
  				model.path.push({nodeName: "math", offset: 1});
  				model.path.push({nodeName: "mfrac", offset: 1});
  				model.path.push({nodeName: "mrow", offset: 2});
  				model.path.push({nodeName: "mn", offset: 1});
  				model.removeRight();
  				// 空的math，在获取焦点时，才显示；否则只占位，不显示。不在空的math中添加mn占位符。
  				var focusNode = model.getFocusNode();
  				assert.equal("/root/line[1]/math[1]/mn[1]", model.getPath());
  				assert.equal("mn", focusNode.nodeName);
  				assert.equal(2, model.getOffset());
  				assert.equal("12", dripLang.getText(focusNode));
  				assert.equal(2, line.firstChild.childNodes.length);// 确保是两个节点
  				assert.equal("mn", line.firstChild.firstChild.nodeName);// 确保mfrac被删掉
			});
			
			test("删除分母,光标在分母上，分母里没有内容，右删除删掉分数结构，留下分子中的内容，光标在后面，分子的最后一个节点是layout节点", function(){
				model.loadData("<root><line><math>" +
  						"<mfrac><mrow><msup><mrow>1</mrow><mrow>2</mrow></msup></mrow><mrow><mn class=\"drip_placeholder_box\">8</mn></mrow></mfrac>" +
  						"<mn>34</mn>" +
  				"</math></line></root>");
  				model.mode = "mathml";
  				var line = model.getLineAt(0);
  				model.anchor.node = line.firstChild.firstChild.lastChild.firstChild;
  				model.anchor.offset = 0;
  				model.path = [];model.path.push({nodeName: "root"});
  				model.path.push({nodeName: "line", offset: 1});
  				model.path.push({nodeName: "math", offset: 1});
  				model.path.push({nodeName: "mfrac", offset: 1});
  				model.path.push({nodeName: "mrow", offset: 2});
  				model.path.push({nodeName: "mn", offset: 1});
  				model.removeRight();
  				// 空的math，在获取焦点时，才显示；否则只占位，不显示。不在空的math中添加mn占位符。
  				var focusNode = model.getFocusNode();
  				assert.equal("/root/line[1]/math[1]/msup[1]", model.getPath());
  				assert.equal("msup", focusNode.nodeName);
  				assert.equal(1, model.getOffset());
  				assert.equal(2, line.firstChild.childNodes.length);// 确保是两个节点
  				assert.equal("msup", line.firstChild.firstChild.nodeName);// 确保mfrac被删掉
			});
			
			test("删除分母,光标在分母上，分母里没有内容，右删除删掉分数结构，留下分子中的内容，光标在后面，分子的最后一个节点是layout节点(被mstyle封装)", function(){
				model.loadData("<root><line><math>" +
  						"<mstyle>" +
	  						"<mfrac>" +
		  						"<mrow><mstyle><msup><mrow>1</mrow><mrow>2</mrow></msup></mstyle></mrow>" +
		  						"<mrow><mn class=\"drip_placeholder_box\">8</mn></mrow>" +
	  						"</mfrac>" +
  						"</mstyle>" +
  						"<mn>34</mn>" +
  				"</math></line></root>");
  				model.mode = "mathml";
  				var line = model.getLineAt(0);
  				model.anchor.node = line.firstChild.firstChild.firstChild.lastChild.firstChild;
  				model.anchor.offset = 0;
  				model.path = [];model.path.push({nodeName: "root"});
  				model.path.push({nodeName: "line", offset: 1});
  				model.path.push({nodeName: "math", offset: 1});
  				model.path.push({nodeName: "mfrac", offset: 1});
  				model.path.push({nodeName: "mrow", offset: 2});
  				model.path.push({nodeName: "mn", offset: 1});
  				model.removeRight();
  				// 空的math，在获取焦点时，才显示；否则只占位，不显示。不在空的math中添加mn占位符。
  				var focusNode = model.getFocusNode();
  				assert.equal("/root/line[1]/math[1]/msup[1]", model.getPath());
  				assert.equal("msup", focusNode.nodeName);
  				assert.equal(1, model.getOffset());
  				assert.equal(2, line.firstChild.childNodes.length);// 确保是两个节点
  				assert.equal("msup", line.firstChild.firstChild.firstChild.nodeName);// 确保mfrac被删掉
			});
			
			test("删除分子,光标在分子上，分子里没有内容，右删除删掉分子结构，留下分母中的内容，光标在前面，分母的第一个节点是token节点", function(){
				model.loadData("<root><line><math>" +
  						"<mfrac>" +
	  						"<mrow><mn class=\"drip_placeholder_box\">8</mn></mrow>" +
	  						"<mrow><mn>12</mn></mrow>" +
  						"</mfrac>" +
  						"<mn>34</mn>" +
  				"</math></line></root>");
  				model.mode = "mathml";
  				var line = model.getLineAt(0);
  				model.anchor.node = line.firstChild.firstChild.firstChild.firstChild;
  				model.anchor.offset = 0;
  				model.path = [];model.path.push({nodeName: "root"});
  				model.path.push({nodeName: "line", offset: 1});
  				model.path.push({nodeName: "math", offset: 1});
  				model.path.push({nodeName: "mfrac", offset: 1});
  				model.path.push({nodeName: "mrow", offset: 1});
  				model.path.push({nodeName: "mn", offset: 1});
  				model.removeRight();
  				// 空的math，在获取焦点时，才显示；否则只占位，不显示。不在空的math中添加mn占位符。
  				var focusNode = model.getFocusNode();
  				assert.equal("/root/line[1]/math[1]/mn[1]", model.getPath());
  				assert.equal("mn", focusNode.nodeName);
  				assert.equal(0, model.getOffset());
  				assert.equal(2, line.firstChild.childNodes.length);// 确保是两个节点
  				assert.equal("mn", line.firstChild.firstChild.nodeName);// 确保mfrac被删掉
			});
			
			test("删除分子,光标在分子上，分子里没有内容，右删除删掉分子结构，留下分母中的内容，光标在前面，分母的第一个节点是token节点(分数被mstyle封装)", function(){
				model.loadData("<root><line><math>" +
  						"<mstyle>" +
	  						"<mfrac>" +
		  						"<mrow><mn class=\"drip_placeholder_box\">8</mn></mrow>" +
		  						"<mrow><mn>12</mn></mrow>" +
	  						"</mfrac>" +
  						"</mstyle>" +
  						"<mn>34</mn>" +
  				"</math></line></root>");
  				model.mode = "mathml";
  				var line = model.getLineAt(0);
  				model.anchor.node = line.firstChild.firstChild.firstChild.firstChild.firstChild;
  				model.anchor.offset = 0;
  				model.path = [];model.path.push({nodeName: "root"});
  				model.path.push({nodeName: "line", offset: 1});
  				model.path.push({nodeName: "math", offset: 1});
  				model.path.push({nodeName: "mfrac", offset: 1});
  				model.path.push({nodeName: "mrow", offset: 1});
  				model.path.push({nodeName: "mn", offset: 1});
  				model.removeRight();
  				// 空的math，在获取焦点时，才显示；否则只占位，不显示。不在空的math中添加mn占位符。
  				var focusNode = model.getFocusNode();
  				assert.equal("/root/line[1]/math[1]/mn[1]", model.getPath());
  				assert.equal("mn", focusNode.nodeName);
  				assert.equal(0, model.getOffset());
  				assert.equal(2, line.firstChild.childNodes.length);// 确保是两个节点
  				assert.equal("mn", line.firstChild.firstChild.nodeName);// 确保mfrac被删掉
			});
			
			test("删除分子,光标在分子上，分子里没有内容，右删除删掉分子结构，留下分母中的内容，光标在前面，分母的第一个节点是layout节点", function(){
				model.loadData("<root><line><math>" +
  						"<mfrac>" +
	  						"<mrow><mn class=\"drip_placeholder_box\">8</mn></mrow>" +
	  						"<mrow><msup><mrow>1</mrow><mrow>2</mrow></msup></mrow>" +
  						"</mfrac>" +
  						"<mn>34</mn>" +
  				"</math></line></root>");
  				model.mode = "mathml";
  				var line = model.getLineAt(0);
  				model.anchor.node = line.firstChild.firstChild.firstChild.firstChild;
  				model.anchor.offset = 0;
  				model.path = [];model.path.push({nodeName: "root"});
  				model.path.push({nodeName: "line", offset: 1});
  				model.path.push({nodeName: "math", offset: 1});
  				model.path.push({nodeName: "mfrac", offset: 1});
  				model.path.push({nodeName: "mrow", offset: 1});
  				model.path.push({nodeName: "mn", offset: 1});
  				model.removeRight();
  				// 空的math，在获取焦点时，才显示；否则只占位，不显示。不在空的math中添加mn占位符。
  				var focusNode = model.getFocusNode();
  				assert.equal("/root/line[1]/math[1]/msup[1]", model.getPath());
  				assert.equal("msup", focusNode.nodeName);
  				assert.equal(0, model.getOffset());
  				assert.equal(2, line.firstChild.childNodes.length);// 确保是两个节点
  				assert.equal("msup", line.firstChild.firstChild.nodeName);// 确保mfrac被删掉
			});
			
			test("删除分子,光标在分子上，分子里没有内容，右删除删掉分子结构，留下分母中的内容，光标在前面，分母的第一个节点是layout节点(被mstyle封装)", function(){
				model.loadData("<root><line><math>" +
  						"<mstyle>" +
	  						"<mfrac>" +
		  						"<mrow><mn class=\"drip_placeholder_box\">8</mn></mrow>" +
		  						"<mrow><mstyle><msup><mrow>1</mrow><mrow>2</mrow></msup></mstyle></mrow>" +
	  						"</mfrac>" +
  						"</mstyle>" +
  						"<mn>34</mn>" +
  				"</math></line></root>");
  				model.mode = "mathml";
  				var line = model.getLineAt(0);
  				model.anchor.node = line.firstChild.firstChild.firstChild.firstChild.firstChild;
  				model.anchor.offset = 0;
  				model.path = [];model.path.push({nodeName: "root"});
  				model.path.push({nodeName: "line", offset: 1});
  				model.path.push({nodeName: "math", offset: 1});
  				model.path.push({nodeName: "mfrac", offset: 1});
  				model.path.push({nodeName: "mrow", offset: 1});
  				model.path.push({nodeName: "mn", offset: 1});
  				model.removeRight();
  				// 空的math，在获取焦点时，才显示；否则只占位，不显示。不在空的math中添加mn占位符。
  				var focusNode = model.getFocusNode();
  				assert.equal("/root/line[1]/math[1]/msup[1]", model.getPath());
  				assert.equal("msup", focusNode.nodeName);
  				assert.equal(0, model.getOffset());
  				assert.equal(2, line.firstChild.childNodes.length);// 确保是两个节点
  				assert.equal("msup", line.firstChild.firstChild.firstChild.nodeName);// 确保mfrac被删掉
			});
			
			test("分子中只剩一个节点时,节点是token节点，节点中只剩下一个字符，删除该字符后，显示占位符", function(){
				model.loadData("<root><line><math>" +
  						"<mfrac>" +
	  						"<mrow><mn>1</mn></mrow>" +
	  						"<mrow><mn>23</mn></mrow>" +
  						"</mfrac>" +
  				"</math></line></root>");
  				model.mode = "mathml";
  				var line = model.getLineAt(0);
  				model.anchor.node = line.firstChild.firstChild.firstChild.firstChild;
  				model.anchor.offset = 0;
  				model.path = [];model.path.push({nodeName: "root"});
  				model.path.push({nodeName: "line", offset: 1});
  				model.path.push({nodeName: "math", offset: 1});
  				model.path.push({nodeName: "mfrac", offset: 1});
  				model.path.push({nodeName: "mrow", offset: 1});
  				model.path.push({nodeName: "mn", offset: 1});
  				model.removeRight();
  				// 空的math，在获取焦点时，才显示；否则只占位，不显示。不在空的math中添加mn占位符。
  				var focusNode = model.getFocusNode();
  				assert.equal("/root/line[1]/math[1]/mfrac[1]/mrow[1]/mn[1]", model.getPath());
  				assert.equal("mn", focusNode.nodeName);
  				assert.equal(0, model.getOffset());
  				assert.equal("drip_placeholder_box", focusNode.getAttribute("class"));// 是占位符
  				// 确定新的节点是占位符
  				assert.equal(focusNode, line.firstChild.firstChild.firstChild.firstChild);
			});
			
			test("分子中只剩一个节点时,节点是layout节点，删除该节点后，显示占位符", function(){
				model.loadData("<root><line><math>" +
  						"<mfrac>" +
	  						"<mrow><msup><mrow>1</mrow><mrow>2</mrow></msup></mrow>" +
	  						"<mrow><mn>23</mn></mrow>" +
  						"</mfrac>" +
  				"</math></line></root>");
  				model.mode = "mathml";
  				var line = model.getLineAt(0);
  				model.anchor.node = line.firstChild.firstChild.firstChild.firstChild;
  				model.anchor.offset = 0;
  				model.path = [];model.path.push({nodeName: "root"});
  				model.path.push({nodeName: "line", offset: 1});
  				model.path.push({nodeName: "math", offset: 1});
  				model.path.push({nodeName: "mfrac", offset: 1});
  				model.path.push({nodeName: "mrow", offset: 1});
  				model.path.push({nodeName: "msup", offset: 1});
  				model.removeRight();
  				// 空的math，在获取焦点时，才显示；否则只占位，不显示。不在空的math中添加mn占位符。
  				var focusNode = model.getFocusNode();
  				assert.equal("/root/line[1]/math[1]/mfrac[1]/mrow[1]/mn[1]", model.getPath());
  				assert.equal("mn", focusNode.nodeName);
  				assert.equal(0, model.getOffset());
  				assert.equal("drip_placeholder_box", focusNode.getAttribute("class"));// 是占位符
  				// 确定新的节点是占位符
  				assert.equal(focusNode, line.firstChild.firstChild.firstChild.firstChild);
			});
			
			test("分母中只剩一个节点时,节点是token节点，节点中只剩下一个字符，删除该字符后，显示占位符", function(){
				model.loadData("<root><line><math>" +
  						"<mfrac>" +
	  						"<mrow><mn>23</mn></mrow>" +
	  						"<mrow><mn>1</mn></mrow>" +
  						"</mfrac>" +
  				"</math></line></root>");
  				model.mode = "mathml";
  				var line = model.getLineAt(0);
  				model.anchor.node = line.firstChild.firstChild.lastChild.firstChild;
  				model.anchor.offset = 0;
  				model.path = [];model.path.push({nodeName: "root"});
  				model.path.push({nodeName: "line", offset: 1});
  				model.path.push({nodeName: "math", offset: 1});
  				model.path.push({nodeName: "mfrac", offset: 1});
  				model.path.push({nodeName: "mrow", offset: 2});
  				model.path.push({nodeName: "mn", offset: 1});
  				model.removeRight();
  				// 空的math，在获取焦点时，才显示；否则只占位，不显示。不在空的math中添加mn占位符。
  				var focusNode = model.getFocusNode();
  				assert.equal("/root/line[1]/math[1]/mfrac[1]/mrow[2]/mn[1]", model.getPath());
  				assert.equal("mn", focusNode.nodeName);
  				assert.equal(0, model.getOffset());
  				assert.equal("drip_placeholder_box", focusNode.getAttribute("class"));// 是占位符
  				// 确定新的节点是占位符
  				assert.equal(focusNode, line.firstChild.firstChild.lastChild.firstChild);
			});
			
			test("分母中只剩一个节点时,节点是layout节点，删除该节点后，显示占位符", function(){
				model.loadData("<root><line><math>" +
  						"<mfrac>" +
	  						"<mrow><mn>23</mn></mrow>" +
	  						"<mrow><msup><mrow>1</mrow><mrow>2</mrow></msup></mrow>" +
  						"</mfrac>" +
  				"</math></line></root>");
  				model.mode = "mathml";
  				var line = model.getLineAt(0);
  				model.anchor.node = line.firstChild.firstChild.lastChild.firstChild;
  				model.anchor.offset = 0;
  				model.path = [];model.path.push({nodeName: "root"});
  				model.path.push({nodeName: "line", offset: 1});
  				model.path.push({nodeName: "math", offset: 1});
  				model.path.push({nodeName: "mfrac", offset: 1});
  				model.path.push({nodeName: "mrow", offset: 2});
  				model.path.push({nodeName: "msup", offset: 1});
  				model.removeRight();
  				// 空的math，在获取焦点时，才显示；否则只占位，不显示。不在空的math中添加mn占位符。
  				var focusNode = model.getFocusNode();
  				assert.equal("/root/line[1]/math[1]/mfrac[1]/mrow[2]/mn[1]", model.getPath());
  				assert.equal("mn", focusNode.nodeName);
  				assert.equal(0, model.getOffset());
  				assert.equal("drip_placeholder_box", focusNode.getAttribute("class"));// 是占位符
  				// 确定新的节点是占位符
  				assert.equal(focusNode, line.firstChild.firstChild.lastChild.firstChild);
			});
		});
	}

});