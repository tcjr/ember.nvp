import { styleText } from "node:util";

/**
 * Print help text to stdout.
 *
 * @param {Record<string, any>} coreOptions
 * @param {import('#types').DiscoveredLayer[]} discoveredLayers
 */
export function printHelp(coreOptions, discoveredLayers = []) {
  const title = styleText(["bgCyan", "black"], " ember.nvp ");
  console.log(`${title}\n`);
  console.log(`${styleText("bold", "Usage:")} npx ember.nvp [options]\n`);

  console.log(styleText("bold", "Core Options:"));
  for (const [name, config] of Object.entries(coreOptions)) {
    const flag = `--${name}`;
    const alias = config.short ? `-${config.short}, ` : "    ";
    const typeStr = config.type ? styleText("dim", `<${config.type}>`) : "";
    const desc = config.description || "";
    const choices = config.choices
      ? styleText(
          "yellow",
          ` [choices: ${config.choices.map((/** @type {string} */ c) => `"${c}"`).join(", ")}]`,
        )
      : "";

    console.log(`  ${alias}${styleText("cyan", flag)} ${typeStr}`);
    if (desc || choices) {
      console.log(`      ${desc}${choices}`);
    }
  }

  const layersWithOpts = discoveredLayers.filter(
    (l) => l.options && Object.keys(l.options).length > 0,
  );
  if (layersWithOpts.length > 0) {
    console.log(`\n${styleText("bold", "Layer Options:")}`);
    for (const layer of layersWithOpts) {
      const layerNameHeader = styleText("magentaBright", layer.name);
      console.log(`  ${layerNameHeader}:`);
      for (const [key, schema] of Object.entries(layer.options ?? {})) {
        const flag = styleText("cyan", `--${layer.name}.${key}`);
        const typeStr = schema.type ? styleText("dim", `<${schema.type}>`) : "";
        const promptDesc = schema.prompt || "";
        const defaultStr =
          schema.default !== undefined
            ? styleText("yellow", ` [default: ${JSON.stringify(schema.default)}]`)
            : "";

        console.log(`    ${flag} ${typeStr}`);
        if (promptDesc || defaultStr) {
          console.log(`        ${promptDesc}${defaultStr}`);
        }
      }
    }
  }

  console.log("");
}
