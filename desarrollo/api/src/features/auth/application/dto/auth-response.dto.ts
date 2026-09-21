import { PublicUserProps } from '../../domain/entities/user';

export type PublicUserDTO = PublicUserProps;

export interface AuthResponseDTO {
  user: PublicUserDTO;
  token: string;
}
