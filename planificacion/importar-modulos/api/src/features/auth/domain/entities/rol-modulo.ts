export interface RolModuloProps {
  idRolModulo: number;
  idRol: number;
  idModulo: number;
}

export class RolModulo {
  constructor(private readonly props: RolModuloProps) {}

  get idRolModulo(): number { return this.props.idRolModulo; }
  get idRol(): number { return this.props.idRol; }
  get idModulo(): number { return this.props.idModulo; }

  toJSON(): RolModuloProps { return { ...this.props }; }
}
