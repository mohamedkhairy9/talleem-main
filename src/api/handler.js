import { toast } from 'react-toastify';
import { getLocalizedErrorMessage, localizeMessage } from '@/utils/helpers/localizedMessages';

export const errorHandler = error => {
    const localizedMessage = getLocalizedErrorMessage(error);
    toast.error(localizedMessage);
};

export const successHandler = message => {
    const localizedMessage = localizeMessage(message, 'api.success.generic');
    toast.success(localizedMessage);
};
