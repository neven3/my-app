import { Route, Routes } from 'react-router-dom';

import Page404 from './pages/404';
import Home from './pages/Home';
import InProgress from './pages/InProgress';
import List from './pages/List';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="list">
        <Route path="" element={<Home />} />
        <Route path=":listId" element={<List />} />
      </Route>
      {/* todo: create /deleted and /completed routes */}
      <Route path="deleted" element={<InProgress />} />
      <Route path="completed" element={<InProgress />} />
      <Route path="*" element={<Page404 />} />
    </Routes>
  );
}

export default App;
