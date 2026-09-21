export type AuthActor = 'usuario' | 'cliente' | 'plataforma';

export interface TokenPayload {
  sub: string;
  username: string;
  actor?: AuthActor;
  idCliente?: number;
  idAgente?: number;
}

export interface TokenService {
  sign(payload: TokenPayload): string;
  verify(token: string): TokenPayload;
}
