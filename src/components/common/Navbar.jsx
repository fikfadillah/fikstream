import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Search, Menu, X } from 'lucide-react';
import { useDebounce } from '../../hooks/useDebounce';
import { api } from '../../services/api';
import './Navbar.css';

const Navbar = () => {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);

  const debouncedSearchTerm = useDebounce(searchQuery, 500);
  const navigate = useNavigate();
  const location = useLocation();
  const searchRef = useRef(null);

  useEffect(() => {
    const fetchResults = async () => {
      if (debouncedSearchTerm) {
        try {
          const res = await api.search(debouncedSearchTerm);
          setSearchResults(res.items || []);
          setShowDropdown(true);
        } catch (error) {
          console.error("Search error", error);
        }
      } else {
        setSearchResults([]);
        setShowDropdown(false);
      }
    };

    fetchResults();
  }, [debouncedSearchTerm]);

  // Click outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
      setIsSearchOpen(false);
      setShowDropdown(false);
      setSearchQuery('');
    }
  };

  const toggleSearch = () => {
    setIsSearchOpen(!isSearchOpen);
    if (!isSearchOpen) setTimeout(() => document.querySelector('.searchInput')?.focus(), 100);
  };

  const isActive = (path) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  };

  return (
    <nav className="navbar">
      <Link to="/" className="logo">
        <span className="logo-text">fikstream</span>
      </Link>

      <div className={`navLinks ${isMobileMenuOpen ? 'open' : ''}`}>
        <Link to="/" className={`navLink ${isActive('/') ? 'active' : ''}`}>Home</Link>
        <Link to="/categories" className={`navLink ${isActive('/categories') ? 'active' : ''}`}>All Categories</Link>
        <Link to="/category/kdrama" className={`navLink ${isActive('/category/kdrama') ? 'active' : ''}`}>K-Drama</Link>
        <Link to="/category/c-drama" className={`navLink ${isActive('/category/c-drama') ? 'active' : ''}`}>C-Drama</Link>
        <Link to="/category/short-tv" className={`navLink ${isActive('/category/short-tv') ? 'active' : ''}`}>Short TV</Link>
        <Link to="/category/anime" className={`navLink ${isActive('/category/anime') ? 'active' : ''}`}>Anime</Link>
        <Link to="/category/western-tv" className={`navLink ${isActive('/category/western-tv') ? 'active' : ''}`}>Western TV</Link>
        <Link to="/category/indo-dub" className={`navLink ${isActive('/category/indo-dub') ? 'active' : ''}`}>Indo Dub</Link>
      </div>

      <div className="rightSection">
        <div ref={searchRef} style={{ position: 'relative' }}>
          <form className={`searchContainer ${isSearchOpen ? 'active' : ''}`} onSubmit={handleSearchSubmit}>
            <button type="button" className="iconButton" onClick={toggleSearch}>
              <Search size={20} />
            </button>
            <input
              type="text"
              className={`searchInput ${isSearchOpen ? 'open' : ''}`}
              placeholder="Titles, people, genres"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={() => { if (searchResults.length > 0) setShowDropdown(true); }}
            />
          </form>

          {showDropdown && searchResults.length > 0 && (
            <div className="searchDropdown">
              {searchResults.slice(0, 5).map(item => (
                <Link
                  key={item.id}
                  to={`/detail/${item.detailPath}`}
                  className="searchItem"
                  onClick={() => { setShowDropdown(false); setIsSearchOpen(false); setSearchQuery(''); }}
                >
                  <img src={item.poster} alt={item.title} className="searchItemPoster" />
                  <div className="searchItemInfo">
                    <div className="searchItemTitle">{item.title}</div>
                    <div className="searchItemMeta">{item.year} • {item.rating}</div>
                  </div>
                </Link>
              ))}
              <div
                onClick={handleSearchSubmit}
                className="searchViewAll"
              >
                See all results for "{searchQuery}"
              </div>
            </div>
          )}
        </div>

        <button
          className="iconButton mobileMenuBtn"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
