import { UsuarioProps } from '../../domain/entities/usuario';

export type UsuarioResponse = Omit<UsuarioProps, 'anulado' | 'palabraSecreta'> & {
  palabraSecreta?: string | null;
};

export function toUsuarioResponse(props: UsuarioProps): UsuarioResponse {
  const { anulado: _anulado, palabraSecreta, ...rest } = props;

  return {
    ...rest,
    palabraSecreta: palabraSecreta ?? null,
  };
}
