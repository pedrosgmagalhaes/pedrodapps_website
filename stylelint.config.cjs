module.exports = {
  extends: ['stylelint-config-standard'],
  ignoreFiles: ['dist/**', 'node_modules/**'],
  rules: {
    // Compat com BEM (wallet__label etc.)
    'selector-class-pattern': null,
    // Evitar restrição de múltiplas declarações em single-line blocks
    'declaration-block-single-line-max-declarations': null,
    // Permitir nomes de keyframes camelCase usados no projeto
    'keyframes-name-pattern': null,
    // Evitar falsos positivos para media queries modernas/experimentais
    'media-feature-name-value-no-unknown': null,
    // Evitar reordenação automática que exige refatorar CSS
    'no-descending-specificity': null,
    // Vendor prefixes tratados pelo build
    'property-no-vendor-prefix': null
  }
}
