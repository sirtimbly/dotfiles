#!/usr/bin/env /Users/timbendt/.asdf/shims/node

import "zx/globals";
import xbar, { separator, isDarkMode } from "@sindresorhus/xbar";
import {
	parseISO,
	formatDistanceToNow,
	lightFormat,
	intervalToDuration,
	formatDuration,
} from "date-fns";

const timew = "/usr/local/bin/timew";
// try {
//   timew = await $`which timew`.quiet()
// } catch (error) {
//   process.stderr.write(`error getting timew, ${error}`);
//   process.exit(1)
// }
// const timew = stdout.trim()
// console.log("🚀 ~ executable:", timew)
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
const tags = todayData.reduce((prev, curr) => {
	for (const t of curr.tags) {
		const newDuration = intervalToDuration({
			start: parseISO(curr.start),
			end: curr.end ? parseISO(curr.end) : new Date(),
		});
		const dictVal = prev[t];
		prev[t] = {
			hours: dictVal ? dictVal.hours : 0 + newDuration.hours,
			minutes: dictVal ? dictVal.minutes : 0 + newDuration.minutes,
			seconds: dictVal ? dictVal.seconds : 0 + newDuration.seconds,
		};
	}
	return prev;
}, {});
// console.log("🚀 ~ tags:", tags);
const submenuItems = Object.keys(tags).map(
	(k) => `🏷️ [${tags[k].hours}h ${tags[k].minutes}m ${tags[k].seconds}s] ${k} `,
);
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
		text: `Tags/Projects (${Object.keys(tags).length})`,
		submenu: submenuItems,
	},
	{
		text: "💻 View Summary",
		terminal: false,
		shell: "/Users/timbendt/.dotfiles/bin/iterm",
		param1: "timew",
		param2: "summary",
	},
]);
