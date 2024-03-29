const fs = require('fs');
const path = require('path')
const {v4 : uuid} = require('uuid')

const dirCodes = path.join(__dirname,"codes")
//to make a file if codes file doesnt exust
if(!fs.existsSync(dirCodes)){
    fs.mkdirSync(dirCodes, {recursive : true})
}

const processCode = (code, parameterNames, parameterTypes, funcName)=>{

    code = "import sys\n" + code
    code = code + `\nprint(${funcName}(`;
    // writing the function call signature with the parameter names- 
    // this piece of code is placed at the end of thepython file
    let argIndex = 1
    parameterTypes.forEach((type)=>{
        if(type == 'String'){
            code = code + `str(sys.argv[${argIndex}]),`
            argIndex +=1;
        }
        else if(type == 'Integer'){
            code= code +  `int(sys.argv[${argIndex}]),`
            argIndex +=1;
        }
        else if(type =='Boolean'){
            code = code
            argIndex +=1;
        }
        else if(type == 'StringArray'){
            code = code + '['
            code = code + ']'
        }
    })
    // if(x == parameters.length-1)
    //     code = code + `sys.argv[${x+1}]`
    // else
    //
    //
    code = code + "))"
    return code;
}

const generateFile = async (format,code, parameterNames, parameterTypes, funcName)=>{
    //here parameters is used for the parameter length
    const jobId = uuid()
    const filename = `${jobId}.${format}`
    const filepath = path.join(dirCodes,filename)

    // Processing the code based on the language
    code = processCode()
    // 
    
    await fs.writeFileSync(filepath,code);

    return filepath
};

module.exports = {
    generateFile, 
};
