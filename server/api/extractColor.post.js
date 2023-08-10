import ColorThief from 'colorthief'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const colors = await ColorThief.getPalette(body.img, 10)
  const dominant = await ColorThief.getColor(body.img, 1)

  return { dominant, colors }
})

