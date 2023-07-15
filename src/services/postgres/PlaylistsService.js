const { Pool } = require("pg");

class PlaylistsService {
    constructor() {
        this._pool = new Pool();
    }
}