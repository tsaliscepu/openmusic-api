const { nanoid } = require("nanoid");
const { Pool } = require("pg");
const InvariantError = require("../../exceptions/InvariantError");
const { mapSongs } = require("../../utils");
const NotFoundError = require("../../exceptions/NotFoundError");

class SongsService {
    constructor() {
        this._pool = new Pool();
    }

    async addSong({ title, year, performer, genre, duration, albumId }) {
        const id = `song-${nanoid(16)}`;
        const query = {
            text: 'INSERT INTO songs VALUES($1, $2 ,$3, $4, $5, $6, $7) RETURNING id',
            values: [id, title, year, performer, genre, duration, albumId],
        };

        const result = await this._pool.query(query);

        if (!result.rows[0].id) {
            throw new InvariantError('Lagu gagal ditambahkan');
        }

        return result.rows[0].id;
    }

    async getSongs() {
        let result = await this._pool.query('SELECT id, title, performer FROM songs');

        if (title !== undefined) {
            const queryTitle = {
                text: 'SELECT id, title, performer FROM songs WHERE LOWER(title) LIKE $1',
                values: [`%${title}%`],
            };
            result = await this._pool.query(queryTitle);
        }

        if (performer !== undefined) {
            const queryPerformer = {
                text: 'SELECT id, title, performer FROM songs WHERE LOWER(performer) LIKE $1',
                values: [`%${performer}%`],
            };
            result = await this._pool.query(queryPerformer);
        }
        return result.rows.map(mapSongs);
    }

    async getSongById(id) {
        const query = {
            text: 'SELECT * FROM songs WHERE id = $1',
            values: [id],
        };
        const result = await this._pool.query(query);

        if (!result.rows.length) {
            throw new NotFoundError('Lagu tidak ditemukan');
        }

        return result.rows.map(mapSongs)[0];
    }
}