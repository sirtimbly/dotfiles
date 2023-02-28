#!/usr/bin/env /usr/local/bin/node
// jshint asi:true
// jshint esversion: 8
// <xbar.title>Daily Tasks</xbar.title>
// <xbar.version>v0.1</xbar.version>
// <xbar.author>Tim Bendt</xbar.author>
// <xbar.author.github>sirtimbly</xbar.author.github>
// <xbar.desc>List top part of daily task file.
// The menu bar shows a count of not done tasks</xbar.desc>
// <xbar.dependencies>node.js</xbar.dependencies>

// <xbar.var>string(DAILY_DIR=""): Directory where daily task files are stored</xbar.var>
// <xbar.var>string(EXTENSION=".taskpaper"): The file extension</xbar.var>
// <xbar.var>string(SCRIPT=""): The script to run when there is no file for today.</xbar.var>
// <xbar.var>string(TODO_EDITOR="/usr/local/bin/subl"): The shell command to run to open the file.</xbar.var>
// <xbar.var>select(DARK_MODE="dark"): Choose dark mode settings [auto, dark, light]</xbar.var>
//
/**
 * Information
 *
 * TODO
 */

const daily_dir = process.env.DAILY_DIR;
const file_extension = process.env.EXTENSION;
const script = process.env.SCRIPT;
const editor = process.env.TODO_EDITOR;

/**
 * MAX length of the title string in the toolbar
 *
 * @type {number}
 */
const MAX_LENGTH = 60;
const notDoneRegex = /^\W+((-\W\[\W\])|(-\W))(.+)/gmu;
/////////////////////////////////////////////////////////////////////////
// Do not edit below this line unless you know what you're doing. :)  //
///////////////////////////////////////////////////////////////////////
import xbar, { separator, isDarkMode } from "@sindresorhus/xbar";
import { format } from "date-fns";
import { readFile } from "node:fs/promises";
import path, { dirname } from "path";
import httpTransport from "https";
import { fileURLToPath } from "url";

function fmtDate(d) {
	return format(d, "yyyy-MM-dd");
}
const __filename = fileURLToPath(import.meta.url);
const todayFilePath = path.resolve(
	daily_dir,
	`${fmtDate(new Date())}${file_extension}`,
);

const textColor = (() => {
	switch (process.env.DARK_MODE) {
		case "dark":
			return "white";
		case "light":
			return "black";
		case "auto":
		default:
			return isDarkMode ? "white" : "black";
	}
})();

async function getTasks() {
	let rawTextBuffer;
	try {
		rawTextBuffer = await readFile(todayFilePath);
	} catch {
		xbar([
			{
				text: "☑️ (!)",
				dropdown: true,
			},
			separator,
			{
				text: todayFilePath,
			},
			{
				text: "> Run Daily Script",
				terminal: true,
				shell: script,
				param1: `--dir=${daily_dir}`,
				param2: `-a`,
			},
		]);
	}
	if (rawTextBuffer && rawTextBuffer.length) {
		let rawText = rawTextBuffer.toString();
		const inboxIndex = await rawText.indexOf("INBOXES:");
		const journalIndex = await rawText.indexOf("# JOURNAL");
		if (journalIndex > 0) {
			rawText = rawText.substring(0, journalIndex);
		}
		const lines = rawText.split("\n");

		const allNotDone = Array.from(rawText.substring(0, inboxIndex).matchAll(notDoneRegex));
		// console.log("allNotDone", allNotDone)
		const statusString = allNotDone ? allNotDone.length || 0 : 0;
		const content = [];
		content.push({
			text: `☑️ ${statusString}`,
			color: textColor,
			dropdown: true,
		});
		content.push(separator);
		let heading = "";
		allNotDone.forEach((value, index) => {
			const text = value[4];
			const line = lines.reduce((prev, curr, idx) =>
				curr.includes(text) ? idx + 1 : prev,
			);
			const newHeading = lines
				.slice(0, line - 1)
				.reduceRight((prev, curr, idx) => {
					if (prev === "") {
						return curr.match(/:\W*$/gmu) ? curr : prev;
					}
					return prev;
				}, "");

			if (newHeading !== "") {
				// console.log(newHeading)
			}
			if (newHeading !== "" && newHeading !== heading) {
				content.push(separator);
				content.push(newHeading);
				heading = newHeading;
			}
			content.push({
				text,
				shell: editor,
				terminal: false,
				param1: `${todayFilePath}:${line}`,
			});
		});
		try {
			xbar(content);
		} catch (error) {
			console.log(content);
			throw error;
		}
	}
}

getTasks().catch((error) => {
	console.error(error);
});
