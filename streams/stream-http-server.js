import { createReadStream } from "node:fs";
import { parse } from "csv-parse";

(async () => {
    const csvPath = new URL('./tasks.csv', import.meta.url);
    const file = createReadStream(csvPath);
    const delimiter = parse({
        delimiter: ',',
        skipEmptyLines: true,
        fromLine: 2
    });
    const csvParsed = file.pipe(delimiter);

    for await(const row of csvParsed) {
        const [title, description] = row;
        await send(title, description);
    }
  })();

  async function send(title, description) {
    await fetch('http://localhost:3334/tasks', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            title,
            description
        })
    });
  }