import { useState, useEffect } from 'react';
import '../style/components/NoteEditor.css';

const NoteEditor = ({ note, onUpdate, onUpdateTitle }) => {
	const [title, setTitle] = useState(note.title);
	const [content, setContent] = useState(note.content);
	const [isSaving, setIsSaving] = useState(false);
	const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

	useEffect(() => {
		setTitle(note.title);
		setContent(note.content);
	}, [note]);

	useEffect(() => {
		const handleResize = () => {
			setIsMobile(window.innerWidth <= 768);
		};
		window.addEventListener('resize', handleResize);
		return () => window.removeEventListener('resize', handleResize);
	}, []);

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

		onUpdate(newContent);
	};

	const handleSave = () => {
		setIsSaving(true);

		if (onUpdateTitle) {
			onUpdateTitle(title);
		}
		onUpdate(content);

		if (isMobile) {
			document.activeElement?.blur();
		}

		setTimeout(() => setIsSaving(false), 300);
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
						{note.updatedAt !== note.createdAt && <span> | Обновлено: {note.updatedAt}</span>}
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
				autoFocus={!isMobile}
			/>

			<div className="editor-footer">
				{isMobile && (
					<div className="mobile-save-container">
						<button className="mobile-save-btn" onClick={handleSave} disabled={isSaving}>
							{isSaving ? 'Сохранение...' : 'Сохранить'}
						</button>
					</div>
				)}
			</div>
		</div>
	);
};

export default NoteEditor;
