"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Provincia = void 0;
class Provincia {
    props;
    constructor(props) {
        this.props = props;
    }
    toPrimitives() {
        return { ...this.props };
    }
}
exports.Provincia = Provincia;
//# sourceMappingURL=provincia.js.map