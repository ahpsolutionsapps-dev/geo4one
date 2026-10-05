"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Modulo = void 0;
class Modulo {
    props;
    constructor(props) {
        this.props = props;
    }
    get idModulo() {
        return this.props.idModulo;
    }
    get codigo() {
        return this.props.codigo;
    }
    get nombreModulo() {
        return this.props.nombreModulo;
    }
    get icono() {
        return this.props.icono;
    }
    get ruta() {
        return this.props.ruta;
    }
    get idPadre() {
        return this.props.idPadre;
    }
    get orderIndex() {
        return this.props.orderIndex;
    }
    get oculto() {
        return this.props.oculto;
    }
    toJSON() {
        return { ...this.props };
    }
}
exports.Modulo = Modulo;
//# sourceMappingURL=modulo.js.map