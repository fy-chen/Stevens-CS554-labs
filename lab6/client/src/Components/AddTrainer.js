import {useState} from 'react';
import {useDispatch} from 'react-redux';
import actions from '../actions';

function AddUser() {
  const dispatch = useDispatch();
  const [name, setName] = useState('');

  const handleChange = (e) => {
    setName(e.target.value);
  };
  const addTrainer = () => {
    dispatch(actions.addTrainer(name));
    setName('')
  };

  return (
    <div className='add'>
      <div className='input-selection'>
        <label>
          Trainers:
          <input
            onChange={(e) => handleChange(e)}
            id='name'
            name='name'
            placeholder='Name...'
            value={name}
          />
        </label>
      </div>
      <button onClick={addTrainer}>Add Trainer</button>
    </div>
  );
}

export default AddUser;
