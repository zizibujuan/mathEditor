define(["intern!tdd",
        "intern/chai!assert",
        "require"], function(
        		tdd,
        		assert,
        		require){
	
	with(tdd){
		
		var keys = {
			'Shift': '\uE008',
			'Space': '\uE00D',
			'Ctrl': '\uE009',
			'Alt': '\uE00A',
			'Enter': '\uE007',
			'Tab': '\uE004',
			'Backspace': '\uE003',
			'Esc': '\uE00C',
			'Delete': '\uE017',
			'LeftArrow': '\uE012',
			'UpArrow': '\uE013',
			'RightArrow': '\uE014',
			'DownArrow': '\uE015'
		};
		
		suite("Text Input", function(){
			
			before(function(){
				return this.remote.get(require.toUrl("./TextInput.html"))
				.waitForCondition("ready", 5000);
			});
			
			after(function(){
				
			});
			
			test("输入英文小写字母", function(){
				return this.remote
				.elementByCssSelector(".drip_text_input")
				.type(["a"])
				.end()
				.elementById("editor")
				.getAttribute("innerHTML")
				.then(function(innerHTML){
					assert.equal("a", innerHTML);
				});
			});
			
			test("输入英文大写字母", function(){
				return this.remote
				.elementByCssSelector(".drip_text_input")
				.type([keys.Shift, "a"])
				.end()
				.elementById("editor")
				.getAttribute("innerHTML")
				.then(function(innerHTML){
					assert.equal("A", innerHTML);
				});
			});
			
			test("输入数字", function(){
				return this.remote
				.elementByCssSelector(".drip_text_input")
				.type(["1"])
				.end()
				.elementById("editor")
				.getAttribute("innerHTML")
				.then(function(innerHTML){
					assert.equal("1", innerHTML);
				});
			});
			
			test("输入中文", function(){
				return this.remote
				.elementByCssSelector(".drip_text_input")
				.type(["啊"])
				.end()
				.elementById("editor")
				.getAttribute("innerHTML")
				.then(function(innerHTML){
					assert.equal("啊", innerHTML);
				});
			});
			
		});
		
	}
	
});