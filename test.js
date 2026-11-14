<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <title>logic.js checks (do not submit)</title>
</head>
<body>
  <h1>logic.js checks</h1>
  <p>Open the browser Console too (F12) to experiment with the functions yourself.</p>
  <ul id="results"></ul>

  <script src="logic.js"></script>
  <script>
    const out = document.getElementById("results");
    function check(name, ok) {
      const li = document.createElement("li");
      li.textContent = (ok ? "PASS: " : "FAIL: ") + name;
      li.style.color = ok ? "green" : "red";
      out.appendChild(li);
    }
    const same = (a, b) => JSON.stringify(a) === JSON.stringify(b);

    const ids = createIdGenerator();
    const other = createIdGenerator(10);
    check("generators do not share a count", ids() === 1 && other() === 10 && ids() === 2);

    check("valid task has no errors",
      validateTask({ title: " Read ch 3 ", course: "DCIT323", due: "2026-11-20", priority: "high" }).length === 0);
    check("all four fields bad gives 4 errors",
      validateTask({ title: "ab", course: "dcit", due: "nope", priority: "x" }).length === 4);

    const nextId = createIdGenerator();
    const a = createTask({ title: " Read chapter 3 ", course: "DCIT323", due: "2026-11-14", priority: "high" }, nextId);
    const b = createTask({ title: "Lab report", course: "DCIT301", due: "2026-11-20", priority: "low" }, nextId);
    const c = { ...createTask({ title: "Quiz revision", course: "DCIT323", due: "2026-11-12", priority: "medium" }, nextId), done: true };
    const tasks = [a, b, c];
    const before = JSON.stringify(tasks);

    check("createTask trims title and sets done false", a.title === "Read chapter 3" && a.done === false);
    check("addTask puts new task last", addTask(tasks, { id: 9 })[3].id === 9);
    check("toggleTask flips done", toggleTask(tasks, 1)[0].done === true);
    check("toggleTask unknown id returns equal copy", same(toggleTask(tasks, 99), tasks));
    check("deleteTask removes the task", deleteTask(tasks, 1).length === 2);
    check("updateTask cannot change id", updateTask(tasks, 1, { id: 77, title: "New" })[0].id === 1);
    check("isOverdue: not done and past", isOverdue(a, "2026-11-15") === true);
    check("isOverdue: done is never overdue", isOverdue(c, "2026-11-15") === false);
    check("filter by status", filterTasks(tasks, { status: "done", course: "all", query: "" }).length === 1);
    check("filter by course", filterTasks(tasks, { status: "all", course: "DCIT301", query: "" }).length === 1);
    check("filter query ignores case and spaces", filterTasks(tasks, { status: "all", course: "all", query: "  QUIZ " }).length === 1);
    check("filter query of only spaces matches all", filterTasks(tasks, { status: "all", course: "all", query: "   " }).length === 3);
    check("sort by priority", same(sortTasks(tasks, "priority").map(t => t.id), [1, 3, 2]));
    check("sort by due", same(sortTasks(tasks, "due").map(t => t.id), [3, 1, 2]));
    check("sort by title", same(sortTasks(tasks, "title").map(t => t.id), [2, 3, 1]));

    const s = getStats(tasks, "2026-11-15");
    check("getStats numbers", s.total === 3 && s.done === 1 && s.pending === 2 && s.overdue === 1 && s.percentDone === 33);
    check("getStats byCourse", same(s.byCourse, { DCIT323: 2, DCIT301: 1 }));
    check("getStats on empty array", getStats([], "2026-11-15").percentDone === 0);

    check("original tasks array was never changed", JSON.stringify(tasks) === before);
  </script>
</body>
</html>
