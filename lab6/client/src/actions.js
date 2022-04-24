const addTrainer = (name) => ({
  type: 'ADD_TRAINER',
  payload: {
    name: name
  }
});

const deleteTrainer = (id) => ({
  type: 'DELETE_TRAINER',
  payload: {id: id}
});

const catchPokemon = (userId, pokemonId) => ({
  type: 'CATCH_POKEMON',
  payload: {userId: userId, pokemonId: pokemonId}
});

const releasePokemon = (userId, pokemonId) => ({
  type: 'RELEASE_POKEMON',
  payload: {userId: userId, pokemonId: pokemonId}
});

module.exports = {
  addTrainer,
  deleteTrainer,
  catchPokemon,
  releasePokemon
};
