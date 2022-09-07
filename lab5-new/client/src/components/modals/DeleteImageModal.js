import React, {useState} from 'react';
import '../App.css';
import {useMutation} from '@apollo/client';
import ReactModal from 'react-modal';

//Import the file where my query constants are defined
import queries from '../../queries';

//For react-modal
ReactModal.setAppElement('#root');
const customStyles = {
  content: {
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    marginRight: '-50%',
    transform: 'translate(-50%, -50%)',
    width: '50%',
    border: '1px solid #28547a',
    borderRadius: '4px'
  }
};

function DeleteImageModal(props) {
  const [showDeleteModal, setShowDeleteModal] = useState(props.isOpen);
  const [image, setImage] = useState(props.deleteImage);

  const [removeImage] = useMutation(queries.DELETE_IMAGE);

  const handleCloseDeleteModal = () => {
    setShowDeleteModal(false);
    setImage(null);
    props.handleClose();
  };

  return (
    <div>
      {/*Delete Image Modal */}
      <ReactModal
        name='deleteModal'
        isOpen={showDeleteModal}
        contentLabel='Delete Image'
        style={customStyles}
      >
        {/*Here we set up the mutation, since I want the data on the page to update
				after I have added someone, I need to update the cache. If not then
				I need to refresh the page to see the data updated 

				See: https://www.apollographql.com/docs/react/essentials/mutations for more
				information on Mutations
			*/}
        <div>
          <p>
            Are you sure you want to delete this Image?
          </p>

          <form
            className='form'
            id='delete-image'
            onSubmit={(e) => {
              e.preventDefault();

              console.log(image.id);
              removeImage({
                variables: {
                  id: image.id
                }
              });
              setShowDeleteModal(false);

              alert('Image Deleted');
              props.handleClose();
              window.location.reload();
            }}
          >
            <br />
            <br />
            <button className='button add-button' type='submit'>
              Delete Image
            </button>
          </form>
        </div>

        <br />
        <br />
        <button
          className='button cancel-button'
          onClick={handleCloseDeleteModal}
        >
          Cancel
        </button>
      </ReactModal>
    </div>
  );
}

export default DeleteImageModal;
