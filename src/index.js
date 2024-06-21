import fs from "fs";

import { scrape } from "./scraper.js";

fs.writeFileSync("data-pertanyaan.csv", "")

await scrape(1, 10);

