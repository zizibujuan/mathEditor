define([ "doh","mathEditor/Model" ], function(doh,Model) {

	doh.register("Model.moveLeft frac在分数之间左移光标",[
	    {
	    	name: "mathml模式下，在空的分数上先右移光标，然后再左移",
  			setUp: function(){
  				this.model = new Model({});
  			},
  			runTest: function(t){
  				var model = this.model;
  				model.toMathMLMode();
  				model.setData({data: "", nodeName: "mfrac"});
  				model.moveRight();
  				model.moveLeft();
  				
  				t.is("/root/line[1]/math[1]/mfrac[1]/mrow[1]/mn[1]", model.getPath());
				var node = model.getFocusNode();
				t.t(node.parentNode.previousSibling == null);
				t.is("mn", node.nodeName);
				t.is("drip_placeholder_box", node.getAttribute("class"));
				t.is(0, model.getOffset());
  			},
  			tearDown: function(){
  				
  			}
	    },{
	    	name: "mathml模式下，在空的分数上输入分子，右移光标到分母，在分母上输入一个数字，然后左移光标两次，此时光标在分子最后。",
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
  				t.is("/root/line[1]/math[1]/mfrac[1]/mrow[2]/mn[1]", model.getPath());
				var node = model.getFocusNode();
				t.is("mn", node.nodeName);
				t.is(0, model.getOffset());
				t.is("2", node.textContent);
  				
  				model.moveLeft();
  				t.is("/root/line[1]/math[1]/mfrac[1]/mrow[1]/mn[1]", model.getPath());
				var node = model.getFocusNode();
				t.t(node.parentNode.previousSibling == null);
				t.is("mn", node.nodeName);
				t.is(1, model.getOffset());
				t.is("1", node.textContent);
  			},
  			tearDown: function(){
  				
  			}
	    },{
	    	name: "mathml模式下，在空的分数上，左移一次光标，光标显示在整个分数之前",
  			setUp: function(){
  				this.model = new Model({});
  			},
  			runTest: function(t){
  				var model = this.model;
  				model.toMathMLMode();
  				model.setData({data: "", nodeName: "mfrac"});
  				model.moveLeft();
  				t.is("/root/line[1]/math[1]/mfrac[1]", model.getPath());
				var node = model.getFocusNode();
				// 如果是layout mathml节点获取焦点，则0表示所在节点之前，1表示所在节点之后。
				t.is("mfrac", node.nodeName);
				t.is(0, model.getOffset());
  			},
  			tearDown: function(){
  				
  			}
	    }
	                             
	]);
});