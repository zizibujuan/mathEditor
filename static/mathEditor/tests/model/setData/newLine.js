define([ "doh","mathEditor/Model" ], function(doh,Model) {

	doh.register("Model.setData newLine创建新行",[
	    {
	    	name: "在空的model中插入一个新行，即敲击回车插入空行, 使用\\n表示换行，因此遇到keyCode为13时，转换为\\n",
  			setUp: function(){
  				this.model = new Model({});
  			},
  			runTest: function(t){
  				var model = this.model;
  				// 遇到如回车符号或者换行符号这类特殊的字符时，使用转义字符表示。
  				model.setData({data:"\n"});
  				t.t(model.getLineCount() == 2);
  				// 如果刚开始什么都不输入，则只插入一个空的line节点，不预插入text节点
  				t.is("/root/line[2]", model.getPath());
  				// 测试用例需要确定，这个节点不是第一个节点
  				t.is(model.getFocusNode().nodeName, "line");
  				// 确认当前获取焦点的行节点，是第二行
  				t.is(model.getFocusNode(), model.getLineAt(1));
  				t.is(0, model.getOffset());
  			},
  			tearDown: function(){
  				
  			}
	    }
	                             
	]);
});