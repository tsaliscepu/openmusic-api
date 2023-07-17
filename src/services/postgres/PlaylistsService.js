const { nanoid } = require("nanoid");
const { Pool } = require("pg");
const { mapSongs, mapAlbums, mapSong, mapPlaylist } = require('../../utils');
const InvariantError = require("../../exceptions/InvariantError");
const NotFoundError = require("../../exceptions/NotFoundError");
const AuthorizationError = require("../../exceptions/AuthorizationError");

class PlaylistsService {
    constructor() {
        this._pool = new Pool();
    }

    async addPlaylist({ name, owner }) {
        const id = `playlist-${nanoid(16)}`;

        const query = {
            text: 'INSERT INTO playlists VALUES($1, $2, $3) RETURNING id',
            values: [id, name, owner],
        };

        const result = await this._pool.query(query);

        if (!result.rowCount) {
            throw new InvariantError('Playlist gagal ditambahkan');
        }

        return result.rows[0].id;
    }

    async getPlaylists(owner) {
        const query = {
            text: `SELECT playlists.id, playlists.name, users.username FROM playlists
                LEFT JOIN users ON users.id = playlists.owner
                LEFT JOIN collaborations ON collaborations.playlist_id = playlists.id
                WHERE playlists.owner = $1 OR collaborations.user_id = $1`,
                values: [owner],
        };
        const result = await this._pool.query(query);

        return result.rows.map(mapPlaylist);
    }

    async deletePlaylistById(id) {
        const query = {
            text: 'DELETE FROM playlists WHERE id = $1 RETURNING id',
            values: [id],
        };

        const result = await this._pool.query(query);

        if (!result.rowCount) {
            throw new NotFoundError('Playlist gagal dihapus. Id tidak ditemukan',);
        }
    }

    async addSongToPlaylist(playlistId, songId) {
        const id = `playlist-${nanoid(16)}`;

        const query = {
            text: 'INSERT INTO playlistsongs VALUES($1, $2, $3) RETURNING id',
            values: [id, playlistId, songId],
        };

        const result = await this._pool.query(query);

        if (!result.rowCount) {
            throw new InvariantError('Lagu gagal ditambahkan ke playlist');
        }

        return result.rows[0].id;
    }

    async checkPlaylists(id) {
        const query = {
            text: 'SELECT * FROM playlists WHERE id = $1',
            values: [id],
        };

        const result = await this._pool.query(query);

        if (!result.rows.length) {
            throw new NotFoundError('Playlist tidak ditemukan');
        }
    }

    async getPlaylistById(playlistId, credentialId) {
        const query = {
            text: `SELECT playlists.* , songs.* FROM playlists
            LEFT JOIN users ON playlists.owner = users.id
            WHERE playlists.id = $2 AND owner = $1`,
            values: [playlistId, credentialId],
        };

        const result = await this._pool.query(query);

        return result.rows.map(mapPlaylist)[0];
    }

    async getSongsFromPlaylist(playlistId) {
        const query = {
            text: `SELECT playlists.*, users.username, songs.id as song_id, songs.title as song_title, songs.performer FROM playlists
            LEFT JOIN playlistsongs ON playlistsongs.playlist_id = playlists.id
            LEFT JOIN songs ON songs.id = playlistsongs.song_id
            LEFT JOIN users ON users.id = playlists.owner
            WHERE playlists.id = $1`,
            values: [playlistId],
        }

        const result = await this._pool.query(query);

        if (!result.rows.length) {
            throw new NotFoundError('Playlist anda tidak ditemukan');
        }

        const playlist = result.rows.map(mapPlaylist)[0];
        const songs = result.rows.map(mapSong);

        return { ...playlist, songs };
    }

    async deleteSongFromPlaylist(playlistId, songId) {
        const query = {
            text: 'DELETE FROM playlistsongs WHERE playlist_id = $1 AND song_id = $2 RETURNING id',
            values: [playlistId, songId],
        };

        const result = await this._pool.query(query);

        if (!result.rowCount) {
            throw new InvariantError('Lagu gagal dihapus');
        }
    }

    async verifyPlaylistOwner(id, owner) {
        const query = {
            text: 'SELECT * FROM playlists WHERE id = $1',
            values: [id],
        };

        const result = await this._pool.query(query);

        if (result.rows.length === 0) {
            throw new NotFoundError('Playlist tidak ditemukan');
        }

        const playlist = result.rows[0];

        if (playlist.owner !== owner) {
            throw new AuthorizationError('Anda tidak berhak mengakses resource ini',);
        }
    }
}

module.exports = PlaylistsService;