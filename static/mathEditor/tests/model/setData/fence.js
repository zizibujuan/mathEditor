define([ "doh","mathEditor/Model" ], function(doh,Model) {

	doh.register("Model.setData.fence fence对称的括号",[
	    {
			name: "mathml模式下，在空的model上输入()/[]/{}/||",
			setUp: function(){
				this.model = new Model({});
			},
			runTest: function(t){
				/**
				 * <mfenced open="[" close="}" separators="sep#1 sep#2 ... sep#(n-1)">
				 * <mrow><mi>x</mi></mrow>
				 * <mrow><mi>y</mi></mrow>
				 * </mfenced>
				 * 
				 * 注意，参数个数的区别，多个参数的话，使用指定的分割符号分开，默认为",".
				 * open和close默认为()
				 * 
				 * 括号，不弹出提示，自动完成。不要在提示框中添加就可以实现。
				 */
				var model = this.model;
				model.toMathMLMode();
				model.setData({data:"("});
				t.is("/root/line[1]/math[1]/mfenced[1]/mrow[1]/mn[1]", model.getPath());
				
				var node = model.getFocusNode();
				t.is("mn", node.nodeName);
				t.is("drip_placeholder_box", node.getAttribute("class"));
				t.is(0, model.getOffset());
			
				var mfencedNode = node.parentNode.parentNode;
				t.is("mfenced",mfencedNode.nodeName);
			},
			tearDown: function(){
				
			}
		},{
			name: "在token节点后添加mfenced",
			setUp: function(){
				this.model = new Model({});
			},
			runTest: function(t){
				var model = this.model;
				model.loadData("<root><line><math><mn>12</mn></math></line></root>");
				model.mode = "mathml";
				var line = model.getLineAt(0);
				model.anchor.node = line.firstChild.firstChild;
				model.anchor.offset = 2;
				model.path = [];
				model.path.push({nodeName:"root"});
				model.path.push({nodeName:"line", offset:1});
				model.path.push({nodeName:"math", offset:1});
				model.path.push({nodeName:"mn", offset:1});
				
				model.setData({data:"("});
				t.is("/root/line[1]/math[1]/mfenced[2]/mrow[1]/mn[1]", model.getPath());
				
				var node = model.getFocusNode();
				t.is("mn", node.nodeName);
				t.is("drip_placeholder_box", node.getAttribute("class"));
				t.is(0, model.getOffset());
			
				var mfencedNode = node.parentNode.parentNode;
				t.is("mfenced",mfencedNode.nodeName);
				t.is(2, line.firstChild.childElementCount);
				t.is("mn", line.firstChild.firstChild.nodeName);
				t.is("mfenced", line.firstChild.firstChild.nextSibling.nodeName);
			},
			tearDown: function(){
				
			}
		},{
			name: "在token节点前添加mfenced",
			setUp: function(){
				this.model = new Model({});
			},
			runTest: function(t){
				var model = this.model;
				model.loadData("<root><line><math><mn>12</mn></math></line></root>");
				model.mode = "mathml";
				var line = model.getLineAt(0);
				model.anchor.node = line.firstChild.firstChild;
				model.anchor.offset = 0;
				model.path = [];
				model.path.push({nodeName:"root"});
				model.path.push({nodeName:"line", offset:1});
				model.path.push({nodeName:"math", offset:1});
				model.path.push({nodeName:"mn", offset:1});
				
				model.setData({data:"("});
				t.is("/root/line[1]/math[1]/mfenced[1]/mrow[1]/mn[1]", model.getPath());
				
				var node = model.getFocusNode();
				t.is("mn", node.nodeName);
				t.is("drip_placeholder_box", node.getAttribute("class"));
				t.is(0, model.getOffset());
			
				var mfencedNode = node.parentNode.parentNode;
				t.is("mfenced",mfencedNode.nodeName);
				t.is(2, line.firstChild.childElementCount);
				t.is("mfenced", line.firstChild.firstChild.nodeName);
				t.is("mn", line.firstChild.firstChild.nextSibling.nodeName);
			},
			tearDown: function(){
				
			}
		}
		
		// 在mn之间插入fenced
	                             
	]);
});