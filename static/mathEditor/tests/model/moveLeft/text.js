define([ "doh","mathEditor/Model" ], function(doh,Model) {

	doh.register("Model.moveLeft.text text节点间左移",[
	    {
	    	name: "text模式下输入一个英文字符，然后执行两次左移",
  			setUp: function(){
  				this.model = new Model({});
  			},
  			runTest: function(t){
  				var model = this.model;
  				model.setData({data:"a"});
  				model.moveLeft();
  				t.is("/root/line[1]/text[1]", model.getPath());
  				var focusNode = model.getFocusNode();
  				t.is("text", focusNode.nodeName);
  				t.is(0, model.getOffset());
  				
  				// 如果已经是行中的第一个节点，且offset为0，
  				// 则再往前移动时，就停留在这个text节点上，不再移动到line上。
  				// 确保如果node为line，offset为0，则line中就没有任何子节点。
  				model.moveLeft();
  				t.is("/root/line[1]/text[1]", model.getPath());
  				var focusNode = model.getFocusNode();
  				t.is(focusNode.nodeName, "text");
  				t.is(0, model.getOffset());
  			},
  			tearDown: function(){
  				
  			}
	    },{
	    	name: "text模式下输入两个英文字符，然后执行两次左移",
  			setUp: function(){
  				this.model = new Model({});
  			},
  			runTest: function(t){
  				var model = this.model;
  				model.setData({data:"ab"});
  				model.moveLeft();
  				model.moveLeft();
  				t.is("/root/line[1]/text[1]", model.getPath());
  				var focusNode = model.getFocusNode();
  				t.is("text", focusNode.nodeName);
  				t.is(0, model.getOffset());
  			},
  			tearDown: function(){
  				
  			}
	    },{
	    	name: "text模式下输入两个英文字符，然后执行一次左移",
  			setUp: function(){
  				this.model = new Model({});
  			},
  			runTest: function(t){
  				var model = this.model;
  				model.setData({data:"ab"});
  				model.moveLeft();
  				t.is("/root/line[1]/text[1]", model.getPath());
  				var focusNode = model.getFocusNode();
  				t.is("text", focusNode.nodeName);
  				t.is(1, model.getOffset());
  			},
  			tearDown: function(){
  				
  			}
	    }
	                             
	]);
});
