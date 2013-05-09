define([ "dojo/_base/array" ], function(array) {

	// 显示对应的快捷键,快捷键就是input中的值
	// TODO: 将支持英文的快捷键和支持中文的快捷键分开。
	//       并且允许用户自定义快捷键。
	// TODO: 将input设计成逗号隔开，支持多个快捷键。而这些快捷键，即支持ms word的标准键，也支持用户自定义，
	//		 如支持用户使用汉语拼音或拼音的缩写作为快捷键。甚至高级用户可以自定义快捷键。
	return {
		keywords : [ {
			input: "/", // 用户输入的值
			map: "&#xF7;",  // 在编辑器中实际输入的值
			nodeName: "mo", // 使用那个标签封装
			freq: 0, // 用户选择的频率
			label: "除号", // 在提示菜单中显示的值
			iconClass: "drip_equation_icon drip_division", // 在提示菜单中显示的图标
			single: true
		}/*,{
			input: "/",
			map: "/",
			nodeName: "text",
			freq: 0,
			label: "/",
			iconClass: ""
		}*/,{
			// <mfrac> numerator(分子) denominator(分母) </mfrac>
			// 当是分数，需要推断出分子时，如果可能有多种情况，则给出一个列表，让用户去选择。
			input: "/",
			map: "",
			nodeName: "mfrac",
			freq: 0,
			label: "分数",
			iconClass: "drip_equation_icon drip_frac"
		},{
			// <mfrac> numerator(分子) denominator(分母) </mfrac>
			// 当是分数，需要推断出分子时，如果可能有多种情况，则给出一个列表，让用户去选择。
			input: "fs",
			map: "",
			nodeName: "mfrac",
			freq: 0,
			label: "分数",
			iconClass: "drip_equation_icon drip_frac"
		},{
			input: "*",
			map: "&#xD7;",
			nodeName: "mo",
			freq: 0,
			label: "乘号",
			iconClass: "drip_equation_icon drip_multiplication"
		},/*{
			input: "*",
			map: "*",
			nodeName: "text",
			freq: 0,
			label: "*",
			iconClass: ""
		},*/{
			// 支持输入平方立方，或直接输入数字
			input: "^",
			map: "^",
			nodeName: "text",
			freq: 0,
			label: "^",
			iconClass: ""
		},{
			// 支持输入平方立方，或直接输入数字
			input: "^",
			map: "",
			nodeName: "msup",
			freq: 0,
			label: "上标",
			iconClass: "drip_equation_icon drip_sup"
		},{
			input: "_",
			map: "_",
			nodeName: "text",
			freq: 0,
			label: "_",
			iconClass: ""
		},{
			// 支持输入平方立方，或直接输入数字
			input: "_",
			map: "",
			nodeName: "msub",
			freq: 0,
			label: "下标",
			iconClass: "drip_equation_icon drip_sub"
		},{
			// 支持输入平方根
			input: "sqrt",
			map: "",
			nodeName: "msqrt",
			freq: 0,
			label: "平方根",
			iconClass: "drip_equation_icon drip_sqrt"
		},{
			// 支持输入根数为任意数的根号
			input: "sqrt",
			map: "",
			nodeName: "mroot",
			freq: 0,
			label: "开根号",
			iconClass: "drip_equation_icon drip_root"
		},{
			input: "sin",
			map: "sin",
			nodeName: "mi",
			freq: 0,
			label: "sin",
			iconClass: ""
		},{
			input: "cos",
			map: "cos",
			nodeName: "mi",
			freq: 0,
			label: "cos",
			iconClass: ""
		},{
			input: "tan",
			map: "tan",
			nodeName: "mi",
			freq: 0,
			label: "tan",
			iconClass: ""
		},{
			input: "cot",
			map: "cot",
			nodeName: "mi",
			freq: 0,
			label: "cot",
			iconClass: ""
		},
		// 希腊字母,小写
		{
			input: "alpha",
			map: "&#x3B1;",
			nodeName: "mi",
			freq: 0,
			label: "阿尔法",
			iconClass: "drip_equation_icon drip_alpha"
		},{
			input: "beta",
			map: "&#x3B2;",
			nodeName: "mi",
			freq: 0,
			label: "贝塔",
			iconClass: "drip_equation_icon drip_beta"
		},{
			input: "gamma",
			map: "&#x3B3;",
			nodeName: "mi",
			freq: 0,
			label: "伽玛",
			iconClass: "drip_equation_icon drip_gamma"
		},{
			input: "delta",
			map: "&#x3B4;",
			nodeName: "mi",
			freq: 0,
			label: "德尔塔",
			iconClass: "drip_equation_icon drip_delta"
		},{
			input: "epsilon",
			map: "&#x3B5;",
			nodeName: "mi",
			freq: 0,
			label: "艾普西龙",
			iconClass: "drip_equation_icon drip_epsilon"
		},{
			input: "zeta",
			map: "&#x3B6;",
			nodeName: "mi",
			freq: 0,
			label: "捷塔",
			iconClass: "drip_equation_icon drip_zeta"
		},{
			input: "eta",
			map: "&#x3B7;",
			nodeName: "mi",
			freq: 0,
			label: "依塔",
			iconClass: "drip_equation_icon drip_eta"
		},{
			input: "theta",
			map: "&#x3B8;",
			nodeName: "mi",
			freq: 0,
			label: "西塔",
			iconClass: "drip_equation_icon drip_theta"
		},{
			input: "iota",
			map: "&#x3B9;",
			nodeName: "mi",
			freq: 0,
			label: "艾欧塔",
			iconClass: "drip_equation_icon drip_iota"
		},{
			input: "kappa",
			map: "&#x3BA;",
			nodeName: "mi",
			freq: 0,
			label: "喀帕",
			iconClass: "drip_equation_icon drip_kappa"
		},{
			input: "lambda",
			map: "&#x3BB;",
			nodeName: "mi",
			freq: 0,
			label: "拉姆达",
			iconClass: "drip_equation_icon drip_lambda"
		},{
			input: "mu",
			map: "&#x3BC;",
			nodeName: "mi",
			freq: 0,
			label: "缪",
			iconClass: "drip_equation_icon drip_mu"
		},{
			input: "nu",
			map: "&#x3BD;",
			nodeName: "mi",
			freq: 0,
			label: "拗",
			iconClass: "drip_equation_icon drip_nu"
		},{
			input: "xi",
			map: "&#x3BE;",
			nodeName: "mi",
			freq: 0,
			label: "克西",
			iconClass: "drip_equation_icon drip_xi"
		},{
			input: "omicron",
			map: "&#x3BF;",
			nodeName: "mi",
			freq: 0,
			label: "欧麦克轮",
			iconClass: "drip_equation_icon drip_omicron"
		},{
			input: "pi",
			map: "&#x3C0;",
			nodeName: "mi",
			freq: 0,
			label: "派",
			iconClass: "drip_equation_icon drip_pi"
		},{
			input: "rho",
			map: "&#x3C1;",
			nodeName: "mi",
			freq: 0,
			label: "柔",
			iconClass: "drip_equation_icon drip_rho"
		},{
			input: "sigma",
			map: "&#x3C3;",
			nodeName: "mi",
			freq: 0,
			label: "西格玛",
			iconClass: "drip_equation_icon drip_sigma"
		},{
			input: "tau",
			map: "&#x3C4;",
			nodeName: "mi",
			freq: 0,
			label: "套",
			iconClass: "drip_equation_icon drip_tau"
		},{
			input: "upsilon",
			map: "&#x3C5;",
			nodeName: "mi",
			freq: 0,
			label: "宇普西龙",
			iconClass: "drip_equation_icon drip_upsilon"
		},{
			input: "phi",
			map: "&#x3C6;",
			nodeName: "mi",
			freq: 0,
			label: "服艾",
			iconClass: "drip_equation_icon drip_phi"
		},{
			input: "chi",
			map: "&#x3C7;",
			nodeName: "mi",
			freq: 0,
			label: "器",
			iconClass: "drip_equation_icon drip_chi"
		},{
			input: "psi",
			map: "&#x3C8;",
			nodeName: "mi",
			freq: 0,
			label: "普赛",
			iconClass: "drip_equation_icon drip_psi"
		},{
			input: "omega",
			map: "&#x3C9;",
			nodeName: "mi",
			freq: 0,
			label: "欧米伽",
			iconClass: "drip_equation_icon drip_omega"
		},
		// 希腊字母,大写
		{
			input: "delta",
			map: "&#x394;",
			nodeName: "mi",
			freq: 0,
			label: "德尔塔(大写)",
			iconClass: "drip_equation_icon drip_delta_upper"
		}
		],

		getProposals : function(prefix) {
			// summary:
			//		根据前缀获取推荐值列表，推荐值按照推荐度倒序排列。
			//		“推荐度”，是整数，值越大推荐度越高。
			
			return array.filter(this.keywords, function(data, index, array) {
				return data.input.indexOf(prefix) == 0;
			});
		}
	};
	
});
