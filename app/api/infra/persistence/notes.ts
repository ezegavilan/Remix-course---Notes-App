import fs from 'fs/promises'
import type { Note } from '~/types/note';

interface Data {
    notes: Note[]
}

export const getNotes = async () => {
    const rawFileContent = await getFileContent();
    const data: Data = JSON.parse(rawFileContent);
    return data.notes ?? [];
}

export const getNote = async (noteId: string) => {
    const rawFileContent = await getFileContent();
    const data: Data = JSON.parse(rawFileContent);
    return data.notes.find(note => note.id === noteId);
}

export const saveNotes = (notes: Note[]) => {
    return fs.writeFile('notes.json', JSON.stringify({ notes: notes || [] }));
}

const getFileContent = async () => {
    return await fs.readFile('notes.json', { encoding: 'utf-8' });
}
