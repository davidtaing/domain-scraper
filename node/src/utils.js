import fs from "node:fs/promises";

export async function writeToJson(data, path) {
  try {
    fs.writeFile(path, JSON.stringify(data))
      .then(
        () => console.log(`Wrote to ${path}`)
      );
  } catch (err) {
    console.error(err);
  }
}

export function getCurrentDateString() {
  return (new Date().toJSON().slice(0, 10));
}