# grunt-ts-concat [![npm version](https://img.shields.io/npm/v/grunt-ts-concat.svg)](https://www.npmjs.com/package/grunt-ts-concat) [![Build Status: Linux](https://img.shields.io/travis/abhi922/grunt-ts-concat/master.svg)](https://travis-ci.org/abhi922/grunt-ts-concat) [![npm downloads](https://img.shields.io/npm/dm/grunt-ts-concat.svg)](https://www.npmjs.com/package/grunt-ts-concat)

> Bundle your typescript files with [Grunt](http://gruntjs.com/) into a single file that when compiled with typescript compiler results in a single module that consumers of your library can import from.

## Getting Started

If you haven't used [Grunt](http://gruntjs.com/) before, be sure to check out the [Getting Started](http://gruntjs.com/getting-started) guide, as it explains how to create a [Gruntfile](http://gruntjs.com/sample-gruntfile) as well as install and use Grunt plugins.
Once you're familiar with that process, you may install this plugin with this command:
```shell
npm install grunt-ts-concat
```
Once the plugin has been installed, it may be enabled inside your Gruntfile with this line of JavaScript:
```js
grunt.loadNpmTasks('grunt-ts-concat');
```

## The "ts_concat" task

### Overview
In your project's Gruntfile, add a section named `ts_concat` to the data object passed into `grunt.initConfig()`.

```js
grunt.initConfig({
  ts_concat: {
    options: {
      // Task-specific options go here.
    },
    your_target: {
      // Target-specific file lists and/or options go here.
    },
  },
});
```

### Options

#### options.bundles
Type: `Object`  
Default value: `null`

* If you are bundling a set of typescript files that import from a different set of files that have already been bundled, 
you can specify that using this property.
* This is not required, but sometimes when you may wanna use this to give better modularity to your code.
* ```key``` is the path to bundle and ```value``` is an ```array``` of file paths that should be replaced with this bundle during concatenation.
* Paths inside this ```array``` can have glob patterns.
* For examples refer to ```Gruntfile.js```.

### Usage Examples

```js
grunt.initConfig({
    ts_concat: {
        default: {
            dest: 'target/bundle.ts',
            src: 'app/**/*.ts'
        }
    }
});
```

### Why would you use this?
For example you have following files.
```js
//letters-validator.ts
import { SomeValidator } from "some-validator";

export class LettersOnlyValidator implements SomeValidator {

    lettersRegexp: RegExp = /^[A-Za-z]+$/;

    isAcceptable(s: string) {
        return this.lettersRegexp.test(s);
    }
}
```

```js
//zip-code-validator.ts
import { SomeValidator } from "some-validator";

export class ZipCodeValidator implements SomeValidator {
    
    numberRegexp: RegExp = /^[0-9]+$/;
    
    isAcceptable(s: string) {
        return s.length === 5 && this.numberRegexp.test(s);
    }
}
```

Now let's say that you compile and bundle these files into a single file called ```main.js``` with ```typescript``` compiler, the result is something like this.
```js
//main.js

System.register("letters-only-validator", [], function (exports_6, context_6) {
    "use strict";
    var __moduleName = context_6 && context_6.id;
    var LettersOnlyValidator;
    return {
        setters: [],
        execute: function () {
            LettersOnlyValidator = (function () {
                function LettersOnlyValidator() {
                    this.lettersRegexp = /^[A-Za-z]+$/;
                }
                LettersOnlyValidator.prototype.isAcceptable = function (s) {
                    return this.lettersRegexp.test(s);
                };
                return LettersOnlyValidator;
            }());
            exports_6("LettersOnlyValidator", LettersOnlyValidator);
        }
    };
});

System.register("zip-code-validator", [], function (exports_7, context_7) {
    "use strict";
    var __moduleName = context_7 && context_7.id;
    var ZipCodeValidator;
    return {
        setters: [],
        execute: function () {
            ZipCodeValidator = (function () {
                function ZipCodeValidator() {
                    this.numberRegexp = /^[0-9]+$/;
                }
                ZipCodeValidator.prototype.isAcceptable = function (s) {
                    return s.length === 5 && this.numberRegexp.test(s);
                };
                return ZipCodeValidator;
            }());
            exports_7("ZipCodeValidator", ZipCodeValidator);
        }
    };
});
```
and the ```main.d.ts``` file is **(generated if compiler option ```--declaration``` is passed as `true`)** [[Typescript Documentation](http://www.typescriptlang.org/docs/handbook/compiler-options.html)]

```javascript
//main.d.ts
declare module "some-validator" {
    export interface SomeValidator {
        isAcceptable(s: String): boolean;
    }
}
declare module "letters-only-validator" {
    import { SomeValidator } from "some-validator";
    export class LettersOnlyValidator implements SomeValidator {
        lettersRegexp: RegExp;
        isAcceptable(s: string): boolean;
    }
}
declare module "zip-code-validator" {
    import { SomeValidator } from "some-validator";
    export class ZipCodeValidator implements SomeValidator {
        numberRegexp: RegExp;
        isAcceptable(s: string): boolean;
    }
}
```
Which means that now if someone is using your library, they have to write 2 import statements for importing these classes.
> This also means that the consumer of your library should be aware of the complete folder structure of your library to import from different modules because when ```typescript``` compiler bundles files, it gives the file path as module name.

Here comes ```ts_concat```, when you use this you can generate a bundle like below
```js
//main.ts
import { SomeValidator } from "some-validator";

export class LettersOnlyValidator implements SomeValidator {

    lettersRegexp: RegExp = /^[A-Za-z]+$/;

    isAcceptable(s: string) {
        return this.lettersRegexp.test(s);
    }
}

export class ZipCodeValidator implements SomeValidator {
    
    numberRegexp: RegExp = /^[0-9]+$/;
    
    isAcceptable(s: string) {
        return s.length === 5 && this.numberRegexp.test(s);
    }
}
```

and when you compile this with ```typescript``` compiler, the result is

```js
//main.js
System.register("main", [], function (exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var LettersOnlyValidator, ZipCodeValidator;
    return {
        setters: [],
        execute: function () {
            LettersOnlyValidator = (function () {
                function LettersOnlyValidator() {
                    this.lettersRegexp = /^[A-Za-z]+$/;
                }
                LettersOnlyValidator.prototype.isAcceptable = function (s) {
                    return this.lettersRegexp.test(s);
                };
                return LettersOnlyValidator;
            }());
            exports_1("LettersOnlyValidator", LettersOnlyValidator);
            ZipCodeValidator = (function () {
                function ZipCodeValidator() {
                    this.numberRegexp = /^[0-9]+$/;
                }
                ZipCodeValidator.prototype.isAcceptable = function (s) {
                    return s.length === 5 && this.numberRegexp.test(s);
                };
                return ZipCodeValidator;
            }());
            exports_1("ZipCodeValidator", ZipCodeValidator);
        }
    };
});
```
and ```main.d.ts``` file is

```javascript
//main.d.ts
declare module "main" {
    export interface SomeValidator {
        isAcceptable(s: String): boolean;
    }
    export class LettersOnlyValidator implements SomeValidator {
        lettersRegexp: RegExp;
        isAcceptable(s: string): boolean;
    }
    export class ZipCodeValidator implements SomeValidator {
        numberRegexp: RegExp;
        isAcceptable(s: string): boolean;
    }
}
```

So now your users can import everything and anything that they want from just one module (```main``` in this case) **and there applications won't break even if you refactor your code into different folders in some future release of your library.**

### *There are a lot more use cases that this plugin can help you with. Some of them have been added in the ```test``` folder.*

## License
MIT