import type { LinksFunction } from "@remix-run/node";
import type { Note } from '../types/note';
import noteListStyles from './NoteList.css';
import { Link } from "@remix-run/react";

export const links: LinksFunction = () => {
    return [
        { rel: "stylesheet", href: noteListStyles }
    ]
}

interface NoteListProps {
    notes: Note[]
}

const NoteList = ({ notes }: NoteListProps) => {
    return (
        <ul id="note-list">
            {notes.map((note, index) => (
                <li key={note.id} className="note">
                    <Link to={note.id}>
                        <article>
                            <header>
                                <ul className="note-meta">
                                    <li>#{index + 1}</li>
                                    <li>
                                        <time dateTime={note.id}>
                                            {new Date(note.id).toLocaleDateString('en-US', {
                                                day: 'numeric',
                                                month: 'short',
                                                year: 'numeric',
                                                hour: '2-digit',
                                                minute: '2-digit',
                                            })}
                                        </time>
                                    </li>
                                </ul>
                                <h2>{note.title}</h2>
                            </header>
                            <p>{note.content}</p>
                        </article>
                    </Link>
                </li>
            ))}
        </ul>
    )
}

export default NoteList
