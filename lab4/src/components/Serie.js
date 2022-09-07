import React, {useState, useEffect, useContext} from 'react';
import axios from 'axios';
import {Link, useParams} from 'react-router-dom';
import noImage from '../img/download.jpeg';
import ApiContext from '../ApiContext';
import {
  makeStyles,
  Card,
  CardContent,
  CardMedia,
  Typography,
  CardHeader
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

const Serie = (props) => {
  const [serieData, setSerieData] = useState(undefined);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const classes = useStyles();
  const [Api] = useContext(ApiContext);
  let {id} = useParams();

  /*const tConvert = (time) => {
    // Check correct time format and split into components
    time = time
      .toString()
      .match(/^([01]\d|2[0-3])(:)([0-5]\d)(:[0-5]\d)?$/) || [time];

    if (time.length > 1) {
      // If time format correct
      time = time.slice(1); // Remove full string match value
      time[5] = +time[0] < 12 ? 'AM' : 'PM'; // Set AM/PM
      time[0] = +time[0] % 12 || 12; // Adjust hours
    }
    return time.join(''); // return adjusted time or original string
  };*/
  const formatDate = (showdate) => {
    var year = showdate.substring(0, 4);
    var month = showdate.substring(5, 7);
    var day = showdate.substring(8, 10);
    return month + '/' + day + '/' + year;
  };
  useEffect(() => {
    console.log('useEffect fired');
    async function fetchData() {
      try {
        setNotFound(false);
        if(!(/^\d+$/.test(id))) {
          setNotFound(true);
        }else {
          const {data} = await axios.get(
            `${Api.baseUrl}/series/${id}?${Api.keyUrl}`
          );
          console.log(data);
          setSerieData(data.data.results[0]);
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

  let description = null;
  const regex = /(<([^>]+)>)/gi;
  if (serieData && serieData.description) {
    description = serieData && serieData.description.replace(regex, '');
  } else {
    description = 'No Description';
  }

  if (loading) {
    return (
      <div>
        <h2>Loading....</h2>
      </div>
    );
  }
  else if(notFound) {
    return <p>404 No Serie Found</p>
  } 
  else {
    return (
      <Card className={classes.card} variant='outlined'>
        <CardHeader className={classes.titleHead} title={serieData.title} />
        <CardMedia
          className={classes.media}
          component='img'
          image={
            serieData.thumbnail && serieData.thumbnail.path && serieData.thumbnail.extension
                    ? serieData.thumbnail.path + '.' + serieData.thumbnail.extension
                    : noImage
          }
          title='show image'
        />

        <CardContent>
          <Typography variant='body2' color='textSecondary' component='span'>
            <dl>
              <p>
                <dt className='title'>Characters:</dt>
                {serieData && serieData.characters.available ? (
                  <span>
                  {serieData.characters.items.map((character) => {
                    return <dd key={character.name}><Link className="showlink" to={character.resourceURI.slice(35)}>{character.name}<br /></Link></dd>
                  })
                  }
                  </span>
                ) : (
                  <dd>N/A</dd>
                )}
              </p>
              <p>
                <dt className='title'>Comics:</dt>
                {serieData && serieData.comics.available ? (
                  <span>
                  {serieData.comics.items.map((comic) => {
                    return <dd key={comic.name}><Link className="showlink" to={comic.resourceURI.slice(35)}>{comic.name}<br /></Link></dd>
                  })
                  }
                  </span>
                ) : (
                  <dd>N/A</dd>
                )}
              </p>
              <p>
                <dt className='title'>Stories:</dt>
                {serieData &&
                serieData.stories.available ? (
                  <span>
                  {serieData.stories.items.map((story) => {
                    return <dd key={story.name}>{`${story.type}: ${story.name}`}<br /></dd>
                  })
                  }
                  </span>
                ) : (
                  <dd>N/A</dd>
                )}
              </p>
              <p>
                <dt className='title'>Events:</dt>
                {serieData &&
                serieData.events.available ? (
                  <span>
                  {serieData.events.items.map((event) => {
                    return <dd key={event.name}>{event.name}<br /></dd>
                  })
                  }
                  </span>
                ) : (
                  <dd>N/A</dd>
                )}
              </p>
              <p>
                <dt className='title'>Creators:</dt>
                {serieData && serieData.creators.available ? (
                  <span>
                  {serieData.creators.items.map((creator) => {
                    return <dd key={creator.name}>{`${creator.role}: ${creator.name}`}<br /></dd>
                  })
                  }
                  </span>
                ) : (
                  <dd>N/A</dd>
                )}
              </p>
              <p>
                <dt className='title'>Modified Time:</dt>
                {serieData && serieData.modified ? (
                  <dd>{formatDate(serieData.modified)}</dd>
                ) : (
                  <dd>N/A</dd>
                )}
              </p>
              <p>
                <dt className='title'>Start Year:</dt>
                {serieData && serieData.startYear ? (
                  <dd>{serieData.startYear}</dd>
                ) : (
                  <dd>N/A</dd>
                )}
              </p>
              <p>
                <dt className='title'>End Year:</dt>
                {serieData && serieData.endYear ? (
                  <dd>{serieData.endYear}</dd>
                ) : (
                  <dd>N/A</dd>
                )}
              </p>
              <p>
                <dt className='title'>Rating:</dt>
                {serieData && serieData.rating ? (
                  <dd>{serieData.rating}</dd>
                ) : (
                  <dd>N/A</dd>
                )}
              </p>
              <p>
                <dt className='title'>Previous:</dt>
                {serieData && serieData.previous ? (
                  <dd><Link className="showlink" to={serieData.previous.resourceURI.slice(35)}>{serieData.previous.name}</Link><br /></dd>
                ) : (
                  <dd>N/A</dd>
                )}
              </p>
              <p>
                <dt className='title'>Next:</dt>
                {serieData && serieData.next ? (
                  <dd><Link className="showlink" to={serieData.next.resourceURI.slice(35)}>{serieData.next.name}</Link><br /></dd>
                ) : (
                  <dd>N/A</dd>
                )}
              </p>
              <p>
                <dt className='title'>Description:</dt>
                <dd>{description}</dd>
              </p>
            </dl>
            <Link className="backLink" to='/series/page/0'>Back to all series...</Link>
          </Typography>
        </CardContent>
      </Card>
    );
  }
};

export default Serie;