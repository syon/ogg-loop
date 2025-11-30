export default defineNuxtPlugin(async (nuxtApp) => {
  // Dynamic import for client-side
  const module = await import('vue3-shortkey')
  const VueShortkey = module.default || module
  nuxtApp.vueApp.use(VueShortkey, { prevent: ['input', 'textarea'] })
})
