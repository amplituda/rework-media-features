var reworkWalk = require("rework-walk");

module.exports = function (options) {  
  return function(ast) {
    var hoverSelectorPrefix = options.hoverSelectorPrefix;
    if ((typeof hoverSelectorPrefix) !== 'string') {
      throw new Error('hoverSelectorPrefix option must be a string');
    }
  }
}
