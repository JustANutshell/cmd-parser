export declare enum commandArgumentType {
    text = "text",
    argument = "argument"
}
export declare enum commandArgumentArgumentValueType {
    any = "any",
    string = "string",
    integer = "integer",
    custom = "custom"
}
export declare class commandArgument {
    type: commandArgumentType;
    needed: boolean;
    other: any;
    constructor(type: commandArgumentType, needed?: boolean, other?: any);
}
export declare class cmd {
    cmdArguments: commandArgument[];
    name: string | null;
    onRun: (value: object, other: any) => void;
    constructor(cmdArguments: commandArgument[], onRun: (value: object, other: any) => void, name?: string | null);
    generateSyntax(): string;
}
export declare class commandInput {
    allCommands: cmd[];
    onError: (name: string, value: any, input: string, other: any) => void;
    constructor(commands: cmd[], onError: (name: string, value: any, input: string, other: any) => void);
    run(str: string, optionsToCmd?: any): void;
}
