import { toast } from 'react-toastify';

export const errorHandler = error => {
    toast.error(error.message || 'Something went wrong');
};

export const successHandler = message => {
    toast.success(message || 'Success');
};
