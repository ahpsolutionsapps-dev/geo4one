export interface RolPermisoProps {
  idRolPermiso: number;
  idRol: number;
  idPermiso: number;
}

export class RolPermiso {
  constructor(private readonly props: RolPermisoProps) {}

  get idRolPermiso(): number { return this.props.idRolPermiso; }
  get idRol(): number { return this.props.idRol; }
  get idPermiso(): number { return this.props.idPermiso; }

  toJSON(): RolPermisoProps { return { ...this.props }; }
}
