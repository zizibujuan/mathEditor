// 三角函数
define([ "doh","mathEditor/Model" ], function(doh,Model) {

	function testSupport(t, model, tri){
		model.setData({data:tri, nodeName:"mi"});
		isTri(t, model, tri);
	}
	
	function isTri(t, model, tri){
		t.is("/root/line[1]/math[1]/mrow[3]/mn[1]", model.getPath());
		
		var node = model.getFocusNode();
		t.is("mn", node.nodeName);
		t.is("drip_placeholder_box", node.getAttribute("class"));
		t.is(0, model.getOffset());
		
		var funNode = node.parentNode.previousSibling;
		t.is("mo",funNode.nodeName);
		t.is("&#x2061;",funNode.textContent);
		
		var triNode = funNode.previousSibling;
		t.is("mi", triNode.nodeName);
		t.is(tri, triNode.textContent);
	}
	
	doh.register("Model.setData 三角函数",[
	    {
  			name: "在空的数学编辑器上输入sin/cos/tan/cot/sec/csc",
  			setUp: function(){
  				this.model = new Model({});
  			},
  			runTest: function(t){
  				/*
  				 * <mi>cos</mi>
  				 * <mo>&#x2061;</mo> 函数应用
  				 * <mrow>
  				 * <mn></mn> 占位符统一使用mn表示
  				 * </mrow>
  				 */
  				var model = this.model;
  				// 其实下面这些都属于一类，一个测试用例足够。
  				// 但是在单个输入字符时，需要对每个三角函数进行判断，所以这里全部测试，
  				// 防止在代码实现时，遗漏处理的情况。
  				model._toMathMLMode();
  				testSupport(t,model,"sin");
  				model.clear();
  				
  				model._toMathMLMode();
  				testSupport(t,model,"cos");
  				model.clear();
  				
  				model._toMathMLMode();
  				testSupport(t,model,"tan");
  				model.clear();
  				
  				model._toMathMLMode();
  				testSupport(t,model,"cot");
  				model.clear();
  				
  				model._toMathMLMode();
  				testSupport(t,model,"sec");
  				model.clear();
  				
  				model._toMathMLMode();
  				testSupport(t,model,"csc");
  				model.clear();
  			},
  			tearDown: function(){
  				
  			}
  		},
	    
	    // 分为一次性输入，和单个字符串的输入，
	    // 注意，删除的时候，敲一次删除键，删除整个操作符
  		{
  			name: "逐个字母的输入每个三角函数",
  			setUp: function(){
  				this.model = new Model({});
  				this.model._toMathMLMode();
  			},
  			runTest: function(t){
  				var model = this.model;
  				model.setData({data:"s"});
  				t.is("/root/line[1]/math[1]/mi[1]", model.getPath());
  				
  				var node = model.getFocusNode();
  				t.is("mi", node.nodeName);
  				t.is("s", node.textContent);
  				t.is(1, model.getOffset());
  				
  				model.setData({data:"i"});
  				node = model.getFocusNode();
  				t.is("/root/line[1]/math[1]/mi[1]", model.getPath());
  				t.is("mi", node.nodeName);
  				t.is("si", node.textContent);
  				t.is(2, model.getOffset());
  				
  				model.setData({data:"n"});
  				isTri(t, model, "sin");
  			},
  			tearDown: function(){
  				
  			}
  		}
  		
	]);
});
