module.exports=(function(){
	var command=class{
		constructor(options){
			this.argument=options.argument;
			this.onRun=options.onRun;
		}
		generateSyntax(){
			var out="";
			for(var a=0;a<this.argument.length;a++){
				var b="";
				switch(this.argument[a].type){
					case "text":
						b=this.argument[a].value;
						break;
					case "argument":
						b="["+this.argument[a].name+"]";
						if(!this.argument[a].needed){
							b="("+b+")";
						}
						break;
					default:
						throw null;
						break;
				}
				out=out+(a===0?"":" ")+b;
			}
			return out;
		}
	}
	var commandInput=class{
		constructor(){
			this.commands=[];
			this.onCmdError=null;
		}
		addCommand(options){
			this.commands[this.commands.length]=new command(options);
		}
		fire(str,optionsToCmd){
			var str=str.split(' ');
			var command=null;
			var command_=null;
			var command__=null;
			for(var a=0;a<this.commands.length&&command===null;a++){
				if(this.commands[a]!==undefined){
					var c=2;
					var d={};
					for(var b=0;(b<str.length||b<this.commands[a].argument.length)&&c===2;b++){
						if(b<str.length&&b<this.commands[a].argument.length){
							switch(this.commands[a].argument[b].type){
								case "text":
									if(this.commands[a].argument[b].value!==str[b]){
										c=0;
									}
									break;
								case "argument":
									d[this.commands[a].argument[b].name]=str[b];
									break;
								default:
									throw null;
									break;
							}
						}else if(b<str.length){
							if(this.commands[a].argument[this.commands[a].argument.length-1].type==="argument"){
								if(this.commands[a].argument[this.commands[a].argument.length-1].multiSpace===true){
									d[this.commands[a].argument[this.commands[a].argument.length-1].name]=d[this.commands[a].argument[this.commands[a].argument.length-1].name]+" "+str[b];
								}
							}
							// wip multiSpace
						}else if(b<this.commands[a].argument.length){
							switch(this.commands[a].argument[b].type){
								case "text":
									c=0;
									break;
								case "argument":
									if(this.commands[a].argument[b].needed===true){
										c=1;
									}
									d[this.commands[a].argument[b].name]=null;
									break;
								default:
									throw null;
									break;
							}
						}
					}
					switch(c){
						case 2:
							if(command===null){
								command=this.commands[a];
								command_="good";
								command__=d;
							}else{
								// warn
							}
							break;
						case 1:
							if(command===null){
								command=this.commands[a];
								command_="syntaxerror";
							}else{
								// warn
							}
							break;
					}
				}
			}
			switch(command_){
				case "good":
					command.onRun(command__,optionsToCmd);
					break;
				case "syntaxerror":
					if(this.onCmdError===null){
						// warn
					}else{
						this.onCmdError({gotCmd:str,errorMsg:"SyntaxError",cmd:command},optionsToCmd);
					}
					break;
				case null:
					if(this.onCmdError===null){
						// warn
					}else{
						this.onCmdError({gotCmd:str,errorMsg:"CommandNotFound"},optionsToCmd);
					}
					break;
			}
		}
	}
	return {
		commandInput:commandInput
	};
})();