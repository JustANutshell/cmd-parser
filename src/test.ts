//const CmdParser=require("./index.js");
import * as CmdParser from "./index"

var a=new CmdParser.commandInput([
	new CmdParser.cmd([
		new CmdParser.commandArgument(CmdParser.commandArgumentType.text,true,{value:"say"}),
		new CmdParser.commandArgument(CmdParser.commandArgumentType.argument,true,{name:"value",multispace:true}),
	],function(a:any,b:any){
		console.log("RUN1",a,b);
	},"test1"),
	new CmdParser.cmd([
		new CmdParser.commandArgument(CmdParser.commandArgumentType.text,true,{value:"lol"}),
	],function(a:any,b:any){
		console.log("RUN2",a,b);
	},"test2")
],function(a:any,b:any,c:any,d:any){
	console.error("ERROR:",a,b,c,d);
});

a.run("say a b c lohl",{id:1234});
a.run("say",{id:1234});
console.log(a.allCommands[0].generateSyntax());
a.run("lol a b c lohl",{id:1234});
console.log(a.allCommands[1].generateSyntax());