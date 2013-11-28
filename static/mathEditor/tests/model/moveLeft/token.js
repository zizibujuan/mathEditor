define([ "intern!tdd", 
         "intern/chai!assert",
         "mathEditor/Model" ], function(
        		 tdd,
        		 assert,
        		 Model) {

	with(tdd){
		suite("Model.moveLeft.token 在mathml token节点之间左移", function(){
			
			var model = null;
			beforeEach(function () {
				model = new Model({});
			});
			
			test("mathml模式下，从mo节点移到mn节点", function(){
				model.loadData("<root><line><math><mn>12</mn><mo>+</mo></math></line></root>");
				model.mode = "mathml";
				var line = model.getLineAt(0);
				model.anchor.node = line.firstChild.lastChild;
				model.anchor.offset = 0;
				model.path = [];
				model.path.push({nodeName: "root"});
				model.path.push({nodeName: "line", offset: 1});
				model.path.push({nodeName: "math", offset: 1});
				model.path.push({nodeName: "mo", offset: 2});
				
				model.moveLeft();
				
				assert.equal("/root/line[1]/math[1]/mn[1]", model.getPath());
				assert.equal("mn", model.getFocusNode().nodeName);
				assert.equal(1, model.getOffset());// 光标应该放在1之后，2之前
			});
			
			test("mathml模式下，当mn为占位符时，判断是否能往在token中往左移动", function(){
				model.loadData("<root><line><math><mn class=\"drip_placeholder_box\">8</mn></math></line></root>");
  				var line = model.getLineAt(0);
  				model.mode = "mathml";
  				model.anchor.node = line.firstChild.firstChild;
  				model.anchor.offset = 0;
  				model.path = [];
  				model.path.push({nodeName: "root"});
  				model.path.push({nodeName: "line", offset: 1});
  				model.path.push({nodeName: "math", offset: 1});
  				model.path.push({nodeName: "mn", offset: 1});
  				assert.isFalse(model._canMoveLeftWithInToken(model.anchor));
			});
			
			test("往左移动时，判断当前光标是不是在token中移动", function(){
				model.setData({data:"a"});
  				assert.ok(model._canMoveLeftWithInToken(model.anchor));
			});
			
		});
	}

});