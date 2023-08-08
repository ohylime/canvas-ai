import ColorThief from 'colorthief'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const colors = await ColorThief.getPalette(body.img, 11)
  const dominant = await ColorThief.getColor(body.img)

  return { dominant, colors }
})

