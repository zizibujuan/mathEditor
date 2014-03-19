define([ "intern!tdd", 
         "intern/chai!assert", 
         "mathEditor/mathContentAssist" ], function(
        		 tdd,
        		 assert, 
        		 mathContentAssist) {
	
	with(tdd){
		suite("mathContentAssist", function(){
			test("getProposals", function(){
				mathContentAssist.keywords = [];
				var result = mathContentAssist.getProposals("a");
				assert.isTrue(result.length == 0);
				
				mathContentAssist.keywords = [{
					input:"abc",
				},{
					input:"a12"
				},{
					input:"/"
				}];
				var result = mathContentAssist.getProposals("a");
				assert.isTrue(result.length == 2);
			});
		});
	}
	
});