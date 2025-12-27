import React from 'react';
import { CiWarning } from 'react-icons/ci';
import Modal from './Modal';
import useLocale from '@/utils/hooks/global/useLocale';
import Btn from '@/components/common/buttons/Btn';

export default function WarningModal({ 
    onConfirm, 
    onCancel, 
    loading = false, 
    title,
    message,
    confirmLabel,
    cancelLabel 
}) {
    const { t } = useLocale();
    
    return (
        <Modal onClose={onCancel}>
            <div className="bg-white p-5 rounded-xl font-semibold">
                <CiWarning className="mx-auto text-4xl text-yellow-500" />
                {title && (
                    <h3 className="text-center text-lg font-bold my-3">
                        {title}
                    </h3>
                )}
                <p className="text-center my-5 text-gray-700">
                    {message}
                </p>
                <div className="flex justify-center gap-4">
                    <Btn
                        onClick={onCancel}
                        className="bg-gray-600 hover:bg-gray-700 text-white px-8 py-2"
                        label={cancelLabel || t('common.cancel')}
                    />
                    <Btn
                        loading={loading}
                        onClick={onConfirm}
                        className="bg-yellow-600 hover:bg-yellow-700 text-white px-8 py-2"
                        label={confirmLabel || t('common.confirm')}
                    />
                </div>
            </div>
        </Modal>
    );
}

