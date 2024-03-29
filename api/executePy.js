const { exec, spawn } = require('child_process');
const path = require('path');
const { stderr } = require('process');

const executePy = async (filepath, input) => {
    // console.log(filepath)
    const name = path.basename(filepath)
    let runCommand = `cd codes && python ${name} ` 
     
    console.log(typeof(input)) 
    if(input!== []){
        // for(let x = 0;x<input.length;x++){
        //     runCommand += input[x]
        // }
        runCommand += input.join(' ')
    }

    return new Promise((resolve, reject) => {
        exec(runCommand, (err, stdout, stderr) => {
            if(err)
                reject({ err, stderr });
            else if (stderr)
                reject({stderr});
            resolve(stdout);
        })

    })

};

module.exports = {
    executePy,
};