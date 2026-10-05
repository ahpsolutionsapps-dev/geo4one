"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RolDetail = void 0;
class RolDetail {
    props;
    constructor(props) {
        this.props = props;
    }
    toPrimitives() {
        return {
            ...this.props,
            idModulos: [...this.props.idModulos],
        };
    }
}
exports.RolDetail = RolDetail;
//# sourceMappingURL=rol-detail.js.map