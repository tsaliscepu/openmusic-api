/* eslint-disable camelcase */
const mapAlbums = ({
    id,
    name,
    year,
  }) => ({
    id,
    name,
    year,
  });
  
  const mapSongs = ({
    id,
    title,
    year,
    performer,
    genre,
    duration,
    album_id,
  }) => ({
    id,
    title,
    year,
    performer,
    genre,
    duration,
    albumId: album_id,
  });
  
  module.exports = { mapSongs, mapAlbums };