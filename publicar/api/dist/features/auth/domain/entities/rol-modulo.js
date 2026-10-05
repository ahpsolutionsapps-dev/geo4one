"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RolModulo = void 0;
class RolModulo {
    props;
    constructor(props) {
        this.props = props;
    }
    get idRolModulo() { return this.props.idRolModulo; }
    get idRol() { return this.props.idRol; }
    get idModulo() { return this.props.idModulo; }
    toJSON() { return { ...this.props }; }
}
exports.RolModulo = RolModulo;
//# sourceMappingURL=rol-modulo.js.map