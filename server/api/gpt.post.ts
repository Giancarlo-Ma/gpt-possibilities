import { Configuration, OpenAIApi } from "openai";

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);
export type Directive = "translate" | "summarize" | "explanation";
export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  const content = body.content.replaceAll("\n", "") || "";
  const directive: Directive = body.directive || "translate";
  const paragraphs = splitTextIntoParagraphs(content, 500) || [];
  const directiveMap: Record<Directive, (c: string) => string> = {
    translate: generateTranslatePrompt,
    summarize: generateSummarizePrompt,
    explanation: generateExplanationPrompt,
  };
  const translationPromises = paragraphs.map(async (paragraph) => {
    const prompt = directiveMap[directive](paragraph);
    const completion = await openai.createCompletion({
      model: "text-davinci-003",
      prompt: prompt,
      max_tokens: 1024,
      temperature: 0.1,
    });

    return completion.data.choices[0].text?.trim();
  });

  const translatedParagraphs = await Promise.all(translationPromises);
  console.log(translatedParagraphs);
  return translatedParagraphs.join("\n");
});

const generateTranslatePrompt = (content: string) => {
  return `Translate the following text to English: \n${content}\n\nTranslation: `;
};

const generateSummarizePrompt = (content: string) => {
  return `用原文语言概括这段文字.:\n${content}\n\n`;
};

const generateExplanationPrompt = (content: string) => {
  return `解释这个文本并解释其中使用的任何技术术语。:\n${content}\n\n`;
};
function splitTextIntoParagraphs(text: string, maxLength: number) {
  const regex = new RegExp(`.{1,${maxLength}}`, "g");
  return text.match(regex);
}
