import React from 'react';
import { MdDelete } from 'react-icons/md';
import { CiWarning } from 'react-icons/ci';
import Modal from './Modal';
import useLocale from '@/utils/hooks/global/useLocale';

export default function DeleteModal({ deleteFn, onClose, loading = false }) {
    const { t } = useLocale();
    return (
        <Modal onClose={onClose}>
            <div className="bg-white p-5 rounded-xl font-semibold">
                <CiWarning className="mx-auto text-4xl text-red-500" />
                <p className="text-center my-5">
                    {t('common.are_you_sure_you_want_to_delete_this_item')}
                </p>
                <div className="flex justify-center gap-4">
                    <button
                        onClick={() => onClose(false)}
                        className="bg-gray-600 hover:bg-gray-700 text-white px-8 py-2 rounded "
                    >
                        {t('common.cancel')}
                    </button>
                    <button
                        disabled={loading}
                        onClick={deleteFn}
                        className="bg-red-600 flex items-center gap-2 hover:bg-red-700 text-white disabled:bg-red-600/50 disabled:hover:bg-red-700/50 px-8 py-2 rounded "
                    >
                        <span>{loading ? t('common.wait') : t('common.delete')}</span>
                        <MdDelete className="text-xl" />
                    </button>
                </div>
            </div>
        </Modal>
    );
}
