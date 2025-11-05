import * as Yup from 'yup';

export const createProjectSchema = Yup.object({
    name: Yup.string()
        .min(3, 'El nombre debe tener al menos 3 caracteres')
        .max(30, 'El nombre no puede exceder 30 caracteres')
        .required('El nombre es requerido'),
    description: Yup.string()
        .max(200, 'La descripción no puede exceder 200 caracteres'),
    category: Yup.string(),
    owner: Yup.string().required()
});
