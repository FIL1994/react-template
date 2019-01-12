#! /usr/bin/env node
const commander = require("commander");
const inquirer = require("inquirer");
const chalk = require("chalk");
const figlet = require("figlet");
const shell = require("shelljs");
const { version } = require("../package.json");
const path = require("path");
const fs = require("fs");
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
      font: "cybermedium"
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
    console.log("Using path:", pathDirectory);

    const relativePath = slash(path.relative(process.cwd(), __dirname));

    console.log("relative", `${relativePath}/template/!(node_modules)`);

    const spinner = ora("Copying files").start();
    cpx.copySync(`${relativePath}/../template/!(node_modules)`, pathDirectory, {
      includeEmptyDirs: true,
      verbose: true
    });
    spinner.color = "green";
    cpx.copySync(`${relativePath}/../template/.*`, pathDirectory);
    spinner.stop();

    console.log("Done copying files");

    console.log(`cd ${dir}`);
    shell.cd(dir);
    console.log(process.cwd());
    exec("npm init");
    console.log(chalk.green("Installing dependencies..."));
    exec("npm i");
    console.log('Run "npm run start" to start the project');
    console.log('Run "npm run build" to build the project');
  });

commander.parse(process.argv);
