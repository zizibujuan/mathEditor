define([ "doh","mathEditor/Model" ], function(doh,Model) {

	/**
	 * 注意：不要强行使用\n作为换行符号，而是应该使用操作系统支持的换行符号。
	 * 因为如果用户从其他文本编辑器中拷贝过来一段文字之后，如果换行符为\r\n，
	 * 则这个程序就无法正确识别。
	 */
	doh.register("Model.setData newLine创建新行",[
	    {
	    	name: "text模式下，在空的model中插入一个新行，即敲击回车插入空行, 使用\\n表示换行，因此遇到keyCode为13时，转换为\\n",
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
  				t.is("line", model.getFocusNode().nodeName);
  				// 确认当前获取焦点的行节点，是第二行
  				t.is(model.getFocusNode(), model.getLineAt(1));
  				t.is(0, model.getOffset());
  			},
  			tearDown: function(){
  				
  			}
	    },{
	    	// 因为这个测试用例主要是用户测试换行，所以放在这个文件中。即使其中也间接测试了输入letter
	    	name: "text模式下，在空的model中输入两行内容",
  			setUp: function(){
  				this.model = new Model({});
  			},
  			runTest: function(t){
  				var model = this.model;
  				// 遇到如回车符号或者换行符号这类特殊的字符时，使用转义字符表示。
  				model.setData({data:"a\nb"});
  				t.is(2, model.getLineCount());
  				// 如果刚开始什么都不输入，则只插入一个空的line节点，不预插入text节点
  				t.is("/root/line[2]/text[1]", model.getPath());
  				// 测试用例需要确定，这个节点不是第一个节点
  				t.is("text", model.getFocusNode().nodeName);
  				t.is(1, model.getOffset());
  			},
  			tearDown: function(){
  				
  			}
	    },{
	    	name: "text模式下，在空的model中输入三行内容",
  			setUp: function(){
  				this.model = new Model({});
  			},
  			runTest: function(t){
  				var model = this.model;
  				// 遇到如回车符号或者换行符号这类特殊的字符时，使用转义字符表示。
  				model.setData({data:"a\nb\nc"});
  				t.is(3, model.getLineCount());
  				// 如果刚开始什么都不输入，则只插入一个空的line节点，不预插入text节点
  				t.is("/root/line[2]/text[1]", model.getPath());
  				// 测试用例需要确定，这个节点不是第一个节点
  				t.is("text", model.getFocusNode().nodeName);
  				t.is(1, model.getOffset());
  			},
  			tearDown: function(){
  				
  			}
	    },{
	    	name: "text模式下，在已有内容的model中输入三行内容",
  			setUp: function(){
  				this.model = new Model({});
  			},
  			runTest: function(t){
//  				var model = this.model;
//  				// 遇到如回车符号或者换行符号这类特殊的字符时，使用转义字符表示。
//  				model.setData({data:"a\nb\nc"});
//  				t.is(3, model.getLineCount());
//  				// 如果刚开始什么都不输入，则只插入一个空的line节点，不预插入text节点
//  				t.is("/root/line[2]/text[1]", model.getPath());
//  				// 测试用例需要确定，这个节点不是第一个节点
//  				t.is("text", model.getFocusNode().nodeName);
//  				t.is(1, model.getOffset());
  			},
  			tearDown: function(){
  				
  			}
	    },{
	    	name: "mathml模式下，不支持输入回车符",
	    	setUp: function(){
	    		this.model = new Model({});
	    		this.model._toMathMLMode();
	    	},
	    	runTest: function(t){
	    		
	    	},
	    	tearDown: function(){
	    		
	    	}
	    }
	                             
	]);
});