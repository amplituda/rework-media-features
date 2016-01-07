var expect = require('chai').expect;
var preprocessor = require('../index.js');

describe('rework-media-features', function () {
  it('has no effect when there are no media queries.', function() {
    expect(preprocessor({hoverSelectorPrefix: 'PREFIX>'})
      .process(".foobar { display: none; }").css)
      .to.deep.equal(".foobar { display: none; }");
  });

  it('skips non-media at-rules.', function() {
    expect(preprocessor({hoverSelectorPrefix: 'PREFIX>'})
      .process("@quux (hover: hover) { .foobar { display: none; } }").css)
      .to.deep.equal("@quux (hover: hover) { .foobar { display: none; } }");
  });

  it('skips media queries with only a media type.', function() {
    expect(preprocessor({hoverSelectorPrefix: 'PREFIX>'})
    .process("@media screen { .foobar { display: none; } }").css)
    .to.deep.equal("@media screen { .foobar { display: none; } }");
  });

  it('skips media queries with ORs.', function() {
    expect(preprocessor({hoverSelectorPrefix: 'PREFIX>'})
    .process("@media (hover: hover), (orientation: landscape) { .foobar { display: none; } }").css)
    .to.deep.equal("@media (hover: hover), (orientation: landscape) { .foobar { display: none; } }");

    expect(preprocessor({hoverSelectorPrefix: 'PREFIX>'})
    .process("@media screen and (hover: hover), screen and (orientation: landscape) { .foobar { display: none; } }").css)
    .to.deep.equal("@media screen and (hover: hover), screen and (orientation: landscape) { .foobar { display: none; } }");
  });

  it('skips media queries with ANDs.', function() {
    expect(preprocessor({hoverSelectorPrefix: 'PREFIX>'})
    .process("@media (hover: hover) and (orientation: landscape) { .foobar { display: none; } }").css)
    .to.deep.equal("@media (hover: hover) and (orientation: landscape) { .foobar { display: none; } }");

    expect(preprocessor({hoverSelectorPrefix: 'PREFIX>'})
    .process("@media screen and (hover: hover) and (orientation: landscape) { .foobar { display: none; } }").css)
    .to.deep.equal("@media screen and (hover: hover) and (orientation: landscape) { .foobar { display: none; } }");
  });

  it('skips media queries that are not about the hover media feature.', function() {
    expect(preprocessor({hoverSelectorPrefix: 'PREFIX>'})
    .process("@media (orientation: landscape) { .foobar { display: none; } }").css)
    to.deep.equal("@media (orientation: landscape) { .foobar { display: none; } }");
  });

  it('skips media queries about the hover media feature with a non-hover value', function() {
    expect(preprocessor({hoverSelectorPrefix: 'PREFIX>'})
    .process("@media (hover: none) { .foobar { display: none; } }").css)
    .to.deep.equal("@media (hover: none) { .foobar { display: none; } }");

    expect(preprocessor({hoverSelectorPrefix: 'PREFIX>'})
    .process("@media (hover: on-demand) { .foobar { display: none; } }").css)
    .to.deep.equal("@media (hover: on-demand) { .foobar { display: none; } }");
  });

  it('works correctly on a representative example.', function() {
    expect(preprocessor({hoverSelectorPrefix: 'PREFIX>'})
    .process("@media (hover: hover) { .foobar { color: white; background: red; } div .quux > input { color: blue; background: white; } }").css)
    .to.deep.equal("PREFIX>.foobar {\n    color: white;\n    background: red;\n}\nPREFIX>div .quux > input {\n    color: blue;\n    background: white;\n}");
  });

  it('handles nested at-rules.', function() {
    expect(preprocessor({hoverSelectorPrefix: 'PREFIX>'})
    .process("@media (orientation: landscape) { @media (hover: hover) { .foobar { display: none; } } }").css)
    .to.deep.equal("@media (orientation: landscape) { PREFIX>.foobar { display: none; } }");

    expect(preprocessor({hoverSelectorPrefix: 'PREFIX>'})
    .process("@media screen and (orientation: landscape) { @media (hover: hover) { .foobar { display: none; } } }").css)
    .to.deep.equal("@media screen and (orientation: landscape) { PREFIX>.foobar { display: none; } }");

    expect(preprocessor({hoverSelectorPrefix: 'PREFIX>'})
    .process("@media (hover: hover) { @media (orientation: landscape) { .foobar { display: none; } } }").css)
    .to.deep.equal("@media (orientation: landscape) {\n    PREFIX>.foobar {\n        display: none;\n    }\n}");

    expect(preprocessor({hoverSelectorPrefix: 'PREFIX>'})
    .process("@media (hover: hover) { @media screen and (orientation: landscape) { .foobar { display: none; } } }").css)
    .to.deep.equal("@media screen and (orientation: landscape) {\n    PREFIX>.foobar {\n        display: none;\n    }\n}");
  });

  it('handles applicable media types.', function() {
    expect(preprocessor({hoverSelectorPrefix: 'PREFIX>'})
    .process("@media screen and (hover: hover) { .foobar { display: none; } }").css)
    .to.deep.equal("@media screen { PREFIX>.foobar { display: none; } }");
  });

  it('handles non-applicable media types.', function() {
    expect(preprocessor({hoverSelectorPrefix: 'PREFIX>'})
    .process("@media print and (hover: hover) { .foobar { display: none; } }").css)
    .to.deep.equal("");
  });

  it('throws errors when hoverSelectorPrefix is not provided.', function() {
    expect(function () {
      preprocessor({})
      .process("@media (hover: hover) { .foobar { display: none; } }").css;
    }).to.throw(Error, 'hoverSelectorPrefix option must be a string');
  });

  it('throws errors when hoverSelectorPrefix is not a string.', function() {
    expect(function () {
        preprocessor({hoverSelectorPrefix: 42})
        .process("@media (hover: hover) { .foobar { display: none; } }").css;
    }).to.throw(Error, 'hoverSelectorPrefix option must be a string');
  });
});
