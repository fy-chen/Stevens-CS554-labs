import React from 'react';
import './App.css';
import {NavLink, BrowserRouter as Router, Route} from 'react-router-dom';

import Main from './Main';
import NewPost from './NewPost';

import {
  ApolloClient,
  HttpLink,
  InMemoryCache,
  ApolloProvider
} from '@apollo/client';
const client = new ApolloClient({
  cache: new InMemoryCache(),
  link: new HttpLink({
    uri: 'http://localhost:4000'
  })
});

function App() {
  return (
    <ApolloProvider client={client}>
      <Router>
        <div>
          <header className='App-header'>
            <h1 className='App-title'>
              GraphQL With Apollo Client/Server Demo
            </h1>
            <nav>
              <NavLink className='navlink' to='/my-bin'>
                My bin
              </NavLink>
              <NavLink className='navlink' to='/'>
                Images
              </NavLink>
              <NavLink className='navlink' to='/my-posts'>
                My Posts
              </NavLink>
            </nav>
          </header>
          <Route exact path='/' component={Main} />
          <Route path='/my-bin/' component={Main} />
          <Route path='/my-posts/' component={Main} />
          <Route path='/new-post/' component={NewPost} />
          <Route path='/popularity/' component={Main} />
        </div>
      </Router>
    </ApolloProvider>
  );
}

export default App;
