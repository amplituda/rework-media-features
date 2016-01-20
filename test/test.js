var expect = require('chai').expect;
var preprocessor = require('../index.js');
var rework = require('rework');
var fs = require('fs');

function fixture(name) {
  return fs.readFileSync('test/fixtures/' + name + '.css', 'utf8').trim();
}

function compareFixtures(name, options) {
  options = options || {hoverSelectorPrefix: 'PREFIX>'};
  var actual = rework(fixture(name))
  .use(preprocessor(options)).toString().trim();
  var expected = fixture(name + '.out');
  return expect(actual).to.deep.equal(expected);
}

function expectedError(name, options) {
  expect(preprocessor(options))
  .to.throw(Error, 'hoverSelectorPrefix option must be a string');
}

describe('rework-media-features', function () {
  it('has no effect when there are no media queries.', function() {
    compareFixtures('no-media-query');

  });

  it('skips non-media at-rules.', function() {
    compareFixtures('non-media-rules');
  });

  it('skips media queries with only a media type.', function() {
    compareFixtures('media-type');
  });

  it('skips media queries with ORs.', function() {
    compareFixtures('or-media-query');
  });

  it('skips media queries with ANDs.', function() {
    compareFixtures('and-media-query');
  });

  it('skips media queries that are not about the hover media feature.', function() {
    compareFixtures('no-hover');
  });

  it('skips media queries about the hover media feature with a non-hover value', function() {
    compareFixtures('non-hover-value');
  });

  it('works correctly on a representative example.', function() {
    compareFixtures('hover');
  });

  it('works correctly with multiple selectors.', function() {
    compareFixtures('multipleSelectors');
  });

  it('handles nested at-rules.', function() {
    compareFixtures('nested-rules');
  });

  it('handles applicable media types.', function() {
    compareFixtures('applicable-media-types');
  });

  it('handles non-applicable media types.', function() {
    compareFixtures('non-applicable-media-types');
  });

  it('handles no prefix.', function() {
    compareFixtures('prefix-errors', {});
  });

  it('throws errors when hoverSelectorPrefix is not a string.', function() {
    expectedError('prefix-errors', {hoverSelectorPrefix: 42});
  });
});
