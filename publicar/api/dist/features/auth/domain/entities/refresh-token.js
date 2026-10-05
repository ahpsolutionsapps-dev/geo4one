"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RefreshToken = void 0;
class RefreshToken {
    props;
    constructor(props) {
        this.props = props;
    }
    get idRefreshToken() { return this.props.idRefreshToken; }
    get idUsuario() { return this.props.idUsuario; }
    get token() { return this.props.token; }
    get expiraEn() { return this.props.expiraEn; }
    get creadoEn() { return this.props.creadoEn; }
    isExpired(now = new Date()) {
        return this.props.expiraEn.getTime() <= now.getTime();
    }
    toJSON() { return { ...this.props }; }
}
exports.RefreshToken = RefreshToken;
//# sourceMappingURL=refresh-token.js.map