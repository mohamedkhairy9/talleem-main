import React, { useState } from 'react';
import {
    useAboutUsQuery,
    useUpdateAboutUsMutation
} from '@/api/hooks/useAboutUs';
import FormAboutUs from './FormAboutUs';
import DeleteAboutUs from './DeleteAboutUs';
import Loader from '@/components/common/Loader';
import { enabledDisabledOptions } from '@/utils/constants/options';
import useLocale from '@/utils/hooks/global/useLocale';
import { HiTrash } from 'react-icons/hi';

export default function AboutUs() {
    const { data, isLoading } = useAboutUsQuery();
    const { mutate, isPending } = useUpdateAboutUsMutation();
    const { t } = useLocale();
    const [showDeleteModal, setShowDeleteModal] = useState(false);

    console.log('data', data);

    if (isLoading) return <Loader />;

    return (
        <>
            <div className=" mx-auto">
                <div className="bg-white rounded-lg shadow-md">
                    <div className="border-b border-gray-200 px-6 py-4 flex justify-between items-center">
                        <div>
                            <h1 className="text-2xl font-bold text-gray-800">
                                {t('sidebar.about_us')}
                            </h1>
                            <p className="text-sm text-gray-600 mt-1">
                                {t('about_us.description')}
                            </p>
                        </div>
                        {data && (
                            <button
                                onClick={() => setShowDeleteModal(true)}
                                className="flex items-center gap-2 px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors duration-200"
                            >
                                <HiTrash size={18} />
                                <span className="font-medium">
                                    {t('table.delete')}
                                </span>
                            </button>
                        )}
                    </div>
                    <div className="p-6">
                        <FormAboutUs
                            oldData={data}
                            mutate={mutate}
                            isPending={isPending}
                            options={{
                                status: enabledDisabledOptions
                            }}
                        />
                    </div>
                </div>
            </div>
            {showDeleteModal && (
                <DeleteAboutUs onClose={() => setShowDeleteModal(false)} />
            )}
        </>
    );
}
