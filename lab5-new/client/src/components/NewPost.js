import React from 'react';
import './App.css';
import {useMutation} from '@apollo/client';
import queries from '../queries';
import { useHistory } from "react-router-dom";

function NewPost() {

  const history = useHistory();
  const [uploadImage, {error}] = useMutation(queries.UPLOAD_IMAGE);

  if(error){
    return <div>{error.message}</div>;
  }else{
    return (
      <form
          className='form upload-form'
          id='add-employer'
          onSubmit={(e) => {
            e.preventDefault();
            uploadImage({
              variables: {
                url: e.target.url.value,
                posterName: e.target.posterName.value,
                description: e.target.description.value
              }
            });
  
            alert('Image Uploaded');
            history.push('./my-posts');
          }}
        >
          <div className='form-group'>
            <label>
              URL:
              <br />
              <input
                type='text'
                name='url'
                required
              />
            </label>
            <br />
            <label>
              Poster:
              <br />
              <input
                type='text'
                name='posterName'
              />
            </label>
            <br />
            <label>
              Description:
              <br />
              <input
                type='text'
                name='description'
              />
            </label>
          </div>

          <br />
          <button className='button' type='submit'>
            Upload Image Post
          </button>
        </form>
    );
  }
}

export default NewPost;
