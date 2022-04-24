const express = require('express');
const router = express.Router();
const pokemonData = require('../data/pokemon');

router.get('/page/:pagenum', async (req, res) => {

    let pagenum = req.params.pagenum;

    try {
        pokemonData.checkNumber(pagenum);
        pagenum = Number(pagenum);
    } catch (e) {
        res.status(500).json({ error: e });
        return; 
    }

    try {
        const pokemons = await pokemonData.getPokemonsByPage(pagenum);
        if(pokemons === 'No Pokemons Found') {
            res.status(404).json({ error: pokemons });
            return;
        }
        res.status(200).json(pokemons);
    } catch (e) {
        res.status(500).json({ error: e }); 
    }

});

router.get('/:id', async (req, res) => {

    let id = req.params.id;

    try {
        pokemonData.checkNumber(id);
        const pokemon = await pokemonData.getPokemonById(id);
        if(pokemon === 'Pokemon Not Found') {
            res.status(404).json({ error: pokemon });
            return;
        }
        res.status(200).json(pokemon);
    } catch (e) {
        res.status(500).json({ error: e }); 
    }

});


module.exports = router;