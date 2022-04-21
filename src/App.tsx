import { Route, Routes } from 'react-router-dom';

import Page404 from './pages/404';
import Home from './pages/Home';
import List from './pages/List';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      {/* todo: create /deleted and /completed routes */}
      <Route path="deleted" element={<List />} />
      <Route path="completed" element={<List />} />
      <Route path="*" element={<Page404 />} />
    </Routes>
  );
}

export default App;
