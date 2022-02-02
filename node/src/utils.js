import fs from "node:fs/promises";
import { resolve } from "node:path";

export async function writeListingsToFile(postCode, listings) {
  try {
    const fileName = resolve(`./data/${postCode}.json`);
    fs.writeFile(fileName, JSON.stringify(listings))
      .then(
        () => console.log(`Wrote listings to ${fileName}`)
      );
  } catch (err) {
    console.error(err);
  }
}