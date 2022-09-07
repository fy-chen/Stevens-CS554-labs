const axios = require("axios");

async function getData(){

    let { data } = await axios.get('https://gist.githubusercontent.com/graffixnyc/ed50954f42c3e620f7c294cf9fe772e8/raw/925e36aa8e3d60fef4b3a9d8a16bae503fe7dd82/lab2');

    return data;
}

module.exports = {
    getById (id) {
        return new Promise((resolve, reject) => {
          setTimeout(async () => {
            let data = await getData();
            
            for(let x of data) {
                if(x.id === Number(id)){
                    resolve(x);
                }
            }
            reject("user not found");
            }, 5000);
          });
    }
}
