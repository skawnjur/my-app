import { useState } from "react";
import "./App.css";

const TOPICS = [
  { name: "Tables, rows and columns", hint: "the basics" },
  { name: "Primary keys", hint: "one unique id per row" },
  { name: "Foreign keys", hint: "link tables together" },
  { name: "One-to-many relationships", hint: "one student, many enrollments" },
  { name: "Many-to-many with a join table", hint: "students and courses" },
  { name: "Normalization (1NF to 3NF)", hint: "remove repeated data" },
  { name: "Indexes", hint: "faster lookups" },
];

function Progress({ done, total }) {
  const pct = Math.round((done / total) * 100);
  return (
    <>
      <div className="bar" role="progressbar" aria-valuenow={pct} aria-valuemin="0" aria-valuemax="100">
        <span style={{ width: pct + "%" }} />
      </div>
      <p>{done} of {total} topics learned</p>
    </>
  );
}

function Topics() {
  const [checked, setChecked] = useState([]);
  const toggle = (i) =>
    setChecked((c) => (c.includes(i) ? c.filter((x) => x !== i) : [...c, i]));
  return (
    <section>
      <h2>What I'm learning</h2>
      <Progress done={checked.length} total={TOPICS.length} />
      <ul className="topics" style={{ marginTop: 12 }}>
        {TOPICS.map((t, i) => (
          <li key={t.name} className={checked.includes(i) ? "done" : ""}>
            <button onClick={() => toggle(i)} aria-pressed={checked.includes(i)}>
              <span className="box">{checked.includes(i) ? "✓" : ""}</span>
              <span className="name">{t.name}</span>
              <span className="hint">{t.hint}</span>
            </button>
          </li>
        ))}
      </ul>
    </section>
  );
}

function Schema() {
  return (
    <section>
      <h2>Example: a school database</h2>
      <div className="tables">
        <table className="pk">
          <caption>students</caption>
          <tbody>
            <tr><td>id</td><td>int</td></tr>
            <tr><td>name</td><td>text</td></tr>
          </tbody>
        </table>
        <table className="pk">
          <caption>courses</caption>
          <tbody>
            <tr><td>id</td><td>int</td></tr>
            <tr><td>title</td><td>text</td></tr>
          </tbody>
        </table>
        <table className="fk">
          <caption>enrollments</caption>
          <tbody>
            <tr><td>student_id</td><td>int</td></tr>
            <tr><td>course_id</td><td>int</td></tr>
          </tbody>
        </table>
      </div>
      <p className="note">
        A student can take many courses and a course has many students, so
        the join table <strong>enrollments</strong> holds one row per pair.
      </p>
    </section>
  );
}

function Log() {
  const [text, setText] = useState("");
  const [entries, setEntries] = useState([]);
  const add = (e) => {
    e.preventDefault();
    const v = text.trim();
    if (!v) return;
    setEntries([v, ...entries]);
    setText("");
  };
  return (
    <section>
      <h2>Today's study log</h2>
      <form onSubmit={add}>
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="What did you learn today?"
          aria-label="Study log entry"
        />
        <button className="btn" type="submit">Add entry</button>
      </form>
      {entries.length === 0 ? (
        <p className="note">No entries yet. Add one above.</p>
      ) : (
        <ul className="log">
          {entries.map((e, i) => <li key={i}>{e}</li>)}
        </ul>
      )}
    </section>
  );
}

function App() {
  return (
    <div className="wrap">
      <header>
        <h1>Database design, one table at a time.</h1>
        <p>A small page to track what I've learned about designing databases, with a sample schema and a daily log.</p>
      </header>
      <Topics />
      <Schema />
      <Log />
 
    </div>
  );
}

export default App;