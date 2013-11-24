define([ "intern!tdd", 
         "intern/chai!assert",
         "mathEditor/Model",
         "mathEditor/lang"], function(
        		 tdd,
        		 assert,
        		 Model,
        		 dripLang) {

	with(tdd){
		suite("Model.moveLeft.mn 在mn节点中左移", function(){
			
			var model = null;
			beforeEach(function () {
				model = new Model({});
			});
			
			test("mathml模式下，输入一个数字，左移光标一次", function(){
				model.toMathMLMode();
  				model.setData({data: "1"});
  				model.moveLeft();
  				assert.equal("/root/line[1]/math[1]/mn[1]", model.getPath()); 
  				assert.equal(model.getFocusNode().nodeName, "mn");
  				assert.equal(0, model.getOffset());
			});
			
			test("mathml模式下，输入两个数字，左移光标两次", function(){
				model.toMathMLMode();
  				model.setData({data: "1"});
  				model.setData({data: "2"});
  				model.moveLeft();
  				assert.equal("/root/line[1]/math[1]/mn[1]", model.getPath()); 
  				assert.equal(model.getFocusNode().nodeName, "mn");
  				assert.equal(1, model.getOffset());
  				
  				model.moveLeft();
  				assert.equal("/root/line[1]/math[1]/mn[1]", model.getPath()); 
  				assert.equal(model.getFocusNode().nodeName, "mn");
  				assert.equal(0, model.getOffset());
			});
			
			test("从分数前左移到分数前面的mn节点前，mn中只有一个数字", function(){
				model.loadData("<root><line><math>" +
  						"<mn>1</mn>" +
  						"<mstyle>" +
  							"<mfrac><mrow><mn>2</mn></mrow><mrow><mn>3</mn></mrow></mfrac>" +
  						"</mstyle>" +
  						"</math></line></root>");
  				model.mode = "mathml";
  				var line = model.getLineAt(0);
  				model.anchor.node = line.firstChild.lastChild.firstChild;
  				model.anchor.offset = 0;
  				model.path = [];
  				model.path.push({nodeName: "root"});
  				model.path.push({nodeName: "line", offset: 1});
  				model.path.push({nodeName: "math", offset: 1});
  				model.path.push({nodeName: "mfrac", offset: 2});
  				
  				model.moveLeft();
  				var node = model.getFocusNode();
  				assert.equal("/root/line[1]/math[1]/mn[1]", model.getPath()); 
  				assert.equal(node.nodeName, "mn");
  				assert.equal(0, model.getOffset());
  				assert.equal("1", dripLang.getText(node));
			});
			
			test("从分数前左移到分数前面的mn节点前，mn中有两个数字", function(){
				model.loadData("<root><line><math>" +
  						"<mn>12</mn>" +
  						"<mstyle>" +
  							"<mfrac><mrow><mn>1</mn></mrow><mrow><mn>3</mn></mrow></mfrac>" +
  						"</mstyle>" +
  						"</math></line></root>");
  				model.mode = "mathml";
  				var line = model.getLineAt(0);
  				model.anchor.node = line.firstChild.lastChild.firstChild;
  				model.anchor.offset = 0;
  				model.path = [];
  				model.path.push({nodeName: "root"});
  				model.path.push({nodeName: "line", offset: 1});
  				model.path.push({nodeName: "math", offset: 1});
  				model.path.push({nodeName: "mfrac", offset: 2});
  				
  				model.moveLeft();
  				var node = model.getFocusNode();
  				assert.equal("/root/line[1]/math[1]/mn[1]", model.getPath()); 
  				assert.equal(node.nodeName, "mn");
  				assert.equal(1, model.getOffset());
  				assert.equal("12", dripLang.getText(node));
			});
			
			
		});
	}
	
});