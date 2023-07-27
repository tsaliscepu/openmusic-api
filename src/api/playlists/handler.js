const autoBind = require('auto-bind');

class PlaylistsHandler {
    constructor(songsService, service, validator) {
        this._songsService = songsService;
        this._service = service;
        this._validator = validator;

        autoBind(this);
    }
}