"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.User = void 0;
class User {
    props;
    constructor(props) {
        this.props = props;
    }
    get idUsuario() { return this.props.idUsuario; }
    get idNegocio() { return this.props.idNegocio; }
    get username() { return this.props.username; }
    get email() { return this.props.email; }
    get userpassword() { return this.props.userpassword; }
    get nombre() { return this.props.nombre; }
    get apellido() { return this.props.apellido; }
    get telefono() { return this.props.telefono; }
    get idRol() { return this.props.idRol; }
    get palabraSecreta() { return this.props.palabraSecreta; }
    get habilitado() { return this.props.habilitado; }
    get imagen() { return this.props.imagen; }
    get idUsuarioRegistra() { return this.props.idUsuarioRegistra; }
    get fechaCreacion() { return this.props.fechaCreacion; }
    get idUsuarioModifica() { return this.props.idUsuarioModifica; }
    get fechaModificacion() { return this.props.fechaModificacion; }
    get anulado() { return this.props.anulado; }
    get idUsuarioAnula() { return this.props.idUsuarioAnula; }
    get fechaAnulado() { return this.props.fechaAnulado; }
    get comentario() { return this.props.comentario; }
    get verificado() { return this.props.verificado; }
    get estatus() { return this.props.estatus; }
    get idioma() { return this.props.idioma; }
    get tema() { return this.props.tema; }
    get intentosFallidos() { return this.props.intentosFallidos; }
    get ultimoAcceso() { return this.props.ultimoAcceso; }
    get bloqueadoHasta() { return this.props.bloqueadoHasta; }
    canLogin() {
        return this.props.habilitado && !this.props.anulado;
    }
    canAccessModules() {
        return this.canLogin() && this.props.verificado;
    }
    toPublic() {
        const { userpassword: _u, palabraSecreta: _p, ...rest } = this.props;
        return rest;
    }
}
exports.User = User;
//# sourceMappingURL=user.js.map