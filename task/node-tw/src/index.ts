import { TaskwarriorLib } from "taskwarrior-lib";
import { formatDistanceToNow, parseISO } from "date-fns"
import notifier from "node-notifier";
const taskwarrior = new TaskwarriorLib();
const tasks = taskwarrior.load("status:pending");
const overdue = taskwarrior.load("+OVERDUE or +DUETODAY");
// console.dir(overdue)
const actions = ["Snooze 5m", "Done", "Start"]
const groupId = "node-tw";
for (const task of overdue) {
  console.log("🚀 ~ due:", task.due)
  const date = parseISO(task.due);
  console.log("🚀 ~ date:", date)

  // notifier.notify({
  //   title: "Task Overdue",
  //   group: `${groupId}-${task.id}`,
  //   message: `Due:${formatDistanceToNow(date)} \r\n ${task.description}`,
  //   dropdownLabel: "Do Something",
  //   wait: true,
  //   actions: actions
  // },
  //   (error, response, metadata) => {
  //     console.log(response, metadata);
  //   }
  // );
}
