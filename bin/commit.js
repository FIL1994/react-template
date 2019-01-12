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

console.log(
  chalk.green(
    figlet.textSync("React Template", {
      font: "cybermedium",
      horizontalLayout: "default",
      verticalLayout: "default"
    })
  ),
  chalk.yellow(`\nv${version}`)
);

commander
  .version(version)
  .option("-d, --dir [value]", "directory")
  .arguments("<project-directory> [options]")
  .action(async dir => {
    console.log("Creating project directory:", dir);

    const path = await makeDir(dir);
    console.log("Using path:", path);
    cpx.copySync("template/!(node_modules)", path, { includeEmptyDirs: true });
    cpx.copySync("template/.*", path);
    console.log("Done copying files");
  });

commander.parse(process.argv);

shell.exec("echo shell.exec works");

// console.log(process.cwd(), "\n", __dirname);
