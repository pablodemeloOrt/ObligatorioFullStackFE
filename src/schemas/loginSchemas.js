import * as Yup from 'yup'

const emailReg = new RegExp(".*\\..+");


export const getLoginSchema = (t) => {
    console.log('Entro en getloginschema')
    return Yup.object({
        email: Yup.string().min(3, t("validations.min", { min: 3 })).matches(emailReg, t("validations.email_invalid")).required(t("validations.email_required")),
        password: Yup.string().min(6, t("validations.min", { min: 6 })).required(t("validations.password_required")),
    })
};
