define([ "doh","mathEditor/Model" ], function(doh,Model) {

	// 无论是text模式还是mathml模式，都允许输入希腊字母
	
	doh.register("Model.setData 希腊字母",[
	    /*{
	    	name: "在text模式下输入希腊字母, 暂不支持",
  			setUp: function(){
  				this.model = new Model({});
  			},
  			runTest: function(t){
  				var model = this.model;
  				model.setData({data:"&#x3B1;"});
  				
  				t.is("/root/line[1]/text[1]", model.getPath());
				var focusNode = model.getFocusNode();
				t.is(focusNode.nodeName, "text");
				t.is("&#x3B1;", focusNode.textContent);
				t.is(1, model.getOffset());
  			},
  			tearDown: function(){
  				
  			}
	    },*/{
	    	name: "在mathml模式下输入希腊字母",
  			setUp: function(){
  				this.model = new Model({});
  				this.model._toMathMLMode();
  			},
  			runTest: function(t){
  				var model = this.model;
  				model.setData({data:"&#x3B1;", nodeName:"mi"});
  				
  				t.is("/root/line[1]/math[1]/mi[1]", model.getPath());
				var focusNode = model.getFocusNode();
				t.is(focusNode.nodeName, "mi");
				t.is("&#x3B1;", focusNode.textContent);
				t.is(1, model.getOffset());
  			},
  			tearDown: function(){
  				
  			}
	    }
	                             
	]);
});