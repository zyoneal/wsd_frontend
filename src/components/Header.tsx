import React, {useContext, useEffect, useState} from 'react';
import {LanguageContext} from './LanguageContext';
import {AuthContext} from '../store/AuthContext';
import {UserDto} from '../interfaces/response/UserDto';
import {AuthService} from '../services/AuthService';
import {userService} from '../services/UserService';
import {Link, useNavigate} from 'react-router-dom';
import BaseButton from './BaseButton/BaseButton';
import styles from './Header.module.css';

const Header = () => {
	const [user, setUser] = useState<UserDto>();
	const { selectedLanguage, setSelectedLanguage } = useContext(LanguageContext);
	const { isLoggedIn, setIsLoggedIn } = useContext(AuthContext);
	const navigate = useNavigate();
	
	const handleLogout = () => {
		AuthService.logout();
		setIsLoggedIn(false);
		navigate('/login');
	};
	
	useEffect(() => {
		if (isLoggedIn) {
			userService
					.getCabinetInfo()
					.then((res) => setUser(res?.data))
					.catch((error) => console.error(error));
		}
	}, [isLoggedIn]);
	
	const handleLanguageChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
		setSelectedLanguage(event.target.value);
		console.log('Selected Language:', event.target.value);
	};
	
	const getFormattedFullName = () => {
		return user?.username;
	};
	
	return (
			<header className={styles.header_container}>
				<Link to="/" className={styles.logo_container}>
					<div className={styles.logo}>
						<img src="/word-stream-logo.png" alt="logo" width="60" height="55"/>
					</div>
					<div>
						<h1 className={styles.registry}>WordStream Dictionary</h1>
						<p className={styles.registry_description}>Your go-to dictionary for
							translations and word context</p>
					</div>
				</Link>
				
				{isLoggedIn && (
						<nav className={styles.navigation}>
							<ul className={styles.navList}>
								<li><Link to="/subtitles"
								          className={styles.navItem}>Subtitles</Link></li>
								<li><Link to="/dictionary"
								          className={styles.navItem}>Dictionary</Link></li>
								<li><Link to="/videos" className={styles.navItem}>Video
									Player</Link></li>
							</ul>
						</nav>
				)}
				
				<div className={styles.languageSelect}>
					<select
							className={styles.languageDropdown}
							value={selectedLanguage}
							onChange={handleLanguageChange}
							aria-label="Language selector"
					>
						<option value="ru">Русский</option>
						<option value="uk">Українська</option>
					</select>
				</div>
				
				{isLoggedIn && (
						<div className={styles.user_container}>
							<Link to="/cabinet" className={styles.user_info}>
								<div
										className={styles.user_fullName}>{getFormattedFullName()}</div>
							</Link>
							<BaseButton className={styles.logout_button}
							            onClick={handleLogout}>Exit</BaseButton>
						</div>
				)}
			</header>
	);
};

export default Header;
