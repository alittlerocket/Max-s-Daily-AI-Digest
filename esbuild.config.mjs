import esbuild from "esbuild";

const watch = process.argv[2] === "watch";

const context = await esbuild.context({
  entryPoints: ["src/main.ts"],
  bundle: true,
  external: ["obsidian"],
  format: "cjs",
  target: "es2020",
  outfile: "main.js",
  sourcemap: watch ? "inline" : false,
  minify: !watch,
});

if (watch) {
  await context.watch();
} else {
  await context.rebuild();
  await context.dispose();
}
