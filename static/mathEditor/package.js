var profile = (function(){
	
	var testResourceRe = /^mathEditor\/tests\//;
	
	var copyOnly = function(fileName, mid){
		var list = {
			"mathEditor/package":1,
			"mathEditor/package.json":1
		};
		
		return (mid in list) || 
			(/^mathEditor\/resources\//.test(mid) && !/\.css$/.test(fileName)) ||
			/(png|jpg|jpeg|gif|tiff)$/.test(fileName);
		
	}
	
	return {
		resourceTags:{
			test: function(fileName, mid){
				return testResourceRe.test(mid);
			},
			
			copyOnly: function(fileName, mid){
				return copyOnly(fileName, mid);
			},
			
			amd: function(fileName, mid){
				return !testResourceRe.test(mid) && !copyOnly(fileName, mid) && /\.js$/.test(fileName);
			}
		}
	};
	
	
})();