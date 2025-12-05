import { useState, useEffect } from 'react';
import NoteList from './NoteList';
import NoteEditor from './NoteEditor';
import SearchBar from './SearchBar';
import '../style/components/Notebook.css';

const Notebook = () => {
	const [notes, setNotes] = useState(() => {
		const savedNotes = localStorage.getItem('notebook-notes');
		return savedNotes ? JSON.parse(savedNotes) : [];
	});

	const [currentNoteIndex, setCurrentNoteIndex] = useState(null);
	const [searchQuery, setSearchQuery] = useState('');
	const [filteredNotes, setFilteredNotes] = useState(notes);
	const [isSidebarVisible, setIsSidebarVisible] = useState(false);
	const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

	useEffect(() => {
		const handleResize = () => {
			setIsMobile(window.innerWidth <= 768);
		};
		window.addEventListener('resize', handleResize);
		return () => window.removeEventListener('resize', handleResize);
	}, []);

	// Сохранение в localStorage и фильтрация
	useEffect(() => {
		localStorage.setItem('notebook-notes', JSON.stringify(notes));
		// eslint-disable-next-line react-hooks/set-state-in-effect
		setFilteredNotes(
			notes.filter(
				(note) =>
					note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
					note.content.toLowerCase().includes(searchQuery.toLowerCase())
			)
		);
	}, [notes, searchQuery]);

	// Скрытие клавиатуры при клике вне поля ввода на мобильных
	useEffect(() => {
		const handleClickOutside = (e) => {
			if (isMobile) {
				const isTextInput = e.target.matches('textarea, input, [contenteditable="true"]');
				if (!isTextInput) {
					document.activeElement?.blur();
				}
			}
		};

		document.addEventListener('click', handleClickOutside);
		return () => document.removeEventListener('click', handleClickOutside);
	}, [isMobile]);

	// Добавление новой заметки
	const addNote = () => {
		const newNote = {
			id: Date.now(),
			title: `Новая запись ${notes.length + 1}`,
			content: '',
			createdAt: new Date().toLocaleString(),
			updatedAt: new Date().toLocaleString(),
		};
		setNotes([newNote, ...notes]);
		setCurrentNoteIndex(0);
		setIsSidebarVisible(false); // Скрыть sidebar на мобильных после добавления

		// Автофокус только на десктопе
		setTimeout(() => {
			if (!isMobile) {
				const textarea = document.querySelector('.editor-textarea');
				if (textarea) textarea.focus();
			}
		}, 100);
	};

	// Обновление содержимого заметки
	const updateNote = (id, updatedContent) => {
		setNotes((prevNotes) =>
			prevNotes.map((note) =>
				note.id === id ? { ...note, content: updatedContent, updatedAt: new Date().toLocaleString() } : note
			)
		);
	};

	// Обновление заголовка заметки
	const updateNoteTitle = (id, newTitle) => {
		setNotes((prevNotes) =>
			prevNotes.map((note) =>
				note.id === id ? { ...note, title: newTitle, updatedAt: new Date().toLocaleString() } : note
			)
		);
	};

	// Удаление заметки
	const deleteNote = (id) => {
		const noteIndex = notes.findIndex((note) => note.id === id);
		const newNotes = notes.filter((note) => note.id !== id);

		setNotes(newNotes);

		// Обновляем текущий индекс
		if (currentNoteIndex !== null && notes[currentNoteIndex]?.id === id) {
			setCurrentNoteIndex(null);
		} else if (currentNoteIndex > noteIndex) {
			setCurrentNoteIndex((prev) => prev - 1);
		}
	};

	// Выбор заметки
	const selectNote = (index) => {
		setCurrentNoteIndex(index);
		setIsSidebarVisible(false); // Скрыть sidebar на мобильных после выбора
	};

	return (
		<div className="notebook">
			<div className="notebook-container">
				<div className={`notebook-sidebar ${isSidebarVisible ? 'visible' : ''}`}>
					<div className="sidebar-header">
						<h1 className="app-title">
							<span className="app-svg"></span> Блокнот
						</h1>
						<p className="app-subtitle">Ваши мысли и идеи в безопасности здесь</p>
						<button className="add-note-btn" onClick={addNote}>
							Новая запись
						</button>
						<div className="search-container">
							<SearchBar onSearch={setSearchQuery} />
						</div>
					</div>
					<NoteList
						notes={filteredNotes}
						currentNoteIndex={currentNoteIndex}
						onNoteSelect={selectNote}
						onDeleteNote={deleteNote}
					/>
					<div className="notes-counter">
						<span className="counter-text">Всего записей: {notes.length}</span>
					</div>
				</div>

				<div className="notebook-editor">
					{isMobile && (
						<button className="burger-btn" onClick={() => setIsSidebarVisible(!isSidebarVisible)}>
							☰
						</button>
					)}
					{currentNoteIndex !== null ? (
						<NoteEditor
							note={notes[currentNoteIndex]}
							onUpdate={updateNote}
							onUpdateTitle={updateNoteTitle}
						/>
					) : (
						<div className="empty-editor">
							<div className="empty-svg">
								{/* SVG icon from original */}
								<svg viewBox="0 0 100 100">
									{/* ... (paste the full SVG path from your original code) ... */}
								</svg>
							</div>
							<h2 className="empty-title">Выберите запись или создайте новую</h2>
							<p className="empty-text">Ваши мысли и идеи в безопасности здесь</p>
						</div>
					)}
				</div>
			</div>
		</div>
	);
};

export default Notebook;
