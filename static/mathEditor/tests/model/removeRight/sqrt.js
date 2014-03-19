define([ "intern!tdd", 
         "intern/chai!assert",
         "mathEditor/Model" ], function(
        		 tdd,
        		 assert,
        		 Model) {

	// summary:
	//		1.右删除删除根数,如果根数中没有任何内容，则直接删除掉根式
	with(tdd){
		suite("Model.removeRight.sqrt 右删除平方根", function(){
			
			var model = null;
			beforeEach(function () {
				model = new Model({});
			});
			
			test("右删除删除根数,如果根数中没有任何内容，则直接删除掉根式。", function(){
				model.loadData("<root><line>" +
  						"<math><msqrt><mn class=\"drip_placeholder_box\">8</mn></msqrt></math>" +
  				"</line></root>");
  				model.mode = "mathml";
  				var line = model.getLineAt(0);
  				model.anchor.node = line.firstChild.firstChild.firstChild;
  				model.anchor.offset = 0;
  				model.path = [];
  				model.path.push({nodeName: "root"});
  				model.path.push({nodeName: "line", offset: 1});
  				model.path.push({nodeName: "math", offset: 1});
  				model.path.push({nodeName: "msqrt", offset: 1});
  				model.path.push({nodeName: "mn", offset: 1});
  				model.removeRight();
  				
  				var focusNode = model.getFocusNode();
  				assert.equal("/root/line[1]/math[1]", model.getPath());
  				assert.equal("math", focusNode.nodeName);
  				assert.equal(2, model.getOffset());// layoutOffset.select
  				assert.equal(0, focusNode.childNodes.length);
			});
		});
	}

});