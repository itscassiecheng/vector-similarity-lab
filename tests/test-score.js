import { embedBatch, cosineSimilarity } from "../lib/cosine-similarity.js";

const texts = ["我喜歡喝咖啡", "我愛喝咖啡"];
const vectors = await embedBatch(texts);
const similarity = cosineSimilarity(vectors[0], vectors[1]);
console.log("回傳幾筆:", vectors.length);
console.log("相似度:", similarity);