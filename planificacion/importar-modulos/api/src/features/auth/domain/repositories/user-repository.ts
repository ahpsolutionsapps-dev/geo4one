import { User, UserProps } from '../entities/user';

export type NewUserInput = Omit<UserProps, 'idUsuario' | 'fechaCreacion' | 'ultimoAcceso' | 'bloqueadoHasta' | 'intentosFallidos'> &
  Partial<Pick<UserProps, 'fechaCreacion' | 'ultimoAcceso' | 'bloqueadoHasta' | 'intentosFallidos'>>;

export type UserThemePreferencesRow = {
  primaryColor: string | null;
  tema: string;
  darkColorScheme: string | null;
};

export interface UserRepository {
  findById(idUsuario: number): Promise<User | null>;
  findByUsername(username: string): Promise<User | null>;
  findByEmail(email: string): Promise<User | null>;
  findPrincipalSucursalId(idUsuario: number): Promise<number | null>;
  findRolName(idUsuario: number): Promise<string | null>;
  create(input: NewUserInput): Promise<User>;
  updatePassword(idUsuario: number, userpassword: string): Promise<void>;
  getThemePreferences(idUsuario: number): Promise<UserThemePreferencesRow | null>;
  updateThemePreferences(
    idUsuario: number,
    data: Partial<{
      primaryColor: string;
      tema: string;
      darkColorScheme: string;
    }>,
  ): Promise<void>;
}
