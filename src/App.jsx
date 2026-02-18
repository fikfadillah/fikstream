import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Search from './pages/Search';
import Detail from './pages/Detail';
import Disclaimer from './pages/Disclaimer';
import Categories from './pages/Categories';
import Category from './pages/Category';
import Genre from './pages/Genre';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/search" element={<Search />} />
        <Route path="/detail/:detailPath?" element={<Detail />} />
        <Route path="/category/:category?" element={<Category />} />
        <Route path="/disclaimer" element={<Disclaimer />} />
        <Route path="/categories" element={<Categories />} />
        <Route path="/genre/:genreName" element={<Genre />} />
      </Routes>
    </Router>
  );
}

export default App;
