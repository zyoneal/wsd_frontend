import {createContext, Dispatch, SetStateAction} from 'react';

interface LanguageContextType {
	selectedLanguage: string;
	setSelectedLanguage: Dispatch<SetStateAction<string>>;
}

	export const LanguageContext = createContext<LanguageContextType>({
		selectedLanguage: 'uk',
		setSelectedLanguage: () => {},
	});
