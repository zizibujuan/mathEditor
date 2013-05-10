define([ "doh","mathEditor/Model" ], function(doh,Model) {

	// summary:
	//		测试分数被mstyle封装的情况和没有被mstyle封装的情况。
	//		删除整个分数
	//		1.光标在整个分数之后，左删除删除整个分数，math中只有一个分数节点
	//		2.光标在整个分数之后，左删除删除整个分数，分数前是一个token节点
	//		3.光标在整个分数之后，左删除删除整个分数，分数前是一个layout节点
	//		4.光标在整个分数之后，左删除删除整个分数，分数前没有节点，分数后有一个token节点
	//		5.光标在整个分数之后，左删除删除整个分数，分数前没有节点，分数后有一个layout节点
	//		删除分母（TODO: 在如何处理删除空的分子和分母的逻辑，这里提供多种方式，最后根据用户投票来设置一个默认方式）
	//		1.光标在分母上，分母里没有内容，左删除删掉分数结构，留下分子中的内容，光标在后面，分子的最后一个节点是token节点
	//		2.光标在分母上，分母里没有内容，左删除删掉分数结构，留下分子中的内容，光标在后面，分子的最后一个节点是layout节点
	//		删除分子
	//		1.光标在分子上，分子里没有任何内容，左删除删掉分子结构，留下分母中的内容，光标在前面，分母的第一个节点是token节点
	//		2.光标在分子上，分子里没有任何内容，左删除删掉分子结构，留下分母中的内容，光标在前面，分母的第一个节点是layout节点
	//		分子中只剩一个节点时
	//		1.节点是token节点，节点中只剩下一个字符，删除该字符后，显示占位符
	//		2.节点是layout节点，删除该节点后，显示占位符
	//		分母中只剩一个节点时
	//		1.节点是token节点，节点中只剩下一个字符，删除该字符后，显示占位符
	//		2.节点是layout节点，删除该节点后，显示占位符
	doh.register("Model.removeLeft.frac 左删除分数中的内容或整个分数",[
	    {
	    	name: "光标在整个分数之后，左删除删除整个分数，math中只有一个分数节点",
  			setUp: function(){
  				this.model = new Model({});
  			},
  			runTest: function(t){
  				var model = this.model;
  				model.loadData("<root><line><math>" +
  						"<mfrac><mrow><mn>1</mn></mrow><mrow><mn>2</mn></mrow></mfrac>" +
  				"</math></line></root>");
  				model.mode = "mathml";
  				var line = model.getLineAt(0);
  				model.anchor.node = line.firstChild.firstChild;
  				model.anchor.offset = 1;
  				model.path = [];model.path.push({nodeName: "root"});
  				model.path.push({nodeName: "line", offset: 1});
  				model.path.push({nodeName: "math", offset: 1});
  				model.path.push({nodeName: "mfrac", offset: 1});
  				model.removeLeft();
  				// 空的math，在获取焦点时，才显示；否则只占位，不显示。不在空的math中添加mn占位符。
  				var focusNode = model.getFocusNode();
  				t.is("/root/line[1]/math[1]", model.getPath());
  				t.is("math", focusNode.nodeName);
  				t.is(2, model.getOffset()); // layoutOffset.select
  				t.is(0, focusNode.childNodes.length)// 确保mfrac节点从math中删除
  			},
  			tearDown: function(){
  				
  			}
	    },{
	    	name: "光标在整个分数之后，左删除删除整个分数，math中只有一个分数节点,并且分数节点被mstyle封装",
  			setUp: function(){
  				this.model = new Model({});
  			},
  			runTest: function(t){
  				var model = this.model;
  				// mstyle是必须要考虑的
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
  				model.anchor.offset = 1;
  				model.path = [];model.path.push({nodeName: "root"});
  				model.path.push({nodeName: "line", offset: 1});
  				model.path.push({nodeName: "math", offset: 1});
  				model.path.push({nodeName: "mfrac", offset: 1});
  				model.removeLeft();
  				// 空的math，在获取焦点时，才显示；否则只占位，不显示。不在空的math中添加mn占位符。
  				var focusNode = model.getFocusNode();
  				t.is("/root/line[1]/math[1]", model.getPath());
  				t.is("math", focusNode.nodeName);
  				t.is(2, model.getOffset()); // layoutOffset.select
  				t.is(0, focusNode.childNodes.length)// 确保mfrac节点从math中删除
  			},
  			tearDown: function(){
  				
  			}
	    },{
	    	name: "光标在整个分数之后，左删除删除整个分数，分数前是一个token节点",
  			setUp: function(){
  				this.model = new Model({});
  			},
  			runTest: function(t){
  				var model = this.model;
  				model.loadData("<root><line><math>" +
  						"<mn>1234</mn>" +
  						"<mfrac><mrow><mn>1</mn></mrow><mrow><mn>2</mn></mrow></mfrac>" +
  				"</math></line></root>");
  				model.mode = "mathml";
  				var line = model.getLineAt(0);
  				model.anchor.node = line.firstChild.lastChild;
  				model.anchor.offset = 1;
  				model.path = [];model.path.push({nodeName: "root"});
  				model.path.push({nodeName: "line", offset: 1});
  				model.path.push({nodeName: "math", offset: 1});
  				model.path.push({nodeName: "mfrac", offset: 2});
  				model.removeLeft();
  				// 空的math，在获取焦点时，才显示；否则只占位，不显示。不在空的math中添加mn占位符。
  				var focusNode = model.getFocusNode();
  				t.is("/root/line[1]/math[1]/mn[1]", model.getPath());
  				t.is("mn", focusNode.nodeName);
  				t.is(4, model.getOffset());
  				t.is("1234", focusNode.textContent);
  				t.is(1, line.firstChild.childNodes.length)// 确保mfrac节点从math中删除
  			},
  			tearDown: function(){
  				
  			}
	    },{
	    	name: "光标在整个分数之后，左删除删除整个分数(分数外有mstyle节点)，分数前是一个token节点",
  			setUp: function(){
  				this.model = new Model({});
  			},
  			runTest: function(t){
  				var model = this.model;
  				model.loadData("<root><line><math>" +
  						"<mn>1234</mn>" +
  						"<mstyle>" +
  						"<mfrac><mrow><mn>1</mn></mrow><mrow><mn>2</mn></mrow></mfrac>" +
  						"</mstyle>" +
  				"</math></line></root>");
  				model.mode = "mathml";
  				var line = model.getLineAt(0);
  				model.anchor.node = line.firstChild.lastChild.firstChild;
  				model.anchor.offset = 1;
  				model.path = [];model.path.push({nodeName: "root"});
  				model.path.push({nodeName: "line", offset: 1});
  				model.path.push({nodeName: "math", offset: 1});
  				model.path.push({nodeName: "mfrac", offset: 2});
  				model.removeLeft();
  				// 空的math，在获取焦点时，才显示；否则只占位，不显示。不在空的math中添加mn占位符。
  				var focusNode = model.getFocusNode();
  				t.is("/root/line[1]/math[1]/mn[1]", model.getPath());
  				t.is("mn", focusNode.nodeName);
  				t.is(4, model.getOffset());
  				t.is("1234", focusNode.textContent);
  				t.is(1, line.firstChild.childNodes.length)// 确保mfrac节点从math中删除
  			},
  			tearDown: function(){
  				
  			}
	    },{
	    	name: "光标在整个分数之后，左删除删除整个分数，分数前是一个layout节点",
  			setUp: function(){
  				this.model = new Model({});
  			},
  			runTest: function(t){
  				var model = this.model;
  				model.loadData("<root><line><math>" +
  						"<mfrac><mrow><mn>1</mn></mrow><mrow><mn>2</mn></mrow></mfrac>" +
  						"<mfrac><mrow><mn>3</mn></mrow><mrow><mn>4</mn></mrow></mfrac>" +
  				"</math></line></root>");
  				model.mode = "mathml";
  				var line = model.getLineAt(0);
  				model.anchor.node = line.firstChild.lastChild;
  				model.anchor.offset = 1;
  				model.path = [];model.path.push({nodeName: "root"});
  				model.path.push({nodeName: "line", offset: 1});
  				model.path.push({nodeName: "math", offset: 1});
  				model.path.push({nodeName: "mfrac", offset: 2});
  				model.removeLeft();
  				// 空的math，在获取焦点时，才显示；否则只占位，不显示。不在空的math中添加mn占位符。
  				var focusNode = model.getFocusNode();
  				t.is("/root/line[1]/math[1]/mfrac[1]", model.getPath());
  				t.is("mfrac", focusNode.nodeName);
  				t.is(1, model.getOffset());
  				t.is(1, line.firstChild.childNodes.length)// 确保mfrac节点从math中删除
  			},
  			tearDown: function(){
  				
  			}
	    },{
	    	name: "光标在整个分数之后，左删除删除整个分数，分数前是一个layout节点(两个layout节点都被mstyle封装)",
  			setUp: function(){
  				this.model = new Model({});
  			},
  			runTest: function(t){
  				var model = this.model;
  				model.loadData("<root><line><math>" +
  						"<mstyle><mfrac><mrow><mn>1</mn></mrow><mrow><mn>2</mn></mrow></mfrac></mstyle>" +
  						"<mstyle><mfrac><mrow><mn>3</mn></mrow><mrow><mn>4</mn></mrow></mfrac></mstyle>" +
  				"</math></line></root>");
  				model.mode = "mathml";
  				var line = model.getLineAt(0);
  				model.anchor.node = line.firstChild.lastChild.firstChild;
  				model.anchor.offset = 1;
  				model.path = [];model.path.push({nodeName: "root"});
  				model.path.push({nodeName: "line", offset: 1});
  				model.path.push({nodeName: "math", offset: 1});
  				model.path.push({nodeName: "mfrac", offset: 2});
  				model.removeLeft();
  				// 空的math，在获取焦点时，才显示；否则只占位，不显示。不在空的math中添加mn占位符。
  				var focusNode = model.getFocusNode();
  				// 要忽略mstyle
  				t.is("/root/line[1]/math[1]/mfrac[1]", model.getPath());
  				t.is("mfrac", focusNode.nodeName);
  				t.is(1, model.getOffset());
  				t.is(1, line.firstChild.childNodes.length)// 确保mfrac节点从math中删除
  			},
  			tearDown: function(){
  				
  			}
	    },{
	    	name: "光标在整个分数之后，左删除删除整个分数，分数前没有节点，分数后有一个token节点",
  			setUp: function(){
  				this.model = new Model({});
  			},
  			runTest: function(t){
  				var model = this.model;
  				model.loadData("<root><line><math>" +
  						"<mfrac><mrow><mn>1</mn></mrow><mrow><mn>2</mn></mrow></mfrac>" +
  						"<mn>1234</mn>" +
  				"</math></line></root>");
  				model.mode = "mathml";
  				var line = model.getLineAt(0);
  				model.anchor.node = line.firstChild.firstChild;
  				model.anchor.offset = 1;
  				model.path = [];model.path.push({nodeName: "root"});
  				model.path.push({nodeName: "line", offset: 1});
  				model.path.push({nodeName: "math", offset: 1});
  				model.path.push({nodeName: "mfrac", offset: 1});
  				model.removeLeft();
  				// 空的math，在获取焦点时，才显示；否则只占位，不显示。不在空的math中添加mn占位符。
  				var focusNode = model.getFocusNode();
  				t.is("/root/line[1]/math[1]/mn[1]", model.getPath());
  				t.is("mn", focusNode.nodeName);
  				t.is(0, model.getOffset());
  				t.is(1, line.firstChild.childNodes.length)// 确保mfrac节点从math中删除
  			},
  			tearDown: function(){
  				
  			}
	    },{
	    	name: "光标在整个分数之后，左删除删除整个分数（分数被mstyle封装），分数前没有节点，分数后有一个token节点",
  			setUp: function(){
  				this.model = new Model({});
  			},
  			runTest: function(t){
  				var model = this.model;
  				model.loadData("<root><line><math>" +
  						"<mstyle><mfrac><mrow><mn>1</mn></mrow><mrow><mn>2</mn></mrow></mfrac></mstyle>" +
  						"<mn>1234</mn>" +
  				"</math></line></root>");
  				model.mode = "mathml";
  				var line = model.getLineAt(0);
  				model.anchor.node = line.firstChild.firstChild.firstChild;
  				model.anchor.offset = 1;
  				model.path = [];model.path.push({nodeName: "root"});
  				model.path.push({nodeName: "line", offset: 1});
  				model.path.push({nodeName: "math", offset: 1});
  				model.path.push({nodeName: "mfrac", offset: 1});
  				model.removeLeft();
  				// 空的math，在获取焦点时，才显示；否则只占位，不显示。不在空的math中添加mn占位符。
  				var focusNode = model.getFocusNode();
  				t.is("/root/line[1]/math[1]/mn[1]", model.getPath());
  				t.is("mn", focusNode.nodeName);
  				t.is(0, model.getOffset());
  				t.is(1, line.firstChild.childNodes.length)// 确保mfrac节点从math中删除
  			},
  			tearDown: function(){
  				
  			}
	    },{
	    	name: "光标在整个分数之后，左删除删除整个分数，分数前没有节点，分数后有一个layout节点",
  			setUp: function(){
  				this.model = new Model({});
  			},
  			runTest: function(t){
  				var model = this.model;
  				model.loadData("<root><line><math>" +
  						"<mfrac><mrow><mn>1</mn></mrow><mrow><mn>2</mn></mrow></mfrac>" +
  						"<mfrac><mrow><mn>3</mn></mrow><mrow><mn>4</mn></mrow></mfrac>" +
  				"</math></line></root>");
  				model.mode = "mathml";
  				var line = model.getLineAt(0);
  				model.anchor.node = line.firstChild.firstChild;
  				model.anchor.offset = 1;
  				model.path = [];model.path.push({nodeName: "root"});
  				model.path.push({nodeName: "line", offset: 1});
  				model.path.push({nodeName: "math", offset: 1});
  				model.path.push({nodeName: "mfrac", offset: 1});
  				model.removeLeft();
  				// 空的math，在获取焦点时，才显示；否则只占位，不显示。不在空的math中添加mn占位符。
  				var focusNode = model.getFocusNode();
  				t.is("/root/line[1]/math[1]/mfrac[1]", model.getPath());
  				t.is("mfrac", focusNode.nodeName);
  				t.is(0, model.getOffset());
  				t.is("34", focusNode.textContent);// 确保是第二个分数
  				t.is(1, line.firstChild.childNodes.length)// 确保mfrac节点从math中删除
  			},
  			tearDown: function(){
  				
  			}
	    },{
	    	name: "光标在整个分数之后，左删除删除整个分数，分数前没有节点，分数后有一个layout节点(两个layout节点都被mstyle封装)",
  			setUp: function(){
  				this.model = new Model({});
  			},
  			runTest: function(t){
  				var model = this.model;
  				model.loadData("<root><line><math>" +
  						"<mstyle><mfrac><mrow><mn>1</mn></mrow><mrow><mn>2</mn></mrow></mfrac></mstyle>" +
  						"<mstyle><mfrac><mrow><mn>3</mn></mrow><mrow><mn>4</mn></mrow></mfrac></mstyle>" +
  				"</math></line></root>");
  				model.mode = "mathml";
  				var line = model.getLineAt(0);
  				model.anchor.node = line.firstChild.firstChild.firstChild;
  				model.anchor.offset = 1;
  				model.path = [];model.path.push({nodeName: "root"});
  				model.path.push({nodeName: "line", offset: 1});
  				model.path.push({nodeName: "math", offset: 1});
  				model.path.push({nodeName: "mfrac", offset: 1});
  				model.removeLeft();
  				// 空的math，在获取焦点时，才显示；否则只占位，不显示。不在空的math中添加mn占位符。
  				var focusNode = model.getFocusNode();
  				t.is("/root/line[1]/math[1]/mfrac[1]", model.getPath());
  				t.is("mfrac", focusNode.nodeName);
  				t.is(0, model.getOffset());
  				t.is("34", focusNode.textContent);// 确保是第二个分数
  				t.is(1, line.firstChild.childNodes.length)// 确保mfrac节点从math中删除
  			},
  			tearDown: function(){
  				
  			}
	    },{
	    	name: "删除分母,光标在分母上，分母里没有内容，左删除删掉分数结构，留下分子中的内容，光标在后面，分子的最后一个节点是token节点",
  			setUp: function(){
  				this.model = new Model({});
  			},
  			runTest: function(t){
  				var model = this.model;
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
  				model.removeLeft();
  				// 空的math，在获取焦点时，才显示；否则只占位，不显示。不在空的math中添加mn占位符。
  				var focusNode = model.getFocusNode();
  				t.is("/root/line[1]/math[1]/mn[1]", model.getPath());
  				t.is("mn", focusNode.nodeName);
  				t.is(2, model.getOffset());
  				t.is("12", focusNode.textContent);
  				t.is(2, line.firstChild.childNodes.length);// 确保是两个节点
  				t.is("mn", line.firstChild.firstChild.nodeName);// 确保mfrac被删掉
  			},
  			tearDown: function(){
  				
  			}
	    },{
	    	name: "删除分母,光标在分母上，分母里没有内容，左删除删掉分数结构，留下分子中的内容，光标在后面，分子的最后一个节点是token节点(分数被mstyle封装)",
  			setUp: function(){
  				this.model = new Model({});
  			},
  			runTest: function(t){
  				var model = this.model;
  				model.loadData("<root><line><math>" +
  						"<mstyle><mfrac><mrow><mn>12</mn></mrow><mrow><mn class=\"drip_placeholder_box\">8</mn></mrow></mfrac></mstyle>" +
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
  				model.removeLeft();
  				// 空的math，在获取焦点时，才显示；否则只占位，不显示。不在空的math中添加mn占位符。
  				var focusNode = model.getFocusNode();
  				t.is("/root/line[1]/math[1]/mn[1]", model.getPath());
  				t.is("mn", focusNode.nodeName);
  				t.is(2, model.getOffset());
  				t.is("12", focusNode.textContent);
  				t.is(2, line.firstChild.childNodes.length);// 确保是两个节点
  				t.is("mn", line.firstChild.firstChild.nodeName);// 确保mfrac被删掉
  			},
  			tearDown: function(){
  				
  			}
	    },{
	    	name: "删除分母,光标在分母上，分母里没有内容，左删除删掉分数结构，留下分子中的内容，光标在后面，分子的最后一个节点是layout节点",
  			setUp: function(){
  				this.model = new Model({});
  			},
  			runTest: function(t){
  				var model = this.model;
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
  				model.removeLeft();
  				// 空的math，在获取焦点时，才显示；否则只占位，不显示。不在空的math中添加mn占位符。
  				var focusNode = model.getFocusNode();
  				t.is("/root/line[1]/math[1]/msup[1]", model.getPath());
  				t.is("msup", focusNode.nodeName);
  				t.is(1, model.getOffset());
  				t.is(2, line.firstChild.childNodes.length);// 确保是两个节点
  				t.is("msup", line.firstChild.firstChild.nodeName);// 确保mfrac被删掉
  			},
  			tearDown: function(){
  				
  			}
	    },{
	    	name: "删除分母,光标在分母上，分母里没有内容，左删除删掉分数结构，留下分子中的内容，光标在后面，分子的最后一个节点是layout节点(分数外用mstyle封装)",
  			setUp: function(){
  				this.model = new Model({});
  			},
  			runTest: function(t){
  				var model = this.model;
  				model.loadData("<root><line><math>" +
  						"<mstyle>" +
	  						"<mfrac>" +
		  						"<mrow><msup><mrow>1</mrow><mrow>2</mrow></msup></mrow>" +
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
  				model.removeLeft();
  				// 空的math，在获取焦点时，才显示；否则只占位，不显示。不在空的math中添加mn占位符。
  				var focusNode = model.getFocusNode();
  				t.is("/root/line[1]/math[1]/msup[1]", model.getPath());
  				t.is("msup", focusNode.nodeName);
  				t.is(1, model.getOffset());
  				t.is(2, line.firstChild.childNodes.length);// 确保是两个节点
  				t.is("msup", line.firstChild.firstChild.nodeName);// 确保mfrac被删掉
  			},
  			tearDown: function(){
  				
  			}
	    },{
	    	name: "删除分母,光标在分母上，分母里没有内容，左删除删掉分数结构，留下分子中的内容，光标在后面，分子的最后一个节点是layout节点(分数外用mstyle封装,分子也用mstyle封装)",
  			setUp: function(){
  				this.model = new Model({});
  			},
  			runTest: function(t){
  				var model = this.model;
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
  				model.removeLeft();
  				// 空的math，在获取焦点时，才显示；否则只占位，不显示。不在空的math中添加mn占位符。
  				var focusNode = model.getFocusNode();
  				t.is("/root/line[1]/math[1]/msup[1]", model.getPath());
  				t.is("msup", focusNode.nodeName);
  				t.is(1, model.getOffset());
  				t.is(2, line.firstChild.childNodes.length);// 确保是两个节点
  				t.is("msup", line.firstChild.firstChild.firstChild.nodeName);// 确保mfrac被删掉
  			},
  			tearDown: function(){
  				
  			}
	    },{
	    	name: "删除分子,光标在分子上，分子里没有任何内容，左删除删掉分子结构，留下分母中的内容，光标在前面，分母的第一个节点是token节点",
  			setUp: function(){
  				this.model = new Model({});
  			},
  			runTest: function(t){
  				var model = this.model;
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
  				model.removeLeft();
  				// 空的math，在获取焦点时，才显示；否则只占位，不显示。不在空的math中添加mn占位符。
  				var focusNode = model.getFocusNode();
  				t.is("/root/line[1]/math[1]/mn[1]", model.getPath());
  				t.is("mn", focusNode.nodeName);
  				t.is(0, model.getOffset());
  				t.is(2, line.firstChild.childNodes.length);// 确保是两个节点
  				t.is("mn", line.firstChild.firstChild.nodeName);// 确保mfrac被删掉
  			},
  			tearDown: function(){
  				
  			}
	    },{
	    	name: "删除分子,光标在分子上，分子里没有任何内容，左删除删掉分子结构，留下分母中的内容，光标在前面，分母的第一个节点是layout节点",
  			setUp: function(){
  				this.model = new Model({});
  			},
  			runTest: function(t){
  				var model = this.model;
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
  				model.removeLeft();
  				// 空的math，在获取焦点时，才显示；否则只占位，不显示。不在空的math中添加mn占位符。
  				var focusNode = model.getFocusNode();
  				t.is("/root/line[1]/math[1]/msup[1]", model.getPath());
  				t.is("msup", focusNode.nodeName);
  				t.is(0, model.getOffset());
  				t.is(2, line.firstChild.childNodes.length);// 确保是两个节点
  				t.is("msup", line.firstChild.firstChild.nodeName);// 确保mfrac被删掉
  			},
  			tearDown: function(){
  				
  			}
	    },{
	    	name: "分子中只剩一个节点时,节点是token节点，节点中只剩下一个字符，删除该字符后，显示占位符",
  			setUp: function(){
  				this.model = new Model({});
  			},
  			runTest: function(t){
  				var model = this.model;
  				model.loadData("<root><line><math>" +
  						"<mfrac>" +
	  						"<mrow><mn>1</mn></mrow>" +
	  						"<mrow><mn>23</mn></mrow>" +
  						"</mfrac>" +
  				"</math></line></root>");
  				model.mode = "mathml";
  				var line = model.getLineAt(0);
  				model.anchor.node = line.firstChild.firstChild.firstChild.firstChild;
  				model.anchor.offset = 1;
  				model.path = [];model.path.push({nodeName: "root"});
  				model.path.push({nodeName: "line", offset: 1});
  				model.path.push({nodeName: "math", offset: 1});
  				model.path.push({nodeName: "mfrac", offset: 1});
  				model.path.push({nodeName: "mrow", offset: 1});
  				model.path.push({nodeName: "mn", offset: 1});
  				model.removeLeft();
  				// 空的math，在获取焦点时，才显示；否则只占位，不显示。不在空的math中添加mn占位符。
  				var focusNode = model.getFocusNode();
  				t.is("/root/line[1]/math[1]/mfrac[1]/mrow[1]/mn[1]", model.getPath());
  				t.is("mn", focusNode.nodeName);
  				t.is(0, model.getOffset());
  				t.is("drip_placeholder_box", focusNode.getAttribute("class"));// 是占位符
  				// 确定新的节点是占位符
  				t.is(focusNode, line.firstChild.firstChild.firstChild.firstChild);
  			},
  			tearDown: function(){
  				
  			}
	    },{
	    	name: "分子中只剩一个节点时,节点是layout节点，删除该节点后，显示占位符",
  			setUp: function(){
  				this.model = new Model({});
  			},
  			runTest: function(t){
  				var model = this.model;
  				model.loadData("<root><line><math>" +
  						"<mfrac>" +
	  						"<mrow><msup><mrow>1</mrow><mrow>2</mrow></msup></mrow>" +
	  						"<mrow><mn>23</mn></mrow>" +
  						"</mfrac>" +
  				"</math></line></root>");
  				model.mode = "mathml";
  				var line = model.getLineAt(0);
  				model.anchor.node = line.firstChild.firstChild.firstChild.firstChild;
  				model.anchor.offset = 1;
  				model.path = [];model.path.push({nodeName: "root"});
  				model.path.push({nodeName: "line", offset: 1});
  				model.path.push({nodeName: "math", offset: 1});
  				model.path.push({nodeName: "mfrac", offset: 1});
  				model.path.push({nodeName: "mrow", offset: 1});
  				model.path.push({nodeName: "msup", offset: 1});
  				model.removeLeft();
  				// 空的math，在获取焦点时，才显示；否则只占位，不显示。不在空的math中添加mn占位符。
  				var focusNode = model.getFocusNode();
  				t.is("/root/line[1]/math[1]/mfrac[1]/mrow[1]/mn[1]", model.getPath());
  				t.is("mn", focusNode.nodeName);
  				t.is(0, model.getOffset());
  				t.is("drip_placeholder_box", focusNode.getAttribute("class"));// 是占位符
  				// 确定新的节点是占位符
  				t.is(focusNode, line.firstChild.firstChild.firstChild.firstChild);
  			},
  			tearDown: function(){
  				
  			}
	    },{
	    	name: "分母中只剩一个节点时,节点是token节点，节点中只剩下一个字符，删除该字符后，显示占位符",
  			setUp: function(){
  				this.model = new Model({});
  			},
  			runTest: function(t){
  				var model = this.model;
  				model.loadData("<root><line><math>" +
  						"<mfrac>" +
	  						"<mrow><mn>23</mn></mrow>" +
	  						"<mrow><mn>1</mn></mrow>" +
  						"</mfrac>" +
  				"</math></line></root>");
  				model.mode = "mathml";
  				var line = model.getLineAt(0);
  				model.anchor.node = line.firstChild.firstChild.lastChild.firstChild;
  				model.anchor.offset = 1;
  				model.path = [];model.path.push({nodeName: "root"});
  				model.path.push({nodeName: "line", offset: 1});
  				model.path.push({nodeName: "math", offset: 1});
  				model.path.push({nodeName: "mfrac", offset: 1});
  				model.path.push({nodeName: "mrow", offset: 2});
  				model.path.push({nodeName: "mn", offset: 1});
  				model.removeLeft();
  				// 空的math，在获取焦点时，才显示；否则只占位，不显示。不在空的math中添加mn占位符。
  				var focusNode = model.getFocusNode();
  				t.is("/root/line[1]/math[1]/mfrac[1]/mrow[2]/mn[1]", model.getPath());
  				t.is("mn", focusNode.nodeName);
  				t.is(0, model.getOffset());
  				t.is("drip_placeholder_box", focusNode.getAttribute("class"));// 是占位符
  				// 确定新的节点是占位符
  				t.is(focusNode, line.firstChild.firstChild.lastChild.firstChild);
  			},
  			tearDown: function(){
  				
  			}
	    },{
	    	name: "分母中只剩一个节点时,节点是layout节点，删除该节点后，显示占位符",
  			setUp: function(){
  				this.model = new Model({});
  			},
  			runTest: function(t){
  				var model = this.model;
  				model.loadData("<root><line><math>" +
  						"<mfrac>" +
	  						"<mrow><mn>23</mn></mrow>" +
	  						"<mrow><msup><mrow>1</mrow><mrow>2</mrow></msup></mrow>" +
  						"</mfrac>" +
  				"</math></line></root>");
  				model.mode = "mathml";
  				var line = model.getLineAt(0);
  				model.anchor.node = line.firstChild.firstChild.lastChild.firstChild;
  				model.anchor.offset = 1;
  				model.path = [];model.path.push({nodeName: "root"});
  				model.path.push({nodeName: "line", offset: 1});
  				model.path.push({nodeName: "math", offset: 1});
  				model.path.push({nodeName: "mfrac", offset: 1});
  				model.path.push({nodeName: "mrow", offset: 2});
  				model.path.push({nodeName: "msup", offset: 1});
  				model.removeLeft();
  				// 空的math，在获取焦点时，才显示；否则只占位，不显示。不在空的math中添加mn占位符。
  				var focusNode = model.getFocusNode();
  				t.is("/root/line[1]/math[1]/mfrac[1]/mrow[2]/mn[1]", model.getPath());
  				t.is("mn", focusNode.nodeName);
  				t.is(0, model.getOffset());
  				t.is("drip_placeholder_box", focusNode.getAttribute("class"));// 是占位符
  				// 确定新的节点是占位符
  				t.is(focusNode, line.firstChild.firstChild.lastChild.firstChild);
  			},
  			tearDown: function(){
  				
  			}
	    }
	    
	]);
});