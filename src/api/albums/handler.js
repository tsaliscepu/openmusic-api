const autoBind = require("auto-bind");

class AlbumsHandler {
    constructor(service, validator) {
        this._service = service;
        this._validator = validator;

        autoBind(this);
    }

    async postAlbumHandler(request, h) {
        try {
            this._validator.validateAlbumPayload(request.payload);
    
            const { name, year } = request.payload;
            
            const albumId = await this._service.addAlbum({ name, year });
    
            const response = h.response({
                status: 'success',
                message: 'Album berhasil ditambahkan',
                data: {
                    albumId,
                },
            });
            response.code(201);
            return response;
        } catch (error) {
            const response = h.response({
                status: 'fail',
                message: error.message,
            });
            response.code(400);
            return response;
        }
    }

    async getAlbumsHandler() {
        const albums = await this._service.getAlbums();
        return {
            status: 'success',
            data: {
                albums,
            },
        };
    }

    async getAlbumByIdHandler(request, h) {
        try {
            const { id } = request.params;
            const album = await this._service.getAlbumById(id);
            return {
                status: 'success',
                data: {
                    album,
                },
            };
        } catch (error) {
            const response = h.response({
                status: 'fail',
                message: error.message,
            });
            response.code(404);
            return response;
        }
    }

    async putAlbumByIdHandler(request, h) {
        try {
            this._validator.validateAlbumPayload(request.payload);
            
            const { id } = request.params;
    
            await this._service.editAlbumById(id, request.payload);
    
            return {
                status: 'success',
                message: 'Album berhasil diperbarui',
            };
        } catch (error) {
            const response = h.response({
                status: 'fail',
                message: error.message,
            });
            response.code(404);
            return response;
        }
    }

    async deleteAlbumByIdHandler(request, h) {
        try {
            const { id } = request.params;
            await this._service.deleteAlbumById(id);
            return {
                status: 'success',
                message: 'Lagu berhasil dihapus',
            };
        } catch (error) {
            const response = h.response({
                status: 'fail',
                message: error.message,
            });
            response.code(404);
            return response;
        }
    }
}

module.exports = AlbumsHandler;