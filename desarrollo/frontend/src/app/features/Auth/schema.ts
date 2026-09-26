import * as Yup from 'yup'

export interface AuthFormValues {
    email: string
    password: string
}

export const schema = Yup.object().shape({
    email: Yup.string()
        .trim()
        .email('Correo inválido')
        .required('El correo es obligatorio'),
    password: Yup.string()
        .trim()
        .required('La contraseña es obligatoria'),
})