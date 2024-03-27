#!/usr/bin/env /Users/timbendt/.asdf/shims/node
//
// Taskwarrior
//
// <xbar.title>TimeWarrior Active Time</xbar.title>
// <xbar.version>v1.0</xbar.version>
// <xbar.author>sirtimbly</xbar.author>
// <xbar.author.github>sirtimbly</xbar.author.github>
// <xbar.desc>Task time tracker status.</xbar.desc>
// <xbar.dependencies>task,timew,node,zx,date-fns</xbar.dependencies>
// <xbar.image>http://uploads.timbendt.com/CleanShot-2024-03-26-at-18.57.01-2x-BSYJBCFwb9M9VLpk7A6NV6ha9Bwb7oVrocAkqQpZtaIHiXLnkp0OyEjMTu0rp85vtHltyudeWLFEVFcxZryP23I4D6oBSFZLaZa2.png</xbar.image>
//
// Dependencies:
//   taskwarrior (http://taskwarrior.org)
//      available via homebrew `brew install task`
//   timewarrior (https://timewarrior.net/)
//      available via homebrew `brew install timewarrior`
//
//	<xbar.var>string(TASK_BIN="/usr/local/bin/task"): Location of the taskwarrior binary</xbar.var>
//	<xbar.var>string(TIMEW_BIN="/usr/local/bin/timew"): Location of timewarrior binary</xbar.var>
//	<xbar.var>string(SHELL_SUMMARY="/Users/timbendt/.dotfiles/bin/iterm"): Shell command for launching the Summary.</xbar.var>

import "zx/globals";
import xbar, { separator } from "@sindresorhus/xbar";
import {
	parseISO,
	formatDistanceToNow,
	lightFormat,
	intervalToDuration,
} from "date-fns";
import { compact } from "lodash-es";

const timew = process.env.TIMEW_BIN || "/usr/local/bin/timew";
const task = process.env.TASK_BIN || "/usr/local/bin/task";
const shellSummary = process.env.SHELL_SUMMARY || "/bin/zsh";

function getDuration(isoStart, isoEnd) {
	if (!isoStart) {
		return "X";
	}

	const endDate = isoEnd ? parseISO(isoEnd) : Date.now();
	// console.log("🚀 ~ getDuration ~ endDate:", endDate)
	const duration = intervalToDuration({
		start: parseISO(isoStart),
		end: endDate,
	});
	// console.log("🚀 ~ getDuration ~ duration:", duration)
	return `${duration.hours}h ${duration.minutes}m ${duration.seconds}s`;
}

function isoToTime(dateIso) {
	if (!dateIso) {
		return "...";
	}
	return lightFormat(parseISO(dateIso), "HH:mm");
}
let activeData;
let currentTime;
try {
	const activeJson = await $`${timew} get dom.active.json`.quiet();
	activeData = JSON.parse(activeJson.stdout);
	currentTime = formatDistanceToNow(parseISO(data.start));
} catch {}
//{"id":1,"start":"20240326T202105Z","tags":["docs","document trpc configuration","granular.fabric3"]}
const now = Date.now();
const startOfDay = lightFormat(now, "yyyy-MM-dd");
// console.log("🚀 ~ starOfDay:", startOfDay)
const exportToday = await $`${timew} export from ${startOfDay}`.quiet();
const todayData = JSON.parse(exportToday.stdout);
// console.log("🚀 ~ exportToday:", todayData);
const totalTime = todayData
	.map((t) =>
		intervalToDuration({
			start: parseISO(t.start),
			end: t.end ? parseISO(t.end) : new Date(),
		}),
	)
	.reduce(
		(curr, prev) => ({
			hours: prev.hours + curr.hours,
			minutes: prev.minutes + curr.minutes,
			seconds: prev.seconds + curr.seconds,
		}),
		{ hours: 0, minutes: 0, seconds: 0 },
	);
// console.log(data)
const allTags = await $`${task} _tags`.quiet();
const tagList = allTags.stdout.split("\n");
// console.log("🚀 ~ tagList:", tagList);
const tags = todayData.reduce((prev, curr) => {
	for (const t of curr.tags) {
		const newDuration = intervalToDuration({
			start: parseISO(curr.start),
			end: curr.end ? parseISO(curr.end) : new Date(),
		});
		const dictVal = prev[t];
		prev[t] = {
			type: tagList.includes(t) ? "tag" : "project",
			hours: dictVal ? dictVal.hours : 0 + newDuration.hours,
			minutes: dictVal ? dictVal.minutes : 0 + newDuration.minutes,
			seconds: dictVal ? dictVal.seconds : 0 + newDuration.seconds,
		};
	}
	return prev;
}, {});

// console.log("🚀 ~ tags:", tags);
const submenuTags = compact(
	Object.keys(tags).map((k) =>
		tags[k].type === "tag"
			? `🏷️ [${tags[k].hours}h ${tags[k].minutes}m ${tags[k].seconds}s] ${k} `
			: undefined,
	),
);
// console.log("🚀 ~ submenuTags:", submenuTags);
const submenuProjects = compact(
	Object.keys(tags).map((k) =>
		tags[k].type === "project"
			? `🛠️ [${tags[k].hours}h ${tags[k].minutes}m ${tags[k].seconds}s] ${k} `
			: undefined,
	),
);
// console.log("🚀 ~ submenuProjects:", submenuProjects);
// console.log("🚀 ~ submenuItems:", submenuItems);
xbar([
	{
		text: activeData
			? `▶️⌚️[${currentTime}] 🏷️ [${data.tags.length}],`
			: `⌚️[${totalTime.hours}h${totalTime.minutes}m]`,
	},
	separator,
	`Today ${startOfDay}  | disabled=true`,
	{
		text: `Time-spans (${todayData.length})`,
		submenu: todayData.map((x) => {
			const isEnded = !!x.end;
			return {
				text: `${isEnded ? "🪵" : "▶️"} [${getDuration(
					x.start,
					x.end,
				)}] ${isoToTime(x.start)}-${isoToTime(x.end)}`,
				color: isEnded ? "black" : "green",
				submenu: x.tags.sort((a, b) => b.length - a.length),
			};
		}),
	},
	{
		text: `Tags (${submenuTags.length})`,
		submenu: submenuTags,
	},
	{
		text: `Projects (${submenuProjects.length})`,
		submenu: submenuProjects,
	},
	{
		text: "💻 View Summary",
		terminal: false,
		shell: shellSummary,
		param1: "timew",
		param2: "summary",
	},
]);
