define([ "doh","mathEditor/Model" ], function(doh,Model) {

	doh.register("Model.moveRight.text text节点间右移",[
	    {
	    	name: "text模式下输入一个英文字符，然后执行右移",
  			setUp: function(){
  				this.model = new Model({});
  			},
  			runTest: function(t){
  				var model = this.model;
  				model.setData({data:"a"});
  				model.moveRight();
  				t.is("/root/line[1]/text[1]", model.getPath());
  				var focusNode = model.getFocusNode();
  				t.is(focusNode.nodeName, "text");
  				t.is(1, model.getOffset());
  				
  				model.moveRight();
  				t.is("/root/line[1]/text[1]", model.getPath());
  				var focusNode = model.getFocusNode();
  				t.is(focusNode.nodeName, "text");
  				t.is(1, model.getOffset());
  			},
  			tearDown: function(){
  				
  			}
	    },{
	    	name: "text模式下输入一个英文字符，执行左移，然后执行右移",
  			setUp: function(){
  				this.model = new Model({});
  			},
  			runTest: function(t){
  				var model = this.model;
  				model.setData({data:"a"});
  				model.moveLeft();
  				model.moveRight();
  				t.is("/root/line[1]/text[1]", model.getPath());
  				var focusNode = model.getFocusNode();
  				t.is(focusNode.nodeName, "text");
  				t.is(1, model.getOffset());
  			},
  			tearDown: function(){
  				
  			}
	    }
	                             
	]);
});
