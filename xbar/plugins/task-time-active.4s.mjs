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
	add,
	addMinutes,
	parseISO,
	formatDistanceToNow,
	lightFormat,
	intervalToDuration,
	formatDuration,
	isBefore,
} from "date-fns";
import { compact } from "lodash-es";

const timew = process.env.TIMEW_BIN || "/usr/local/bin/timew";
const task = process.env.TASK_BIN || "/usr/local/bin/task";
const shellSummary = process.env.SHELL_SUMMARY || "/bin/zsh";

export const addDurations = (duration1, duration2) => {
	const baseDate = new Date(0); // can probably be any date, 0 just seemed like a good start

	return intervalToDuration({
		start: baseDate,
		end: add(add(baseDate, duration1), duration2),
	});
};
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
	// return `${duration.hours}h ${duration.minutes}m ${duration.seconds}s`;
	return formatDuration(duration);
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
	currentTime = formatDistanceToNow(parseISO(activeData.start));
} catch {}
//{"id":1,"start":"20240326T202105Z","tags":["docs","document trpc configuration","granular.fabric3"]}
const now = Date.now();
const startOfDay = lightFormat(now, "yyyy-MM-dd");
// console.log("🚀 ~ starOfDay:", startOfDay)
const exportToday = await $`${timew} export from ${startOfDay}`.quiet();
const timespanData = JSON.parse(exportToday.stdout).sort((a, b) =>
	isBefore(parseISO(a.start), parseISO(b.start)) ? 1 : -1,
);
// console.log("🚀 ~ exportToday:", todayData);
const totalTime = timespanData
	.map((t) =>
		intervalToDuration({
			start: parseISO(t.start),
			end: t.end ? parseISO(t.end) : new Date(),
		}),
	)
	.reduce(addDurations, { hours: 0, minutes: 0, seconds: 0 });
// console.log(data)
const allTags = await $`${task} _tags`.quiet();
const tagList = allTags.stdout.split("\n");
// console.log("🚀 ~ tagList:", tagList);
const tags = timespanData.reduce((prev, curr) => {
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
		tags[k].type === "tag" ? `🏷️ [${formatDuration(tags[k])}] ${k} ` : undefined,
	),
);
// console.log("🚀 ~ submenuTags:", submenuTags);
const submenuProjects = compact(
	Object.keys(tags).map((k) =>
		tags[k].type === "project"
			? `🛠️ [${formatDuration(tags[k])}] ${k} `
			: undefined,
	),
);
const taskText = activeData?.tags
	?.filter((t) => !tagList.includes(t))
	.join(",");
const taskTags = activeData?.tags
	?.filter((t) => tagList.includes(t))
	.join(", ");
// console.log("🚀 ~ submenuProjects:", submenuProjects);
// console.log("🚀 ~ submenuItems:", submenuItems);
const pomodoroDone = isBefore(
	addMinutes(parseISO(activeData.start), 35),
	new Date(),
);
xbar([
	{
		text: activeData
			? `${pomodoroDone ? "🍅" : "▶️"} ⌚️[${currentTime}] | color=${
					pomodoroDone ? "red" : "green"
			  }`
			: `⌚️[${formatDuration(totalTime, { format: ["hours", "minutes"] })}]`,
	},
	...(taskText
		? [separator, `▶️ ${taskText} | color=green`, `🏷️ [${taskTags}]`]
		: []),
	separator,
	`Today ${startOfDay}`,
	{
		text: `Time-spans (${timespanData.length})`,
	},
	...(timespanData.length
		? timespanData.map((x) => {
				const isEnded = !!x.end;
				return {
					text: `${isEnded ? "🪵" : "▶️"} [${getDuration(
						x.start,
						x.end,
					)}] ${isoToTime(x.start)}-${isoToTime(x.end)}`,
					color: isEnded ? "black" : "green",
					submenu: x.tags.sort((a, b) => b.length - a.length),
				};
		  })
		: []),

	{
		text: `Tags (${submenuTags.length})`,
		...(submenuTags.length ? { submenu: submenuTags } : {}),
	},
	{
		text: `Tasks (${submenuProjects.length})`,
		...(submenuProjects.length ? { submenu: submenuProjects } : {}),
	},
	{
		text: "💻 View Summary",
		terminal: false,
		shell: shellSummary,
		param1: "timew",
		param2: "summary",
	},
]);
