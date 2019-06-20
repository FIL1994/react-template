#! /usr/bin/env node
const commander = require("commander");
const chalk = require("chalk");
const figlet = require("figlet");
const shell = require("shelljs");
const { version } = require("../package.json");
const path = require("path");
const makeDir = require("make-dir");
const cpx = require("cpx");
const slash = require("slash");
const ora = require("ora");
const execSync = require("child_process").execSync;

const exec = (command, extraEnv) =>
  execSync(command, {
    stdio: "inherit",
    env: Object.assign({}, process.env, extraEnv)
  });

console.log(
  chalk.green(
    figlet.textSync("React Template", {
      font: "Cybermedium"
    })
  )
);
console.log(chalk.black.bgWhite(`v${version}`));

commander
  .version(version)
  .arguments("<project-directory>")
  .action(async dir => {
    console.log("Creating project directory:", dir);

    const pathDirectory = await makeDir(dir);

    const relativePath = slash(path.relative(process.cwd(), __dirname));

    const spinner = ora("Copying files").start();
    cpx.copySync(`${relativePath}/../template/{!(node_modules),!(node_modules)/**}`, pathDirectory, {
      includeEmptyDirs: true,
      verbose: true
    });
    spinner.color = "green";
    cpx.copySync(`${relativePath}/../template/.*`, pathDirectory);
    spinner.stop();

    console.log("Done copying files");

    shell.cd(dir);
    console.log(process.cwd());
    exec("npm init");
    console.log(chalk.green("Installing dependencies..."));
    exec("npm i");
    console.log(`cd ${dir}`);
    console.log('Run "npm run start" to start the project');
    console.log('Run "npm run build" to build the project');
  });

commander.parse(process.argv);
