const axios = require('axios');

const checkNumber = (input, name) => {
    if(!(/^\d+$/.test(input))) throw `Provided ${name} should be a number`;
    return true;
}

const getPokemonsByPage = async (pagenum) => {
    
    checkNumber(pagenum, 'Page');
    pagenum = Number(pagenum);
    const url = `https://pokeapi.co/api/v2/pokemon/?offset=${pagenum * 20}&limit=20`;
    const {data} = await axios.get(url);

    if(data.results.length === 0) {
        return 'No Pokemons Found';
    } else {
        let result = [];
        for (let pokemon of data.results) {
            const {data: pokemonData} = await axios.get(pokemon.url);
            result.push(pokemonData);
        }
        return result;
    }
} 

const getPokemonById = async (id) => {

    checkNumber(id, 'Pokemon Id');
    const url = `https://pokeapi.co/api/v2/pokemon/${id}/`;
    try{
        const {data} = await axios.get(url);
        return data;
    } catch (e) {
        return 'Pokemon Not Found';
    }
    
}

module.exports = {
    getPokemonById,
    getPokemonsByPage,
    checkNumber,
}