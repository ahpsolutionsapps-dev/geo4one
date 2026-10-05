"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Permiso = void 0;
class Permiso {
    props;
    constructor(props) {
        this.props = props;
    }
    get idPermiso() { return this.props.idPermiso; }
    get permiso() { return this.props.permiso; }
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
exports.Permiso = Permiso;
//# sourceMappingURL=permiso.js.map