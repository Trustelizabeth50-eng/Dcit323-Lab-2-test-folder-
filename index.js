<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Study Planner</title>
  <!-- STAND-IN for the practice repo. The real starter index.html from LabClassroom has the same ids. Styling is not marked. -->
  <style>
    :root {
      --bg: #f3f4fb;
      --card: #ffffff;
      --text: #1f2340;
      --muted: #6b7090;
      --accent: #5b5fe9;
      --accent-dark: #4347c9;
      --border: #e1e3f2;
      --danger: #dc2f55;
      --ok: #1f9d6b;
    }
    * { box-sizing: border-box; }
    body {
      margin: 0;
      padding: 32px 16px 48px;
      background: var(--bg);
      color: var(--text);
      font-family: system-ui, -apple-system, "Segoe UI", Roboto, sans-serif;
      line-height: 1.5;
    }
    h1 {
      max-width: 760px;
      margin: 0 auto 20px;
      font-size: 2rem;
      letter-spacing: -0.02em;
    }
    h2 {
      margin: 0 0 12px;
      font-size: 1.05rem;
      text-transform: uppercase;
      letter-spacing: 0.06em;
      color: var(--muted);
    }
    form, #errors:not(:empty), .panel {
      max-width: 760px;
      margin: 0 auto 20px;
      background: var(--card);
      border: 1px solid var(--border);
      border-radius: 14px;
      padding: 20px;
      box-shadow: 0 2px 8px rgba(31, 35, 64, 0.05);
    }
    form {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 14px 16px;
    }
    form p { margin: 0; }
    form p:first-child { grid-column: 1 / -1; }
    label { display: block; font-size: 0.85rem; font-weight: 600; color: var(--muted); }
    label input, label select { margin-top: 4px; }
    input, select {
      width: 100%;
      padding: 10px 12px;
      font: inherit;
      color: var(--text);
      background: #fff;
      border: 1px solid var(--border);
      border-radius: 8px;
    }
    input:focus, select:focus {
      outline: 2px solid var(--accent);
      outline-offset: 1px;
    }
    button {
      font: inherit;
      font-weight: 600;
      cursor: pointer;
      border: none;
      border-radius: 8px;
      padding: 9px 16px;
      background: var(--accent);
      color: #fff;
      transition: background 0.15s;
    }
    button:hover { background: var(--accent-dark); }
    form button { grid-column: 1 / -1; padding: 12px; }
    #errors:not(:empty) {
      background: #fff1f4;
      border-color: #f6c0cc;
    }
    #errors p { margin: 2px 0; color: var(--danger); font-weight: 500; }
    #errors p::before { content: "! "; font-weight: 700; }

    .filters {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
      gap: 14px;
    }
    .filters p { margin: 0; display: contents; }

    #task-list {
      list-style: none;
      margin: 0;
      padding: 0;
      display: grid;
      gap: 10px;
    }
    #task-list li {
      padding: 14px 16px;
      background: #fafbff;
      border: 1px solid var(--border);
      border-left: 5px solid var(--accent);
      border-radius: 10px;
      color: var(--muted);
    }
    #task-list li.overdue { border-left-color: var(--danger); background: #fff6f8; }
    #task-list li.done { border-left-color: var(--ok); background: #f3fbf7; opacity: 0.8; }
    #task-list li.empty {
      border: 2px dashed var(--border);
      background: transparent;
      text-align: center;
      padding: 28px 16px;
      color: var(--muted);
    }
    .task-title { font-weight: 700; color: var(--text); font-size: 1.05rem; }
    .task-course { font-weight: 600; color: var(--accent-dark); }
    .task-priority {
      display: inline-block;
      padding: 1px 10px;
      border-radius: 999px;
      font-size: 0.8rem;
      font-weight: 700;
      background: #e8e9f7;
      color: var(--muted);
    }
    .priority-high { background: #fde3ea; color: var(--danger); }
    .priority-medium { background: #fff1d6; color: #b36b00; }
    .priority-low { background: #def5ea; color: var(--ok); }
    #task-list button { padding: 5px 12px; font-size: 0.85rem; margin-top: 8px; margin-right: 6px; }
    #task-list button[data-action="delete"] { background: #fff; color: var(--danger); border: 1px solid #f0b8c4; }
    #task-list button[data-action="delete"]:hover { background: #fff1f4; }

    #stats { display: grid; grid-template-columns: repeat(auto-fit, minmax(110px, 1fr)); gap: 12px; }
    #stats p {
      margin: 0;
      padding: 12px;
      text-align: center;
      font-size: 0.8rem;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      color: var(--muted);
      background: #fafbff;
      border: 1px solid var(--border);
      border-radius: 10px;
    }
    #stats [data-stat] {
      display: block;
      font-size: 1.8rem;
      font-weight: 800;
      letter-spacing: 0;
      color: var(--accent-dark);
    }
    @media (max-width: 560px) {
      form { grid-template-columns: 1fr; }
    }
  </style>
</head>
<body>
  <h1>Study Planner</h1>

  <form id="task-form">
    <p>
      <label>Title <input id="title" type="text" placeholder="e.g. Read chapter 3"></label>
    </p>
    <p>
      <label>Course <input id="course" type="text" placeholder="DCIT323"></label>
    </p>
    <p>
      <label>Due <input id="due" type="date"></label>
    </p>
    <p>
      <label>Priority
        <select id="priority">
          <option value="low">low</option>
          <option value="medium" selected>medium</option>
          <option value="high">high</option>
        </select>
      </label>
    </p>
    <button type="submit">Add task</button>
  </form>

  <div id="errors"></div>

  <section class="panel">
    <h2>Filters</h2>
    <p class="filters">
      <label>Status
        <select id="filter-status">
          <option value="all">all</option>
          <option value="pending">pending</option>
          <option value="done">done</option>
        </select>
      </label>
      <label>Course
        <select id="filter-course">
          <option value="all">all</option>
        </select>
      </label>
      <label>Search <input id="search" type="search" placeholder="Search titles"></label>
      <label>Sort by
        <select id="sort-by">
          <option value="due">due</option>
          <option value="priority">priority</option>
          <option value="title">title</option>
        </select>
      </label>
    </p>
  </section>

  <section class="panel">
    <h2>Tasks</h2>
    <ul id="task-list"></ul>
  </section>

  <section class="panel">
    <h2>Stats</h2>
    <div id="stats"></div>
  </section>

  <script src="logic.js"></script>
  <script src="app.js"></script>
</body>
</html>
