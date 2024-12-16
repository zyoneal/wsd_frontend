import React, {
	useContext,
	useEffect,
	useLayoutEffect,
	useRef,
	useState
} from 'react';
import {SubtitleService} from '../../services/SubtitleService';
import {DictionaryService} from '../../services/DictionaryService';
import styles from './css/VideoPlayer.module.css';
import {LanguageContext} from "../LanguageContext";

interface Subtitle {
	id: number;
	name: string;
	startTimeMs: number;
	endTimeMs: number;
	text: string;
}

interface VideoPlayerProps {
	videoUrl: string;
	subtitles: { name: string }[];
}

interface DictionaryItem {
	id: number;
	resourceName: string;
	highlightedText: string;
	translatedText: string;
	context: string;
}

const VideoPlayer: React.FC<VideoPlayerProps> = ({ videoUrl, subtitles }) => {
	const { selectedLanguage } = useContext(LanguageContext);
	const [subtitlesForVideo, setSubtitlesForVideo] = useState<Subtitle[]>([]);
	const [fileName, setFileName] = useState<string>('');
	const [selectedSubtitle, setSelectedSubtitle] = useState<string | null>(null);
	const [currentSubtitle, setCurrentSubtitle] = useState<string | null>(null);
	const [selectedText, setSelectedText] = useState<string | null>(null);
	const [selectedSentence, setSelectedSentence] = useState<string | null>(null);
	const [showSubmitButton, setShowSubmitButton] = useState<boolean>(false);
	const [translation, setTranslation] = useState<string | null>(null);
	const [isSelecting, setIsSelecting] = useState(false);
	const [dictionaryItems, setDictionaryItems] = useState<DictionaryItem[]>([]);
	const [notification, setNotification] = useState<string | null>(null);
	const [flippedIndex, setFlippedIndex] = useState<number | null>(null);
	const [currentIndex, setCurrentIndex] = useState(0);
	const videoRef = useRef<HTMLVideoElement>(null);
	const videoWrapperRef = useRef<HTMLDivElement>(null);
	
	
	const showNotification = (message: string) => {
		setNotification(message);
		setTimeout(() => setNotification(null), 3000);
	};
	
	const handleSubtitleClick = async (subtitleName: string) => {
		try {
			const data = await SubtitleService.fetchSubtitlesForVideo(subtitleName);
			setSubtitlesForVideo(data);
			if (data.length > 0) {
				setFileName(data[0].name);
				setSelectedSubtitle(URL.createObjectURL(new Blob([JSON.stringify(data)], { type: 'text/vtt' })));
				fetchDictionaryItems(subtitleName);
			}
		} catch (error) {
			console.error('Error loading subtitles:', error);
		}
	};
	
	const handleSubmit = async (selected: string, sentence: string) => {
		try {
			if (!selected || !sentence) {
				console.log('No text or sentence selected!');
				return;
			}
			
			const newItem = await SubtitleService.processHighlightedText({
				resourceName: fileName,
				highlightedText: selected,
				context: sentence,
				language: selectedLanguage,
			});
			
			setDictionaryItems((prevItems) => [...prevItems, newItem]);
			
			console.log('Text submitted successfully');
			showNotification('The word has been added to the dictionary');
		} catch (error) {
			console.log('Failed to submit text');
		}
	};
	
	const handleDisableSubtitles = () => {
		setSelectedSubtitle(null);
		setFileName('');
	};
	
	const updateSubtitles = () => {
		if (videoRef.current) {
			const currentTime = videoRef.current.currentTime * 1000;
			const subtitle = subtitlesForVideo.find(
					(sub) => currentTime >= sub.startTimeMs && currentTime <= sub.endTimeMs
			);
			setCurrentSubtitle(subtitle ? subtitle.text : null);
		}
	};
	
	const cleanTextForSelection = (text: string): string => {
		return text.replace(/\s+/g, ' ').trim();
	};
	
	const findSentenceForSubtitle = (selected: string | null) => {
		if (!selected || !currentSubtitle) {
			console.log('No selected text or current subtitles!');
			return null;
		}
		
		console.log('Current subtitle:', currentSubtitle);
		
		const cleanedSubtitle = cleanTextForSelection(currentSubtitle);
		
		const regex = new RegExp(`[^.!?]*${selected}[^.!?]*[.!?]*`, 'g');
		
		const sentences = cleanedSubtitle.match(regex);
		
		if (sentences && sentences.length > 0) {
			const cleanedSentence = cleanTextForSelection(sentences[0].trim());
			setSelectedSentence(cleanedSentence);
			return cleanedSentence;
		} else {
			console.log('The sentence is not found in the current subtitle.');
			setSelectedSentence(null);
			return null;
		}
	};
	
	const handleTextSelectionStart = (e: MouseEvent) => {
		if (videoWrapperRef.current && videoWrapperRef.current.contains(e.target as Node)) {
			setIsSelecting(true);
			if (videoRef.current) videoRef.current.pause();
		}
	};
	
	useEffect(() => {
		if (selectedText) {
			console.log(`Selected text: ${selectedText}`);
		}
	}, [selectedText]);
	
	const handleTextSelectionEnd = (event: MouseEvent) => {
		const selection = window.getSelection();
		if (selection?.toString()) {
			setSelectedText(selection.toString());
		} else {
			setSelectedText(null);
		}
	};
	
	
	useEffect(() => {
		if (selectedText) {
			console.log(`Selected text: ${selectedText}`);
			const sentence = findSentenceForSubtitle(selectedText);
			console.log('Found sentence: ' + sentence);
			if (sentence) {
				fetchTranslation(selectedText, sentence);
				setShowSubmitButton(true);
			}
		}
	}, [selectedText]);
	
	
	const fetchTranslation = async (selectedText: string, selectedSentence: string) => {
		try {
			const translation = await SubtitleService.getTranslation({
				resourceName: fileName,
				highlightedText: selectedText,
				context: selectedSentence,
				language: selectedLanguage,
			});
			console.log(translation);
			setTranslation(translation);
		} catch (error) {
			console.error('Error fetching translation:', error);
		}
	};
	
	useLayoutEffect(() => {
		const handleMouseDown = (e: MouseEvent) => handleTextSelectionStart(e);
		const handleMouseUp = (e: MouseEvent) => handleTextSelectionEnd(e);
		
		if (videoWrapperRef.current) {
			videoWrapperRef.current.addEventListener('mousedown', handleMouseDown);
			videoWrapperRef.current.addEventListener('mouseup', handleMouseUp);
		}
		
		return () => {
			if (videoWrapperRef.current) {
				videoWrapperRef.current.removeEventListener('mousedown', handleMouseDown);
				videoWrapperRef.current.removeEventListener('mouseup', handleMouseUp);
			}
		};
	}, []);
	
	const highlightContext = (context: string, highlightedText: string) => {
		const regex = new RegExp(`(${highlightedText})`, "gi");
		return context.replace(regex, `<span class="${styles.highlight}">$1</span>`);
	};
	
	const toggleCardFlip = (index: number) => {
		if (flippedIndex === index) {
			setFlippedIndex(null);
		} else {
			setFlippedIndex(index);
		}
	};
	
	useEffect(() => {
		const intervalId = setInterval(updateSubtitles, 100);
		return () => clearInterval(intervalId);
	}, [subtitlesForVideo]);
	
	const fetchDictionaryItems = async (resourceName: string) => {
		try {
			const items = await DictionaryService.fetchDictionaryItemsByResourceName(resourceName);
			setDictionaryItems(items);
			setCurrentIndex(0);
		} catch (err) {
			console.error('Error fetching dictionary items', err);
		}
	};
	
	const handleKeyDown = (event: KeyboardEvent) => {
		if (event.code === 'ArrowRight' && videoRef.current) {
			videoRef.current.currentTime += 5;
		}
		if (event.code === 'ArrowLeft' && videoRef.current) {
			videoRef.current.currentTime -= 5;
		}
		if (event.code === 'Space') {
			event.preventDefault();
			if (videoRef.current) {
				if (videoRef.current.paused) {
					videoRef.current.play();
				} else {
					videoRef.current.pause();
				}
			}
		}
	}
	
	useEffect(() => {
		window.addEventListener('keydown', handleKeyDown);
		return () => {
			window.removeEventListener('keydown', handleKeyDown);
		};
	}, []);
	
	return (
			<div className={styles.container}>
				<div className={styles.videoContainer}>
					<div className={styles.videoWrapper} ref={videoWrapperRef}>
						<video ref={videoRef} controls>
							<source src={videoUrl} type="video/mp4" />
							Your browser does not support the video tag.
						</video>
						<div className={styles.subtitleContainer}>
							{!selectedSubtitle ? (
									<>
										<h4 className={styles.subtitleTitle}>Select subtitles:</h4>
										{subtitles.length > 0 ? (
												<ul className={styles.subtitleList}>
													{subtitles.map((subtitle) => (
															<li key={subtitle.name}>
																<button
																		className={styles.subtitleButton}
																		onClick={() => handleSubtitleClick(subtitle.name)}
																>
																	{subtitle.name}
																</button>
															</li>
													))}
												</ul>
										) : (
												<p>Subtitles are unavailable</p>
										)}
									</>
							) : (
									<div className={styles.currentSubtitleContainer} ref={videoWrapperRef}>
										{currentSubtitle && <p className={styles.currentSubtitle}>{currentSubtitle}</p>}
									</div>
							)}
						</div>
						{showSubmitButton && selectedText && (
								<div className={styles.translationContainer}>
									{translation && <p className={styles.translationText}>{translation}</p>}
									<button
											className={styles.submitButton}
											onClick={() => {
												const sentence = selectedSentence;
												if (sentence) {
													handleSubmit(selectedText!, sentence);
													setShowSubmitButton(false);
												} else {
													alert('No sentence found!');
												}
											}}
									>
										Add to dictionary
									</button>
								</div>
						)}
					</div>
					{notification && <div className={styles.notification}>{notification}</div>}
					
					<div className={styles.cardContainer}>
						{dictionaryItems.length > 0 ? (
								dictionaryItems.map((item, index) => (
										<div
												key={item.id}
												className={`${styles.card} ${flippedIndex === index ? styles.flipped : ""}`}
												onClick={() => toggleCardFlip(index)}
										>
											<div className={styles.cardInner}>
												<div className={styles.cardFront}>
													<h3 className={styles.highlightedText}>{item.highlightedText}</h3>
													<p
															className={styles.highlightedContext}
															dangerouslySetInnerHTML={{
																__html: highlightContext(item.context, item.highlightedText),
															}}
													/>
												</div>
												<div className={styles.cardBack}>
													<h3>{item.translatedText}</h3>
												</div>
											</div>
										</div>
								))
						) : (
								<p>Dictionary is empty.</p>
						)}
					</div>
				</div>
			</div>
	);
};

export default VideoPlayer;
