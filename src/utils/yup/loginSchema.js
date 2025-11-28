import * as yup from 'yup';

export const loginSchema = yup.object({
    email: yup
        .string()
        .email('من فضلك أدخل بريدك الإلكتروني الصحيح')
        .required('البريد الإلكتروني مطلوب'),
    password: yup
        .string()
        .min(6, 'كلمة المرور يجب أن تكون على الأقل 6 أحرف')
        .required('كلمة المرور مطلوبة')
});
