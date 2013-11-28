define([ "intern!tdd", 
         "intern/chai!assert", 
         "mathEditor/Model", 
         "mathEditor/lang" ], function(
        		 tdd,
        		 assert, 
        		 Model, 
        		 dripLang) {

	with(tdd){
		suite("Model.moveRight.mn 在mn节点中右移", function(){
			
			var model = null;
			beforeEach(function () {
				model = new Model({});
			});
			
			test("从分数后右移到分数后面的mn节点上，mn中只有一个数字", function(){
				model.loadData("<root><line><math>" +
  						"<mstyle>" +
  							"<mfrac><mrow><mn>2</mn></mrow><mrow><mn>3</mn></mrow></mfrac>" +
  						"</mstyle>" +
  						"<mn>1</mn>" +
  						"</math></line></root>");
  				model.mode = "mathml";
  				var line = model.getLineAt(0);
  				model.anchor.node = line.firstChild.firstChild.firstChild;
  				model.anchor.offset = 1;
  				model.path = [];
  				model.path.push({nodeName: "root"});
  				model.path.push({nodeName: "line", offset: 1});
  				model.path.push({nodeName: "math", offset: 1});
  				model.path.push({nodeName: "mfrac", offset: 1});
  				
  				model.moveRight();
  				var node = model.getFocusNode();
  				assert.equal("/root/line[1]/math[1]/mn[2]", model.getPath()); 
  				assert.equal(node.nodeName, "mn");
  				assert.equal(1, model.getOffset());
  				assert.equal("1", dripLang.getText(node));
			});
			
			test("从分数后右移到分数后面的mn节点上，mn中有两个数字", function(){
				model.loadData("<root><line><math>" +
  						"<mstyle>" +
  							"<mfrac><mrow><mn>2</mn></mrow><mrow><mn>3</mn></mrow></mfrac>" +
  						"</mstyle>" +
  						"<mn>12</mn>" +
  						"</math></line></root>");
  				model.mode = "mathml";
  				var line = model.getLineAt(0);
  				model.anchor.node = line.firstChild.firstChild.firstChild;
  				model.anchor.offset = 1;
  				model.path = [];
  				model.path.push({nodeName: "root"});
  				model.path.push({nodeName: "line", offset: 1});
  				model.path.push({nodeName: "math", offset: 1});
  				model.path.push({nodeName: "mfrac", offset: 1});
  				
  				model.moveRight();
  				var node = model.getFocusNode();
  				assert.equal("/root/line[1]/math[1]/mn[2]", model.getPath()); 
  				assert.equal(node.nodeName, "mn");
  				assert.equal(1, model.getOffset());
  				assert.equal("12", dripLang.getText(node));
			});
		});
	}
	
});