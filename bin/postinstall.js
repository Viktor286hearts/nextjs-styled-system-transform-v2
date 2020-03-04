
var babel = require("@babel/core");
var fs = require('fs');
const { types: t } = babel;

const transform = async (code)=>{

  /**
   * the path reference for program path so a require statement can be
   * unshifted on the top of the file
   */
  let filePath = null;

    //https://babeljs.io/docs/en/babel-core
    const ast = await babel.parseAsync(code, {sourceType:"module"})

    babel.traverse(ast, {

        Program(path) {
          filePath = path;
        },
        FunctionExpression(path) {
          if (path.parent.type === 'VariableDeclarator' && path.parent.id.name === 'system') {
            
            /**
             * inject our customTransform function. add line:
             *   args = { ...customTransform(args)};
             */
            const customExpression = t.expressionStatement(
              t.assignmentExpression(
                '=',
                t.identifier('args'),
                t.objectExpression([
                  t.spreadElement(
                    t.callExpression(t.identifier('customTransform'), [t.identifier('args')]),
                  ),
                ]),
              ),
            );
  
            path.get('body').unshiftContainer('body', customExpression);
  

            /**
             * add line to the top of the file:
             * var {
                  customTransform: customTransform
                } = require("{__dirname}/bin/customTransform");
             */
            const variableDec = t.variableDeclaration('var', [
              t.variableDeclarator(
                t.objectPattern([
                  t.objectProperty(t.identifier('customTransform'), t.identifier('customTransform')),
                ]),
                t.callExpression(t.identifier('require'), [t.stringLiteral(__dirname + '/customTransform')]),
              ),
            ]);
            filePath.unshiftContainer('body', variableDec);

          }
        },
      });

    const newCodeObj = await babel.transformFromAstAsync(ast);

    return newCodeObj.code;

}

const root = './node_modules/@styled-system/core/dist'
fs.readdir(root, function(direrr, items) {
    if (direrr) throw direrr;

    items.forEach(filename=>{
        const filePath = `${root}/${filename}`;
        fs.readFile(filePath, 'utf-8', async function(err, data){
            if (err) throw err;
        
            const transformedCode = await transform(data);
    
            fs.writeFile(filePath, transformedCode, function(err) {
                if(err) {
                    return console.log(err);
                }
                console.log('tranformed styled-system file: ' + filePath)
            }); 
        
        });
    })
});
