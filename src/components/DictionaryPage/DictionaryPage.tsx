import React, {useEffect, useState} from 'react';
import {Link} from 'react-router-dom';
import {DictionaryService} from '../../services/DictionaryService';
import styles from './css/DictionaryPage.module.css';

interface DictionaryResource {
	groupName: string;
	numberOfWords: number;
}

const DictionaryPage: React.FC = () => {
	const [dictionaryResources, setDictionaryResources] = useState<DictionaryResource[]>([]);
	const [searchQuery, setSearchQuery] = useState('');
	const [error, setError] = useState<string>('');
	
	const fetchDictionaryResources = async () => {
		setError('');
		try {
			const resources = await DictionaryService.fetchDictionaryResources();
			setDictionaryResources(resources);
		} catch (err) {
			if (err instanceof Error) {
				setError(err.message);
			}
		}
	};
	
	const deleteResource = async (groupName: string) => {
		setError('');
		try {
			await DictionaryService.deleteDictionaryResource(groupName);
			setDictionaryResources((prevResources) =>
					prevResources.filter((resource) => resource.groupName !== groupName)
			);
		} catch (err) {
			if (err instanceof Error) {
				setError(err.message);
			}
		}
	};
	
	
	const exportCSV = async () => {
		try {
			const blob = await DictionaryService.exportAllDictionaryAsCSV();
			const url = window.URL.createObjectURL(blob);
			const link = document.createElement("a");
			link.href = url;
			link.setAttribute("download", `full_dictionary.csv`);
			document.body.appendChild(link);
			link.click();
			document.body.removeChild(link);
		} catch (err) {
			if (err instanceof Error) {
				setError(err.message);
			}
		}
	};
	
	useEffect(() => {
		fetchDictionaryResources();
	}, []);
	
	const filteredResources = dictionaryResources.filter((resource) =>
			resource.groupName.toLowerCase().includes(searchQuery.toLowerCase())
	);
	
	return (
			<div className={styles.container}>
				<div className={styles.header}>
					<h1>Dictionary Resources</h1>
					<input
							type="text"
							placeholder="Search by resource name..."
							value={searchQuery}
							onChange={(e) => setSearchQuery(e.target.value)}
							className={styles.searchInput}
					/>
				</div>
				{error && <p className={styles.errorMessage}>{error}</p>}
				
				<div className={styles.resourcesWrapper}>
					<div className={styles.resourcesList}>
						{filteredResources.length > 0 ? (
								filteredResources.map((resource, index) => (
										<div key={index} className={styles.resourceItem}>
											<div className={styles.resourceContent}>
												<Link to={`/dictionary/resources/${resource.groupName}`}>
													<h3 className={styles.resourceName}>{resource.groupName}</h3>
													<p>{resource.numberOfWords} words</p>
												</Link>
												<button
														onClick={() => deleteResource(resource.groupName)}
														className={styles.deleteButton}
												>
													&#10006;
												</button>
											</div>
										</div>
								))
						) : (
								<div className={styles.emptyState}>
									<p>No resources found</p>
								</div>
						)}
					</div>
					{filteredResources.length > 0 && (
							<button onClick={exportCSV} className={styles.exportButton}>
								Export
							</button>
					)}
				</div>
			</div>
	);
};

export default DictionaryPage;
