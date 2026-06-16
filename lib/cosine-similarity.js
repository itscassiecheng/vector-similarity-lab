import { client } from "./openai.js";

export const EMBEDDING_DIM = 1536;
export const EMBEDDING_MODEL = "text-embedding-3-small";

export async function embedBatch(texts) {
  const res = await client.embeddings.create({
    model: EMBEDDING_MODEL,
    input: texts,        // ← ⼀次傳整個 batch（OpenAI ⽀援陣列）
  });
  return res.data.map((d) => d.embedding);
}

export function cosineSimilarity(vector1, vector2) {
  const dot = vector1.reduce((sum, a, i) => sum + a * vector2[i], 0);
  const mag1 = Math.sqrt(vector1.reduce((sum, a) => sum + a * a, 0));
  const mag2 = Math.sqrt(vector2.reduce((sum, b) => sum + b * b, 0));
  return dot / (mag1 * mag2);
};

export async function getSentenceSimilarity(sentences) {
  const vectors = await embedBatch(sentences);

  const results = [];
  for (let i = 0; i < sentences.length; i++) {
    for (let j = i + 1; j < sentences.length; j++) {
      results.push({
        a: sentences[i],
        b: sentences[j],
        score: cosineSimilarity(vectors[i], vectors[j]),
      });
    }
  }
  return results;
}