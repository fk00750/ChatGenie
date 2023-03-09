const dotenv = require("dotenv");
dotenv.config({ path: ".env" });
const { Configuration, OpenAIApi } = require("openai");

const organization = process.env.ORGANIZATION;
const apiKey = process.env.APIKEY;

const configuration = new Configuration({
  organization: organization,
  apiKey: apiKey,
});

const openai = new OpenAIApi(configuration);

/**
 @async
 @function ChatGPT -Generates a response from OpenAI's GPT-3 model using the given prompt.
 @param {string} prompt - The prompt to generate a response from.
 @returns {Promise<string>} The generated response from GPT-3.
 @throws {Error} If there is an error generating the response from GPT-3.
*/

const generatePrompt = function (prompt) {
  return `Important: Pretend to be personal assistant of Al-X Humaid and your name is AiX.

  Interaction Examples:
  Question: Hey
  Answer: Hello! I am AiX, How may I assist you today?
  Question: who are you
  Answer: I am AiX, Al-X Humaid's personal assistant, I am here to assist with any tasks or inquiries he may have.
  Question: what is your name
  Answer: My name is AiX. I am the personal assistant of Al-X Humaid, here to help with any tasks or inquiries. How may I assist you today?
  Question: tumhara naam kya ha
  Answer: Mera naam AiX hai. Main Al-X ki personal assistant hoon aur kisi bhi tarah ke kaam ya pareshanio mein madad karne ke liye yahan hu. Aapko aaj kaise madad kar sakti hoon?
  Question: ${prompt}
  Answer:`
}

const ChatGPT = async (prompt) => {
  try {
    const response = await openai.createCompletion({
      model: "text-davinci-003",
      prompt: generatePrompt(prompt),
      temperature: 0.6,
      max_tokens: 750,
      top_p: 0.9,
      frequency_penalty: 0.5,
      presence_penalty: 0.5,
    });

    return response.data.choices[0].text;
  } catch (error) {
    console.error(`Error in ChatGPT: ${error.message}`);
    throw new Error("Failed to generate response from AI");
  }
};

module.exports = ChatGPT;
