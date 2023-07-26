import { redirect, type ActionArgs, type ActionFunction, type LinksFunction, type MetaFunction, type LoaderFunction, json } from "@remix-run/node";
import { useCatch, useLoaderData } from "@remix-run/react";
import { getNotes, saveNotes } from "~/api/infra/persistence/notes";
import NewNote, { links as newNoteLinks } from "~/components/NewNote";
import NoteList, { links as noteListLinks } from "~/components/NoteList";
import type { Note } from "~/types/note";

export const links: LinksFunction = () => {
    return [...newNoteLinks(), ...noteListLinks()];
}

export const meta: MetaFunction = () => {
    return {
        title: "Notes"
    }
}

export const loader: LoaderFunction = async () => {
    const notes: Note[] = await getNotes();
    if (!notes || notes?.length === 0) {
        throw json({ message: 'Notes Not Found' }, { status: 404 });
    }
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

export const CatchBoundary = () => {
    const catchResponse = useCatch();
    const message = catchResponse.data?.message || 'Data Not Found';

    return (
        <main>
            <NewNote />
            <p className="info-message">{message}</p>
        </main>
    )
}

export default function NotePage() {
    const notes: Note[] = useLoaderData();

    return (
        <main>
            <NewNote />
            <NoteList notes={notes} />
        </main>
    )
}
