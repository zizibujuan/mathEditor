define(["dojox/xml/parser",
        "dojo/_base/array"], function(
        		xmlParser,
        		array){
	// summary:
	//		数据处理工具类，将xml字符串转换为html等。
	var dataUtil = {};
	
	// summary:
	//		xml的格式为：
	//		<root><line><text></text><math></math></line></root>
	dataUtil.xmlDocToHtml = function(xmlDoc){
		var xmlString = "";
		var root = xmlDoc.documentElement;
		var lines = root.childNodes;
		array.forEach(lines, function(line, index){
			var lineString = "<div class='drip_line'>";
			var spans = line.childNodes;
			array.forEach(spans, function(span, index){
				if(span.nodeName == "text"){
					lineString += "<span>"+span.textContent+"</span>";
				}else if(span.nodeName == "math"){
					// TODO:如果math中不存在子节点，则显示占位符
					lineString += "<span class=\"drip_math\">";
					if(span.childNodes.length == 0){
						// 添加“在这里添加公式”的提示信息，不在math中添加mn占位符
						lineString += "<math><mtext>请在这里输入公式</mtext></math>";
					}else{
						var tmp = xmlParser.innerXML(span);
						lineString += tmp.replace(/&amp;/g, "&");
					}
					lineString += "</span>";
				}
			});
			lineString += "</div>";
			
			xmlString += lineString;
		});
		return xmlString;
	},
	
	dataUtil.xmlStringToHtml = function(xmlString){
		var doc = xmlParser.parse(xmlString);
		return this.xmlDocToHtml(doc);
	}
	
	return dataUtil;
	
});