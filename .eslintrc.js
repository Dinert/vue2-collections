module.exports = {
    'parser': 'vue-eslint-parser',
    'parserOptions': {
        'sourceType': 'module',
        'ecmaFeatures': {
            'jsx': true
        },
        'requireConfigFile': false,
        'parser': '@babel/eslint-parser'
    },
    'plugins': ['vue'],
    'overrides': [{
        'files': ['*.vue'],
        'rules': {
            'indent': 'off'
        }
    }],
    'rules': {
        'vue/no-unsupported-features': 'off',
        'vue/comment-directive': 'off',
        'vue/jsx-uses-vars': 'error',
        'vue/no-dupe-v-else-if': 'error',
        'vue/no-dupe-keys': 'error',
        'vue/no-duplicate-attributes': ['error', {
            'allowCoexistClass': true,
            'allowCoexistStyle': true
        }],
        'vue/no-parsing-error': 'error',
        'vue/no-reserved-keys': 'error',
        'vue/no-shared-component-data': 'error',
        'vue/no-template-key': 'error',
        'vue/no-textarea-mustache': 'error',
        'vue/no-unused-components': 'error',
        'vue/no-unused-vars': 'error',
        'vue/no-use-v-if-with-v-for': 'warn',
        'vue/require-prop-type-constructor': 'error',
        'vue/require-render-return': 'error',
        'vue/require-v-for-key': 'error',
        'vue/require-valid-default-prop': 'error',
        'vue/return-in-computed-property': 'error',
        'vue/valid-template-root': 'error',
        'vue/valid-v-bind': 'error',
        'vue/valid-v-cloak': 'error',
        'vue/valid-v-else-if': 'error',
        'vue/valid-v-else': 'error',
        'vue/valid-v-for': 'error',
        'vue/valid-v-html': 'error',
        'vue/valid-v-if': 'error',
        'vue/valid-v-model': 'error',
        'vue/valid-v-on': 'error',
        'vue/valid-v-once': 'error',
        'vue/valid-v-pre': 'error',
        'vue/valid-v-show': 'error',
        'vue/valid-v-slot': 'error',
        'vue/valid-v-text': 'error',
        'vue/attribute-hyphenation': 'error',
        'vue/html-closing-bracket-newline': 'error',
        'vue/html-closing-bracket-spacing': ['warn', {
            'selfClosingTag': 'never'
        }],
        'vue/html-end-tags': 'error',
        'vue/html-indent': ['error', 4, {
            'attribute': 1,
            'baseIndent': 1,
            'closeBracket': 0,
            'alignAttributesVertically': false,
            'ignores': []
        }],
        'vue/html-quotes': 'error',
        'vue/html-self-closing': ['error', {
            'html': {
                'void': 'never',
                'normal': 'never',
                'component': 'always'
            },
            'svg': 'always',
            'math': 'always'
        }],
        'vue/max-attributes-per-line': ['error', {
            'singleline': {
                'max': 2
            },
            'multiline': {
                'max': 2
            }
        }],
        'vue/mustache-interpolation-spacing': 'error',
        'vue/no-multi-spaces': 'error',
        'vue/no-spaces-around-equal-signs-in-attribute': 'error',
        'vue/prop-name-casing': 'error',
        'vue/require-default-prop': 'off',
        'vue/require-prop-types': 'error',
        'vue/v-bind-style': 'warn',
        'vue/v-on-style': 'warn',
        'vue/attributes-order': 'warn',
        'vue/no-multiple-slot-args': 'warn',
        'vue/this-in-template': 'error',
        'vue/component-definition-name-casing': 'off',
        'vue/component-name-in-template-casing': ['error', 'kebab-case', {
            'registeredComponentsOnly': true,
            'ignores': []
        }],
        'vue/component-tags-order': ['warn', {
            'order': [
                ['script', 'template'], 'style'
            ]
        }],
        'vue/no-deprecated-scope-attribute': 'off',
        'vue/no-deprecated-slot-attribute': 'off',
        'vue/no-deprecated-slot-scope-attribute': 'off',
        'vue/no-reserved-component-names': 'error',
        'vue/require-direct-export': 'error',
        'vue/script-indent': ['error', 4, {
            'switchCase': 1
        }],
        'vue/valid-next-tick': 'error',
        'vue/html-button-has-type': 'error',
        'vue/no-invalid-model-keys': 'error',
        'vue/no-unused-refs': 'error',
        'vue/no-this-in-before-route-enter': 'error',
        'vue/no-use-computed-property-like-method': 'error',
        'vue/no-useless-template-attributes': 'error',
        'vue/no-computed-properties-in-data': 'error',
        'vue/no-custom-modifiers-on-v-model': 'error',
        'vue/no-multiple-template-root': 'error',
        'vue/no-v-for-template-key': 'error',
        'vue/no-v-model-argument': 'error',
        'vue/valid-v-bind-sync': 'error',
        'vue/array-bracket-spacing': ['error', 'never'],
        'vue/arrow-spacing': 'error',
        'vue/block-spacing': ['error', 'never'],
        'vue/brace-style': 'off',
        'vue/camelcase': 'off',
        'vue/comma-dangle': 'off',
        'vue/dot-location': ['error', 'property'],
        'vue/eqeqeq': ['error', 'always', {
            'null': 'ignore'
        }],
        'vue/key-spacing': ['error', {
            'beforeColon': false,
            'afterColon': true
        }],
        'vue/keyword-spacing': 'error',
        'vue/no-empty-pattern': 'error',
        'vue/no-irregular-whitespace': 'error',
        'vue/no-restricted-syntax': 'off',
        'vue/object-curly-spacing': ['error', 'never'],
        'vue/space-infix-ops': 'error',
        'vue/space-unary-ops': 'warn'
    }
};
