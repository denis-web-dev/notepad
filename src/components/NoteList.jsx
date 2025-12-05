import { useState } from 'react';
import { FaPencilAlt } from 'react-icons/fa';
import '../style/components/NoteList.css';

const NoteList = ({ notes, currentNoteIndex, onNoteSelect, onDeleteNote, onEditNote }) => {
	const [dragIndex, setDragIndex] = useState(null);

	const handleDragStart = (index) => {
		setDragIndex(index);
	};

	const handleDragOver = (e) => {
		e.preventDefault();
	};

	const handleDrop = (dropIndex) => {
		if (dragIndex !== null && dragIndex !== dropIndex) {
			// onReorder would need to be implemented if drag-and-drop is required
			// For now, assuming no reorder, or add logic
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
						onDragOver={handleDragOver}
						onDrop={() => handleDrop(index)}
					>
						<div className="note-header">
							<div className="note-title">
								<span className="note-icon">📄</span>
								{note.title}
							</div>
							<div className="note-actions">
								<button
									className="edit-btn-list"
									onClick={(e) => {
										e.stopPropagation();
										onEditNote(index);
									}}
									title="Редактировать"
								>
									<FaPencilAlt />
								</button>
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
