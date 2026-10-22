import { linkageAudit } from "./swashplate-model-Cursor.js";

const result = linkageAudit();
console.log(JSON.stringify(result.summary, null, 2));
if (!result.ok) {
  console.error(result.failures.join("\n"));
  process.exit(1);
}
console.log("linkage audit passed");
