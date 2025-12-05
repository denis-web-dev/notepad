import { useState } from 'react';
import '../style/components/SearchBar.css';

const SearchBar = ({ onSearch }) => {
	const [query, setQuery] = useState('');

	const handleChange = (e) => {
		const value = e.target.value;
		setQuery(value);
		onSearch(value);
	};

	const clearSearch = () => {
		setQuery('');
		onSearch('');
	};

	return (
		<div className="search-bar">
			<div className="search-icon">
				<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24">
					{/* ... (paste the full SVG paths from your original code) ... */}
				</svg>
			</div>
			<input
				type="text"
				placeholder="Поиск по записям..."
				value={query}
				onChange={handleChange}
				className="search-input"
			/>
			{query && (
				<button className="clear-search" onClick={clearSearch}>
					×
				</button>
			)}
		</div>
	);
};

export default SearchBar;
