// logic.js - pure functions for the study planner.
// No document, no console.log, no Date.now(), and no function changes its input.

const PRIORITY_RANK = { high: 0, medium: 1, low: 2 };

// Returns a function that gives the next number each time it is called.
function createIdGenerator(start = 1) {
  let next = start;
  return function () {
    const current = next;
    next += 1;
    return current;
  };
}

// Returns an array of error messages. Empty array means valid.
function validateTask(input) {
  const errors = [];
  const data = input || {};

  const title = typeof data.title === "string" ? data.title.trim() : "";
  if (title.length < 3 || title.length > 60) {
    errors.push("Title must be 3 to 60 characters");
  }

  if (typeof data.course !== "string" || !/^[A-Z]{4}[0-9]{3}$/.test(data.course)) {
    errors.push("Course must be 4 capital letters then 3 digits, e.g. DCIT323");
  }

  if (typeof data.due !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(data.due)) {
    errors.push("Due date must be in YYYY-MM-DD format");
  } else {
    // Reject impossible dates such as 2026-02-31
    const parsed = new Date(data.due + "T00:00:00Z");
    if (Number.isNaN(parsed.getTime()) || parsed.toISOString().slice(0, 10) !== data.due) {
      errors.push("Due date is not a real date");
    }
  }

  if (!Object.prototype.hasOwnProperty.call(PRIORITY_RANK, data.priority)) {
    errors.push("Priority must be low, medium or high");
  }

  return errors;
}

// Builds a task. Does not validate: the caller validates first.
function createTask(input, nextId) {
  return {
    id: nextId(),
    title: input.title.trim(),
    course: input.course,
    due: input.due,
    priority: input.priority,
    done: false
  };
}

function addTask(tasks, task) {
  return [...tasks, task];
}

function toggleTask(tasks, id) {
  return tasks.map(function (task) {
    return task.id === id ? { ...task, done: !task.done } : { ...task };
  });
}

function deleteTask(tasks, id) {
  return tasks.filter(function (task) {
    return task.id !== id;
  });
}

// The id can never be changed, even if changes contains one.
function updateTask(tasks, id, changes) {
  return tasks.map(function (task) {
    return task.id === id ? { ...task, ...changes, id: task.id } : { ...task };
  });
}

function isOverdue(task, today) {
  return !task.done && task.due < today;
}

function filterTasks(tasks, options) {
  const status = options.status || "all";
  const course = options.course || "all";
  const query = (options.query || "").trim().toLowerCase();

  return tasks.filter(function (task) {
    const statusOk =
      status === "all" ||
      (status === "done" && task.done) ||
      (status === "pending" && !task.done);
    const courseOk = course === "all" || task.course === course;
    const queryOk = query === "" || task.title.toLowerCase().includes(query);
    return statusOk && courseOk && queryOk;
  });
}

function compareText(a, b) {
  return a < b ? -1 : a > b ? 1 : 0;
}

// Returns a new sorted array. The original keeps its order.
function sortTasks(tasks, by) {
  const copy = [...tasks];

  copy.sort(function (a, b) {
    if (by === "priority") {
      return (
        PRIORITY_RANK[a.priority] - PRIORITY_RANK[b.priority] ||
        compareText(a.due, b.due) ||
        compareText(a.title.toLowerCase(), b.title.toLowerCase())
      );
    }
    if (by === "title") {
      return (
        compareText(a.title.toLowerCase(), b.title.toLowerCase()) ||
        compareText(a.due, b.due)
      );
    }
    // "due" (default): earliest first, ties by title
    return (
      compareText(a.due, b.due) ||
      compareText(a.title.toLowerCase(), b.title.toLowerCase())
    );
  });

  return copy;
}

function getStats(tasks, today) {
  const total = tasks.length;
  const stats = tasks.reduce(
    function (acc, task) {
      if (task.done) {
        acc.done += 1;
      }
      if (isOverdue(task, today)) {
        acc.overdue += 1;
      }
      acc.byCourse[task.course] = (acc.byCourse[task.course] || 0) + 1;
      return acc;
    },
    { done: 0, overdue: 0, byCourse: {} }
  );

  return {
    total: total,
    done: stats.done,
    pending: total - stats.done,
    overdue: stats.overdue,
    percentDone: total === 0 ? 0 : Math.round((stats.done / total) * 100),
    byCourse: stats.byCourse
  };
}
