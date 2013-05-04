// 输入英文字母
define([ "doh","mathEditor/Model" ], function(doh,Model) {
	
	// 现在的逻辑改为，如果在一个节点之前插入一个新节点，则光标的位置保持不变，即还是在原来节点之前，而不是调整到新节点之后。
	// FIXME:到底是选哪种好呢？
	doh.register("Model.setData.mi 输入变量",[
	    
		/********************mathml模式下*******************/
		{
			name: "mathml模式下，在空的model中输入一个英文字母",
			setUp: function(){
				this.model = new Model({});
				this.model.toMathMLMode();
			},
			runTest: function(t){
				var model = this.model;
				
				model.setData({data:"x"});
				t.is("/root/line[1]/math[1]/mi[1]", model.getPath());
				var focusNode = model.getFocusNode();
				t.is("mi", focusNode.nodeName);
				t.is("x", focusNode.textContent);
				t.is(1, model.getOffset());
			},
			tearDown: function(){
				
			}
		},{
			name: "mathml模式下，在空的model中输入一个字母之后，再输入一个字母",
			setUp: function(){
				this.model = new Model({});
				this.model.toMathMLMode();
			},
			runTest: function(t){
				var model = this.model;
				model.setData({data:"x"});
				model.setData({data:"y"});
				t.is("/root/line[1]/math[1]/mi[2]", model.getPath());
				var focusNode = model.getFocusNode();
				t.is("mi", focusNode.nodeName);
				t.is("y", focusNode.textContent);
				t.is(1, model.getOffset());
				
				var previous = focusNode.previousSibling;
				t.is("mi", previous.nodeName);
				t.is("x", previous.textContent);
			},
			tearDown: function(){
				
			}
		},{
			name: "mathml模式下，在空的model中输入一个字母之后，然后在这个字母前输入一个字母",
			setUp: function(){
				this.model = new Model({});
				this.model.toMathMLMode();
			},
			runTest: function(t){
				var model = this.model;
				model.setData({data:"x"});
				model.anchor.offset--;
				model.setData({data:"y"});
				t.is("/root/line[1]/math[1]/mi[2]", model.getPath());
				// 现在的逻辑改为，如果在一个节点之前插入一个新节点，则光标的位置保持不变，即还是在原来节点之前，而不是调整到新节点之后。
				// FIXME:到底是选哪种好呢？
				var focusNode = model.getFocusNode();
				t.is("mi", focusNode.nodeName);
				t.is("x", focusNode.textContent);
				t.is(0, model.getOffset());
				
				var previous = focusNode.previousSibling;
				t.is("mi", previous.nodeName);
				t.is("y", previous.textContent);
			},
			tearDown: function(){
				
			}
		},{
			name: "mathml模式下，在空的model中输入两个字母，然后在两个字母中间输入一个字母",
			setUp: function(){
				this.model = new Model({});
				this.model.toMathMLMode();
			},
			runTest: function(t){
				var model = this.model;
				model.setData({data:"x"});
				model.setData({data:"y"});
				model.anchor.offset--;
				model.setData({data:"z"});
				t.is("/root/line[1]/math[1]/mi[3]", model.getPath());
				var focusNode = model.getFocusNode();
				t.is("mi", focusNode.nodeName);
				t.is("y", focusNode.textContent);
				t.is(0, model.getOffset());
				
				var previous = focusNode.previousSibling;
				t.is("mi", previous.nodeName);
				t.is("z", previous.textContent);
				
				var next = focusNode.previousSibling.previousSibling;
				t.is("mi", next.nodeName);
				t.is("x", next.textContent);
			},
			tearDown: function(){
				
			}
		},{
	    	name: "在mn中间插入mi节点",
  			setUp: function(){
  				this.model = new Model({});
  			},
  			runTest: function(t){
  				var model = this.model;
  				model.loadData("<root><line>" +
	  						"<math>" +
		  						"<mn>12</mn>" +
	  						"</math>" +
  						"</line></root>");
  				model.mode = "mathml";
  				var line = model.getLineAt(0);
  				model.anchor.node = line.firstChild.firstChild;
  				model.anchor.offset = 1;
  				model.path.push({nodeName:"root"});
  				model.path.push({nodeName:"line", offset:1});
  				model.path.push({nodeName:"math", offset:1});
  				model.path.push({nodeName:"mn", offset:1});
  				model.setData({data:"x"});
  				// 光标的位置保持不变，依然停留在mo的前面，但是输入的值追加在mn最后
  				t.is("/root/line[1]/math[1]/mi[2]", model.getPath());
  				var focusNode = model.getFocusNode();
  				t.is("mi", focusNode.nodeName);
  				t.is(1, model.getOffset());
  				t.is("x", focusNode.textContent);
  				t.is(3, focusNode.parentNode.childNodes.length);
  				t.is("1", focusNode.previousSibling.textContent);
  				t.is("2", focusNode.nextSibling.textContent);
  			},
  			tearDown: function(){
  				
  			}
	    },{
	    	name: "在mn前面追加mi节点",
  			setUp: function(){
  				this.model = new Model({});
  			},
  			runTest: function(t){
  				var model = this.model;
  				model.loadData("<root><line>" +
	  						"<math>" +
		  						"<mn>12</mn>" +
	  						"</math>" +
  						"</line></root>");
  				model.mode = "mathml";
  				var line = model.getLineAt(0);
  				model.anchor.node = line.firstChild.firstChild;
  				model.anchor.offset = 0;
  				model.path.push({nodeName:"root"});
  				model.path.push({nodeName:"line", offset:1});
  				model.path.push({nodeName:"math", offset:1});
  				model.path.push({nodeName:"mn", offset:1});
  				model.setData({data:"x"});
  				// 光标的位置保持不变，依然停留在mo的前面
  				t.is("/root/line[1]/math[1]/mn[2]", model.getPath());
  				var focusNode = model.getFocusNode();
  				t.is("mn", focusNode.nodeName);
  				t.is(0, model.getOffset());
  				t.is("x", focusNode.previousSibling.textContent);
  				t.is(2, focusNode.parentNode.childNodes.length);
  				t.is("12", focusNode.textContent);
  			},
  			tearDown: function(){
  				
  			}
	    },{
	    	name: "在mn后面追加mi节点",
  			setUp: function(){
  				this.model = new Model({});
  			},
  			runTest: function(t){
  				var model = this.model;
  				model.loadData("<root><line>" +
	  						"<math>" +
		  						"<mn>12</mn>" +
	  						"</math>" +
  						"</line></root>");
  				model.mode = "mathml";
  				var line = model.getLineAt(0);
  				model.anchor.node = line.firstChild.firstChild;
  				model.anchor.offset = 2;
  				model.path.push({nodeName:"root"});
  				model.path.push({nodeName:"line", offset:1});
  				model.path.push({nodeName:"math", offset:1});
  				model.path.push({nodeName:"mn", offset:1});
  				model.setData({data:"x"});
  				// 光标的位置保持不变，依然停留在mo的前面，但是输入的值追加在mn最后
  				t.is("/root/line[1]/math[1]/mi[2]", model.getPath());
  				var focusNode = model.getFocusNode();
  				t.is("mi", focusNode.nodeName);
  				t.is(1, model.getOffset());
  				t.is("x", focusNode.textContent);
  				t.is(2, focusNode.parentNode.childNodes.length);
  				t.is("12", focusNode.previousSibling.textContent);
  			},
  			tearDown: function(){
  				
  			}
	    }
	                             
	]);
});