import React, {useEffect, useState} from 'react';
import {SubtitleService} from '../../services/SubtitleService';
import VideoPlayer from './VideoPlayer';
import styles from './css/VideoPage.module.css';

interface SubtitleDto {
	id: number;
	name: string;
	fileUrl: string;
}

const VideoPage: React.FC = () => {
	const [videoUrl, setVideoUrl] = useState<string | null>(null);
	const [subtitles, setSubtitles] = useState<SubtitleDto[]>([]);
	const [selectedWords, setSelectedWords] = useState<string[]>([]);
	const [error, setError] = useState<string>('');
	const [uploadStatus, setUploadStatus] = useState<string | null>(null);
	
	const handleSubtitlesUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
		const file = event.target.files?.[0];
		if (file) {
			const formData = new FormData();
			formData.append('file', file);
			
			try {
				await SubtitleService.uploadSubtitles(formData);
				setUploadStatus('');
				fetchSubtitles();
			} catch (err) {
				setError('Failed to upload subtitles.');
			}
		}
	};
	
	const fetchSubtitles = async () => {
		try {
			const subtitles = await SubtitleService.fetchAllSubtitles();
			setSubtitles(subtitles);
		} catch (err) {
			setError('Failed to fetch subtitles');
		}
	};
	
	const handleWordSelect = (word: string) => {
		setSelectedWords((prevWords) => {
			if (prevWords.includes(word)) {
				return prevWords.filter((w) => w !== word);
			}
			return [...prevWords, word];
		});
	};
	
	const handleVideoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
		const file = event.target.files?.[0];
		if (file) {
			setVideoUrl(URL.createObjectURL(file));
		}
	};
	
	useEffect(() => {
		fetchSubtitles();
	}, []);
	
	return (
			<div className={styles.container}>
				<header className={styles.header}>
					<div className={styles.uploadSection}>
						<div className={styles.downloadLinkContainer}>
							<p>
								<a href="https://yts.mx/" target="_blank"
								   rel="noopener noreferrer" className={styles.downloadButton}>
									Download content
								</a>
							</p>
						</div>
						
						<div className={styles.downloadLinkContainer}>
							<p>
								<a href="https://www.opensubtitles.com/en" target="_blank"
								   rel="noopener noreferrer" className={styles.downloadButton}>
									Download subtitles
								</a>
							</p>
						</div>
						
						<label className={styles.uploadButton}>
							Upload Video
							<input
									type="file"
									accept="video/*"
									onChange={handleVideoUpload}
									className={styles.uploadInput}
							/>
						</label>
						<label className={styles.uploadButton}>
							Upload Subtitle
							<input
									type="file"
									accept=".srt,.vtt"
									onChange={handleSubtitlesUpload}
									className={styles.uploadInput}
							/>
						</label>
					</div>
				</header>
				
				{uploadStatus && <p className={styles.uploadStatus}>{uploadStatus}</p>}
				{error && <p className={styles.errorMessage}>{error}</p>}
				
				{videoUrl && (
						<div className={styles.videoContainer}>
							<VideoPlayer videoUrl={videoUrl} subtitles={subtitles}/>
						</div>
				)}
			</div>
	);
};

export default VideoPage;
