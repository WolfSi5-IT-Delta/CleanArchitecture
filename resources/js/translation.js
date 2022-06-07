/**
 * Translate the given key.
 */
export const __ = (key, replace = {}) => {
  const keys = key.split('.');
  let translation = this.page.props.translations;
  keys.forEach(function(keyTmp) {
    translation = translation[keyTmp] ?
      translation[keyTmp] :
      keyTmp
  });

  Object.keys(replace).forEach(function(key) {
    translation = translation.replace(':' + key, replace[key])
  });

  return translation
}

/**
 * Translate the given key with basic pluralization.
 */
export function __n(key, number, replace = {}) {
  var options = key.split('|');

  key = options[1];
  if (number == 1) {
    key = options[0];
  }

  return tt(key, replace);
}

/*
module.exports = {
    methods: {

        __(key, replace = {}) {
            keys = key.split('.');
            var translation = this.$page.props.translations;
            keys.forEach(function(keyTmp){
                 translation = translation[keyTmp]
                    ? translation[keyTmp]
                    : keyTmp
            });

            Object.keys(replace).forEach(function (key) {
                translation = translation.replace(':' + key, replace[key])
            });

            return translation
        },

        __n(key, number, replace = {}) {
            var options = key.split('|');

            key = options[1];
            if(number == 1) {
                key = options[0];
            }

            return tt(key, replace);
        },
    },
}
*/
