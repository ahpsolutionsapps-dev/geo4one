"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Anunciante = void 0;
class Anunciante {
    props;
    constructor(props) {
        this.props = props;
    }
    toPrimitives() {
        return { ...this.props };
    }
}
exports.Anunciante = Anunciante;
//# sourceMappingURL=anunciante.js.map