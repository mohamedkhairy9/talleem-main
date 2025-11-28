import { useQueryClient } from '@tanstack/react-query';
import { employeesService } from '../services/employees.service';
import { API_KEYS } from '../endpoints';
import useCustomQuery from '../../utils/hooks/global/useCustomQuery';
import useCustomMutation from '../../utils/hooks/global/useCustomMutation';

export const useEmployeesQuery = (params = {}, options = {}) => {
    return useCustomQuery({
        queryKey: [API_KEYS.EMPLOYEES, params],
        queryFn: () => employeesService.getEmployees(params),
        ...options
    });
};

export const useEmployeeQuery = (id, options = {}) => {
    return useCustomQuery({
        queryKey: [API_KEYS.EMPLOYEES, id],
        queryFn: () => employeesService.getEmployee(id),
        ...options
    });
};

export const useCreateEmployeeMutation = () => {
    const queryClient = useQueryClient();
    return useCustomMutation({
        mutationFn: data => employeesService.createEmployee(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [API_KEYS.EMPLOYEES] });
        },
        onError: error => {
            console.log(error);
        }
    });
};

export const useUpdateEmployeeMutation = () => {
    const queryClient = useQueryClient();
    return useCustomMutation({
        mutationFn: data => employeesService.updateEmployee(data.id, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [API_KEYS.EMPLOYEES] });
        },
        onError: error => {
            console.log(error);
        }
    });
};

export const useDeleteEmployeeMutation = () => {
    const queryClient = useQueryClient();
    return useCustomMutation({
        mutationFn: id => employeesService.deleteEmployee(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [API_KEYS.EMPLOYEES] });
        },
        onError: error => {
            console.log(error);
        }
    });
};

export const useImportEmployeesMutation = () => {
    const queryClient = useQueryClient();
    return useCustomMutation({
        mutationFn: data => employeesService.importEmployees(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [API_KEYS.EMPLOYEES] });
        },
        onError: error => {
            console.log(error);
        }
    });
};

export const useExportExampleFileMutation = () => {
    return useCustomMutation({
        mutationFn: () => employeesService.exportExampleFile(),
        onError: error => {
            console.log(error);
        }
    });
};