import React, {useState} from 'react';
import logo from './img/Marvel_Logo.svg.png';
import './App.css';
import Home from './components/Home';
import {BrowserRouter as Router, Route, Link, Routes} from 'react-router-dom';
import CharacterList from './components/CharacterList';
import Character from './components/Character';
import SerieList from './components/SerieList';
import Serie from './components/Serie';
import ComicList from './components/ComicList';
import Comic from './components/Comic';
import ApiContext from './ApiContext';

const md5 = require('blueimp-md5');
const publickey = '78452579ff3530955e6fae0c7a2db28f';
const privatekey = '95f7508456c714bf11cde63461fe2d79ce81fad8';
const ts = new Date().getTime();
const stringToHash = ts + privatekey + publickey;
const hash = md5(stringToHash);
const baseUrl = 'https://gateway.marvel.com:443/v1/public/';
const keyUrl = 'ts=' + ts + '&apikey=' + publickey + '&hash=' + hash;

const App = () => {
  
const [Api, setApi] = useState({baseUrl: baseUrl, keyUrl: keyUrl});

  return (
    <Router>
      <ApiContext.Provider value={[Api, setApi]}>
      <div className='App'>
        <header className='App-header'>
          <img src={logo} className='App-logo' alt='logo' />
          <h1 className='App-title'>
            Welcome to the React.js Marvel API Example
          </h1>
          <Link className='showlink' to='/'>
            Home
          </Link>
          <Link className='showlink' to='/characters/page/0'>
            Characters
          </Link>
          <Link className='showlink' to='/series/page/0'>
            Series
          </Link>
          <Link className='showlink' to='/comics/page/0'>
            Comics
          </Link>
        </header>
        <br />
        <br />
        <div className='App-body'>
          <Routes>
            <Route path='/' element={<Home />} />
            <Route path='/characters/page/:page' element={<CharacterList />} />
            <Route path='/characters/:id' element={<Character />} />
            <Route path='/series/page/:page' element={<SerieList />} />
            <Route path='/series/:id' element={<Serie />} />
            <Route path='/comics/page/:page' element={<ComicList />} />
            <Route path='/comics/:id' element={<Comic />} />
          </Routes>
        </div>
      </div>
      </ApiContext.Provider>
    </Router>
  );
};

export default App;
