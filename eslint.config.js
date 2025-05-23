import antfu from '@antfu/eslint-config'

export default antfu({
  rules: {
    'style/semi': ['error', 'always'],
    'style/member-delimiter-style': ['error', {singleline: {delimiter:'semi',requireLast:true},multiline: {requireLast:true,delimiter:'semi'}}],
  },
  ignores: [
    'eslint.json',
  ],
})
