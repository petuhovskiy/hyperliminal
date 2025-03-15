// src/server.ts

const server = Bun.serve({
    port: 3000,
    fetch(req) {
        const url = new URL(req.url);
        const slug = url.pathname.split("/r/")[1];
        if (!slug) return new Response("Missing slug", { status: 400 });

        const parts = slug.split("-");
        if (parts.length !== 3 || !parts.every(p => /^[a-z]+$/.test(p))) {
            return new Response("Invalid slug format", { status: 400 });
        }

        const [a, b, c] = parts;
        return new Response(`
        <html>
          <body>
            <h1>Page: ${a}-${b}-${c}</h1>
            <a href="/r/foo-bar-baz">Go to another page</a>
          </body>
        </html>
      `, {
            headers: { "Content-Type": "text/html" },
        });
    },
});
