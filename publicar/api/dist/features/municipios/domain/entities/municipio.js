"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Municipio = void 0;
class Municipio {
    props;
    constructor(props) {
        this.props = props;
    }
    get idMunicipio() {
        return this.props.idMunicipio;
    }
    get idProvincia() {
        return this.props.idProvincia;
    }
    get provinciaNombre() {
        return this.props.provinciaNombre;
    }
    get municipio() {
        return this.props.municipio;
    }
    get latitud() {
        return this.props.latitud;
    }
    get longitud() {
        return this.props.longitud;
    }
    get activo() {
        return this.props.activo;
    }
    get fechaCreacion() {
        return this.props.fechaCreacion;
    }
    get fechaActualizacion() {
        return this.props.fechaActualizacion;
    }
    get creadoPor() {
        return this.props.creadoPor;
    }
    get actualizadoPor() {
        return this.props.actualizadoPor;
    }
    toPrimitives() {
        return { ...this.props };
    }
}
exports.Municipio = Municipio;
//# sourceMappingURL=municipio.js.map