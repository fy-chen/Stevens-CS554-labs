import {v4 as uuid} from 'uuid';
const initalState = [
  {
    id: uuid(),
    name: 'Satoshi',
    pokemons: [25, 1, 6, 7, 18, 99]
  }
];

let copyState = null;
let index = 0;
let pokemonIndex = 0;

const trainerReducer = (state = initalState, action) => {
  const {type, payload} = action;

  switch (type) {
    case 'ADD_TRAINER':
      console.log('payload', payload);
      return [...state, {id: uuid(), name: payload.name, pokemons: []}];
    case 'DELETE_TRAINER':
      copyState = [...state];
      index = copyState.findIndex((x) => x.id === payload.id);
      copyState.splice(index, 1);
      return [...copyState];
    case 'CATCH_POKEMON':
      copyState = [...state];
      index = copyState.findIndex((x) => x.id === payload.userId);
      copyState[index].pokemons.push(payload.pokemonId);
      return [...copyState];
    case 'RELEASE_POKEMON':
      copyState = [...state];
      index = copyState.findIndex((x) => x.id === payload.userId);
      pokemonIndex = copyState[index].pokemons.findIndex((x) => x === payload.pokemonId);
      copyState[index].pokemons.splice(pokemonIndex, 1);
      return [...copyState];
    default:
      return state;
  }
};

export default trainerReducer;
