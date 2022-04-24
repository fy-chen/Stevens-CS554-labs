import React, {useState, useEffect, useContext} from 'react';
import axios from 'axios';
import {Link, useParams} from 'react-router-dom';
import Search from './Search';
import noImage from '../img/download.jpeg';
import TrainerContext from '../TrainerContext';
import {useDispatch} from 'react-redux';
import actions from '../actions';

import {
  Card,
  CardActionArea,
  CardContent,
  CardMedia,
  Grid,
  Typography,
  makeStyles,
  Button
} from '@material-ui/core';

import '../App.css';
const useStyles = makeStyles({
  card: {
    maxWidth: 250,
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
const PokemonList = () => {
  const classes = useStyles();
  const [loading, setLoading] = useState(true);
  const [searchData, setSearchData] = useState(undefined);
  const [PokemonsData, setPokemonsData] = useState(undefined);
  const [searchTerm, setSearchTerm] = useState('');
  const [Trainer] = useContext(TrainerContext);
  const [showNext, setShowNext] = useState(true);
  const [showPrevious, setShowPrevious] = useState(true);
  const [showNotFound, setShowNotFound] = useState(false);
  const { pagenum } = useParams();
  let card = null;

  const dispatch = useDispatch();

  const handleCatchPokemon = (pokemon) => {
    dispatch(actions.catchPokemon(Trainer.id, pokemon.id));
  }

  const handleReleasePokemon = (pokemon) => {
    dispatch(actions.releasePokemon(Trainer.id, pokemon.id));
  }

  useEffect(() => {
    console.log('on load useeffect');
    async function fetchData() {
      try {
        setShowNotFound(false);
        if(!(/^\d+$/.test(pagenum))) {
          setShowNotFound(true);
        }else{
          const {data} = await axios.get(`/pokemon/page/${pagenum}`);
          setPokemonsData(data);
        }
        setLoading(false);
      } catch (e) {
        setShowNotFound(true);
        console.log(e);
      }
    }

    async function checkPagination() {
      try {
        setShowNext(true);
        if(pagenum === '0'){
          setShowPrevious(false);
        }else{ 
          setShowPrevious(true);
        }
        const { data } = await axios.get(`/pokemon/page/${Number(pagenum) + 1}`);
        console.log(data);
      } catch (e) {
        setShowNext(false);
        console.log(e);
      }
    }  
    
    fetchData();
    checkPagination();
  }, [pagenum]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    console.log('search useEffect fired');
    async function fetchData() {
      try {
        setShowNotFound(false);
        console.log(`in fetch searchTerm: ${searchTerm}`);
        const {data} = await axios.get(`https://pokeapi.co/api/v2/pokemon/${searchTerm}`);
        setSearchData([data]);
        setLoading(false);
      } catch (e) {
        setShowNotFound(true);
        console.log(e);
      }
    }
    if (searchTerm) {
      console.log('searchTerm is set');
      fetchData();
    }
  }, [searchTerm]); // eslint-disable-line react-hooks/exhaustive-deps

  const searchValue = async (value) => {
    setSearchTerm(value);
  };
  const buildCard = (pokemon) => {
    return (
      <Grid item xs={12} sm={6} md={4} lg={3} xl={2} key={pokemon.id}>
        <Card className={classes.card} variant='outlined'>
          <CardActionArea>
            <Link to={`/pokemon/${pokemon.id}`}>
              <CardMedia
                className={classes.media}
                component='img'
                image={
                  pokemon.sprites && pokemon.sprites.front_default
                    ? pokemon.sprites.front_default
                    : noImage
                }
                title='pokemon image'
              />

              <CardContent>
                <Typography
                  className={classes.titleHead}
                  gutterBottom
                  variant='h6'
                  component='h2'
                  color='textSecondary'
                >
                  {pokemon.species.name}
                </Typography>
              </CardContent>
            </Link>
          </CardActionArea>
          {Trainer && Trainer.pokemons.indexOf(pokemon.id) === -1 && Trainer.pokemons.length < 6 && <Button color='primary' onClick={(event) => {event.preventDefault(); handleCatchPokemon(pokemon)}}>Catch</Button>}
          {Trainer && Trainer.pokemons.indexOf(pokemon.id) !== -1 && Trainer.pokemons.length < 6 && <Button color='primary' onClick={(event) => {event.preventDefault(); handleReleasePokemon(pokemon)}}>Release</Button>}
          {!Trainer && <Button disabled color='primary'>No Trainer Selected</Button>}
          {Trainer && Trainer.pokemons.length >= 6 && <Button disabled color='primary'>Party Full</Button>}
        </Card>
      </Grid>
    );
  };

  if (searchTerm) {
    card =
      searchData &&
      searchData.map((pokemon) => {
        return buildCard(pokemon);
      });
  } else {
    card =
      PokemonsData &&
      PokemonsData.map((pokemon) => {
        return buildCard(pokemon);
      });
  }

  if (loading) {
    return (
      <div>
        <h2>Loading....</h2>
      </div>
    );
  } else {
    return (
      <div>
        {!showNotFound && <Search searchValue={searchValue}/>}
        <br />
        <br />
        {showPrevious && !showNotFound && !searchTerm && <Link className="showlink" to={`/pokemon/page/${Number(pagenum) - 1}`}>
          Previous
        </Link>}
        {showNext && !showNotFound  && !searchTerm && <Link className="showlink" to={`/pokemon/page/${Number(pagenum) + 1}`}>
          Next
        </Link>}
        <br />
        <br />
        {showNotFound && <p>404 No Pokemons Found</p>}
        <Grid container className={classes.grid} spacing={5}>
          {card}
        </Grid>
      </div>
    );
  }
};

export default PokemonList;
