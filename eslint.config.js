import globals from 'globals';
import pluginJs from '@eslint/js';
import tseslint from 'typescript-eslint';
import pluginVue from 'eslint-plugin-vue';

export default [
  {
    languageOptions: {
      globals: globals.browser,
      parser: "vue-eslint-parser",
      parserOptions: {
        parser: '@typescript-eslint/parser'
      }
    }
  },
  {
    "vue/valid-v-slot": ["error", {
      "allowModifiers": true
    }]
  },
  {
    "rules": {
      "@typescript-eslint/no-explicit-any": "off"
    }
  },

  pluginJs.configs.recommended,
  ...tseslint.configs.recommended,
  ...pluginVue.configs['flat/essential']
];
