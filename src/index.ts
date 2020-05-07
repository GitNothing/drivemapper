import { MapperDirectionModel, MapperLocationModel } from "./MapperModels";
import * as fs from 'fs'
import { CMDExecute } from "./CMDExecute";
import * as path from 'path'

let configFile = '../drivermapper_config.json'
if(!fs.existsSync('../drivermapper_config.json')){
    configFile = './drivermapper_config.json'
}

const config:any = fs.readFileSync(path.resolve(configFile), 'utf8')
const directions:MapperDirectionModel[] = JSON.parse(config).directions
const locations:MapperLocationModel[] = JSON.parse(config).locations

const generateCommand = (location: MapperLocationModel)=>{
    let direction: MapperDirectionModel = null
    directions.forEach(e => {
        if(e.name === location.direction_name){
            direction = e
        }
    });
    if(!direction && location.direction_name) throw 'cannot find direction for ' + location.location
    
    let cmd = ''
    if(!direction.name || !direction.password){
        cmd = 'net use ' + location.driveLetter + ': ' + '\\\\' + direction.ip + '\\' + location.location + ' /persistent:no'
    }else{
        cmd = 'net use ' + location.driveLetter + ': ' + '\\\\' + direction.ip + '\\' + location.location + 
        ' /user:' + direction.ip + '\\' + direction.user + ' ' + direction.password + ' /persistent:no'
    }
    return cmd
}

const timeoutter = ()=>{
    return new Promise(resolve=>{
        setTimeout(() => {
            console.log('DRIVEMAPPER END')
            setTimeout(() => {
                resolve()
            }, 1000);
        }, 2000);
    })
}

const main = async ()=>{
    await CMDExecute.factory('net use * /delete /y', 'c:\\')
    locations.forEach(e=>{
        CMDExecute.factory(generateCommand(e), 'c:\\')
    })
    await timeoutter()
    process.exit()
}
main()