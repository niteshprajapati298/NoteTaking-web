// src/types/note.ts
export interface Note {
  _id: string;
  title: string;
  text: string;
  user: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateNoteData {
  title: string;
  content: string;
}

export interface CreateNoteResponse extends Note {}

export interface NotesApiResponse extends Array<Note> {}