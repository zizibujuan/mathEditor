define([ "intern!tdd", 
         "intern/chai!assert",
         "mathEditor/Model" ], function(
        		 tdd,
        		 assert,
        		 Model) {

	with(tdd){
		suite("Model.moveLeft.mi 在mi节点中左移光标", function(){
			
			var model = null;
			beforeEach(function () {
				model = new Model({});
			});
			
			test("mathml模式下，输入一个单字符的变量x，然后左移光标", function(){
				model.loadData("<root><line><math><mi>x</mi></math></line></root>");
  				model.mode = "mathml";
  				var line = model.getLineAt(0);
  				model.anchor.node = line.firstChild.firstChild;
  				model.anchor.offset = 1;
  				model.path = [];
  				model.path.push({nodeName:"root"});
  				model.path.push({nodeName:"line", offset:1});
  				model.path.push({nodeName:"math", offset:1});
  				model.path.push({nodeName:"mi", offset:1});
  				model.moveLeft();
  				
  				assert.equal("/root/line[1]/math[1]/mi[1]", model.getPath()); 
  				assert.equal(model.getFocusNode().nodeName, "mi");
  				assert.equal(0, model.getOffset());
			});
			
			/**********多字符变量，如三角函数**********/
			test("mathml模式下，输入一个多字符的变量sin，然后左移光标一次", function(){
				model.loadData("<root><line><math><mi>sin</mi></math></line></root>");
  				model.mode = "mathml";
  				var line = model.getLineAt(0);
  				model.anchor.node = line.firstChild.firstChild;
  				model.anchor.offset = 1;
  				model.path = [];
  				model.path.push({nodeName:"root"});
  				model.path.push({nodeName:"line", offset:1});
  				model.path.push({nodeName:"math", offset:1});
  				model.path.push({nodeName:"mi", offset:1});
  				model.moveLeft();
  				
  				assert.equal("/root/line[1]/math[1]/mi[1]", model.getPath()); 
  				assert.equal("mi", model.getFocusNode().nodeName);
  				assert.equal(0, model.getOffset());
			});
			
			
		});
	}
	
});