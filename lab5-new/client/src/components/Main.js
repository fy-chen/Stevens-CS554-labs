import React, {useState, useEffect} from 'react';
import './App.css';
import { useLocation } from 'react-router-dom';
import {useLazyQuery, useMutation} from '@apollo/client';
import DeleteImageModal from './modals/DeleteImageModal';
import queries from '../queries';
import {NavLink} from 'react-router-dom';

function Main() {
  const [pageNum, setPageNum] = useState(1);
  const [imageData, setimageData] = useState([]);
  const location = useLocation();
  const [showGetMore, setShowGetMore] = useState(false);
  const [showDelete, setShowDelete] = useState(false);
  const [showUpload, setShowUpload] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteImage, setDeleteImage] = useState(null);
  const [mainStream, setMainStream] = useState(false);
  const [showPopularity, setShowPopularity] = useState(false);

  const [getUnsplash, { loading: unsplashLoading, error: unsplashError, data: unsplashData, refetch: refetchUnsplash }] = useLazyQuery(queries.GET_UNSPLASH, {
      variables: {
        pageNum: pageNum
      },
      fetchPolicy: 'network-only'
    });
  const [getBinned, { loading: binnedLoading, error: binnedError, data: binnedData }] = useLazyQuery(queries.GET_BINNED, { fetchPolicy: 'network-only' });
  const [getPosted, { loading: postedLoading, error: postedError, data: postedData }] = useLazyQuery(queries.GET_POSTED, { fetchPolicy: 'network-only' });
  const [getTopTen, { loading: topTenLoading, error: topTenError, data: topTenData }] = useLazyQuery(queries.GET_TOP_TEN, { fetchPolicy: 'network-only' });

  const [updateImage, {error: updateError}] = useMutation(queries.UPDATE_IMAGE);

  const handleOpenDeleteModal = (image) => {
    setShowDeleteModal(true);
    setDeleteImage(image);
  };

  const handleCloseModals = () => {
    setShowDeleteModal(false);
  };

  useEffect(() => {
    if(location.pathname === '/') {
      getUnsplash();
      setShowGetMore(true);
    }else if (location.pathname === '/my-bin') {
      setShowPopularity(true);
      getBinned();
    }else if(location.pathname === '/my-posts') {
      setShowDelete(true);
      setShowUpload(true);
      getPosted();
    }else if(location.pathname === '/popularity') {
      getTopTen();
    }
  }, []);// eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    console.log('fired unsplash');
    if (unsplashData) {
      setimageData(imageData.concat(unsplashData.unsplashImages));
    }
  }, [unsplashLoading]);// eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    console.log('fired bin');
    if (binnedData) {
      setimageData(binnedData.binnedImages);
    }
  }, [binnedLoading]);// eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    console.log('fired POSTED');
    if (postedData) {
      setimageData(postedData.userPostedImages);
    }
  }, [postedLoading]);// eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    console.log('fired top ten');
    if (topTenData) {
      setimageData(topTenData.getTopTenBinnedPosts);
      let imageList = topTenData.getTopTenBinnedPosts;
      let sumNum = 0;
      for (let x of imageList) {
        sumNum = sumNum + Number(x.numBinned);
      }
      if(sumNum >= 200) {
        setMainStream(true);
      }
    }
  }, [topTenLoading]);// eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if(location.pathname === '/'){
      refetchUnsplash();
    }
    console.log('fired');
  }, [pageNum]);// eslint-disable-line react-hooks/exhaustive-deps

  if (imageData) {
    console.log(imageData);
    return (
      <div>
        <br />
        <br />
        {showUpload && <NavLink className='new-post-navlink' to='/new-post'>
                Upload Image
              </NavLink>}
        {showPopularity && <NavLink className='new-post-navlink' to='/popularity'>
                To top ten binned images
              </NavLink>}
        
        {location.pathname === '/popularity' && <p className='card'>You are {mainStream === true? 'Mainstream': 'Non-mainstream'}</p>}
        <br />
        <br />
        {imageData.map((image) => {
          return (
            <div className='card' key={image.id}>
              <div className='card-body'>
                <h5 className='card-title'>
                  Image by: {image.posterName}
                </h5>
                <br />
                <img className='card' src={image.url} alt={image.id}/>
                Description: {image.description ? image.description : 'No Description'}
                <br />
                <br />
                {!image.binned && <button onClick={(event) => {
                  event.preventDefault();
                  updateImage({
                    variables: {
                      id: image.id,
                      url: image.url,
                      posterName: image.posterName,
                      userPosted: image.userPosted,
                      description: image.description,
                      binned: true
                    }
                  });
              
                  if(location.pathname === '/my-bin'){
                    window.location.reload();
                  }else {
                    let imageList = imageData;
                    for(let x of imageList) {
                      if(x.id === image.id) {
                        x.binned = !image.binned;
                      }
                    }
                    setimageData(imageList);
                  }

                  alert('Image Updated');
                }}>Add to bin</button>}
                {image.binned && <button onClick={(event) => {
                  event.preventDefault();
                  updateImage({
                    variables: {
                      id: image.id,
                      url: image.url,
                      posterName: image.posterName,
                      userPosted: image.userPosted,
                      description: image.description,
                      binned: false
                    }
                  });
              
                  if(location.pathname === '/my-bin' || location.pathname === '/popularity'){
                    window.location.reload();
                  }else {
                    let imageList = imageData;
                    for(let x of imageList) {
                      if(x.id === image.id) {
                        x.binned = !image.binned;
                      }
                    }
                    setimageData(imageList);
                  }
                  
                  alert('Image Updated');
                }}>Remove from bin</button>}
                {location.pathname === '/popularity' && <p>Liked: {image.numBinned}</p>}
              </div>
              {showDelete && <button onClick={() => {
                    handleOpenDeleteModal(image);
                  }}>Delete</button>}
            </div>
          );
        })}
        {showGetMore && <button className='getMore-button' onClick={() => {setPageNum(pageNum + 1);}}>Get more</button>}

        {showDeleteModal && showDeleteModal && (
          <DeleteImageModal
            isOpen={showDeleteModal}
            handleClose={handleCloseModals}
            deleteImage={deleteImage}
          />
        )}

      </div>
    );
  } else if (unsplashLoading || binnedLoading || postedLoading || topTenLoading) {
    return <div>Loading</div>;
  } else if (unsplashError) {
    return <div>{unsplashError.message}</div>;
  }else if (binnedError) {
    return <div>{binnedError.message}</div>;
  }else if (postedError) {
    return <div>{postedError.message}</div>;
  }else if (updateError) {
    return <div>{updateError.message}</div>;
  }else if (topTenError) {
    return <div>{topTenError.message}</div>;
  }
}

export default Main;
