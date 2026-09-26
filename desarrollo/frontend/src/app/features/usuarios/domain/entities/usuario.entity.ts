export interface Usuario {
  id: string;
  idNegocio: number;
  username: string;
  email: string;
  nombre: string;
  apellido: string | null;
  telefono: string | null;
  idRol: string | null;
  rolNombre: string | null;
  palabraSecreta: string | null;
  habilitado: boolean;
  imagen: string | null;
  verificado: boolean;
  estatus: number;
  idioma: string;
  tema: string;
  comentario: string | null;
  fechaCreacion: string | null;
  fechaModificacion: string | null;
}

export interface CreateUsuarioInput {
  username: string;
  email: string;
  userpassword: string;
  nombre?: string;
  apellido?: string | null;
  telefono?: string | null;
  idRol?: string | null;
  palabraSecreta?: string | null;
  habilitado?: boolean;
  verificado?: boolean;
  estatus?: number;
  idioma?: string;
  tema?: string;
  comentario?: string | null;
}

export interface UpdateUsuarioInput {
  id: string;
  username: string;
  email: string;
  userpassword?: string | null;
  nombre?: string;
  apellido?: string | null;
  telefono?: string | null;
  idRol?: string | null;
  palabraSecreta?: string | null;
  habilitado?: boolean;
  verificado?: boolean;
  estatus?: number;
  idioma?: string;
  tema?: string;
  comentario?: string | null;
}

export const ESTATUS_USUARIO_OPTIONS = [
  { value: 1, label: "Activo" },
  { value: 0, label: "Inactivo" },
] as const;

export function getEstatusUsuarioLabel(estatus: number): string {
  return (
    ESTATUS_USUARIO_OPTIONS.find((option) => option.value === estatus)
      ?.label ?? "Desconocido"
  );
}

export function getUsuarioEstadoLabel(usuario: Usuario): string {
  if (!usuario.habilitado) {
    return "Deshabilitado";
  }

  if (!usuario.verificado) {
    return "Sin verificar";
  }

  return getEstatusUsuarioLabel(usuario.estatus);
}

export function getUsuarioDisplayName(usuario: Pick<Usuario, "nombre" | "apellido" | "username">): string {
  const fullName = [usuario.nombre, usuario.apellido].filter(Boolean).join(" ").trim();
  return fullName || usuario.username;
}
