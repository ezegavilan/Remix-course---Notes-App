import { type ActionArgs, json, type LinksFunction, type LoaderFunction, type MetaFunction } from "@remix-run/node"
import { Link, useLoaderData } from "@remix-run/react"
import { getNote } from "~/api/infra/persistence/notes"
import type { Note } from "~/types/note"
import noteDetailsStyle from '~/styles/note-details.css'

export const meta: MetaFunction = ({ data }) => {
    return { title: `Note | ${ data.title || '' }` }
}

export const links: LinksFunction = () => {
    return [
        { rel: "stylesheet", href: noteDetailsStyle }
    ]
}

export const loader: LoaderFunction = async ({ params }: ActionArgs) => {
    const noteId: string = params.noteId || '';
    const note: Note | undefined = await getNote(noteId);
    if (note === undefined) {
        throw json({ message: 'Note not found' }, { status: 404 })
    }
    return note; 
}

 export default function NoteDetailsPage() {
    const note: Note = useLoaderData();
    return (
        <main id="note-details">
            <header>
                <nav>
                    <Link to="/notes">Back to all notes</Link>
                </nav>
                <h1>{ note.title }</h1>
            </header>
            <p id="note-details-content">{ note.content }</p>
        </main>
    )
 }
 