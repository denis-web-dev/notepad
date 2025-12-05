import { useState, useEffect } from 'react';
import { FaPencilAlt } from 'react-icons/fa';
import '../style/components/NoteEditor.css';

const NoteEditor = ({ note, onUpdate, onUpdateTitle, forceEdit, onSaveComplete }) => {
	const [title, setTitle] = useState(note.title);
	const [content, setContent] = useState(note.content);
	const [isSaving, setIsSaving] = useState(false);
	const [isEditing, setIsEditing] = useState(false);
	const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

	useEffect(() => {
		// eslint-disable-next-line react-hooks/set-state-in-effect
		setTitle(note.title);
		setContent(note.content);
		setIsEditing(forceEdit || note.content === '');
	}, [note, forceEdit]);

	useEffect(() => {
		const handleResize = () => setIsMobile(window.innerWidth <= 768);
		window.addEventListener('resize', handleResize);
		return () => window.removeEventListener('resize', handleResize);
	}, []);

	const handleTitleChange = (e) => {
		setTitle(e.target.value);
	};

	const handleContentChange = (e) => {
		setContent(e.target.value);
	};

	const handleSave = () => {
		setIsSaving(true);
		onUpdateTitle(note.id, title);
		onUpdate(note.id, content);
		setIsEditing(false);
		if (isMobile) document.activeElement?.blur();
		setTimeout(() => {
			setIsSaving(false);
			onSaveComplete();
		}, 300);
	};

	const handleEdit = () => {
		setIsEditing(true);
	};

	const handleKeyDown = (e) => {
		if (e.ctrlKey && e.key === 's') {
			e.preventDefault();
			handleSave();
		}
		if (isMobile && e.key === 'Enter' && !e.shiftKey) {
			e.preventDefault();
			handleSave();
		}
	};

	return (
		<div className="note-editor">
			<div className="editor-header">
				<div className="title-container">
					{isEditing ? (
						<input
							type="text"
							className="note-title-input"
							value={title}
							onChange={handleTitleChange}
							placeholder="Введите заголовок..."
							onKeyDown={handleKeyDown}
						/>
					) : (
						<h2 className="note-title-view">{title || 'Без заголовка'}</h2>
					)}
					<div className="note-date">
						<span>Создано: {note.createdAt}</span>
						{note.updatedAt !== note.createdAt && <span> | Обновлено: {note.updatedAt}</span>}
					</div>
				</div>

				<div className="editor-actions">
					{isEditing ? (
						<button
							className={`save-btn ${isSaving ? 'saving' : ''}`}
							onClick={handleSave}
							disabled={isSaving}
						>
							{isSaving ? 'Сохранение...' : 'Сохранить'}
						</button>
					) : (
						<button className="edit-btn" onClick={handleEdit} title="Редактировать">
							<FaPencilAlt />
						</button>
					)}
				</div>
			</div>

			<div className="editor-info">
				<div className="word-count">
					Символов: {content.length} | Слов: {content.trim() ? content.trim().split(/\s+/).length : 0}
				</div>
			</div>

			{isEditing ? (
				<textarea
					className="editor-textarea"
					value={content}
					onChange={handleContentChange}
					onKeyDown={handleKeyDown}
					placeholder="Начните писать здесь..."
					autoFocus={!isMobile}
				/>
			) : (
				<div className="note-content-view">
					<p>{content || 'Пустая заметка...'}</p>
				</div>
			)}

			{isMobile && isEditing && (
				<div className="mobile-save-container">
					<button className="mobile-save-btn" onClick={handleSave} disabled={isSaving}>
						{isSaving ? 'Сохранение...' : 'Сохранить'}
					</button>
				</div>
			)}
		</div>
	);
};

export default NoteEditor;
