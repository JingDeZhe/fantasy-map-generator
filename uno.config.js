import { defineConfig, presetUno, presetIcons, transformerCompileClass, transformerDirectives } from 'unocss'

export default defineConfig({
  presets: [
    presetUno(),
    presetIcons({
      extraProperties: {
        display: 'inline-block',
        'vertical-align': 'middle',
      },
    }),
  ],
  transformers: [transformerDirectives(), transformerCompileClass()],
  theme: {
    colors: {},
  },
  safelist: getSafeList(),
})

function getSafeList() {
  return ['i-tabler-photo-down', 'i-tabler-printer', 'i-tabler-copy']
}
