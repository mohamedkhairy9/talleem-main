import { useDeleteRemotelyAttendancePlatformMutation } from "@/api/hooks/useRemotelyAttendancePlatforms";
import DeleteModal from "@/components/common/form/DeleteModal";

export function DeleteRemotelyAttendancePlatorm({ id, onClose }){

    const { mutate, isLoading } = useDeleteRemotelyAttendancePlatformMutation(id);

    const handleDelete = () => {
        mutate(id, {
            onSuccess: () => {
                onClose();
            }
        })
    }

    return(
        <DeleteModal
            onClose={onClose}
            loading={isLoading}
            deleteFn={handleDelete}
        />
    )
}