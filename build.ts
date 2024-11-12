import { renderFileToString } from "https://deno.land/x/dejs@0.10.3/mod.ts";
import sass from "https://deno.land/x/denosass/mod.ts";
import { routes } from "./routes.ts";

async function renderRoute(template: string, output: string, data: Record<string, unknown>) {
    const html = await renderFileToString(template, data);
    await Deno.writeTextFile(output, html);
    console.log(`Wrote ${output}`);
}

async function buildSass() {
    const sassData = await Deno.readTextFile(`${Deno.cwd()}/source/styles/index.scss`);
    const css = sass(sassData, { load_paths: [`${Deno.cwd()}/source/styles`] }).to_string();
    await Deno.writeTextFile(`${Deno.cwd()}/docs/index.css`, css);
    console.log(`Wrote docs/index.css`)
}

export async function build() {
    for (const route of routes) {
        await renderRoute(route.template, route.output, {});
    }

    await buildSass();
}
