import React from 'react';
import {NavLink} from 'react-router-dom';
import styles from "./css/SideBar.module.css";

interface SideBarProps {
	className?: string;
}

const navItems = [
	{to: '/subtitles', label: 'Subtitles'},
	{to: '/dictionary', label: 'Dictionary'},
	{to: '/videos', label: 'Video Player'},
];

const SideBar: React.FC<SideBarProps> = ({className}) => {
	return (
			<aside className={`${styles.sidebar} ${className || ''}`}
			       aria-label="Main navigation">
				<nav className={styles.navigation}>
					<ul className={styles.navList}>
						{navItems.map(({to, label}) => (
								<NavLink
										key={to}
										to={to}
										className={({isActive}) => `${styles.navItem} ${isActive ? styles.active : ''}`}
										end
								>
									{label}
								</NavLink>
						))}
					</ul>
				</nav>
			</aside>
	);
};

export default SideBar;
