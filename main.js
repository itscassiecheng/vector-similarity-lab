import { input } from "@inquirer/prompts";
import { getSentenceSimilarity } from "./lib/cosine-similarity.js";
import { spinner } from "./utils/spinner.js";

try {
  while (true) {
    const raw = (await input({ message: "輸入句子（用「句子1」「句子2」格式，exit 離開）：" })).trim();

    if (raw.toLowerCase() === "exit") { console.log("再會~"); break; }

    const sentences = [...raw.matchAll(/「([^」]+)」/g)].map((m) => m[1]);

    if (sentences.length < 2) {
      console.log("至少需要兩句，格式範例：「我愛咖啡」「咖啡很香」\n");
      continue;
    }

    const spin = spinner("計算中...").start();
    const results = await getSentenceSimilarity(sentences);
    spin.stop();

    for (const [i, r] of results.entries()) {
      console.log(`\n${i + 1}. 「${r.a}」vs「${r.b}」→ ${r.score.toFixed(3)}`);
    }

    results.average = results.reduce((sum, r) => sum + r.score, 0) / results.length;  
    console.log(`\n平均相似度：${results.average.toFixed(3)}`);
  }
} catch (err) {
  if (err.name === "ExitPromptError") {
    console.log("\n再會~");
  } else {
    throw err;
  }
}