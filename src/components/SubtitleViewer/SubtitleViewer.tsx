import React, {useContext, useEffect, useState} from 'react';
import {useParams} from 'react-router-dom';
import {SubtitleService} from '../../services/SubtitleService';
import {DictionaryService} from '../../services/DictionaryService';
import styles from './css/SubtitleViewer.module.css';
import {LanguageContext} from "../LanguageContext";

interface DictionaryItem {
	id: number;
	resourceName: string;
	highlightedText: string;
	translatedText: string;
	context: string;
}

const SubtitleViewer: React.FC = () => {
	const { selectedLanguage } = useContext(LanguageContext);
	const { fileId } = useParams<{ fileId: string }>();
	const [subtitles, setSubtitles] = useState<string[]>([]);
	const [dictionaryItems, setDictionaryItems] = useState<DictionaryItem[]>([]);
	const [highlightedWords, setHighlightedWords] = useState<string[]>([]);
	const [isLoading, setIsLoading] = useState<boolean>(false);
	const [error, setError] = useState<string>('');
	const [selectedText, setSelectedText] = useState<string>('');
	const [selectedSentence, setSelectedSentence] = useState<string>('');
	const [notification, setNotification] = useState<string | null>(null);
	
	const fetchSubtitles = async () => {
		if (!fileId) {
			setError('Invalid file ID.');
			return;
		}
		
		setIsLoading(true);
		setError('');
		try {
			const data = await SubtitleService.fetchSubtitles(fileId);
			setSubtitles(data);
		} catch (err) {
			setError(err instanceof Error ? err.message : 'An unknown error occurred.');
		} finally {
			setIsLoading(false);
		}
	};
	
	const showNotification = (message: string) => {
		setNotification(message);
		setTimeout(() => setNotification(null), 3000);
	};
	
	const fetchHighlightedWords = async () => {
		if (!fileId) return;
		try {
			const items = await DictionaryService.fetchDictionaryItemsByResourceName(fileId);
			setDictionaryItems(items);
			setHighlightedWords(items.map((item: DictionaryItem) => item.highlightedText));
		} catch (err) {
			console.error('Failed to fetch highlighted words', err);
		}
	};
	
	useEffect(() => {
		fetchSubtitles();
		fetchHighlightedWords();
	}, [fileId]);
	
	const handleTextSelection = () => {
		const selected = window.getSelection()?.toString();
		if (selected) {
			setSelectedText(selected);
			findSentenceForSelection(selected);
		}
	};
	
	const findSentenceForSelection = (selected: string) => {
		const allText = subtitles.join(' ');
		const regex = new RegExp(`[^.!?]*${selected}[^.!?]*[.!?]`, 'g');
		const sentences = allText.match(regex);
		if (sentences && sentences.length > 0) {
			setSelectedSentence(sentences[0].trim());
			handleSubmit(selected, sentences[0].trim());
		}
	};
	
	const handleSubmit = async (selected: string, sentence: string) => {
		try {
			console.log(selectedLanguage);
			await SubtitleService.processHighlightedText({
				resourceName: fileId || 'Unknown File',
				highlightedText: selected,
				context: sentence,
				language: selectedLanguage,
			});
			setHighlightedWords((prev) => [...prev, selected]);
			showNotification('The word has been added to the dictionary');
		} catch (error) {
			console.log('Failed to submit text');
		}
	};
	
	const highlightText = (text: string) => {
		return highlightedWords.reduce(
				(result, word) =>
						result.replace(
								new RegExp(`\\b${word}\\b`, 'gi'),
								`<span class="${styles.highlightedText}">${word}</span>`
						),
				text
		);
	};
	
	return (
			<div className={styles.container}>
				<h2 className={styles.title}>Subtitles Viewer</h2>
				{isLoading ? (
						<p className={styles.loading}>Loading subtitles...</p>
				) : error ? (
						<p className={styles.error}>{error}</p>
				) : subtitles.length > 0 ? (
						<div
								className={styles.subtitles}
								onMouseUp={handleTextSelection}
								dangerouslySetInnerHTML={{
									__html: subtitles.map((subtitle) => highlightText(subtitle)).join('\n'),
								}}
						/>
				) : (
						<p className={styles.noSubtitles}>No subtitles found.</p>
				)}
				{notification && <div className={styles.notification}>{notification}</div>}
			</div>
	);
};

export default SubtitleViewer;
