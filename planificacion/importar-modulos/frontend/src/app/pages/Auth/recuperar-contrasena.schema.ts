import * as Yup from "yup";

export interface RecuperarContrasenaFormValues {
  email: string;
  palabraSecreta: string;
  password: string;
  confirmPassword: string;
}

export const recuperarContrasenaSchema = Yup.object().shape({
  email: Yup.string()
    .trim()
    .email("Correo inválido")
    .required("El correo es obligatorio"),
  palabraSecreta: Yup.string()
    .trim()
    .required("La palabra secreta es obligatoria"),
  password: Yup.string()
    .trim()
    .min(6, "La contraseña debe tener al menos 6 caracteres")
    .required("La nueva contraseña es obligatoria"),
  confirmPassword: Yup.string()
    .trim()
    .required("Confirma tu contraseña")
    .oneOf([Yup.ref("password")], "Las contraseñas no coinciden"),
});
