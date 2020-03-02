# nextjs-styled-system-transform-v2

Compares to v1 https://github.com/ILovePug/nextjs-styled-system-transform, instead of using babel plugin approach, 
v2 uses npm `postinstall` hook to inject the custom trasnform function. 

The reason for not using babel plugin is that-
1. I couldn't get it to run on the nextjs server side 😭😭. It has something to do with server side always uses commonJS file 
which is `index.js` whereas the client side always use `index.esm.js`. When I look into nextjs source code for the `next-babel-loader`,
it exlcudes out most `node_modules` except for the `next` ones. I can inject my plugin in but it runs fine on the browser but on the server side
it could not detect nor transpile `node_modules/@styled-system` because it has filtered it out. 
2. After thinking about it, babel-plugin is intended for transpiling all the source code at compile time every time; this means 
the plugin will run whenever we make code changes for hot reload or rebuild. Since what we need to transpile really just need to happen once, 
make it happen at `postinstall` is a better solution for both simplicity and efficiency. Most importantly it works!!! 

Essentially we are only injecting two files:
1. node_modules/@styled-system/core/dist/index.esm.js (ESModule that is used by nextjs client side)
2. node_modules/@styled-system/core/dist/index.js (commonJS that is used by nextjs server side)

and we are only injecting two lines:
```javascript
var {customTransform} = require('${__dirname}/bin/customTransform'); //<- injected line 1
...
...
export var system = function system(args) {
 args = {...customTransform(args)};  //<- injected line 2
...
...
```
With this, we are able to inject a middleware function `customTransform` that takes all styling prop args, do whatever we want
such as add a default `transform` function to it, and return a new object for styled-system to continue with styled object creations.

codesandbox: https://codesandbox.io/s/github/ILovePug/nextjs-styled-system-transform-v2
