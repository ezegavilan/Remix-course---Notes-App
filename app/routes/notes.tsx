import { redirect, type ActionArgs, type ActionFunction, type LinksFunction, type MetaFunction, type LoaderFunction } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { getNotes, saveNotes } from "~/api/infra/persistence/notes";
import NewNote, { links as newNoteLinks } from "~/components/NewNote";
import NoteList, { links as noteListLinks } from "~/components/NoteList";
import type { Note } from "~/types/note";

export const links: LinksFunction = () => {
    return [...newNoteLinks(), ...noteListLinks()];
}

export const meta: MetaFunction = () => {
    return {
        title: "Notas"
    }
}

export const loader: LoaderFunction = async () => {
    const notes: Note[] = await getNotes();
    return notes;
}

export const action: ActionFunction = async ({ request }: ActionArgs) => {
    const formData = await request.formData();
    const note: Note = {
        id: new Date().toISOString(),
        title: formData.get('title')!.toString(),
        content: formData.get('content')!.toString()
    };

    if (note.title.trim().length < 5) {
        return {
            message: 'Invalid title - must be at least 5 characters'
        }
    }

    const prevNotes: Note[] = await getNotes();
    const updatedNotes = prevNotes.concat(note);
    await saveNotes(updatedNotes);
    await new Promise<void>((resolve, reject) => { setTimeout(() => resolve(), 500) });
    return redirect('/notes');
}

export default function NotePage() {
    const notes: Note[] = useLoaderData();

    return (
        <main>
            <NewNote />
            <NoteList notes={ notes } />
        </main>
    )
}
