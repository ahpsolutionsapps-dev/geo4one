"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.toUsuarioResponse = toUsuarioResponse;
function toUsuarioResponse(props) {
    const { anulado: _anulado, palabraSecreta, ...rest } = props;
    return {
        ...rest,
        palabraSecreta: palabraSecreta ?? null,
    };
}
//# sourceMappingURL=usuario-response.mapper.js.map