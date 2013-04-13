define([ "doh","mathEditor/Model" ], function(doh,Model) {

	doh.register("Model.moveRight frac在分数之间右移光标",[
	    {
	    	name: "mathml模式下，在一个空的分子上右移光标",
  			setUp: function(){
  				this.model = new Model({});
  			},
  			runTest: function(t){
  				var model = this.model;
  				model.toMathMLMode();
  				model.setData({data:"", nodeName:"mfrac"});
  				model.moveRight();
  				
  				t.is("/root/line[1]/math[1]/mfrac[1]/mrow[2]/mn[1]", model.getPath());
				var node = model.getFocusNode();
				
				t.t(node.parentNode.previousSibling != null);
				t.t(node.parentNode.nextSibling == null);
				t.is("mn", node.nodeName);
				t.is("drip_placeholder_box", node.getAttribute("class"));
				t.is(0, model.getOffset());
  			},
  			tearDown: function(){
  				this.model = null;
  			}
	    },{
	    	name: "mathml模式下，在一个空的分子上输入一个数字，然后右移光标",
  			setUp: function(){
  				this.model = new Model({});
  			},
  			runTest: function(t){
  				var model = this.model;
  				model.toMathMLMode();
  				model.setData({data:"", nodeName:"mfrac"});
  				model.setData({data:"1"});
  				
  				model.moveRight();
  				
  				t.is("/root/line[1]/math[1]/mfrac[1]/mrow[2]/mn[1]", model.getPath());
				var node = model.getFocusNode();
				
				t.t(node.parentNode.previousSibling != null);
				t.t(node.parentNode.nextSibling == null);
				t.is("mn", node.nodeName);
				t.is("drip_placeholder_box", node.getAttribute("class"));
				t.is(0, model.getOffset());
  			},
  			tearDown: function(){
  				this.model = null;
  			}
	    },{
	    	name: "mathml模式下，在空的分数上输入分子，右移光标到分母，在分母上输入一个数字，然后左移光标两次，然后右移光标一次，此时光标在分母最前面。",
  			setUp: function(){
  				this.model = new Model({});
  			},
  			runTest: function(t){
  				var model = this.model;
  				model.toMathMLMode();
  				model.setData({data: "", nodeName: "mfrac"});
  				model.setData({data: "1"});
  				model.moveRight();
  				model.setData({data: "2"});
  				
  				model.moveLeft();
  				model.moveLeft();
  				model.moveRight();
  				t.is("/root/line[1]/math[1]/mfrac[1]/mrow[2]/mn[1]", model.getPath());
				var node = model.getFocusNode();
				t.t(node.parentNode.previousSibling != null);
				t.is("mn", node.nodeName);
				t.is(0, model.getOffset());
				t.is("2", node.textContent);
  			},
  			tearDown: function(){
  				
  			}
	    },{
	    	name: "mathml模式下，在空的分数上，右移一次光标到分母占位符，再右移一次到整个分数之后",
  			setUp: function(){
  				this.model = new Model({});
  			},
  			runTest: function(t){
  				var model = this.model;
  				model.toMathMLMode();
  				model.setData({data: "", nodeName: "mfrac"});
  				model.moveRight();
  				model.moveRight();
  				t.is("/root/line[1]/math[1]/mfrac[1]", model.getPath());
				var node = model.getFocusNode();
				// 如果是layout mathml节点获取焦点，则0表示所在节点之前，1表示所在节点之后。
				t.is("mfrac", node.nodeName);
				t.is(1, model.getOffset());
  			},
  			tearDown: function(){
  				
  			}
	    },{
	    	// 为什么不把放表放在math之后呢？因为之前假定只要node为line，则其中没有内容。FIXME：看需不需要调节。
	    	name: "mathml模式下，将光标移出分数，如果分数后面没有任何内容，则光标就停留在分数之后",
  			setUp: function(){
  				this.model = new Model({});
  			},
  			runTest: function(t){
  				// TODO：重构，将移动方法进行拆分，先找到合适的下一个节点，然后再移动。
  				var model = this.model;
  				model.toMathMLMode();
  				model.setData({data: "", nodeName: "mfrac"});
  				model.moveRight();
  				model.moveRight();
  				model.moveRight();
  				t.is("/root/line[1]/math[1]", model.getPath());
				var node = model.getFocusNode();
				t.is("math", node.nodeName);
				t.is(1, model.getOffset());// 1表示在节点之后
  			},
  			tearDown: function(){
  				
  			}
	    },{
	    	name: "mathml模式下，将光标移出分数，如果分数后面有text文本，则光标就停留在text的第0字符位置",
  			setUp: function(){
  				this.model = new Model({});
  			},
  			runTest: function(t){
  				// TODO：需要先实现右移操作
//  				var model = this.model;
//  				model.toMathMLMode();
//  				model.setData({data: "", nodeName: "mfrac"});
//  				model.moveRight();
//  				model.moveRight();
//  				t.is("/root/line[1]/math[1]/mfrac[1]", model.getPath());
//				var node = model.getFocusNode();
//				// 如果是layout mathml节点获取焦点，则0表示所在节点之前，1表示所在节点之后。
//				t.is("mfrac", node.nodeName);
//				t.is(1, model.getOffset());
  			},
  			tearDown: function(){
  				
  			}
	    }
	    
	    // 在分数中输入字母和操作符号等。
	    // TODO：从分数外面移到分数里面
	                             
	]);
});