import { useState } from 'react';
import '../style/components/NoteList.css';

const NoteList = ({ notes, currentNoteIndex, onNoteSelect, onDeleteNote, onReorder }) => {
	const [dragIndex, setDragIndex] = useState(null);

	const handleDragStart = (index) => {
		setDragIndex(index);
	};

	const handleDragOver = (e) => {
		e.preventDefault();
	};

	const handleDrop = (dropIndex) => {
		if (dragIndex !== null && dragIndex !== dropIndex) {
			onReorder(dragIndex, dropIndex);
		}
		setDragIndex(null);
	};

	return (
		<div className="note-list">
			{notes.length === 0 ? (
				<div className="empty-list">
					<div className="icon">📄</div>
					<p>Записей пока нет</p>
				</div>
			) : (
				notes.map((note, index) => (
					<div
						key={note.id}
						className={`note-item ${index === currentNoteIndex ? 'active' : ''}`}
						onClick={() => onNoteSelect(index)}
						draggable
						onDragStart={() => handleDragStart(index)}
						onDragOver={(e) => handleDragOver(e, index)}
						onDrop={() => handleDrop(index)}
					>
						<div className="note-header">
							<div className="note-title">
								<span className="note-icon">📄</span>
								{note.title}
							</div>
							<button
								className="delete-btn"
								onClick={(e) => {
									e.stopPropagation();
									onDeleteNote(note.id);
								}}
								title="Удалить"
							>
								×
							</button>
						</div>

						<div className="note-preview">
							{note.content.length > 0
								? note.content.length > 60
									? `${note.content.replace(/\n/g, ' ').slice(0, 60)}...`
									: note.content.replace(/\n/g, ' ')
								: 'Пустая заметка...'}
						</div>

						<div className="note-meta">
							<span className="date">{note.updatedAt}</span>
							<span className="drag-handle" title="Перетащите для изменения порядка">
								⋮⋮
							</span>
						</div>
					</div>
				))
			)}
		</div>
	);
};

export default NoteList;
