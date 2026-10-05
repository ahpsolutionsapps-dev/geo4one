"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RolListItem = void 0;
class RolListItem {
    props;
    constructor(props) {
        this.props = props;
    }
    toPrimitives() {
        return { ...this.props };
    }
}
exports.RolListItem = RolListItem;
//# sourceMappingURL=rol-list-item.js.map