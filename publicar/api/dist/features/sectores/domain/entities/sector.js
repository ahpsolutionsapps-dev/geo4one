"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Sector = void 0;
class Sector {
    props;
    constructor(props) {
        this.props = props;
    }
    toPrimitives() {
        return { ...this.props };
    }
}
exports.Sector = Sector;
//# sourceMappingURL=sector.js.map