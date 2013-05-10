define([ "doh","mathEditor/Model" ], function(doh,Model) {

	doh.register("Model.setData.math",[
	    {
	    	name: "在空的math前插入字母",
  			setUp: function(){
  				this.model = new Model({});
  			},
  			runTest: function(t){
  				var model = this.model;
  				model.loadData("<root><line><math></math></line></root>");
  				model.mode = "text";
  				var line = model.getLineAt(0);
  				model.anchor.node = line.firstChild;
  				model.anchor.offset = 0;// 在math前
  				model.path = [];model.path.push({nodeName: "root"});
  				model.path.push({nodeName: "line", offset: 1});
  				model.path.push({nodeName: "math", offset: 1});
  				model.setData({data: "a"});
  				t.is("/root/line[1]/text[1]", model.getPath());
  				var focusNode = model.getFocusNode();
  				t.is("text", focusNode.nodeName);
  				t.is(1, model.getOffset());// 表示已经移到math之后
  				t.t(model.isTextMode());
  				t.is("a", focusNode.textContent);
  				t.is(2, focusNode.parentNode.childElementCount);
  			},
  			tearDown: function(){
  				
  			}
	    }
	                             
	]);
});