[![Version npm][version]](http://browsenpm.org/package/rework-media-features)
[![Build Status][build]](https://travis-ci.org/n-fuse/rework-media-features)
[![Dependencies][david]](https://david-dm.org/n-fuse/rework-media-features)
[![Coverage Status][cover]](https://coveralls.io/github/n-fuse/rework-media-features?branch=master)

[version]: http://img.shields.io/npm/v/rework-media-features.svg?style=flat-square
[build]: http://img.shields.io/travis/n-fuse/rework-media-features/master.svg?style=flat-square
[david]: https://img.shields.io/david/dev/n-fuse/rework-media-features.svg?style=flat-square
[cover]: http://img.shields.io/coveralls/n-fuse/rework-media-features/master.svg?style=flat-square
 
# rework-media-features

A [Rework](https://github.com/reworkcss/rework) (`>=1.0.0`) plugin to add support for the
[Media Queries Level 4 `hover` @media feature](http://drafts.csswg.org/mediaqueries/#hover).
This plugin is a processor based on the postprocessor of
[mq4-hover-shim](https://github.com/twbs/mq4-hover-shim#mq4-hover-shim).

The rework-media-features plugin rewrites

```css
@media (hover: hover) {
  some-selector {
    property: value;
  }
}
```

into

```css
some-prefix some-selector {
  property: value;
}
```

In normal use-cases, `some-selector` will contain the `:hover` pseudo-class and `some-prefix`
will be a specially-named CSS class that will typically be added to the `<html>` element.

## Usage

```js
// Dependencies
var preprocessor = require('rework-media-features');
var rework = require('rework');
var fs = require('fs');

// CSS to be parsed
var css = fs.readFileSync('built/built.css', 'utf8').trim();

// Process css using rework-media-features
var options = {hoverSelectorPrefix: 'some-prefix'};
css = rework(css).use(preprocessor(options)).toString().trim();
```
