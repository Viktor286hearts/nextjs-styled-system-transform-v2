/**
 * Styled-system transform handler
 * Ex. of transform usage in 'layout':
 * http://github.com/styled-system/styled-system/blob/master/packages/layout/src/index.js
 *
 * @param inputValue {string|number} - string example: '99%', '100px', 'auto', '1rem'
 * @param scale {any} - value of corresponded 'scale' field of config, e.g. { scale: 'sizes' } in 'layout'
 * @param obj {object} - component object
 * @returns {string} - analog of inputValue{string}
 */
const getScaledValue = function getScaledValue(inputValue, scale, obj) {
    return typeof inputValue === 'number' && !isNaN(inputValue) ? inputValue * scale + 'rem' : inputValue;
};

function customTransform (config) {
    Object.keys(config).forEach(key => {
        // Handle all properties with { scale: 'sizes' } value
        if (config[key]['scale'] === 'sizes') {
            config[key].transform = getScaledValue;
        }

        // Handle other properties of { scale: value }
        // ...
    })
    return config;
}

module.exports ={customTransform}

