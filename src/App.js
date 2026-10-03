import { useState } from "react";
import useLocalStorage from "./useLocalStorage";
import { BrowserRouter, Routes, Route, NavLink } from "react-router-dom";
import Quiz from "./quiz";

const TOPICS = [
  { name: "Tables, rows and columns", hint: "the basics" },
  { name: "Primary keys", hint: "one unique id per row" },
  { name: "Foreign keys", hint: "link tables together" },
  { name: "One-to-many relationships", hint: "one student, many enrollments" },
  { name: "Many-to-many with a join table", hint: "students and courses" },
  { name: "Normalization (1NF to 3NF)", hint: "remove repeated data" },
  { name: "Indexes", hint: "faster lookups" },
];

const focusRing =
  "focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-sun";

function Section({ title, children }) {
  return (
    <section className="py-8 border-t-2 border-ink">
      <h2 className="font-serif text-2xl mb-3">{title}</h2>
      {children}
    </section>
  );
}

function Progress({ done, total }) {
  const pct = Math.round((done / total) * 100);
  return (
    <>
      <div
        className="h-2.5 bg-line mt-5 mb-2"
        role="progressbar"
        aria-valuenow={pct}
        aria-valuemin="0"
        aria-valuemax="100"
      >
        <div
          className="h-full bg-teal transition-[width] duration-300"
          style={{ width: pct + "%" }}
        />
      </div>
      <p>{done} of {total} topics learned</p>
    </>
  );
}

function Topics() {
 const [checked, setChecked] = useLocalStorage("topics-checked", []);
  const toggle = (i) =>
    setChecked((c) => (c.includes(i) ? c.filter((x) => x !== i) : [...c, i]));

  return (
    <Section title="What I'm learning">
      <Progress done={checked.length} total={TOPICS.length} />
      <ul className="mt-3 bg-white border border-line">
        {TOPICS.map((t, i) => {
          const done = checked.includes(i);
          return (
            <li key={t.name} className="border-b border-line last:border-b-0">
              <button
                onClick={() => toggle(i)}
                aria-pressed={done}
                className={`w-full flex items-center gap-3.5 px-4 py-3.5 text-left hover:bg-slate-50 [&:focus-visible]:[outline-offset:-3px] ${focusRing}`}
              >
                <span
                  className={`w-[22px] h-[22px] shrink-0 grid place-items-center border-2 font-bold ${
                    done ? "bg-teal border-teal text-white" : "border-ink"
                  }`}
                >
                  {done ? "✓" : ""}
                </span>
                <span className={done ? "line-through opacity-60" : ""}>
                  {t.name}
                </span>
                <span className="ml-auto text-sm opacity-70">{t.hint}</span>
              </button>
            </li>
          );
        })}
      </ul>
    </Section>
  );
}

function DbTable({ name, rows }) {
  return (
    <table className="w-full border-collapse bg-white border border-ink text-sm">
      <caption className="text-left font-bold px-2.5 py-2 bg-ink text-white">
        {name}
      </caption>
      <tbody>
        {rows.map((r) => (
          <tr key={r.col}>
            <td className="px-2.5 py-1.5 border-t border-line">
              {r.key && (
                <span
                  className={`mr-1 text-xs font-bold ${
                    r.key === "PK" ? "text-teal" : "text-amber-700"
                  }`}
                >
                  {r.key}
                </span>
              )}
              <span className={r.key === "PK" ? "font-bold" : ""}>{r.col}</span>
            </td>
            <td className="px-2.5 py-1.5 border-t border-line text-right opacity-60">
              {r.type}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

function Schema() {
  return (
    <Section title="Example: a school database">
      <div className="grid gap-4 grid-cols-[repeat(auto-fit,minmax(210px,1fr))]">
        <DbTable
          name="students"
          rows={[
            { col: "id", type: "int", key: "PK" },
            { col: "name", type: "text" },
          ]}
        />
        <DbTable
          name="courses"
          rows={[
            { col: "id", type: "int", key: "PK" },
            { col: "title", type: "text" },
          ]}
        />
        <DbTable
          name="enrollments"
          rows={[
            { col: "student_id", type: "int", key: "FK" },
            { col: "course_id", type: "int", key: "FK" },
          ]}
        />
      </div>
      <p className="mt-3.5 text-[.95rem]">
        A student can take many courses and a course has many students, so the
        join table <strong>enrollments</strong> holds one row per pair.
      </p>
    </Section>
  );
}

function Log() {
  const [text, setText] = useState("");
  const [entries, setEntries] = useLocalStorage("log-entries", []);

  const add = (e) => {
    e.preventDefault();
    const v = text.trim();
    if (!v) return;
    setEntries([v, ...entries]);
    setText("");
  };

  const remove = (i) => setEntries(entries.filter((_, idx) => idx !== i));

  return (
    <Section title="Today's study log">
      <form onSubmit={add} className="flex flex-wrap gap-2">
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="What did you learn today?"
          aria-label="Study log entry"
          className={`flex-[1_1_200px] px-3 py-2.5 bg-white border-2 border-ink ${focusRing}`}
        />
        <button
          type="submit"
          className={`px-[18px] py-2.5 font-bold bg-sun border-2 border-ink cursor-pointer ${focusRing}`}
        >
          Add entry
        </button>
      </form>
      {entries.length === 0 ? (
        <p className="mt-3.5 text-[.95rem]">No entries yet. Add one above.</p>
      ) : (
        <ul className="mt-4 pl-5 list-disc">
          {entries.map((e, i) => (
          <li key={i} className="mb-1">
  {e}
  <button
    onClick={() => remove(i)}
    aria-label={`Delete entry: ${e}`}
    className={`ml-3 text-sm underline text-ink/70 hover:text-ink ${focusRing}`}
  >
    Delete
  </button>
</li>
          ))}
        </ul>
      )}
    </Section>
  );
}

function Home() {
  return (
    <div className="max-w-3xl mx-auto px-5">
      <header className="pt-16 pb-8">
        <h1 className="font-serif text-4xl sm:text-6xl leading-tight">
          Database design, one table at a time.
        </h1>
        <p className="mt-4 max-w-[52ch] text-lg">
          A small page to track what I've learned about designing databases,
          with a sample schema and a daily log.
        </p>
      </header>
      <Topics />
      <Schema />
      <Log />
      <footer className="pt-8 pb-14 text-sm opacity-70">
        Built with React and Tailwind CSS.
      </footer>
    </div>
  );
}
console.log(typeof Quiz, typeof Home, typeof NavLink, typeof Routes, typeof BrowserRouter);
const navClass = ({ isActive }) =>
  isActive
    ? "underline decoration-4 decoration-sun underline-offset-4"
    : "opacity-70 hover:opacity-100";

function App() {
  return (
    <BrowserRouter>
      <nav className="max-w-3xl mx-auto px-5 pt-6 flex gap-6 font-bold">
        <NavLink to="/" end className={navClass}>Notes</NavLink>
        <NavLink to="/quiz" className={navClass}>Quiz</NavLink>
      </nav>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/quiz" element={<Quiz />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;