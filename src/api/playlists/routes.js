const routes = (handler) => [
  {
    method: 'POST',
    path: '/playlists',
    handler: handler.postPlaylistHandler,
  },
  {
    method: 'GET',
    path: '/playlists',
    handler: handler.getPlaylistHandler,
  },
  {
    method: 'DELETE',
    path: '/playlists/{id}',
    handler: handler.deletePlaylistHandler,
  },
  {
    method: 'POST',
    path: '/playlists/{id}/songs',
    handler: handler.postSongToPlaylistHandler,
  },
  {
    method: 'GET',
    path: '/playlists/{id}/songs',
    handler: handler.getSongFromPlaylistHandler,
  },
  {
    method: 'DELETE',
    path: '/playlists/{id}/songs',
    handler: handler.deleteSongFromPlaylistHandler,
  },
  {
    method: 'GET',
    path: '/playlists/{id}/activities',
    handler: handler.getSongActivitiesHandler,
  },

];

module.exports = routes;