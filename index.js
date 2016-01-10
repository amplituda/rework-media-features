/**
 * (hover: hover) can only be paired with a mediaType.
 * If there is more than 1 'and', the (hover: hover) shouldn't be replaced.
 */
function getMediaType(media) {
  var parts = media.split(' and ');
  if (parts.length > 2) {
    return;
  }

  if (parts[0] === '(hover: hover)') {
    // If no mediatype is specified, default to 'all'.
    return parts[1] || 'all'; //
  } else {
    return parts[0];
  }
}

/**
 * print and speech are never applicable with hover, so those rules can be
 * deleted.
 * @param mediaType: string.
 */
function keepRule(mediaType) {
  switch(mediaType) {
    case 'print': return false; // Delete.
    case 'speech': return false;
    default: return true; // Ignore.
  }
}

/**
 * Deletes rules with only (hover: hover) or (hover: hover) combined
 * with all mediatype and pulls up children with
 * hoverSelectorPrefix added before every selector.
 *
 * If (hover: hover) is combined with screen mediatype
 * rule.media is changed to screen, and children rules get
 * hoverSelectorPrefix added before every selector.
 *
 * @param rules: Rules to walk over.
 * @param hoverSelectorPrefix: prefix to add before every selector belonging
 *        to a valid hover rule.
 * @param addHover: Since optimzeHover walks the rules recursively, addHover
 *        remembers, if a valid hover rule is waiting to be added as prefix.
 */
function optimizeHover(rules, hoverSelectorPrefix, addHover) {
  var newRules = [];
  var addHover = addHover || false;

  rules.forEach(function(rule, i) {
    if (rule.type === 'media')  {
      if (rule.media.indexOf('(hover: hover)') > -1) {
        // Has (hover: hover) rule.
        if(rule.media.indexOf(',') > -1)  {
          // Ignore or-rules.
          newRules.push(rule);
          return;
        }

        // Check mediaType.
        var mediaType = getMediaType(rule.media);
        if(mediaType === 'all') {
          // Pull up children.
          var childRules = optimizeHover(rule.rules, hoverSelectorPrefix, true);
          newRules = newRules.concat(childRules);
        } else if (keepRule(mediaType)) {
          // Delete rules with non applicable mediatypes.
          if (mediaType === 'screen') {
            // Hover and mediatype. Keep rule, but delete hover part.
            rule.media = 'screen';
            rule.rules = optimizeHover(rule.rules, hoverSelectorPrefix, true);
          } else {
            // Ignore, if mediatype isn't screen or all.
            rule.rules = optimizeHover(rule.rules, hoverSelectorPrefix, false);
          }
          newRules.push(rule);
        }

      } else {
        // No Hover rule, skip.
        rule.rules = optimizeHover(rule.rules, hoverSelectorPrefix, addHover);
        newRules.push(rule);
      }
    } else {
      // Non-media rules.
      if (addHover) {
        // Add hoverSelectorPrefix before each selector, before pushing rule.
        rule.selectors.forEach(function(selector, j) {
          rule.selectors[j] = hoverSelectorPrefix.concat(selector);
        });
      }
      newRules.push(rule);
    }
  });

  return newRules;
}

/**
* Module export.
*/
module.exports = function (options) {
  return function(ast) {
    var hoverSelectorPrefix = options.hoverSelectorPrefix;

    /*
    * Throw error, if options either don't define a hoverSelectorPrefix,
    * or if hoverSelectorPrefix isn't a string.
    */
    if ((typeof hoverSelectorPrefix) !== 'string') {
      throw new Error('hoverSelectorPrefix option must be a string');
    }

    ast.rules = optimizeHover(ast.rules, hoverSelectorPrefix);
  }
}
