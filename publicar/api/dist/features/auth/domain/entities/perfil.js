"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Perfil = void 0;
class Perfil {
    props;
    constructor(props) {
        this.props = props;
    }
    get idPerfil() { return this.props.idPerfil; }
    get idUsuario() { return this.props.idUsuario; }
    get perfil() { return this.props.perfil; }
    get descripcion() { return this.props.descripcion; }
    get anulado() { return this.props.anulado; }
    get fechaCreacion() { return this.props.fechaCreacion; }
    get idUsuarioRegistra() { return this.props.idUsuarioRegistra; }
    get idUsuarioModifica() { return this.props.idUsuarioModifica; }
    get fechaModificacion() { return this.props.fechaModificacion; }
    get idUsuarioAnula() { return this.props.idUsuarioAnula; }
    get fechaAnulado() { return this.props.fechaAnulado; }
    get comentario() { return this.props.comentario; }
    toJSON() { return { ...this.props }; }
}
exports.Perfil = Perfil;
//# sourceMappingURL=perfil.js.map