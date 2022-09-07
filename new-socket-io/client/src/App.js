import React, {useEffect, useRef, useState} from 'react';
import io from 'socket.io-client';
import './App.css';

function App() {
  const [state, setState] = useState({message: '', name: ''});
  const [chat, setChat] = useState([]);

  const [currentRoomId, setCurrentRoomId] = useState('');
  const socketRef = useRef();

  useEffect(() => {
    socketRef.current = io('/');
    return () => {
      socketRef.current.disconnect();
    };
  }, []);

  useEffect(() => {
    socketRef.current.on('receive-message', ({name, message}) => {
      setChat([...chat, {name, message}]);
    });
    socketRef.current.on('joined-room', function (data) {
      setChat([
        ...chat,
        {name: 'ChatBot', message: `${data.name} has joined the chat`}
      ]);
      setCurrentRoomId(data.roomId);
    });
  }, [chat]);

  const userjoin = (name) => {
    socketRef.current.emit("join-room", {
			newRoom: "general",
			previousRoom: currentRoomId,
      name: name
		});
    setCurrentRoomId('general');
  };

  const onMessageSubmit = (e) => {
    let msgEle = document.getElementById('message');
    console.log([msgEle.name], msgEle.value);
    setState({...state, [msgEle.name]: msgEle.value});
    let room = currentRoomId;
    socketRef.current.emit('send-message', {
      name: state.name,
      message: msgEle.value,
      room: room
    });
    e.preventDefault();
    setState({message: '', name: state.name});
    msgEle.value = '';
    msgEle.focus();
  };

  const renderChat = () => {
    return chat.map(({name, message}, index) => (
      <div key={index}>
        <h3>
          {name}: <span>{message}</span>
        </h3>
      </div>
    ));
  };

  const change = (event) => {
		let newRoom = event.target.value;

		if (newRoom === currentRoomId) {
			return;
		}
    setChat([]);

		socketRef.current.emit("join-room", {
			newRoom: newRoom,
			previousRoom: currentRoomId,
      name: state.name
		});

    setCurrentRoomId(newRoom);
  }

  return (
    <div>
      <select id="room-selector" onChange={change}>
			<option value="">Chat Rooms</option>
			<option value="general">General</option>
      <option value="trains">Trains</option>
      </select>
      {state.name && (
        <div className='card'>
          <div className='render-chat'>
            <h1>Chat Log</h1>
            {renderChat()}
          </div>
          <form onSubmit={onMessageSubmit}>
            <h1>Messenger</h1>
            <div>
              <input
                name='message'
                id='message'
                variant='outlined'
                label='Message'
              />
            </div>
            <button>Send Message</button>
          </form>
        </div>
      )}

      {!state.name && (
        <form
          className='form'
          onSubmit={(e) => {
            console.log(document.getElementById('username_input').value);
            e.preventDefault();
            setState({name: document.getElementById('username_input').value});
            userjoin(document.getElementById('username_input').value);
            // userName.value = '';
          }}
        >
          <div className='form-group'>
            <label>
              User Name:
              <br />
              <input id='username_input' />
            </label>
          </div>
          <br />

          <br />
          <br />
          <button type='submit'> Click to join</button>
        </form>
      )}
    </div>
  );
}

export default App;
