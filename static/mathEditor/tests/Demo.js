define(["intern!tdd", 
        "intern/chai!assert"], function(
        		tdd,
        		assert){
	
	with(tdd){
		suite("demo", function(){
			test("xxx", function(){
				assert.ok(true);
			});
		});
	}
	
});