// server/utils/ai.js
import { Configuration, OpenAIApi } from "openai";

const config = useRuntimeConfig();

const configuration = new Configuration({
  apiKey: config.openAi.secretKey,
});


const openai = new OpenAIApi(configuration);
let response = 'none';

async function verifyConnection() {
  try {
    response = await openai.listFiles();
  } catch (e) {
    throw new Error(`Error Connecting to openai: ${e}`)
  }

  if (!response.data) {
    throw new Error('response is error')
  }
  console.log(response.status, 'Success connecting to openai')
}
verifyConnection()


export const getChat = async ({ messages }) => {
  let response;
  try {
    response = await openai.createChatCompletion(
      {
        max_tokens: 2048,
        model: "gpt-3.5-turbo",
        temperature: 0.7,
        messages,
        stream: true
      },
      { responseType: "stream" }
    );


  } catch (e) {
    throw new Error(`Error getChatStream: ${e}`)
  }

  if (!response.data) {
    throw new Error('response is error')
  }
  return response.data;
};