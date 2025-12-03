import { useState, useEffect } from 'react';
import '../style/components/NoteEditor.css';

const NoteEditor = ({ note, onUpdate, onUpdateTitle }) => {
	const [title, setTitle] = useState(note.title);
	const [content, setContent] = useState(note.content);
	const [isSaving, setIsSaving] = useState(false);

	useEffect(() => {
		setTitle(note.title);
		setContent(note.content);
	}, [note]);

	const handleTitleChange = (e) => {
		const newTitle = e.target.value;
		setTitle(newTitle);
		if (onUpdateTitle) {
			onUpdateTitle(newTitle);
		}
	};

	const handleContentChange = (e) => {
		const newContent = e.target.value;
		setContent(newContent);
		// Автосохранение контента при изменении
		onUpdate(newContent);
	};

	const handleSave = () => {
		setIsSaving(true);
		// Убедимся, что всё сохранено
		if (onUpdateTitle) {
			onUpdateTitle(title);
		}
		onUpdate(content);
		setTimeout(() => setIsSaving(false), 300);
	};

	const handleKeyDown = (e) => {
		if (e.ctrlKey && e.key === 's') {
			e.preventDefault();
			handleSave();
		}
	};

	return (
		<div className="note-editor">
			<div className="editor-header">
				<div className="title-container">
					<input
						type="text"
						className="note-title-input"
						value={title}
						onChange={handleTitleChange}
						placeholder="Введите заголовок..."
						onKeyDown={handleKeyDown}
					/>
					<div className="note-date">
						<span>Создано: {note.createdAt}</span>
						<span> | Обновлено: {note.updatedAt}</span>
					</div>
				</div>

				<div className="editor-actions">
					<button className={`save-btn ${isSaving ? 'saving' : ''}`} onClick={handleSave} disabled={isSaving}>
						{isSaving ? 'Сохранение...' : 'Сохранить'}
					</button>
				</div>
			</div>

			<div className="editor-info">
				<div className="word-count">
					Символов: {content.length} | Слов: {content.trim() ? content.trim().split(/\s+/).length : 0}
					{title && ` | Заголовок: ${title.length} симв.`}
				</div>
			</div>

			<textarea
				className="editor-textarea"
				value={content}
				onChange={handleContentChange}
				onKeyDown={handleKeyDown}
				placeholder="Начните писать здесь..."
				autoFocus
			/>
		</div>
	);
};

export default NoteEditor;
