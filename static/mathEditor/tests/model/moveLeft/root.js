define([ "doh","mathEditor/Model" ], function(doh,Model) {

	// summary:
	//		在根式中左移光标（这个根式中显示包含根次）
	//		左移进根式，首先进入根数
	//		1. 根式后没有任何节点，在根式后左移光标到根数后，根数的最后一个节点是token节点；
	//		2. 根式后没有任何节点，在根式后左移光标到根数后，根数的最后一个节点是layout节点；
	//		3. 根式后有一个token节点，在token节点最前左移光标到根数后，根数的最后一个节点是token节点；
	//		4. 根式后有一个token节点，在token节点最前左移光标到根数后，根数的最后一个节点是layout节点；
	//		5. 根式后有一个layout节点，在layout节点最前左移光标到根数后，根数的最后一个节点是token节点；
	//		6. 根式后有一个layout节点，在layout节点最前左移光标到根数后，根数的最后一个节点是layout节点；
	//		从根数前左移进根次后
	//		1. 根数第一个节点是token节点，根次最后一个节点是token节点
	//		2. 根数第一个节点是token节点，根次最后一个节点是layout节点
	//		3. 根数第一个节点是layout节点，根次最后一个节点是token节点
	//		4. 根数第一个节点是layout节点，根次最后一个节点是layout节点
	//		从根次前左移出根式，到根式前（注意：与根式前有无节点或节点种类无关）
	//		1. 根次的第一个节点是token节点
	//		2. 根次的第一个节点是layout节点
	doh.register("Model.moveLeft.root 在根式中左移光标",[
	    {
	    	name: "mathml模式下，在空的根式root中左移光标，将光标从index中移到根式之前。",
  			setUp: function(){
  				this.model = new Model({});
  			},
  			runTest: function(t){
  				var model = this.model;
  				model.toMathMLMode();
  				model.setData({data: "", nodeName: "mroot"});
  				model.moveLeft();
  				
				t.is("/root/line[1]/math[1]/mroot[1]", model.getPath());
				
				var baseNode = model.getFocusNode();
				t.is("mroot", baseNode.nodeName);
				t.is(0, model.getOffset());
  			},
  			tearDown: function(){
  				
  			}
	    },{
	    	name: "mathml模式下，在空的根式root中右移光标到base，然后左移光标到index。",
  			setUp: function(){
  				this.model = new Model({});
  			},
  			runTest: function(t){
  				var model = this.model;
  				model.toMathMLMode();
  				model.setData({data: "", nodeName: "mroot"});
  				model.moveRight();
  				model.moveLeft();
  				
				t.is("/root/line[1]/math[1]/mroot[1]/mrow[2]/mn[1]", model.getPath());
				
				var indexNode = model.getFocusNode();
				t.is("drip_placeholder_box", indexNode.getAttribute("class"));
				t.is("mn", indexNode.nodeName);
				t.is(0, model.getOffset());
  			},
  			tearDown: function(){
  				
  			}
	    },{
	    	name: "mathml模式下，在base为1，index为2的根式root中左移光标到index。",
  			setUp: function(){
  				this.model = new Model({});
  			},
  			runTest: function(t){
  				var model = this.model;
  				model.toMathMLMode();
  				model.setData({data: "", nodeName: "mroot"});
  				model.setData({data: "2"});
  				model.moveRight();
  				model.setData({data: "1"});
  				model.moveLeft();
  				model.moveLeft();
  				
				t.is("/root/line[1]/math[1]/mroot[1]/mrow[2]/mn[1]", model.getPath());
				
				var indexNode = model.getFocusNode();
				t.isNot("drip_placeholder_box", indexNode.getAttribute("class"));
				t.is("mn", indexNode.nodeName);
				t.is(1, model.getOffset());
  			},
  			tearDown: function(){
  				
  			}
	    }
	    // TODO:从根式外面移到根式里面
	                             
	]);
});