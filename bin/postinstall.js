
var fs = require('fs');

const root = './node_modules/@styled-system/core/dist'
fs.readdir(root, function(err, items) {

    items.forEach(filename=>{
        const filePath = `${root}/${filename}`;
        fs.readFile(filePath, 'utf-8', function(err, data){
            if (err) throw err;
        
            const newData = `var {customTransform} = require('${__dirname}/customTransform'); \r\n ` 
            + data.replace('function system(args) {', `function system(args) {\r\n args = {...customTransform(args)}; \r\n`);
            //console.log(newData)
    
            fs.writeFile(filePath, newData, function(err) {
                if(err) {
                    return console.log(err);
                }
                console.log('tranformed styled-system file: ' + filePath)
            }); 
        
        });
    })


});