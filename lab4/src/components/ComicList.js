import React, {useState, useEffect, useContext} from 'react';
import axios from 'axios';
import {Link, useParams} from 'react-router-dom';
import Search from './Search';
import noImage from '../img/download.jpeg';
import ApiContext from '../ApiContext';

import {
  Card,
  CardActionArea,
  CardContent,
  CardMedia,
  Grid,
  Typography,
  makeStyles
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
const ComicList = () => {
  const regex = /(<([^>]+)>)/gi;
  const classes = useStyles();
  const [loading, setLoading] = useState(true);
  const [searchData, setSearchData] = useState(undefined);
  const [ComicData, setComicData] = useState(undefined);
  const [searchTerm, setSearchTerm] = useState('');
  const [Api] = useContext(ApiContext);
  const [showNext, setShowNext] = useState(true);
  const [showPrevious, setShowPrevious] = useState(true);
  const [showNotFound, setShowNotFound] = useState(false);
  const { page } = useParams();
  let card = null;

  useEffect(() => {
    console.log('on load useeffect');
    async function fetchData() {
      try {
        setShowNotFound(false);
        if(!(/^\d+$/.test(page))) {
          setShowNotFound(true);
        }else{
          const offset = Number(page) * 20;
          const {data} = await axios.get(Api.baseUrl + 'comics?offset=' + offset + '&' + Api.keyUrl);
          if(data.data.results.length === 0){
            setShowNotFound(true);
          }else{
            setComicData(data.data.results);
          }
        } 
        setLoading(false);
      } catch (e) {
        console.log(e);
      }
    }

    async function checkPagination() {
      try {
        const offset = (Number(page) + 1) * 20;
        const { data } = await axios.get(Api.baseUrl + 'comics?offset=' + offset + '&' + Api.keyUrl);
        if(data.data.results.length === 0){
          setShowNext(false);
        }else{
          setShowNext(true);
        }
        if(page === '0'){
          setShowPrevious(false);
        }else{
          setShowPrevious(true);
        }
      } catch (e) {
        console.log(e);
      }
    }  
    
    fetchData();
    checkPagination();
  }, [page]);// eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    console.log('search useEffect fired');
    async function fetchData() {
      try {
        console.log(`in fetch searchTerm: ${searchTerm}`);
        const {data} = await axios.get(Api.baseUrl + 'comics?titleStartsWith=' + searchTerm + '&' + Api.keyUrl);
        setSearchData(data.data.results);
        setLoading(false);
      } catch (e) {
        console.log(e);
      }
    }
    if (searchTerm) {
      console.log('searchTerm is set');
      fetchData();
    }
  }, [searchTerm]);// eslint-disable-line react-hooks/exhaustive-deps

  const searchValue = async (value) => {
    setSearchTerm(value);
  };
  const buildCard = (comic) => {
    return (
      <Grid item xs={12} sm={6} md={4} lg={3} xl={2} key={comic.id}>
        <Card className={classes.card} variant='outlined'>
          <CardActionArea>
            <Link to={`/comics/${comic.id}`}>
              <CardMedia
                className={classes.media}
                component='img'
                image={
                  comic.thumbnail && comic.thumbnail.path && comic.thumbnail.extension
                    ? comic.thumbnail.path + '.' + comic.thumbnail.extension
                    : noImage
                }
                title='comic image'
              />

              <CardContent>
                <Typography
                  className={classes.titleHead}
                  gutterBottom
                  variant='h6'
                  component='h2'
                  color='textSecondary'
                >
                  {comic.title}
                </Typography>
                <Typography variant='body2' color='textSecondary' component='p'>
                  {comic.description
                    ? comic.description.replace(regex, '').substring(0, 139) + '...'
                    : 'No Description...'}
                  <span>More Info</span>
                </Typography>
              </CardContent>
            </Link>
          </CardActionArea>
        </Card>
      </Grid>
    );
  };

  if (searchTerm) {
    card =
      searchData &&
      searchData.map((comic) => {
        return buildCard(comic);
      });
  } else {
    card =
      ComicData &&
      ComicData.map((comic) => {
        return buildCard(comic);
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
        {!showNotFound && <Search searchValue={searchValue} content='Comics'/>}
        <br />
        <br />
        {showPrevious && !showNotFound && !searchTerm && <Link className="showlink" to={`/comics/page/${Number(page) - 1}`}>
          Previous
        </Link>}
        {showNext && !showNotFound && !searchTerm && <Link className="showlink" to={`/comics/page/${Number(page) + 1}`}>
          Next
        </Link>}
        <br />
        <br />
        {showNotFound && <p>404 No Comics Found</p>}
        <Grid container className={classes.grid} spacing={5}>
          {card}
        </Grid>
      </div>
    );
  }
};

export default ComicList;