import React, {useEffect, useState} from "react";
import {useParams} from "react-router-dom";
import {DictionaryService} from "../../services/DictionaryService";
import styles from "./css/DictionaryItemsPage.module.css";
import {ReactComponent as PlayIcon} from '../../icons/play.svg';


interface DictionaryItem {
	id: number;
	resourceName: string;
	highlightedText: string;
	translatedText: string;
	context: string;
}

const DictionaryItemsPage: React.FC = () => {
	const {resourceName} = useParams<{ resourceName: string }>();
	const [dictionaryItems, setDictionaryItems] = useState<DictionaryItem[]>([]);
	const [currentIndex, setCurrentIndex] = useState(0);
	const [error, setError] = useState<string>("");
	const [flipped, setFlipped] = useState(false);
	
	const fetchDictionaryItems = async () => {
		setError("");
		if (!resourceName) {
			setError("Resource name is missing");
			return;
		}
		try {
			const items = await DictionaryService.fetchDictionaryItemsByResourceName(resourceName);
			setDictionaryItems(items);
			setCurrentIndex(0);
		} catch (err) {
			if (err instanceof Error) {
				setError(err.message);
			}
		}
	};
	
	const exportCSV = async () => {
		try {
			const blob = await DictionaryService.exportDictionaryByResourceAsCSV(resourceName!);
			const url = window.URL.createObjectURL(blob);
			const link = document.createElement("a");
			link.href = url;
			link.setAttribute("download", `${resourceName}_dictionary.csv`);
			document.body.appendChild(link);
			link.click();
			document.body.removeChild(link);
		} catch (err) {
			if (err instanceof Error) {
				setError(err.message);
			}
		}
	};
	
	const deleteItem = async (id: number) => {
		setError("");
		try {
			await DictionaryService.deleteDictionaryItem(id);
			setDictionaryItems((prevItems) => {
				const updatedItems = prevItems.filter((item) => item.id !== id);
				if (currentIndex >= updatedItems.length) {
					setCurrentIndex(updatedItems.length - 1);
				}
				return updatedItems;
			});
		} catch (err) {
			if (err instanceof Error) {
				setError(err.message);
			}
		}
	};
	
	const highlightContext = (context: string, highlightedText: string) => {
		const regex = new RegExp(`(${highlightedText})`, "gi");
		return context.replace(regex, `<span class="${styles.highlight}">$1</span>`);
	};
	
	const showNextCard = () => {
		if (currentIndex < dictionaryItems.length - 1) {
			setFlipped(false);
			setCurrentIndex((prevIndex) => prevIndex + 1);
		}
	};
	
	const showPreviousCard = () => {
		if (currentIndex > 0) {
			setFlipped(false);
			setCurrentIndex((prevIndex) => prevIndex - 1);
		}
	};
	
	const toggleCardFlip = () => {
		setFlipped(!flipped);
	};
	
	const redirectToYouglish = (word: string) => {
		const youglishURL = `https://youglish.com/pronounce/${word}/english`;
		window.open(youglishURL, "_blank");
	};
	
	const playPronunciation = (word: string) => {
		const utterance = new SpeechSynthesisUtterance(word);
		
		utterance.lang = "en-US";
		utterance.rate = 0.6;
		utterance.pitch = 1;
		utterance.volume = 1;
		
		window.speechSynthesis.speak(utterance);
	};
	
	
	useEffect(() => {
		fetchDictionaryItems();
	}, [resourceName]);
	
	return (
			<div className={styles.itemsContainer}>
				{error && <p className={styles.errorMessage}>{error}</p>}
				
				<h1 className={styles.pageTitle}>
					{resourceName ? `${resourceName} Items` : "Items"}
				</h1>
				
				{dictionaryItems.length > 0 ? (
						<div className={styles.cardContainer}>
							<div
									className={`${styles.card} ${flipped ? styles.flipped : ""}`}
									onClick={toggleCardFlip}
							>
								<div className={styles.cardInner}>
									<div className={styles.cardFront}>
										<h3 className={styles.highlightedText}>
											{dictionaryItems[currentIndex].highlightedText}
										</h3>
										<p
												className={styles.context}
												dangerouslySetInnerHTML={{
													__html: highlightContext(
															dictionaryItems[currentIndex].context,
															dictionaryItems[currentIndex].highlightedText
													),
												}}
										/>
									</div>
									<div className={styles.cardBack}>
										<p className={styles.translatedText}>
											{dictionaryItems[currentIndex].translatedText}
										</p>
									</div>
								</div>
							</div>
							
							<div className={styles.navigationButtons}>
								<button
										onClick={showPreviousCard}
										disabled={currentIndex === 0}
										className={`${styles.button} ${styles.arrowButton}`}
								>
									&#8592;
								</button>
								<button
										onClick={showNextCard}
										disabled={currentIndex === dictionaryItems.length - 1}
										className={`${styles.button} ${styles.arrowButton}`}
								>
									&#8594;
								</button>
								<button
										className={`${styles.button} ${styles.deleteButton}`}
										onClick={(e) => {
											e.stopPropagation();
											deleteItem(dictionaryItems[currentIndex].id);
										}}
								>
									&#10006;
								</button>
							</div>
							
							<div className={styles.otherCards}>
								<button onClick={exportCSV} className={styles.exportButton}>
									Export
								</button>
								<div className={styles.cardGrid}>
									{dictionaryItems.map((item) => (
											<div key={item.id} className={styles.smallCard}>
												<div className={styles.smallCardFront}>
													<h4
															onClick={() => redirectToYouglish(item.highlightedText)}
															className={styles.clickableText}
													>
														{item.highlightedText}
													</h4>
													<button
															onClick={() => playPronunciation(item.highlightedText)}
															className={styles.playButton}
															aria-label={`Play pronunciation for ${item.highlightedText}`}
													>
														<PlayIcon className={styles.icon}/>
													</button>
													<p>{item.translatedText}</p>
												</div>
											</div>
									))}
								</div>
							
							</div>
						</div>
				) : (
						<p>No items found.</p>
				)}
			</div>
	);
}
export default DictionaryItemsPage;
