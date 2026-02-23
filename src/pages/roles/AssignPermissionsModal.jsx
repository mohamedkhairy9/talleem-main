import React, { useState, useEffect } from 'react';
import { usePermissionsQuery } from '@/api/hooks/usePermissions';
import { useAssignPermissionMutation } from '@/api/hooks/useRoles';
import useLocale from '@/utils/hooks/global/useLocale';
import useDebounce from '@/utils/hooks/global/useDebounce';
import i18next from 'i18next';
import Modal from '@/components/common/form/Modal';
import ModalHeader from '@/components/common/form/ModalHeader';
import ModalContent from '@/components/common/form/ModalContent';
import ModalFooter from '@/components/common/form/ModalFooter';
import Btn from '@/components/common/buttons/Btn';
import Loader from '@/components/common/Loader';

const currentLang = () => i18next.language || 'en';

export default function AssignPermissionsModal({ role, onClose }) {
    const { t } = useLocale();
    const [permissionSearch, setPermissionSearch] = useState('');
    const debouncedSearch = useDebounce(permissionSearch, 300);
    const [selectedPermissionIds, setSelectedPermissionIds] = useState([]);

    const { data: permissionsData, isLoading: permissionsLoading } = usePermissionsQuery(
        { search: debouncedSearch, per_page: 50 },
        { enabled: !!role?.id }
    );
    const assignMutation = useAssignPermissionMutation();

    const permissions = permissionsData?.data ?? [];

    useEffect(() => {
        if (role?.permissions) {
            setSelectedPermissionIds(role.permissions.map((p) => p.id));
        } else {
            setSelectedPermissionIds([]);
        }
    }, [role?.id, role?.permissions]);

    const togglePermission = (id) => {
        setSelectedPermissionIds((prev) =>
            prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
        );
    };

    const handleSubmit = () => {
        if (!role?.id) return;
        assignMutation.mutate(
            { roleId: role.id, permission_ids: selectedPermissionIds },
            {
                onSuccess: () => {
                    onClose();
                }
            }
        );
    };

    const roleDisplayName =
        role?.display_name?.[currentLang()] || role?.display_name?.en || role?.name || '—';

    if (!role) return null;

    return (
        <Modal onClose={onClose} size="5xl">
            <ModalHeader onClose={onClose} header="roles.assign_permission" />
            <ModalContent>
                <p className="text-gray-600 mb-4">
                    {t('roles_permissions.assign_for_role')}: <strong>{roleDisplayName}</strong>
                </p>
                <div className="mb-4">
                    <input
                        type="text"
                        value={permissionSearch}
                        onChange={(e) => setPermissionSearch(e.target.value)}
                        placeholder={t('roles_permissions.search_permissions_placeholder')}
                        className="input input-bordered w-full max-w-md"
                    />
                </div>
                <div className="border border-gray-200 rounded-lg max-h-96 overflow-y-auto">
                    {permissionsLoading ? (
                        <div className="flex justify-center py-8">
                            <Loader />
                        </div>
                    ) : (
                        <ul className="divide-y divide-gray-100">
                            {permissions.map((perm) => {
                                const name =
                                    perm.display_name?.[currentLang()] ||
                                    perm.display_name?.en ||
                                    perm.name;
                                const checked = selectedPermissionIds.includes(perm.id);
                                return (
                                    <li
                                        key={perm.id}
                                        className="flex items-center px-4 py-2 hover:bg-gray-50"
                                    >
                                        <label className="flex items-center gap-2 cursor-pointer w-full">
                                            <input
                                                type="checkbox"
                                                checked={checked}
                                                onChange={() => togglePermission(perm.id)}
                                                className="rounded border-gray-300"
                                            />
                                            <span className="text-sm text-gray-800">{name}</span>
                                            {perm.name && (
                                                <span className="text-xs text-gray-400">
                                                    ({perm.name})
                                                </span>
                                            )}
                                        </label>
                                    </li>
                                );
                            })}
                        </ul>
                    )}
                    {!permissionsLoading && permissions.length === 0 && (
                        <div className="text-center py-8 text-gray-500 text-sm">
                            {debouncedSearch
                                ? t('roles_permissions.no_permissions_match')
                                : t('roles_permissions.search_to_find')}
                        </div>
                    )}
                </div>
            </ModalContent>
            <ModalFooter>
                <button type="button" onClick={onClose} className="btn btn-secondary min-w-fit p-2 py-3 me-3">
                    {t('common.cancel')}
                </button>
                <Btn
                    loading={assignMutation.isPending}
                    onClick={handleSubmit}
                    label="common.submit"
                    className="p-2 px-4 min-w-fit"
                />
            </ModalFooter>
        </Modal>
    );
}
