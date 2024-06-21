import fs from "fs";

import { scrape } from "./scraper.js";

fs.writeFileSync("data-pertanyaan.csv", "")

// UBAH FUNGSI INI TERGANTUNG PAGE YANG INGIN DI SCRAPE
// CONTOH DIBAWAH UNTUK PAGE 1 - 10
await scrape(1, 10);  // GANTI HALAMAN

