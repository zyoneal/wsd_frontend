import React from "react";
import styles from "./css/HomePage.module.css";

const HomePage: React.FC = () => {
	return (
			<div className={styles.container}>
				<header className={styles.header}>
					<h1 className={styles.title}>Learn English with Subtitles!</h1>
					<p className={styles.subtitle}>
						Upload videos or subtitles, highlight words, and create your personal
						dictionary. Learn new words with flashcards and export them to Quizlet,
						Anki, or any other platform.
					</p>
				</header>
				
				<main className={styles.main}>
					<section className={styles.features}>
						<h2 className={styles.featuresTitle}>Service Features</h2>
						<div className={styles.featureList}>
							<article className={styles.featureItem}>
								<h3>Subtitles & Dictionaries</h3>
								<p>
									Upload subtitles, highlight words, and add them to your personal
									dictionary. Learn words in the context of movies and videos.
								</p>
							</article>
							<article className={styles.featureItem}>
								<h3>Video Player</h3>
								<p>Watch videos with subtitles, highlight words in the player.</p>
							</article>
							<article className={styles.featureItem}>
								<h3>Flashcards</h3>
								<p>
									Review words with flashcards. Learn phrases and enhance your
									vocabulary through engaging exercises.
								</p>
							</article>
						</div>
					</section>
					
					<section className={styles.steps}>
						<h2 className={styles.stepsTitle}>How It Works</h2>
						<ol className={styles.stepsList}>
							<li>Upload subtitles or videos with subtitles.</li>
							<li>Watch, highlight words, and add them to your dictionary.</li>
							<li>Review words using flashcards or learn through context.</li>
							<li>
								Export flashcards to Quizlet, Anki, or other platforms for easy
								study.
							</li>
						</ol>
					</section>
				</main>
				
				<footer className={styles.footer}>
					<p>© 2024 WordStream Dictionary. Learn English effortlessly!</p>
				</footer>
			</div>
	);
};

export default HomePage;
