"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { usePrograms } from "@/app/lib/ProgramsContext";
import { useAuth } from "@/app/lib/AuthContext";
import { getInitials } from "@/app/lib/initials";
import { programCategories } from "@/app/lib/programsData";
import { readWorkbookRows, parseProgramRows } from "@/app/lib/spreadsheetImport";
import { BackIcon } from "@/app/components/admin/AdminIcons";

const MAX_BYTES = 8 * 1024 * 1024;

function slugify(name) {
  const base = name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
  return `${base || "program"}-${Date.now().toString(36)}`;
}

export default function ProgramImportScreen() {
  const router = useRouter();
  const { programs, createProgram, overwriteProgramWeeks } = usePrograms();
  const { user } = useAuth();

  const [mode, setMode] = useState("create"); // "create" | "update"
  const [targetId, setTargetId] = useState(programs[0]?.id || "");
  const [fileName, setFileName] = useState("");
  const [fileError, setFileError] = useState("");
  const [parsing, setParsing] = useState(false);
  const [parsed, setParsed] = useState(null); // { weeks, errors, duration, sessionsPerWeek, programName }
  const [programName, setProgramName] = useState("");
  const [category, setCategory] = useState(programCategories[0]);
  const [difficulty, setDifficulty] = useState("Beginner");
  const [imported, setImported] = useState(false);

  const reset = () => {
    setFileName("");
    setFileError("");
    setParsed(null);
    setImported(false);
  };

  const handleFile = async (e) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    reset();

    const isSpreadsheet = /\.(xlsx|xls|csv)$/i.test(file.name);
    if (!isSpreadsheet) {
      setFileError("Choose a .xlsx or .csv file.");
      return;
    }
    if (file.size > MAX_BYTES) {
      setFileError("File is too large (max 8MB).");
      return;
    }

    setFileName(file.name);
    setParsing(true);
    try {
      const rows = await readWorkbookRows(file);
      const result = parseProgramRows(rows);
      setParsed(result);
      if (result.programName) setProgramName(result.programName);
    } catch (err) {
      setFileError(err.message || "Couldn't read that file.");
    } finally {
      setParsing(false);
    }
  };

  const hasErrors = Boolean(parsed?.errors?.length);
  const hasPreview = Boolean(parsed && !hasErrors && parsed.weeks.length > 0);
  const canConfirm =
    hasPreview && (mode === "create" ? programName.trim().length > 0 : Boolean(targetId));

  const handleConfirm = () => {
    if (!canConfirm) return;
    if (mode === "create") {
      const newProgram = {
        id: slugify(programName),
        title: programName.trim(),
        category,
        duration: parsed.duration,
        difficulty,
        shortDescription: `Imported ${parsed.duration}-week program.`,
        fullDescription: `${programName.trim()} — imported from a spreadsheet. Edit this description from the admin program editor.`,
        coach: {
          name: user?.firstName || "Coach",
          initials: getInitials({ firstName: user?.firstName, email: user?.email }) || "CO",
          title: "Program Coach",
          bio: "",
        },
        enrolledCount: 0,
        sessionsPerWeek: parsed.sessionsPerWeek,
        joined: false,
        currentWeek: 0,
        weeks: parsed.weeks,
      };
      createProgram(newProgram);
      setImported(true);
      setTimeout(() => router.push(`/admin/${newProgram.id}`), 900);
    } else {
      overwriteProgramWeeks(targetId, {
        weeks: parsed.weeks,
        duration: parsed.duration,
        sessionsPerWeek: parsed.sessionsPerWeek,
      });
      setImported(true);
      setTimeout(() => router.push(`/admin/${targetId}`), 900);
    }
  };

  return (
    <div>
      <button onClick={() => router.push("/admin")} className="flex items-center gap-2 text-sm text-zinc-400 hover:text-white">
        <BackIcon /> Programs
      </button>
      <h1 className="mt-3 text-xl font-extrabold text-white">Import from Spreadsheet</h1>
      <p className="mt-1 text-sm text-zinc-500">
        Upload a .xlsx or .csv with columns Week, Day, Exercise, Sets, Reps, Rest, RPE, Notes.
      </p>

      <div className="mt-5 flex gap-2">
        <button
          type="button"
          onClick={() => setMode("create")}
          className={`flex-1 rounded-full py-2.5 text-xs font-bold transition ${
            mode === "create" ? "bg-rival-red text-white" : "border border-border-subtle text-zinc-400"
          }`}
        >
          Create New Program
        </button>
        <button
          type="button"
          onClick={() => setMode("update")}
          className={`flex-1 rounded-full py-2.5 text-xs font-bold transition ${
            mode === "update" ? "bg-rival-red text-white" : "border border-border-subtle text-zinc-400"
          }`}
        >
          Update Existing
        </button>
      </div>

      {mode === "update" && (
        <div className="mt-4">
          <label className="text-xs font-medium text-zinc-400" htmlFor="target-program">
            Program to update
          </label>
          <select
            id="target-program"
            value={targetId}
            onChange={(e) => setTargetId(e.target.value)}
            className="mt-1.5 w-full rounded-xl border border-border-subtle bg-surface px-3 py-2.5 text-sm text-white focus:border-rival-red focus:outline-none"
          >
            {programs.map((p) => (
              <option key={p.id} value={p.id}>
                {p.title}
              </option>
            ))}
          </select>
        </div>
      )}

      {mode === "create" && (
        <div className="mt-4 space-y-3">
          <div>
            <label className="text-xs font-medium text-zinc-400" htmlFor="program-name">
              Program name
            </label>
            <input
              id="program-name"
              value={programName}
              onChange={(e) => setProgramName(e.target.value)}
              placeholder="e.g. Marathon Base Building"
              className="mt-1.5 w-full rounded-xl border border-border-subtle bg-surface px-3 py-2.5 text-sm text-white placeholder:text-zinc-600 focus:border-rival-red focus:outline-none"
            />
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="text-xs font-medium text-zinc-400" htmlFor="program-category">
                Category
              </label>
              <select
                id="program-category"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="mt-1.5 w-full rounded-xl border border-border-subtle bg-surface px-3 py-2.5 text-sm text-white focus:border-rival-red focus:outline-none"
              >
                {programCategories.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-xs font-medium text-zinc-400" htmlFor="program-difficulty">
                Difficulty
              </label>
              <select
                id="program-difficulty"
                value={difficulty}
                onChange={(e) => setDifficulty(e.target.value)}
                className="mt-1.5 w-full rounded-xl border border-border-subtle bg-surface px-3 py-2.5 text-sm text-white focus:border-rival-red focus:outline-none"
              >
                {["Beginner", "Intermediate", "Advanced"].map((d) => (
                  <option key={d} value={d}>
                    {d}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      )}

      <div className="mt-5">
        <input type="file" accept=".xlsx,.xls,.csv" id="program-file" className="hidden" onChange={handleFile} />
        <label
          htmlFor="program-file"
          className="flex min-h-11 w-full cursor-pointer items-center justify-center rounded-xl border border-dashed border-zinc-700 bg-surface px-3 text-sm font-semibold text-zinc-300 hover:border-zinc-500"
        >
          {fileName || "Choose spreadsheet file…"}
        </label>
        {fileError && <p className="mt-1.5 text-xs text-rival-red">{fileError}</p>}
        {parsing && <p className="mt-1.5 text-xs text-zinc-500">Reading file…</p>}
      </div>

      {hasErrors && (
        <div className="mt-4 rounded-xl border border-rival-red/40 bg-rival-red/10 p-3">
          <p className="text-xs font-bold text-rival-red">
            {parsed.errors.length} issue{parsed.errors.length === 1 ? "" : "s"} found — fix and re-upload:
          </p>
          <ul className="mt-2 space-y-1">
            {parsed.errors.map((err, i) => (
              <li key={i} className="text-xs text-zinc-300">
                {err}
              </li>
            ))}
          </ul>
        </div>
      )}

      {hasPreview && (
        <div className="mt-4">
          <div className="flex items-center justify-between">
            <p className="text-sm font-bold text-white">Preview</p>
            <p className="text-xs text-zinc-500">
              {parsed.duration} weeks · {parsed.sessionsPerWeek}
            </p>
          </div>
          <div className="mt-2 max-h-96 space-y-3 overflow-y-auto rounded-xl border border-border-subtle bg-surface p-3">
            {parsed.weeks.map((week) => (
              <div key={week.week}>
                <p className="text-xs font-bold uppercase tracking-wide text-rival-red">{week.title}</p>
                <div className="mt-1.5 space-y-2">
                  {week.days.map((day) => (
                    <div key={day.day} className="rounded-lg border border-border-subtle bg-black p-2.5">
                      <p className="text-xs font-semibold text-white">{day.label}</p>
                      <ul className="mt-1 space-y-1">
                        {day.exercises.map((ex, i) => (
                          <li key={i} className="text-[11px] text-zinc-400">
                            {ex.name}
                            {ex.sets != null && ` · ${ex.sets} sets`}
                            {ex.reps && ` · ${ex.reps} reps`}
                            {ex.rest && ` · rest ${ex.rest}`}
                            {ex.rpe && ` · RPE ${ex.rpe}`}
                            {ex.notes && ` — ${ex.notes}`}
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <button
            type="button"
            onClick={handleConfirm}
            disabled={!canConfirm}
            className="mt-4 w-full rounded-full bg-rival-red py-3 text-sm font-extrabold tracking-wide text-white disabled:opacity-40"
          >
            {mode === "create" ? "Create Program" : "Overwrite Program"}
          </button>
        </div>
      )}

      {imported && (
        <p className="mt-3 text-center text-xs font-semibold text-emerald-400">
          {mode === "create" ? "Program created ✓" : "Program updated ✓"}
        </p>
      )}
    </div>
  );
}
