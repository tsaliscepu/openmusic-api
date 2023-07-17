const mapAlbums = ({
  id,
  name,
  year
}) => ({
  id,
  name,
  year
})

const mapSongs = ({
  id,
  title,
  year,
  performer,
  genre,
  duration,
  album_id
}) => ({
  id,
  title,
  year,
  performer,
  genre,
  duration,
  albumId: album_id
})

const mapSong = ({
  song_id,
  song_title,
  performer
}) => ({
  id: song_id,
  title: song_title,
  performer
})

const mapPlaylist = ({
  id,
  name,
  username
}) => ({
  id,
  name,
  username
})

module.exports = { mapSongs, mapAlbums, mapSong, mapPlaylist }
