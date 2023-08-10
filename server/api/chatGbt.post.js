

import { getChat } from "../utils/ai";

//messages: [{ "role": "user", "content": "Who won the world series in 2020?" },],
export default defineEventHandler(async (event) => {

  const body = await readBody(event)

  const prompt = `Given an image with dominant color ${body.dominant}
  and the following color properties ${body.colorProperties},
  recommend at least 10 text colors, background colors, border colors,
  and shadow colors that is not present in the color properties.
  Ensure that each recommended color is not repeated in the input color properties,
  and include if it meets accessibility ratio as.

  Give repsonse in JSON with color groups textColors, backgroundColors, borderColors, shadowColors.
  Each group entry has a "color" property and an "accessible" property
`

  const messages = [{ "role": "user", "content": prompt }]

  let response;
  try {
    response = await getChat({ messages });

    const data = JSON.parse(response)
    return data;
  } catch (e) {
    throw new Error(`Error in gbtRoute: ${e}`)
  }

})
