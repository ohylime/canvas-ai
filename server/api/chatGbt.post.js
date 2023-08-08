

import { getChat } from "../utils/ai";

function extractColorData(jsonMessage) {
  return JSON.parse(message)
}

//messages: [{ "role": "user", "content": "Who won the world series in 2020?" },],
export default defineEventHandler(async (event) => {

  const body = await readBody(event)

  const prompt = `Given an image with dominant color ${body.dominant} and the following color properties ${body.colorProperties}, recommend the best text colors, background colors, border colors, and shadow colors that are not present in the color properties.
  Ensure that each recommended color is not repeated in the input color properties, and include accessibility ratios.
  Give repsonse in JSON with camelCase`

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
