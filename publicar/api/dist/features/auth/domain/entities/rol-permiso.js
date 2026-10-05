"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RolPermiso = void 0;
class RolPermiso {
    props;
    constructor(props) {
        this.props = props;
    }
    get idRolPermiso() { return this.props.idRolPermiso; }
    get idRol() { return this.props.idRol; }
    get idPermiso() { return this.props.idPermiso; }
    toJSON() { return { ...this.props }; }
}
exports.RolPermiso = RolPermiso;
//# sourceMappingURL=rol-permiso.js.map