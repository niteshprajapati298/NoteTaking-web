import { useEffect, useState } from "react";

interface RawNote {
  _id: string;
  title?: string;
  content?: string;
  text?: string;
  createdAt?: string;
  updatedAt?: string;
}

interface Note {
  _id: string;
  title: string;
  content: string;
  createdAt: string;
  updatedAt?: string;
}

export default function Notes() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [newTitle, setNewTitle] = useState("");
  const [newContent, setNewContent] = useState("");

  // ✅ Normalize raw backend data
  const normalizeNote = (n: RawNote): Note => ({
    _id: n._id,
    title: (n.title ?? "Untitled").trim() || "Untitled",
    content: (n.content ?? n.text ?? "").toString(),
    createdAt: n.createdAt ?? new Date().toISOString(),
    updatedAt: n.updatedAt,
  });

  // ✅ Fetch notes
  const loadNotes = async () => {
    try {
      setLoading(true);
      setError(null);

      const res = await fetch("http://localhost:5000/notes", {
        credentials: "include",
      });

      if (!res.ok) throw new Error("Failed to load notes");

      const data: RawNote[] = await res.json();
      setNotes(data.map(normalizeNote));
    } catch (err) {
      console.error("Error loading notes:", err);
      setError("Could not fetch notes. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadNotes();
  }, []);

  // ✅ Create note
  const createNote = async () => {
    if (!newTitle.trim() && !newContent.trim()) return;

    try {
      setError(null);

      const res = await fetch("http://localhost:5000/notes/createNote", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ title: newTitle, content: newContent }),
      });

      const raw = await res.json();
      console.log("Create response:", raw);

      if (!res.ok || !raw || !raw._id) {
        throw new Error(raw.message || "Invalid response from server");
      }

      setNotes((prev) => [normalizeNote(raw), ...prev]);
      setNewTitle("");
      setNewContent("");
    } catch (err) {
      console.error("Error creating note:", err);
      setError("Failed to create note. Please try again.");
    }
  };

  // ✅ Delete note
  const deleteNote = async (id: string) => {
    try {
      setError(null);

      const res = await fetch(`http://localhost:5000/notes/${id}`, {
        method: "DELETE",
        credentials: "include",
      });

      if (!res.ok) throw new Error("Failed to delete note");

      setNotes((prev) => prev.filter((note) => note._id !== id));
    } catch (err) {
      console.error("Error deleting note:", err);
      setError("Failed to delete note.");
    }
  };

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">My Notes</h1>

      {/* Error */}
      {error && <p className="text-red-500 mb-2">{error}</p>}

      {/* Create Form */}
      <div className="mb-4 space-y-2">
        <input
          className="border w-full p-2 rounded"
          placeholder="Note title"
          value={newTitle}
          onChange={(e) => setNewTitle(e.target.value)}
        />
        <textarea
          className="border w-full p-2 rounded"
          placeholder="Note content"
          value={newContent}
          onChange={(e) => setNewContent(e.target.value)}
        />
        <button
          onClick={createNote}
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          Add Note
        </button>
      </div>

      {/* Notes List */}
      {loading ? (
        <p>Loading notes...</p>
      ) : notes.length === 0 ? (
        <p>No notes yet.</p>
      ) : (
        <ul className="space-y-2">
          {notes.map((note) => (
            <li key={note._id} className="border p-3 rounded shadow-sm">
              <h2 className="font-semibold">{note.title}</h2>
              <p className="text-gray-700">{note.content}</p>
              <button
                onClick={() => deleteNote(note._id)}
                className="text-red-500 mt-2"
              >
                Delete
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
