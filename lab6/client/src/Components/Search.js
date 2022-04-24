import { useState } from "react";
import React from 'react';

const SearchCharacters = (props) => {

  const [searchTerm, setSearchTerm] = useState(null);
  const handleChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleSubmit = (e) => {
    props.searchValue(searchTerm);
  }
  return (
    <form
      method='POST '
      onSubmit={(e) => {
        e.preventDefault();
        handleSubmit();
      }}
      name='formName'
      className='center'
    >
      <label>
        <span>{`Search Pokemon: `}</span>
        <input
          autoComplete='off'
          type='text'
          name='searchTerm'
          onChange={handleChange}
        />
      </label>

      <button type='submit'> Search</button>
    </form>
  );
};

export default SearchCharacters;
