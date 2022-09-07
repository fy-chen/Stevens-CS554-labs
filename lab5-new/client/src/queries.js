import {gql} from '@apollo/client';

const GET_UNSPLASH = gql`
  query unsplashImages($pageNum: Int!){
    unsplashImages(pageNum: $pageNum){
      id
      url
      posterName
      description
      userPosted
      binned
      numBinned
    }
  }
`;

const GET_BINNED = gql`
  query binnedImages{
    binnedImages{
      id
      url
      posterName
      description
      userPosted
      binned
      numBinned
    }
  }
`;

const GET_POSTED = gql`
  query userPostedImages{
    userPostedImages{
      id
      url
      posterName
      description
      userPosted
      binned
      numBinned
    }
  }
`;

const GET_TOP_TEN = gql`
  query getTopTenBinnedPosts{
    getTopTenBinnedPosts{
      id
      url
      posterName
      description
      userPosted
      binned
      numBinned
    }
  }
`;

const UPDATE_IMAGE = gql`
  mutation updateImage(
    $id: ID!
    $url: String
    $posterName: String
    $userPosted: Boolean
    $description: String
    $binned: Boolean
  ) {
    updateImage(
      id: $id
      url: $url
      posterName: $posterName
      userPosted: $userPosted
      description: $description
      binned: $binned
    ) {
      id
      url
      posterName
      description
      userPosted
      binned
      numBinned
    }
  }
`;

const UPLOAD_IMAGE = gql`
  mutation uploadImage(
    $url: String!
    $description: String
    $posterName: String
  ) {
    uploadImage(
      url: $url
      posterName: $posterName
      description: $description
    ) {
      id
      url
      posterName
      description
      userPosted
      binned
      numBinned
    }
  }
`;

const DELETE_IMAGE = gql`
  mutation deleteImage($id: ID!) {
    deleteImage(id: $id) {
      id
      url
      posterName
      description
      userPosted
      binned
      numBinned
    }
  }
`;

let exported = {
  GET_UNSPLASH,
  GET_BINNED,
  GET_POSTED,
  UPDATE_IMAGE,
  UPLOAD_IMAGE,
  DELETE_IMAGE,
  GET_TOP_TEN
};

export default exported;
