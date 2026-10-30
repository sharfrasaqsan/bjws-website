import fs from "fs";
import path from "path";

const chunksDir = path.resolve("bjws-website/.next/static/chunks");

for (const chunk of ["285_oegxa9t_g.js", "0cz1d0mv5g_q7.js"]) {
  const p = path.join(chunksDir, chunk);
  const text = fs.readFileSync(p, "utf-8");
  const lines = text.slice(0, 1000);
  console.log(chunk, "preview:");
  console.log(lines.slice(0, 300));
}
