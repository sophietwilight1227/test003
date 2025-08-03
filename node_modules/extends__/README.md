extends__
=========

Requireable CoffeeScript  `__extends` [![Build Status][travis-image]][travis-url]
---------------------------------------------------------------------------------

[![NPM][npm-image]][npm-url]

Install
-------
```
npm install --save extends__
```

Mixin syntax
------------

It is possible to inherit from multiple classes - one Base and the rest Mixins.
~~Mixin methods must not call `super`, and must not extend anything. They should be
a simple Interfaces. The Mixin `constructor` is ignored. It will not be called.~~
Mixins can be fully capable classes with constructors and `super` calls. The constructors
will be called in the order they appear in inheritance list. The superclass constructor
will be called first. The `super` inside mixin methods will got up the mixin's inheritance chain.

#### [CoffeeScript][coffee-url]

```coffeescript
class Parent then constructor: ->
  (@log ||= []).push 'Parent'

class Mixin1 then constructor: ->
  @log.push 'Mixin1'

class Mixin2 then constructor: ->
  @log.push 'Mixin2'

class MixinParent then constructor: ->
  @log.push 'MixinParent'

class MixinChild extends MixinParent then constructor: ->
  super
  @log.push "MixinChild"

class Child extends [Parent, Mixin1, MixinChild, Mixin2]
  constructor: ->
    super
    @log.push "Child"

console.log JSON.stringify (new Child).log, null, '  '
```

**will yield**
```json
[
  "Parent",
  "Mixin1",
  "MixinParent",
  "MixinChild",
  "Mixin2",
  "Child"
]
```

Use with [GULP][gulp-url]
-------------------------

#### [CoffeeScript][coffee-url]

```coffeescript
gulp = require 'gulp'
replace = require 'gulp-replace'
re = /((__)?extends?)\s*=\s*function\(child,\s*parent\)\s*\{.+?return\s*child;\s*\}/

gulp.task 'coffee', ->
  gulp
    .src [ './source/**/*.+(coffee|litcoffee)' ]
    .pipe replace re, '$1 = require("extends__")'
    .pipe gulp.dest './build'
```

#### JavaScript

```javascript
var gulp, replace, re;
gulp = require('gulp');
replace = require('gulp-replace');
re = /((__)?extends?)\s*=\s*function\(child,\s*parent\)\s*\{.+?return\s*child;\s*\}/;

gulp.task('coffee', function() {
  gulp
    .src([ './source/**/*.+(coffee|litcoffee)' ])
    .pipe(replace(re, '$1 = require("extends__")'))
    .pipe(gulp.dest('./build'));
});
```

Build
-----
```
git clone https://github.com/nhz-io/extends__.git
cd extends__
npm install
gulp
```

LICENSE
-------
#### [MIT](LICENSE)

VERSION
-------
#### 0.0.8
* Updated the CoffeeScript extend example in README.md

#### 0.0.7
* Mixins now can have constructors and call `super`

#### 0.0.6
* Added `Mixin` Functionality

#### 0.0.5
* Better `README.md`
* Now wrapping default [CoffeScript][coffee-url] extends

[coffee-url]: https://github.com/jashkenas/coffeescript
[gulp-url]: https://github.com/gulpjs/gulp

[travis-image]: https://travis-ci.org/nhz-io/extends__.svg
[travis-url]: https://travis-ci.org/nhz-io/extends__

[npm-image]: https://nodei.co/npm/extends__.png
[npm-url]: https://nodei.co/npm/extends__
