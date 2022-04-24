import './App.css';
import Trainers from './Components/Trainers';
import './App.css';
import {BrowserRouter as Router, Route, Link, Routes} from 'react-router-dom';
import TrainerContext from './TrainerContext';
import React, {useState} from 'react';
import {useSelector} from 'react-redux';
import PokemonList from './Components/PokemonList';
import Pokemon from './Components/Pokemon';
import Home from './Components/Home';

function App() {

  const allTrainers = useSelector((state) => state.trainers);
  console.log(allTrainers);

  const [Trainer, setTrainer] = useState(allTrainers[0]);
  console.log(Trainer);

  return (
    <Router>
      <TrainerContext.Provider value={[Trainer, setTrainer]}>
      <div className='App'>
        <header className='App-header'>
          <h1 className='App-title'>
            Welcome to the Pokemon Application
          </h1>
          <Link className='showlink' to='/trainers'>
            Trainers
          </Link>

          <Link className='showlink' to='/'>
            Home
          </Link>

          <Link className='showlink' to='/pokemon/page/0'>
            Pokemons
          </Link>
        </header>
        <br />
        <br />
        <div className='App-body'>
          <Routes>
            <Route path='/' element={<Home />} />
            <Route path='/trainers' element={<Trainers />} />
            <Route path='/pokemon/page/:pagenum' element={<PokemonList />} />
            <Route path='/pokemon/:id' element={<Pokemon />} />            
          </Routes>
        </div>
      </div>
      </TrainerContext.Provider>
    </Router>

  );
}

export default App;
