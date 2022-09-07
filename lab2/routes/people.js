const express = require('express');
const router = express.Router();
const data = require('../data/data');
const bluebird = require('bluebird');
const redis = require('redis');
const client = redis.createClient();

bluebird.promisifyAll(redis.RedisClient.prototype);
bluebird.promisifyAll(redis.Multi.prototype);

router.get('/:id([0-9]+)', async (req, res) => {
    
    try {
        let cacheUserExists = await client.getAsync(req.params.id);
        if (cacheUserExists) {
            const user = JSON.parse(cacheUserExists);
            await client.lpushAsync("history", cacheUserExists);
            res.json(user);
        } else {
            const user = await data.getById(req.params.id);
            const jsonUser = JSON.stringify(user);
            await client.setAsync(user.id, jsonUser);
            await client.lpushAsync("history", jsonUser);
            res.json(user);
        }
    } catch (e) {
      res.status(500).json({error: e});
    }

});

router.get('/history', async (req, res) => {
    
    try {
        let cacheHistory = await client.lrangeAsync('history', 0, 19);
        if (cacheHistory) {
            for(let x of cacheHistory) {
                x = JSON.parse(x);
            }
            res.json(cacheHistory);
        } else {
            res.json({result: "No recent view now"});
        }
    } catch (e) {
      res.status(500).json({error: e});
    }
    
});

module.exports = router;