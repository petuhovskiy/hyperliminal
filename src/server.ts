// src/server.ts

import { dictionary } from './dictionary';

const server = Bun.serve({
  port: 3000,
  fetch(req) {
    const url = new URL(req.url);
    const slugPath = url.pathname.split("/r/")[1];
    if (!slugPath) return new Response("Missing slug", { status: 400 });

    const parts = slugPath.split("-");
    if (parts.length !== 3 || !parts.every(p => /^[a-z]+$/.test(p))) {
      return new Response("Invalid slug format", { status: 400 });
    }

    const [a, b, c] = parts as [string, string, string];

    if (!dictionary.hasWord(a) || !dictionary.hasWord(b) || !dictionary.hasWord(c)) {
      return new Response("One or more words not found in dictionary", { status: 404 });
    }

    try {
      const aIndex = dictionary.getIndex(a);
      const bIndex = dictionary.getIndex(b);
      const cIndex = dictionary.getIndex(c);


      return new Response(`
        <html>
          <body>
            <pre>
Words: ${a}-${b}-${c}
Indices: ${aIndex}, ${bIndex}, ${cIndex}
Dictionary size: ${dictionary.size}
            </pre>
            <a href="/r/foo-bar-baz">Try another</a>
          </body>
        </html>
      `, {
        headers: { "Content-Type": "text/html" },
      });
    } catch (error) {
      if (error instanceof Error) {
        return new Response(`Error: ${error.message}`, { status: 500 });
      }
      return new Response("An unknown error occurred", { status: 500 });
    }
  },
});
