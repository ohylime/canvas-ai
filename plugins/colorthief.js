import ColorThief from 'colorthief'
export default defineNuxtPlugin(() => {
  return {
    provide: {
      getPalette: { ...ColorThief.getPalette },
      getColors: ColorThief.getColors
    }
  }
})