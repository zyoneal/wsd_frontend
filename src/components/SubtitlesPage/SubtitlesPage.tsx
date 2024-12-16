import React, {useEffect, useState} from 'react';
import {Link} from 'react-router-dom';
import {SubtitleService} from '../../services/SubtitleService';
import styles from './css/SubtitlesPage.module.css';

interface SubtitleDto {
	name: string;
}

const SubtitlesPage: React.FC = () => {
	const [subtitles, setSubtitles] = useState<SubtitleDto[]>([]);
	const [searchQuery, setSearchQuery] = useState('');
	const [error, setError] = useState<string>('');
	
	const fetchSubtitles = async () => {
		setError('');
		try {
			const resources = await SubtitleService.fetchAllSubtitles();
			setSubtitles(resources);
		} catch (err) {
			setError('Failed to load subtitles. Please try again later.');
		}
	};
	
	const handleFileUpload = async (files: FileList | null) => {
		if (!files || !files[0]) return;
		const file = files[0];
		try {
			const formData = new FormData();
			formData.append('file', file);
			
			await SubtitleService.uploadSubtitles(formData);
			await fetchSubtitles();
		} catch (err) {
			setError('Failed to upload subtitles. Please try again.');
		}
	};
	
	const deleteSubtitlesByName = async (name: string) => {
		setError('');
		try {
			await SubtitleService.deleteSubtitlesByName(name);
			setSubtitles((prevResources) =>
					prevResources.filter((resource) => resource.name !== name)
			);
		} catch (err) {
			if (err instanceof Error) {
				setError(err.message);
			}
		}
	};
	
	useEffect(() => {
		fetchSubtitles();
	}, []);
	
	const filteredResources = subtitles.filter((subtitle) =>
			subtitle.name.toLowerCase().includes(searchQuery.toLowerCase())
	);
	
	return (
			<div className={styles.container}>
				<h1>My Subtitles</h1>
				<div className={styles.header}>
					<input
							type="text"
							placeholder="Search by name..."
							value={searchQuery}
							onChange={(e) => setSearchQuery(e.target.value)}
							className={styles.searchInput}
					/>
					<label className={styles.uploadButton}>
						Upload Subtitles
						<input
								type="file"
								accept=".srt,.vtt"
								onChange={(e) => handleFileUpload(e.target.files)}
								className={styles.uploadInput}
						/>
					</label>
				</div>
				
				{error && <p className={styles.errorMessage}>{error}</p>}
				
				<div className={styles.subtitlesWrapper}>
					{filteredResources.length > 0 ? (
							<div className={styles.subtitlesList}>
								{filteredResources.map((subtitle, index) => (
										<div key={index} className={styles.subtitleItem}>
											<div className={styles.subtitleContent}>
												<Link to={`/subtitles/${subtitle.name}`} className={styles.subtitleLink}>
													<h3 className={styles.subtitleName}>{subtitle.name}</h3>
												</Link>
												<button
														className={styles.deleteButton}
														onClick={() => deleteSubtitlesByName(subtitle.name)}
												>
													&#10006;
												</button>
											</div>
										</div>
								))}
							</div>
					) : (
							<div className={styles.emptyState}>
								<p>No subtitles found</p>
							</div>
					)}
				</div>
			</div>
	);
};

export default SubtitlesPage;
