const CmdParser=require("./index.js");
var a=new CmdParser.commandInput();
a.onCmdError=function(a,b){console.error("ERROR:",a,b);}
a.addCommand({
	argument:[
		{type:"text",value:"!say"},
		{type:"argument",name:"value",needed:true,multiSpace:true},
	],
	onRun:function(a,b){
		console.log("RUN:",a,b);
	}
});
a.addCommand({
	argument:[
		{type:"text",value:"!lol"},
		{type:"argument",name:"rofl",needed:false,multiSpace:true},
	],
	onRun:function(a,b){
		console.log("RUN:",a,b);
	}
});
a.fire("!say a b c lohl",{id:1234});
console.log(a.commands[0].generateSyntax());
a.fire("!lol a b c lohl",{id:1234});
console.log(a.commands[1].generateSyntax());