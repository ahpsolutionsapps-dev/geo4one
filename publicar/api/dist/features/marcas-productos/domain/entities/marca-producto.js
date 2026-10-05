"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MarcaProducto = void 0;
class MarcaProducto {
    props;
    constructor(props) {
        this.props = props;
    }
    toPrimitives() {
        return { ...this.props };
    }
}
exports.MarcaProducto = MarcaProducto;
//# sourceMappingURL=marca-producto.js.map