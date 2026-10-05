"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Proveedor = void 0;
class Proveedor {
    props;
    constructor(props) {
        this.props = props;
    }
    toPrimitives() {
        return { ...this.props };
    }
}
exports.Proveedor = Proveedor;
//# sourceMappingURL=proveedor.js.map