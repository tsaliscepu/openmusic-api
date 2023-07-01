const { nanoid } = require("nanoid");
const { Pool } = require("pg");
const InvariantError = require("../../exceptions/InvariantError");
const { mapAlbums } = require("../../utils");
const NotFoundError = require("../../exceptions/NotFoundError");

class AlbumsService {
    constructor() {
        this._pool = new Pool();
    }

    async addAlbum({ name, year }) {
        const id = `album-${nanoid(16)}`;
        const query = {
            text: 'INSERT INTO albums VALUES($1, $2, $3) RETURNING id',
            values: [id, name, year],
        };

        const result = await this._pool.query(query);

        if (!result.rows[0].id) {
            throw new InvariantError('Album gagal ditambahkan');
        }

        return result.rows[0].id;
    }

    async getAlbums() {
        const result = await this._pool.query('SELECT * FROM albums');
        return result.rows.map(mapAlbums);
    }

    async getAlbumById(id) {
        const query = {
            text: 'SELECT * FROM albums WHERE id = $1',
            values: [id],
        };
        
        const querySong = {
            text: 'SELECT songs.id, songs.title, songs.performer FROM songs INNER JOIN albums ON albums.id = songs.album_id WHERE albums.id = $1',
            values: [id],
        };

        const result = await this._pool.query(query);
        const resultSong = await this._pool.query(querySong);

        if (!result.rows.length) {
            throw new NotFoundError('Album tidak ditemukan');
        }

        return {
            id: result.rows[0].id,
            name: result.rows[0].name,
            year: result.rows[0].year,
            songs: resultSong.rows,s
        };
    }
}