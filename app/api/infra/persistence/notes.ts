import fs from 'fs/promises'
import type { Note } from '~/types/note';

export const getNotes = async () => {
    const rawFileContent = await fs.readFile('notes.json', { encoding: 'utf-8' });
    const data = JSON.parse(rawFileContent);
    return data.notes ?? [];
}

export const saveNotes = (notes: Note[]) => {
    return fs.writeFile('notes.json', JSON.stringify({ notes: notes || [] }));
}
