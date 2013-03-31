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
	    }
	    
	    // 在分数中输入字母和操作符号等。
	                             
	]);
});