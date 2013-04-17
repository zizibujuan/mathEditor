define([ "doh","mathEditor/Model" ], function(doh,Model) {

	doh.register("Model.loadData 加载xml文件",[
	    {
	    	name: "加载空内容",
  			setUp: function(){
  				this.model = new Model({});
  			},
  			runTest: function(t){
  				var model = this.model;
  				model.loadData();
  				t.t(model.isEmpty());
  				
  				model.clear();
  				model.loadData("");
  				t.t(model.isEmpty());
  			},
  			tearDown: function(){
  				
  			}
	    },{
	    	name: "加载xml字符串",
  			setUp: function(){
  				this.model = new Model({});
  			},
  			runTest: function(t){
  				var model = this.model;
  				model.loadData("<root><line><text>a</text></line></root>");
  				t.is(1, model.getLineCount());
  			},
  			tearDown: function(){
  				
  			}
	    }
	                             
	]);
});