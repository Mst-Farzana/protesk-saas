import { createConfigForNuxt } from '@nuxt/eslint-config/flat'

export default createConfigForNuxt({
  features: {
    stylistic: {
      semi: false, // ✅ No semicolons
      braceStyle: '1tbs', // ✅ One true brace style
    },
    tooling: true,
    typescript: true,
    vue: true,
  },
}).append({
  rules: {
    // Vue rules
    'vue/multi-word-component-names': 'off',
    'vue/max-attributes-per-line': 'off',
    'vue/singleline-html-element-content-newline': 'off',
    'vue/html-indent': 'off',
    'vue/attribute-hyphenation': 'off',

    // TypeScript rules
    '@typescript-eslint/no-explicit-any': 'off',
    '@typescript-eslint/no-unused-vars': 'warn',
    '@typescript-eslint/no-undef': 'off',

    // Nuxt auto-imports - এগুলো Nuxt automatically import করে
    'no-undef': 'off',

    // General rules
    'no-console': 'warn',
    'no-unused-vars': 'off',

    // Stylistic rules
    '@stylistic/semi': ['error', 'never'],
    '@stylistic/brace-style': ['error', '1tbs'],
    '@stylistic/comma-dangle': ['error', 'always-multiline'],
  },
})
