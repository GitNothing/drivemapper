const spawn = require("child_process").spawn
import * as path from 'path'
export class CMDExecute{
    constructor(public CWD: string){
        this.CWD = path.resolve(__dirname, this.CWD)
    }
    executeCommand(command: string){
        return new Promise<string[]>(resolve=>{
            const opt = {cwd: this.CWD, shell: true}
            const thread = spawn(command,opt)
            const output:string[] = []
            thread.stdout.on('data', data=>{
                data.toString().split('\n').forEach(e => {
                    if(!this.isEmptyOrSpaces(e)){
                        output.push(e)
                    }
                });
            })
            thread.on('error', err=>{
                console.log(err)
            })
            thread.on('exit', ()=>{
                resolve(output)
            })
        })
    }

    executeOngoingCommand(command: string){
        return new Promise<any>(resolve=>{
            const opt = {cwd: this.CWD, shell: true}
            const thread = spawn(command,opt)
            thread.stdout.on('data', data=>{
                console.log(data.toString())
            })
            thread.on('error', err=>{
                console.log(err)
            })
            thread.on('exit', ()=>{
            })
            resolve(thread)
        })
    }

    public static async factory(command, cwd){
        const c = new CMDExecute(cwd)
        console.log('Executing: ', command, ' at path ', c.CWD);
        return await c.executeCommand(command)
    }

    public static async factoryOngoing(command, cwd){
        const c = new CMDExecute(cwd)
        console.log('Executing: ', command, ' at path ', c.CWD);
        return await c.executeOngoingCommand(command)
    }
    private isEmptyOrSpaces(str){
        if(str === undefined) return true
        return str === null || str.match(/^ *$/) !== null;
    }
}