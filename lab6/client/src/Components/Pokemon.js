import React, {useState, useEffect, useContext} from 'react';
import axios from 'axios';
import {Link, useParams} from 'react-router-dom';
import noImage from '../img/download.jpeg';
import TrainerContext from '../TrainerContext';
import {useDispatch} from 'react-redux';
import actions from '../actions';

import {
  makeStyles,
  Card,
  CardContent,
  CardMedia,
  Typography,
  CardHeader,
  Button
} from '@material-ui/core';
import '../App.css';
const useStyles = makeStyles({
  card: {
    maxWidth: 550,
    height: 'auto',
    marginLeft: 'auto',
    marginRight: 'auto',
    borderRadius: 5,
    border: '1px solid #1e8678',
    boxShadow: '0 19px 38px rgba(0,0,0,0.30), 0 15px 12px rgba(0,0,0,0.22);'
  },
  titleHead: {
    borderBottom: '1px solid #1e8678',
    fontWeight: 'bold'
  },
  grid: {
    flexGrow: 1,
    flexDirection: 'row'
  },
  media: {
    height: '100%',
    width: '100%'
  },
  button: {
    color: '#1e8678',
    fontWeight: 'bold',
    fontSize: 12
  }
});

const Pokemon = (props) => {
  const [pokemonData, setPokemonData] = useState(undefined);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const classes = useStyles();
  const [Trainer] = useContext(TrainerContext);
  let {id} = useParams();

  useEffect(() => {
    console.log('useEffect fired');
    async function fetchData() {
      try {
        setNotFound(false);
        if(!(/^\d+$/.test(id))) {
          setNotFound(true);
        }else {
          const {data} = await axios.get(
            `/pokemon/${id}`
          );
          console.log(data);
          setPokemonData(data);
        }
        setLoading(false);
      } catch (e) {
        setNotFound(true);
        setLoading(false);
        console.log(e);
      }
    }
    fetchData();
  }, [id]);// eslint-disable-line react-hooks/exhaustive-deps

  const dispatch = useDispatch();

  const handleCatchPokemon = (pokemon) => {
    dispatch(actions.catchPokemon(Trainer.id, pokemon.id));
  }

  const handleReleasePokemon = (pokemon) => {
    dispatch(actions.releasePokemon(Trainer.id, pokemon.id));
  }

  if (loading) {
    return (
      <div>
        <h2>Loading....</h2>
      </div>
    );
  } 
  else if(notFound) {
    return <p>404 No Pokemon Found</p>
  }
  else {
    return (
      <Card className={classes.card} variant='outlined'>
        <CardHeader className={classes.titleHead} title={pokemonData.name} />
        <CardMedia
          className={classes.media}
          component='img'
          image={
            pokemonData.sprites && pokemonData.sprites.front_default
                    ? pokemonData.sprites.front_default
                    : noImage
          }
          title='pokemon image'
        />

        <CardContent>
          <Typography variant='body2' color='textSecondary' component='span'>
            <dl>
            <p>
              <dt className='title'> ID: </dt> <br />
                {pokemonData.id ? 
                  <dd key={pokemonData.id}>{pokemonData.id}<br /></dd>
                 : 'N/A'}
              </p>
              <p>
              <dt className='title'> Abilities: </dt> <br />
                {pokemonData.abilities.length > 0 ? pokemonData.abilities.map((ability) => {
                  return (<dd key={ability.ability.name}>{ability.ability.name}{ability.is_hidden && ' (hidden)'}<br /></dd>);
                }) : 'N/A'}
              </p>
              <p>
              <dt className='title'> Stats: </dt> <br />
                {pokemonData.stats.length > 0 ? pokemonData.stats.map((stat) => {
                  return(<dd key={stat.stat.name}>{`${stat.stat.name}: ${stat.base_stat}`}<br /></dd>);
                }) : 'N/A'}
              </p>
              <p>
              <dt className='title'> Image: </dt> <br />
              <dd key={pokemonData.sprites.front_default}><img className="pokemon-img" src={pokemonData.sprites.front_default ? pokemonData.sprites.front_default : noImage} alt={pokemonData.name}/></dd>
              <dd key={pokemonData.sprites.front_shiny}><img className="pokemon-img" src={pokemonData.sprites.front_shiny ? pokemonData.sprites.front_shiny : noImage} alt={pokemonData.name}/></dd><br />
              <dd key={pokemonData.sprites.back_default}><img className="pokemon-img" src={pokemonData.sprites.back_default ? pokemonData.sprites.back_default : noImage} alt={pokemonData.name}/></dd>
              <dd key={pokemonData.sprites.back_shiny}><img className="pokemon-img" src={pokemonData.sprites.back_shiny ? pokemonData.sprites.back_shiny : noImage} alt={pokemonData.name}/></dd><br />
              </p>
            </dl>
            {Trainer && Trainer.pokemons.indexOf(pokemonData.id) === -1 && Trainer.pokemons.length < 6 && <Button color='primary' onClick={(event) => {event.preventDefault(); handleCatchPokemon(pokemonData)}}>Catch</Button>}
            {Trainer && Trainer.pokemons.indexOf(pokemonData.id) !== -1 && Trainer.pokemons.length < 6 && <Button color='primary' onClick={(event) => {event.preventDefault(); handleReleasePokemon(pokemonData)}}>Release</Button>}
            {!Trainer && <Button disabled color='primary'>No Trainer Selected</Button>}
            {Trainer && Trainer.pokemons.length >= 6 && <Button disabled color='primary'>Party Full</Button>}
            <br />
            <Link className="backLink" to='/pokemon/page/0'>Back to all pokemons...</Link>
          </Typography>
        </CardContent>
      </Card>
    );
  }
};

export default Pokemon;
