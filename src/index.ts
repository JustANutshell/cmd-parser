export enum commandArgumentType{
	text	="text",
	argument="argument",
}
export enum commandArgumentArgumentValueType{ //WIP
	any		="any",
	string	="string",
	integer	="integer",
	custom	="custom",
}
export class commandArgument{
	public type		:commandArgumentType;
	public needed	:boolean			=true;
	public other	:any				={};
	constructor(type:commandArgumentType,needed:boolean=true,other:any={}){
		this.type	=type;
		this.needed	=needed;
		this.other	=other;
		switch(this.type){
			case commandArgumentType.text:
				if(typeof this.other.value!=="string"){
					throw null; //WIP
				}
				break;
			case commandArgumentType.argument:
				if(typeof this.other.name!=="string"){
					throw null; //WIP
				}
				if(typeof this.other.multispace!=="boolean"){
					this.other.multispace=false;
				}
				break;
			default:
				throw null; //WIP
				break;
		}
	}
}
export class cmd{
	public cmdArguments	:commandArgument[]				;
	public name			:string|null					=null;
	public onRun		:(value:object,other:any)=>void	;
	constructor(cmdArguments:commandArgument[],onRun:(value:object,other:any)=>void,name:string|null=null){
		this.cmdArguments	=cmdArguments;
		this.onRun			=onRun;
	}
	generateSyntax(){
		let out="";
		for(let a=0;a<this.cmdArguments.length;a++){
			let b="";
			switch(this.cmdArguments[a].type){
				case commandArgumentType.text:
					b=this.cmdArguments[a].other.value;
					break;
				case commandArgumentType.argument:
					b="["+this.cmdArguments[a].other.name+"]";
					break;
				default:
					throw null; //WIP
					break;
			}
			out=out+(a===0?"":" ")+(this.cmdArguments[a].needed?b:"("+b+")");
		}
		return out;
	}
}
enum foundCmdValue{
	nothing,
	syntaxErr,
	good,
}
export class commandInput{
	public allCommands	:cmd[]													;
	public onError		:(name:string,value:any,input:string,other:any)=>void	;
	constructor(commands:cmd[],onError:(name:string,value:any,input:string,other:any)=>void){
		this.allCommands=commands;
		this.onError=onError;
	}
	run(str:string,optionsToCmd:any=null){
		let strArr=str.split(' ');
		let found:cmd|null=null;
		let foundValue:foundCmdValue=foundCmdValue.nothing;
		let foundValueErr:string|null=null;
		let values:any;
		for(let a=0;a<this.allCommands.length&&foundValue!==foundCmdValue.good;a++){
			values={};
			let wrongCmd=false;
			let b=0;
			let c=0;
			while((b<this.allCommands[a].cmdArguments.length||c<strArr.length)&&wrongCmd===false){
				if(b<this.allCommands[a].cmdArguments.length&&c<strArr.length){ // normal
					switch(this.allCommands[a].cmdArguments[b].type){
						case commandArgumentType.text:
							if(this.allCommands[a].cmdArguments[b].other.value===strArr[c]){
							}else if(this.allCommands[a].cmdArguments[b].needed===false){
								c--;
							}else{
								wrongCmd=true;
							}
							break;
						case commandArgumentType.argument:
								values[this.allCommands[a].cmdArguments[b].other.name]=strArr[c];
							break;
						default:
							throw null; //WIP
							break;
					}
				}else if(b<this.allCommands[a].cmdArguments.length){ // input text to short
					if(this.allCommands[a].cmdArguments[b].needed===true){
						found=this.allCommands[a];
						foundValue=foundCmdValue.syntaxErr;
						foundValueErr="last Argument was needed";
						wrongCmd=true;
					}
				}else{ // input text too long
					if(this.allCommands[a].cmdArguments[b-1].type===commandArgumentType.argument){
						if(this.allCommands[a].cmdArguments[b-1].other.multispace===true){
							values[this.allCommands[a].cmdArguments[b-1].other.name]+=" "+strArr[c];
						}else{
							found=this.allCommands[a];
							foundValue=foundCmdValue.syntaxErr;
							foundValueErr="last Argument was not multispace";
							wrongCmd=true;
						}
					}else{
						wrongCmd=true;
					}
				}
				if(b<this.allCommands[a].cmdArguments.length) b++;
				c++;
			}
			if(wrongCmd===false){
				found=this.allCommands[a];
				foundValue=foundCmdValue.good;
				foundValueErr=null;
			}
		}
		switch(foundValue){
			case foundCmdValue.nothing:
				this.onError("no cmd found",null,str,optionsToCmd);
				break;
			case foundCmdValue.syntaxErr:
				this.onError("syntax error",{cmd:found,err:foundValueErr},str,optionsToCmd);
				break;
			case foundCmdValue.good:
				if(found!==null){
					found.onRun(values,optionsToCmd);
				}else{
					throw null; //WIP
				}
				break;
		}
	}
}