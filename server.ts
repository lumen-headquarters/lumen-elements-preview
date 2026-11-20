const folder = import.meta.dir;
const server = Bun.serve({
  hostname: "127.0.0.1",
  port: Number(process.env.PORT ?? 4178),
  async fetch(request) {
    const { pathname } = new URL(request.url);
    if (pathname === "/") return new Response(Bun.file(folder + "/index.html"));
    if (pathname === "/preview.js") {
      const bundle = await Bun.build({ entrypoints: [folder + "/main.ts"], target: "browser" });
      if (!bundle.success) return new Response(bundle.logs.map(String).join("\n"), { status: 500 });
      return new Response(bundle.outputs[0], {
        headers: { "content-type": "text/javascript", "cache-control": "no-store" },
      });
    }
    if (pathname === "/style.css") return new Response(Bun.file(folder + pathname));
    if (/^\/fonts\/[a-z-]+\.woff2$/.test(pathname)) return new Response(Bun.file(folder + pathname));
    return new Response("Not found", { status: 404 });
  },
});
console.log(`Elements preview at ${server.url}`);
