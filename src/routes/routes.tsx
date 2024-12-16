import {Route, Routes} from 'react-router-dom';

import SubtitleViewer from '../components/SubtitleViewer/SubtitleViewer';
import DictionaryPage from '../components/DictionaryPage/DictionaryPage';
import SubtitlesPage from '../components/SubtitlesPage/SubtitlesPage';
import LoginPage from '../components/LoginPage/LoginPage';
import HomePage from '../components/HomePage/HomePage';
import CabinetPage from '../components/CabinetPage/CabinetPage';
import VideoPage from '../components/VideoPage/VideoPage';
import NotFoundPage from '../components/NotFoundPage/NotFoundPage';
import DictionaryItemsPage
  from '../components/DictionaryItemsPage/DictionaryItemsPage';
import {urls} from '../constants/urls';

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/cabinet" element={<CabinetPage />} />
      <Route path="/dictionary" element={<DictionaryPage />} />
      <Route path="/subtitles" element={<SubtitlesPage />} />
      <Route path="/videos" element={<VideoPage />} />
      <Route path={urls.login} element={<LoginPage />} />
      <Route path="/subtitles/:fileId" element={<SubtitleViewer />} />
      <Route path="/dictionary/resources/:resourceName" element={<DictionaryItemsPage />} />
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
};

export default AppRoutes;
