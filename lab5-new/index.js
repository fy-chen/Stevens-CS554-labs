const {ApolloServer, gql} = require('apollo-server');
const uuid = require('uuid'); //for generating _id's
const axios = require("axios");
const redis = require('redis');
const client = redis.createClient();

(async () => {

  client.on('error', (err) => console.log('Redis Client Error', err));

  await client.connect();

})();

//Create the type definitions for the query and our data
const typeDefs = gql`
  type Query {
    unsplashImages(pageNum: Int): [ImagePost]
    binnedImages: [ImagePost]
    userPostedImages: [ImagePost]
    getTopTenBinnedPosts: [ImagePost]
  }

  type ImagePost {
    id: ID!
    url: String!
    posterName: String!
    description: String
    userPosted: Boolean!
    binned: Boolean!
    numBinned: Int!
  }

  type Mutation {
    uploadImage(
      url: String!
      description: String
      posterName: String
    ): ImagePost
    updateImage(
      id: ID!
      url: String
      posterName: String
      description: String
      userPosted: Boolean
      binned: Boolean
    ): ImagePost
    deleteImage(id: ID!): ImagePost
  }
`;

/* parentValue - References the type def that called it
    so for example when we execute numOfEmployees we can reference
    the parent's properties with the parentValue Paramater
*/

/* args - Used for passing any arguments in from the client
    for example, when we call 
    addEmployee(firstName: String!, lastName: String!, employerId: Int!): Employee
		
*/

const resolvers = {
  Query: {
    unsplashImages: async (_, args) => {

      let binnedImages = (await client.SMEMBERS('binned')).map(JSON.parse);

      let { data } = await axios.get(`https://api.unsplash.com/photos?client_id=H-eSgtcdSBgX94Zu1Dxd_wYT1cMsPaURAuLKkDlRIZs&page=${args.pageNum}`);
      
      let imagePostList = [];

      for(let image of data){
      
        let binned = false;

        for(let binnedImage of binnedImages){
          if(binnedImage.id === image.id) binned = true;
        }

        let newImage = {
          id: image.id,
          url: image.urls.regular,
          posterName: image.user.username,
          description: image.description,
          userPosted: false,
          binned: binned,
          numBinned: image.likes
        }
        
        imagePostList.push(newImage);
      }

      return imagePostList;
    },
    binnedImages: async () => {

      let binnedImages = (await client.SMEMBERS('binned')).map(JSON.parse);
      return binnedImages;
    },
    userPostedImages: async () => {

      let postedImages = (await client.SMEMBERS('userPosted')).map(JSON.parse);
      return postedImages; 
    },
    getTopTenBinnedPosts: async () => {
      let binnedImages = (await client.SMEMBERS('binned')).map(JSON.parse);
      binnedImages.sort(function(a, b) {
        if(a.numBinned > b.numBinned){
          return -1;
        }else if(a.numBinned < b.numBinned){
          return 1;
        }else{
          return 0;
        }
      });
      return binnedImages.slice(0, 10);
    }
  },
  Mutation: {
    uploadImage: async (_, args) => {

      const newimagePost = {
        id: uuid.v4(),
        url: args.url,
        posterName: args.posterName,
        description: args.description,
        userPosted: true,
        binned: false,
        numBinned: 0
      };

      await client.SADD('userPosted', JSON.stringify(newimagePost));

      return newimagePost;
    },
    updateImage: async (_, args) => {

      let numBinned = 0;

      if(!args.userPosted) {
        let {data} = await axios.get(`https://api.unsplash.com/photos/${args.id}?client_id=H-eSgtcdSBgX94Zu1Dxd_wYT1cMsPaURAuLKkDlRIZs`);
        numBinned = data.likes;
      }

      const updateimagePost = {
        id: args.id,
        url: args.url,
        posterName: args.posterName,
        description: args.description,
        userPosted: args.userPosted,
        binned: args.binned,
        numBinned: numBinned
      };

      let binnedImages = (await client.SMEMBERS('binned')).map(JSON.parse);

      let updated = 0;
      for (let image of binnedImages) {
        if(image.id = args.id) {
          if(args.binned) {
            await client.SREM('binned', JSON.stringify(image));
            await client.SADD('binned', JSON.stringify(updateimagePost));
          }else{
            await client.SREM('binned', JSON.stringify(image));
          }
          updated = 1;
        }
      }

      if(updated === 0 && args.binned) {
        await client.SADD('binned', JSON.stringify(updateimagePost));
      }

      if(args.userPosted) {
        let postedImages = (await client.SMEMBERS('userPosted')).map(JSON.parse);
        for(let image of postedImages){
          if(image.id = args.id){
            await client.SREM('userPosted', JSON.stringify(image));
            await client.SADD('userPosted', JSON.stringify(updateimagePost));
          }
        }
      }

      return updateimagePost;
      
    },
    deleteImage: async (_, args) => {

      let postedImages = (await client.SMEMBERS('userPosted')).map(JSON.parse);

      let deletedImage = null;
      for(let image of postedImages){
        if(image.id = args.id) {
          deletedImage = image;
          if(image.binned === true){
            await client.SREM('binned', JSON.stringify(image));
          }
          await client.SREM('userPosted', JSON.stringify(image));
        }
      }

      return deletedImage;
    }
  }
};

const server = new ApolloServer({typeDefs, resolvers});

server.listen().then(({url}) => {
  console.log(`🚀  Server ready at ${url} 🚀`);
});
