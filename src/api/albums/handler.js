class AlbumsHandler {
    constructor(service) {
        this._service = service;
    }

    postAlbumHandler(request, h) {
        const { name, year } = request.payload;
        
        const albumId = this._service.addAlbum({ name, year });

        const response = h.response({
            status: 'success',
            message: 'Album berhasil ditambahkan',
            data: {
                albumId,
            },
        });
        response.code(201);
        return response;
    }

    getAlbumsHandler() {
        const albums = this._service.getAlbums();
        return {
            status: 'success',
            data: {
                albums,
            },
        };
    }

    getAlbumByIdHandler(request) {
        const { id } = request.params;
        const album = this._service.getAlbumById(id);
        return {
            status: 'success',
            data: {
                album,
            },
        };
    }

    putAlbumByIdHandler(request) {
        const { id } = request.params;

        this._service.editAlbumById(id, request.payload);

        return {
            status: 'success',
            message: 'Album berhasil diperbarui',
        };
    }

    deleteAlbumByIdHandler(request) {
        const { id } = request.params;
        this._service.deleteAlbumById(id);
        return {
            status: 'success',
            message: 'Lagu berhasil dihapus',
        };
    }
}

module.exports = AlbumsHandler;