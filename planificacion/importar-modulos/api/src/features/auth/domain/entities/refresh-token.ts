export interface RefreshTokenProps {
  idRefreshToken: number;
  idUsuario: number;
  token: string;
  expiraEn: Date;
  creadoEn: Date;
}

export class RefreshToken {
  constructor(private readonly props: RefreshTokenProps) {}

  get idRefreshToken(): number { return this.props.idRefreshToken; }
  get idUsuario(): number { return this.props.idUsuario; }
  get token(): string { return this.props.token; }
  get expiraEn(): Date { return this.props.expiraEn; }
  get creadoEn(): Date { return this.props.creadoEn; }

  isExpired(now: Date = new Date()): boolean {
    return this.props.expiraEn.getTime() <= now.getTime();
  }

  toJSON(): RefreshTokenProps { return { ...this.props }; }
}
