# grunt-bundle

> Use import syntax to import file or folder in javascript or css

## Getting Started
### Overview

this plugin support absolute path and relative to import file or folder

```js
    import '../folder'; //relative
    import '/folder';   //absolute
    import 'folder/file.js';
    import 'folder/subfolder/file.js';
```

### Options

#### options.separator
Type: `String`
Default value: `',  '`

A string value that is used to do something with whatever.

#### options.punctuation
Type: `String`
Default value: `'.'`

A string value that is used to do something else with whatever else.

### Usage Examples For javascript

```js
grunt.initConfig({
  bundle: {
    target1: {
        src:'src/js/main.js',
        dest:'public/js/main.js'
    },
    target2: {
        cwd:'src/js',
        src:'main.js',
        dest:'public/js/main.js'
    },
    target3: {
        cwd:'src/js',
        src:'router',
        dest:'public/js/router.js'
    }
  },
});
```

#### src/js/main.js
```js
    import 'router'; //import index.js if exist in router folder otherwise will import all from folder

    angular.module('app',['router']).config(function(routeProvider){
        routeProvider.config();
    });
```

#### src/js/router/index.js
```js
    (function(module){
        import 'provider/route.js'; //import single file
        import 'directives'; //import all files from directory [src/js/router/directives] if index.js not exist

        module.config(function(routeProvider,$controllerProvider){
            routeProvider.register($controllerProvider);
        });
    })(angular.module('router',[]))
```

#### src/js/router/provider/route.js
```js
    import '/services/common/emitter.js'; //import single file from absolute path

    module.provider('route',function(){
        this.register=function(){};
        this.config=function(){};

        this.$get=function(emitter){

        }
    })
```

#### src/js/services/common/emitter.js
```js
    module.factory('emitter',function(){

    })
```

#### src/js/router/directives/view.js
```js
    module.directive('view',function(){
        return {}
    })
```

#### src/js/router/directives/route-nav.js
```js
    module.directive('routeNav',function(){
        return {}
    })
```

### Usage Examples For CSS

```js
grunt.initConfig({
  bundle: {
    target: {
        type:'.css',
        src:'src/css/main.css',
        dest:'public/css/main.css'
    }
  },
});
```

#### src/css/main.css
```css
    @import 'defaults';          //import folder defaults
    @import 'components/panel';  //import sub folder panel
    @import 'views/home.css';    //import file from folder views

    .demo{background:red;font-size:18px}
```

### Usage Extra options
#### Tasks example
```js
grunt.initConfig({
  bundle: {
    target: {
        src:'src/app',
        dest:'public/js/app.js',
        tasks:['ngAnnotate:app','uglify:app']
    }
  }
});
```
#### Watch example
```js
grunt.initConfig({
    bundle: {
        app: {
            src:'src/app.js',
            dest:'public/js/app.js',
            tasks:['ngAnnotate:app','uglify:app']
        }
    },
    watch: {
        options: {
            spawn: false
        },
        app:{
            files:'<%= bundle.app.required %>',
            tasks:['bundle:app']
        },
    }
});
```