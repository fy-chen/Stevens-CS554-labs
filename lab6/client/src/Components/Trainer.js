import {useDispatch} from 'react-redux';
import React, {useContext, useEffect, useState} from 'react';
import {useSelector} from 'react-redux';
import actions from '../actions';
import TrainerContext from '../TrainerContext';
import axios from 'axios';
import noImage from '../img/download.jpeg';

function User(props) {

  const [Trainer, setTrainer] = useContext(TrainerContext);

  const [pokemons, setPokemons] = useState([]);

  const [loadingPokemon, setLoadingPokemon] = useState(false);

  const allTrainers = useSelector((state) => state.trainers);

  const dispatch = useDispatch();

  const deleteTrainer = () => {
    dispatch(actions.deleteTrainer(props.trainer.id));
    if(Trainer.id === props.trainer.id){
      if(allTrainers[0].id === props.trainer.id){
        setTrainer(allTrainers[1]);
      } else {
        setTrainer(allTrainers[0]);
      }
    }
  };

  const selectTrainer = (e) => {
    e.preventDefault();
    setTrainer(props.trainer);
  }

  useEffect(() => {
    async function fetchData() {
      try {

        setLoadingPokemon(true);

        let pokemons = [];
        for(let pokemon of props.trainer.pokemons) {
          const {data} = await axios.get(`/pokemon/${pokemon}`);
          pokemons.push(data);
        }

        setPokemons(pokemons);
        setLoadingPokemon(false);

      } catch (e) {
        console.log(e);
      }
    }
    
    fetchData();
  }, [props.trainer]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div className='todo-wrapper'>
      <table>
        <tbody>
          <tr>
            <td>Name:</td>
            <td>{props.trainer.name}</td>
          </tr>

          <tr>
            <td>Pokemon:</td>
          </tr>
          <tr>
            <td>{loadingPokemon && 'Loading...'}</td>
            <td>{!loadingPokemon && pokemons.length !== 0 && pokemons.map((pokemon) => {
              return(<a href={`/pokemon/${pokemon.id}`}><img className="pokemon-img" key={pokemon.id} src={pokemon.sprites.front_default ? pokemon.sprites.front_default : noImage} alt={pokemon.id}/></a>);
            })}</td>
          </tr>
          <br />
          <tr>
            <td>
              <button onClick={deleteTrainer}>Delete Trainer</button>
            </td>
            <td>
              <button disabled={Trainer ? Trainer.id === props.trainer.id : false} onClick={selectTrainer}>Select Trainer</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}

export default User;
