#!/usr/bin/env /Users/timbendt/.asdf/shims/node


import 'zx/globals'
import xbar, { separator, isDarkMode } from "@sindresorhus/xbar";
import {parseISO, formatDistanceToNow, lightFormat, intervalToDuration, formatDuration} from "date-fns";

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
    return "X"
  }

  const endDate = isoEnd ? parseISO(isoEnd) : Date.now();
  // console.log("🚀 ~ getDuration ~ endDate:", endDate)
  const duration = intervalToDuration({start: parseISO(isoStart), end: endDate})
  // console.log("🚀 ~ getDuration ~ duration:", duration)
  return `${duration.hours}h ${duration.minutes}m ${duration.seconds}s`

}

function isoToTime(dateIso) {
  if (!dateIso) {
    return "..."
  }
  return lightFormat(parseISO(dateIso), "HH:mm")
}

const activeJson = await $`${timew} get dom.active.json`.quiet()
//{"id":1,"start":"20240326T202105Z","tags":["docs","document trpc configuration","granular.fabric3"]}
const data = JSON.parse(activeJson.stdout)
const now = Date.now()
const startOfDay = lightFormat(now, "yyyy-MM-dd")
// console.log("🚀 ~ starOfDay:", startOfDay)
const exportToday = await $`${timew} export from ${startOfDay}`.quiet()
const todayData = JSON.parse(exportToday.stdout);
// console.log("🚀 ~ exportToday:", todayData)
const totalTime = formatDistanceToNow(parseISO(data.start))
// console.log(data)
xbar([
	{
		text: `🏷️ [${data.tags.length}], ⌚️[${totalTime}]`,
	},
  separator,
  `Today ${startOfDay} | disabled=true`,
  ...todayData.map((x) => {
    const isEnded = !!x.end;
   return {
    text: `${isEnded ? "🪵" : "▶️"} [${getDuration(x.start, x.end)}] ${isoToTime(x.start)}-${isoToTime(x.end)}`,
    color: isEnded ? "white" : "green",
    submenu: x.tags.sort((a,b) => b.length - a.length)
   }

  })
]);
