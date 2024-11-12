import { build } from "./build.ts"

async function serveFiles(req: Request): Promise<Response> {
    try {
        const url = new URL(req.url);
        const file = `./public/${url.pathname === "/" ? "/index.html" : url.pathname}`;
        const content = await Deno.readFile(file);
        const contentType = getContentType(file);
        return new Response(content, { status: 200, headers: { "content-type": contentType } });
    } catch {
        const f404 = await Deno.readFile("./public/404.html");
        return new Response(f404, { status: 404 });
    }

}

function getContentType(path: string): string {
    if (path.endsWith(".html")) return "text/html";
    if (path.endsWith(".css")) return "text/css";
    if (path.endsWith(".js")) return "application/javascript";
    if (path.endsWith(".ico")) return "image/x-icon";
    if (path.endsWith(".png")) return "image/png";
    if (path.endsWith(".svg")) return "image/svg+xml";
    return "application/octet-stream";
}

const watchFiles = async () => {
    const watcher = Deno.watchFs(["./source"]);
    for await (const event of watcher) {
        if (event.kind == "modify") {
            console.log("Changes detected, reloading");
            await build();
        }
    }
};

await build();
Deno.serve(serveFiles, { port: 8000 });
watchFiles();
