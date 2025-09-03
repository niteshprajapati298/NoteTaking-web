import React, { useEffect, useMemo, useState } from "react";
import { Trash2, Plus, X } from "lucide-react";

interface User {
  id: string;
  email: string;
  name: string;
  dateOfBirth: string;
}

type RawNote = {
  _id: string;
  title?: string;
  content?: string;
  text?: string;
  createdAt?: string;
  updatedAt?: string;
};

interface Note {
  _id: string;
  title: string;
  content: string;
  createdAt: string;
  updatedAt?: string;
}

interface NotesProps {
  user: User;
  onLogout: () => void;
}

const API_BASE = "https://notetaking-backend-efiw.onrender.com";

const normalizeNote = (n: RawNote): Note => ({
  _id: n._id,
  title: (n.title ?? "Untitled").trim() || "Untitled",
  content: (n.content ?? n.text ?? "").toString(),
  createdAt: n.createdAt ?? new Date().toISOString(),
  updatedAt: n.updatedAt,
});

const Notes: React.FC<NotesProps> = ({ user, onLogout }) => {
  const [notes, setNotes] = useState<Note[]>([]);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [selected, setSelected] = useState<Note | null>(null);
  const [viewerOpen, setViewerOpen] = useState(false);

  const [message, setMessage] = useState<{ text: string; type: "success" | "error" } | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<Note | null>(null);

  const hasNotes = useMemo(() => notes.length > 0, [notes]);

  const showMessage = (text: string, type: "success" | "error" = "success") => {
    setMessage({ text, type });
    setTimeout(() => setMessage(null), 3000);
  };

  const loadNotes = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${API_BASE}/notes`, { credentials: "include" });
      const data = await res.json();

      if (!res.ok || !Array.isArray(data)) {
        throw new Error("Failed to load notes");
      }

      setNotes(data.map(normalizeNote));
    } catch (e) {
      console.error("Error loading notes:", e);
      showMessage("Could not load notes. Please refresh.", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadNotes();
  }, []);

  const createNote = async () => {
    if (!title.trim() || !content.trim()) return;
    setCreating(true);
    try {
      const res = await fetch(`${API_BASE}/notes/createNote`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ title, content }),
      });

      const raw = await res.json();

      if (!res.ok || !raw || !raw._id) {
        throw new Error("Invalid response from server");
      }

      setNotes((prev) => [normalizeNote(raw), ...prev]);
      setTitle("");
      setContent("");
      showMessage("Note created successfully!");
    } catch (e) {
      console.error("Error creating note:", e);
      showMessage("Failed to create note.", "error");
    } finally {
      setCreating(false);
    }
  };

  const confirmDelete = (note: Note) => {
    setDeleteConfirm(note);
  };

  const deleteNote = async (id: string) => {
    try {
      const res = await fetch(`${API_BASE}/notes/${id}`, {
        method: "DELETE",
        credentials: "include",
      });

      if (!res.ok) throw new Error("Failed to delete note");

      setNotes((prev) => prev.filter((n) => n._id !== id));
      if (selected?._id === id) {
        setViewerOpen(false);
        setSelected(null);
      }
      showMessage("Note deleted successfully!");
    } catch (e) {
      console.error("Error deleting note:", e);
      showMessage("Failed to delete note.", "error");
    } finally {
      setDeleteConfirm(null);
    }
  };

  const openViewer = (note: Note) => {
    setSelected(note);
    setViewerOpen(true);
  };

  const closeViewer = () => {
    setViewerOpen(false);
    setSelected(null);
  };

  return (
    <div className="h-screen flex flex-col p-6 max-w-3xl mx-auto">
      {/* message bar */}
      {message && (
        <div
          className={`mb-4 p-3 rounded-lg text-white text-sm ${
            message.type === "success" ? "bg-green-500" : "bg-red-500"
          }`}
        >
          {message.text}
        </div>
      )}

      {/* header */}
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 rounded-full flex items-center justify-center">
            <img src="/Logo.png" alt="Logo" className="w-6 h-6 bg-white rounded-full" />
          </div>
          <span className="font-bold text-xl">Dashboard</span>
        </div>
        <button className="text-blue-600 hover:underline" onClick={onLogout}>
          Sign Out
        </button>
      </div>

      {/* user info */}
      <div className="bg-white shadow rounded-lg p-4 mb-5">
        <h2 className="font-semibold text-gray-800">Welcome, {user.name}!</h2>
        <p className="text-gray-500 text-sm">Email: {user.email}</p>
      </div>

      {/* create note */}
      <div className="mb-6">
        <div className="space-y-2">
          <input
            type="text"
            placeholder="Note title..."
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && createNote()}
            className="w-full border px-3 py-2 rounded-lg"
          />
          <textarea
            placeholder="Note content..."
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows={3}
            className="w-full border px-3 py-2 rounded-lg resize-y"
          />
          <button
            onClick={createNote}
            disabled={creating || !title.trim() || !content.trim()}
            className="w-full bg-blue-500 text-white py-2 rounded-lg flex items-center justify-center gap-2 disabled:opacity-50"
          >
            <Plus size={18} />
            {creating ? "Creating..." : "Create Note"}
          </button>
        </div>
      </div>

      {/* notes list */}
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-lg font-semibold">Notes ({notes.length})</h3>
        <button
          onClick={loadNotes}
          className="text-blue-600 hover:text-blue-800 text-sm font-medium"
        >
          Refresh
        </button>
      </div>

      <div className="flex-1 overflow-y-auto space-y-3">
        {loading ? (
          <div className="flex items-center justify-center py-12 text-gray-600">
            Loading notes...
          </div>
        ) : !hasNotes ? (
          <div className="bg-white rounded-lg shadow p-8 text-center text-gray-600">
            No notes yet. Create your first note above.
          </div>
        ) : (
          notes.map((note) => (
            <button
              key={note._id}
              onClick={() => openViewer(note)}
              className="w-full text-left bg-white rounded-lg shadow p-4 hover:shadow-md transition-shadow group"
            >
              <div className="flex items-start justify-between">
                <div className="pr-3">
                  <h4 className="font-medium text-gray-900">{note.title}</h4>
                  <p className="text-gray-600 text-sm line-clamp-2 whitespace-pre-wrap">
                    {note.content}
                  </p>
                </div>
                <div
                  onClick={(e) => {
                    e.stopPropagation();
                    confirmDelete(note);
                  }}
                  title="Delete note"
                  className="text-red-500 hover:text-red-700 p-2 rounded-lg"
                >
                  <Trash2 size={18} />
                </div>
              </div>
              <div className="mt-2 text-xs text-gray-500">
                {new Date(note.createdAt).toLocaleDateString()} •{" "}
                {new Date(note.createdAt).toLocaleTimeString()}
              </div>
            </button>
          ))
        )}
      </div>

      {/* note viewer */}
      {viewerOpen && selected && (
        <div className="fixed inset-0 z-50 flex items-center justify-center" role="dialog" aria-modal="true">
          <div className="absolute inset-0 bg-black/40" onClick={closeViewer} />
          <div className="relative z-10 w-[92vw] max-w-2xl max-h-[85vh] overflow-hidden rounded-2xl bg-white shadow-2xl">
            <div className="flex items-center justify-between border-b px-5 py-3">
              <h3 className="font-semibold text-gray-900 truncate pr-4">
                {selected.title}
              </h3>
              <button
                onClick={closeViewer}
                className="p-2 rounded-lg hover:bg-gray-100"
                aria-label="Close"
              >
                <X size={18} />
              </button>
            </div>
            <div className="px-5 py-4 overflow-auto">
              <div className="text-xs text-gray-500 mb-3">
                Created: {new Date(selected.createdAt).toLocaleString()}
                {selected.updatedAt ? (
                  <> • Updated: {new Date(selected.updatedAt).toLocaleString()}</>
                ) : null}
              </div>
              <div className="whitespace-pre-wrap leading-relaxed text-gray-800">
                {selected.content}
              </div>
            </div>
            <div className="flex justify-end gap-2 border-t px-5 py-3">
              <button
                onClick={() => confirmDelete(selected)}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-white bg-red-500 hover:bg-red-600"
              >
                <Trash2 size={16} />
                Delete
              </button>
              <button
                onClick={closeViewer}
                className="px-4 py-2 rounded-lg border hover:bg-gray-50"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* delete confirm modal */}
      {deleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/40" onClick={() => setDeleteConfirm(null)} />
          <div className="relative z-10 bg-white rounded-lg p-6 shadow-lg max-w-sm w-full">
            <h3 className="text-lg font-semibold mb-4">Delete Note?</h3>
            <p className="text-gray-600 mb-6">Are you sure you want to delete “{deleteConfirm.title}”?</p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setDeleteConfirm(null)}
                className="px-4 py-2 rounded-lg border hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={() => deleteNote(deleteConfirm._id)}
                className="px-4 py-2 rounded-lg bg-red-500 text-white hover:bg-red-600"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      <style>{`
        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>
    </div>
  );
};

export default Notes;
