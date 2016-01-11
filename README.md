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
