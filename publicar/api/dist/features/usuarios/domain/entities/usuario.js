"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Usuario = void 0;
class Usuario {
    props;
    constructor(props) {
        this.props = props;
    }
    get idUsuario() {
        return this.props.idUsuario;
    }
    get anulado() {
        return this.props.anulado;
    }
    get imagen() {
        return this.props.imagen;
    }
    toPrimitives() {
        return { ...this.props };
    }
}
exports.Usuario = Usuario;
//# sourceMappingURL=usuario.js.map