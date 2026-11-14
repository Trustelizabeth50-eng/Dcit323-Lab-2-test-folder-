// app.js - the page. All data changes go through the functions in logic.js.

const state = {
  tasks: [],
  filter: { status: "all", course: "all", query: "" },
  sortBy: "due"
};

// Allowed global: the id generator made with createIdGenerator.
const nextId = createIdGenerator();

// Short helper to find an element by id.
function $(id) {
  return document.getElementById(id);
}

// Today's date comes from this one place only.
function getToday() {
  return new Date().toISOString().slice(0, 10);
}

// Small helper to build an element with text (never innerHTML).
function makeElement(tag, text, className) {
  const element = document.createElement(tag);
  if (text !== undefined) {
    element.textContent = text;
  }
  if (className) {
    element.className = className;
  }
  return element;
}

function clearErrors() {
  $("errors").textContent = "";
}

function showErrors(messages) {
  clearErrors();
  messages.forEach(function (message) {
    $("errors").appendChild(makeElement("p", message));
  });
}

function readForm() {
  return {
    title: $("title").value,
    course: $("course").value.trim(),
    due: $("due").value,
    priority: $("priority").value
  };
}

// Rebuilds the course dropdown so it lists only courses that appear in the tasks.
function renderCourseOptions(courses) {
  const select = $("filter-course");

  // If the selected course no longer exists, fall back to "all".
  if (state.filter.course !== "all" && !courses.includes(state.filter.course)) {
    state.filter.course = "all";
  }

  select.textContent = "";
  const allOption = makeElement("option", "all");
  allOption.value = "all";
  select.appendChild(allOption);

  courses.forEach(function (course) {
    const option = makeElement("option", course);
    option.value = course;
    select.appendChild(option);
  });

  select.value = state.filter.course;
}

function buildTaskItem(task, today) {
  const item = makeElement("li");
  item.dataset.id = String(task.id);

  if (task.done) {
    item.classList.add("done");
    item.style.textDecoration = "line-through";
  }
  if (isOverdue(task, today)) {
    item.classList.add("overdue");
    item.style.color = "crimson";
  }

  item.appendChild(makeElement("span", task.title, "task-title"));
  item.appendChild(document.createTextNode(" | "));
  item.appendChild(makeElement("span", task.course, "task-course"));
  item.appendChild(document.createTextNode(" | due "));
  item.appendChild(makeElement("span", task.due, "task-due"));
  item.appendChild(document.createTextNode(" | "));
  item.appendChild(makeElement("span", task.priority, "task-priority priority-" + task.priority));
  item.appendChild(document.createTextNode(" "));

  if (isOverdue(task, today)) {
    item.appendChild(makeElement("strong", "[OVERDUE] "));
  }

  const doneButton = makeElement("button", "Done");
  doneButton.type = "button";
  doneButton.dataset.action = "done";
  item.appendChild(doneButton);

  const deleteButton = makeElement("button", "Delete");
  deleteButton.type = "button";
  deleteButton.dataset.action = "delete";
  item.appendChild(deleteButton);

  return item;
}

function renderStats(stats) {
  const box = $("stats");
  box.textContent = "";

  const rows = [
    ["Total", "total", stats.total, ""],
    ["Done", "done", stats.done, ""],
    ["Pending", "pending", stats.pending, ""],
    ["Overdue", "overdue", stats.overdue, ""],
    ["Complete", "percentDone", stats.percentDone, "%"]
  ];

  rows.forEach(function (row) {
    const paragraph = makeElement("p");
    paragraph.appendChild(document.createTextNode(row[0] + ": "));
    const number = makeElement("span", String(row[2]));
    number.dataset.stat = row[1];
    paragraph.appendChild(number);
    if (row[3]) {
      paragraph.appendChild(document.createTextNode(row[3]));
    }
    box.appendChild(paragraph);
  });
}

// The one render function: clears the list and stats, then draws them from state.
function render() {
  const today = getToday();
  const stats = getStats(state.tasks, today);

  renderCourseOptions(Object.keys(stats.byCourse).sort());

  const visible = sortTasks(filterTasks(state.tasks, state.filter), state.sortBy);

  const list = $("task-list");
  list.textContent = "";

  if (state.tasks.length === 0) {
    list.appendChild(makeElement("li", "No tasks yet. Add your first task above.", "empty"));
  } else if (visible.length === 0) {
    list.appendChild(makeElement("li", "No tasks match your filters.", "empty"));
  } else {
    visible.forEach(function (task) {
      list.appendChild(buildTaskItem(task, today));
    });
  }

  renderStats(stats);
}

function handleSubmit(event) {
  event.preventDefault();
  const input = readForm();
  const errors = validateTask(input);

  if (errors.length > 0) {
    showErrors(errors); // keep what the user typed
    return;
  }

  state.tasks = addTask(state.tasks, createTask(input, nextId));
  $("task-form").reset();
  clearErrors();
  render();
}

function handleFormKeydown(event) {
  if (event.key === "Escape") {
    $("task-form").reset();
    clearErrors();
  } else if (event.key === "Enter" && (event.target.tagName === "INPUT" || event.target.tagName === "SELECT")) {
    event.preventDefault();
    $("task-form").requestSubmit();
  }
}

// One listener for the whole list: event.target tells us which button and which task.
function handleListClick(event) {
  const button = event.target.closest("button[data-action]");
  if (!button) {
    return;
  }
  const item = button.closest("li[data-id]");
  if (!item) {
    return;
  }
  const id = Number(item.dataset.id);

  if (button.dataset.action === "done") {
    state.tasks = toggleTask(state.tasks, id);
  } else if (button.dataset.action === "delete") {
    state.tasks = deleteTask(state.tasks, id);
  }
  render();
}

function init() {
  $("task-form").addEventListener("submit", handleSubmit);
  $("task-form").addEventListener("keydown", handleFormKeydown);
  $("task-list").addEventListener("click", handleListClick);

  $("filter-status").addEventListener("change", function (event) {
    state.filter.status = event.target.value;
    render();
  });
  $("filter-course").addEventListener("change", function (event) {
    state.filter.course = event.target.value;
    render();
  });
  $("search").addEventListener("input", function (event) {
    state.filter.query = event.target.value;
    render();
  });
  $("sort-by").addEventListener("change", function (event) {
    state.sortBy = event.target.value;
    render();
  });

  render();
}

init();
