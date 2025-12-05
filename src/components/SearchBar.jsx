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
				<svg
					xmlns="http://www.w3.org/2000/svg"
					width="18"
					height="18"
					viewBox="0 0 24 24"
					fill="none"
					stroke="currentColor"
					strokeWidth="2"
				>
					<circle cx="11" cy="11" r="8"></circle>
					<line x1="21" y1="21" x2="16.65" y2="16.65"></line>
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
