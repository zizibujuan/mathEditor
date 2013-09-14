define(["intern!tdd",
        "intern/chai!assert",
        "require"], function(
        		tdd,
        		assert,
        		require){
	
	with(tdd){
		
		suite("Text Input", function(){
			
			test("输入英文小写字母", function(){
				return this.remote.get(require.toUrl("./TextInput.html"))
				.title().then(function(title){
					assert.equal("View Test", title);
				});
			});
			
		});
		
	}
	
});