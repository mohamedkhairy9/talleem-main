import React from 'react';
import { MdDelete } from 'react-icons/md';
import { CiWarning } from 'react-icons/ci';
import Modal from './Modal';

export default function DeleteModal({ deleteFn, setIsOpen, loading = false }) {
    return (
        <Modal setIsOpen={setIsOpen}>
            <div className="bg-white p-5 rounded-xl font-semibold">
                <CiWarning className="mx-auto text-4xl text-red-500" />
                <p className="text-center my-5">
                    Are you sure you want to delete this item?
                </p>
                <div className="flex justify-center gap-4">
                    <button
                        onClick={() => setIsOpen(false)}
                        className="bg-gray-600 hover:bg-gray-700 text-white px-8 py-2 rounded "
                    >
                        Cancel
                    </button>
                    <button
                        disabled={loading}
                        onClick={deleteFn}
                        className="bg-red-600 flex items-center gap-2 hover:bg-red-700 text-white disabled:bg-red-600/50 disabled:hover:bg-red-700/50 px-8 py-2 rounded "
                    >
                        <span>{loading ? 'Wait ..' : 'Delete'}</span>
                        <MdDelete className="text-xl" />
                    </button>
                </div>
            </div>
        </Modal>
    );
}
