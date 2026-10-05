"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ComboAnunciante = void 0;
class ComboAnunciante {
    props;
    constructor(props) {
        this.props = props;
    }
    toPrimitives() {
        return { ...this.props, marcas: [...this.props.marcas] };
    }
}
exports.ComboAnunciante = ComboAnunciante;
//# sourceMappingURL=combo-anunciante.js.map