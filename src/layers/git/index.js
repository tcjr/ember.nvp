import { hasGit, initGit, isInGit } from "#utils/git.js";
import { formatLabel } from "#utils/cli.js";
import { join } from "node:path";
import { cp } from "node:fs/promises";

export default {
  label: formatLabel("git init"),
  hint: "set up this project as a fresh git repository",

  /**
   * @param {import('#utils/project.js').Project} project
   */
  async defaultValue(project) {
    return !isInGit();
  },

  /**
   * @param {import('#utils/project.js').Project} project
   */
  async run(project) {
    if (hasGit(project.directory)) {
      return;
    }

    let initOk = initGit(project.directory);
    if (initOk) {
      let gitIgnorePath = join(import.meta.dirname, "files/.gitignore");
      let targetPath = join(project.directory, ".gitignore");

      await cp(gitIgnorePath, targetPath, { force: true });
    }

    return initOk;
  },

  /**
   * @param {import('#utils/project.js').Project} project
   */
  async isSetup(project) {
    return hasGit(project.directory);
  },
};
