import React, { useState, useMemo, useEffect } from 'react';
import { MdDragIndicator } from 'react-icons/md';
import { FaEye } from 'react-icons/fa';
import { MdAdd, MdEdit, MdDelete } from 'react-icons/md';
import ActiveCell from '@/components/common/table/cells/ActiveCell';
import useLocale from '@/utils/hooks/global/useLocale';
import { useReorderStepsMutation } from '@/api/hooks/usePhases';
import i18next from 'i18next';
import ViewStep from '@/pages/steps/ViewStep';
import CreateStep from '@/pages/steps/CreateStep';
import EditStep from '@/pages/steps/EditStep';
import DeleteStep from '@/pages/steps/DeleteStep';

export default function StepsList({ steps, phaseId, requestTypeId, onReorderComplete }) {
    const { t } = useLocale();
    const { mutate: reorderSteps, isPending } = useReorderStepsMutation();
    const [draggedIndex, setDraggedIndex] = useState(null);
    const [dragOverIndex, setDragOverIndex] = useState(null);
    const [viewingStepId, setViewingStepId] = useState(null);
    const [editingStep, setEditingStep] = useState(null);
    const [deletingStepId, setDeletingStepId] = useState(null);
    const [showCreateStep, setShowCreateStep] = useState(false);
    const [optimisticSteps, setOptimisticSteps] = useState(null); // Optimistic update state

    // Use optimistic steps if available, otherwise use original steps
    const displaySteps = optimisticSteps || steps || [];

    // Create a map of original steps by ID for efficient lookup
    const originalStepsMap = useMemo(() => {
        const map = new Map();
        (steps || []).forEach(step => {
            map.set(step.id, step);
        });
        return map;
    }, [steps]);

    // Clear optimistic data when new steps arrive from server
    useEffect(() => {
        if (steps && optimisticSteps) {
            // Clear optimistic state when fresh data arrives
            setOptimisticSteps(null);
        }
    }, [steps]);

    const handleDragStart = (e, index) => {
        setDraggedIndex(index);
        e.dataTransfer.effectAllowed = 'move';
        e.dataTransfer.setData('text/plain', index.toString());
        e.currentTarget.style.opacity = '0.5';
    };

    const handleDragOver = (e, index) => {
        e.preventDefault();
        e.dataTransfer.dropEffect = 'move';
        if (draggedIndex !== null && draggedIndex !== index) {
            setDragOverIndex(index);
        }
    };

    const handleDragLeave = () => {
        setDragOverIndex(null);
    };

    const handleDrop = (e, dropIndex) => {
        e.preventDefault();
        if (draggedIndex === null || draggedIndex === dropIndex) {
            setDraggedIndex(null);
            setDragOverIndex(null);
            return;
        }

        // Get current steps (use optimistic if available, otherwise original)
        const currentSteps = optimisticSteps || steps || [];
        const draggedStep = currentSteps[draggedIndex];
        
        // Optimistically update the UI immediately
        const newSteps = [...currentSteps];
        newSteps.splice(draggedIndex, 1);
        newSteps.splice(dropIndex, 0, draggedStep);
        
        // Update order numbers optimistically
        const updatedSteps = newSteps.map((step, idx) => ({
            ...step,
            order: idx + 1
        }));

        // Update UI immediately (optimistic update)
        setOptimisticSteps(updatedSteps);

        // Store the moved step data for API call
        const movedStepData = {
            step_id: draggedStep.id,
            new_order: dropIndex + 1
        };

        setDraggedIndex(null);
        setDragOverIndex(null);

        // Call API in the background
        reorderSteps(
            { phaseId, data: movedStepData },
            {
                onSuccess: () => {
                    // Query invalidation will automatically trigger refetch
                    // Clear optimistic state - it will be replaced by fresh data
                    setOptimisticSteps(null);
                },
                onError: () => {
                    // Revert optimistic update on error
                    setOptimisticSteps(null);
                    // Refresh to get correct data from server
                    if (onReorderComplete) {
                        onReorderComplete();
                    }
                }
            }
        );
    };

    const handleDragEnd = (e) => {
        e.currentTarget.style.opacity = '1';
    };

    const hasSteps = steps && steps.length > 0;

    return (
        <div className="ml-8 py-4">
            <div className="flex items-center justify-between mb-3">
                <h4 className="text-sm font-semibold text-gray-700">
                    {t('phases.steps')}
                </h4>
                <div className="flex items-center gap-2">
                    <button
                        onClick={() => setShowCreateStep(true)}
                        className="px-3 py-1 text-xs bg-primary-600 text-white rounded hover:bg-primary-700 flex items-center gap-1"
                    >
                        <MdAdd className="w-4 h-4" />
                        {t('common.add')}
                    </button>
                </div>
            </div>
            {!hasSteps ? (
                <div className="py-4">
                    <p className="text-sm text-gray-500">{t('phases.no_steps')}</p>
                </div>
            ) : (
            <div className="space-y-2">
                {displaySteps.map((step, stepIndex) => {
                    const isDragged = draggedIndex === stepIndex;
                    const isDragOver = dragOverIndex === stepIndex;
                    const stepName = typeof step.name === 'string' 
                        ? step.name 
                        : step.name?.[i18next.language] || step.name?.en || step.name?.ar || `Step ${step.id}`;

                    return (
                        <div
                            key={step.id}
                            draggable
                            onDragStart={(e) => handleDragStart(e, stepIndex)}
                            onDragOver={(e) => handleDragOver(e, stepIndex)}
                            onDragLeave={handleDragLeave}
                            onDrop={(e) => handleDrop(e, stepIndex)}
                            onDragEnd={handleDragEnd}
                            className={`
                                bg-white p-4 rounded-lg border border-gray-200 shadow-sm
                                flex items-center gap-3 cursor-move
                                ${isDragged ? 'opacity-50' : ''}
                                ${isDragOver ? 'border-primary-500 bg-primary-50' : ''}
                                hover:shadow-md transition-all
                            `}
                        >
                            <MdDragIndicator className="w-5 h-5 text-gray-400 flex-shrink-0" />
                            <div className="flex-1 flex items-center justify-between">
                                <div className="flex items-center gap-4">
                                    <span className="text-sm font-medium text-gray-600">
                                        {step.order || stepIndex + 1}. {stepName}
                                    </span>
                                    <span className="text-xs text-gray-500">
                                        {t('phases.step_type')}: {step.step_type}
                                    </span>
                                    <span className="text-xs text-gray-500">
                                        {t('phases.assigned_to')}: {step.assigned_to_type}
                                    </span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            setViewingStepId(step.id);
                                        }}
                                        className="p-1 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded transition-colors"
                                        title={t('table.view')}
                                    >
                                        <FaEye className="w-4 h-4" />
                                    </button>
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            setEditingStep(step);
                                        }}
                                        className="p-1 text-green-600 hover:text-green-800 hover:bg-green-50 rounded transition-colors"
                                        title={t('table.edit')}
                                    >
                                        <MdEdit className="w-4 h-4" />
                                    </button>
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            setDeletingStepId(step.id);
                                        }}
                                        className="p-1 text-red-600 hover:text-red-800 hover:bg-red-50 rounded transition-colors"
                                        title={t('table.delete')}
                                    >
                                        <MdDelete className="w-4 h-4" />
                                    </button>
                                    <ActiveCell info={{ getValue: () => step.status }} />
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
            )}
            {viewingStepId && (
                <ViewStep
                    onClose={() => setViewingStepId(null)}
                    stepId={viewingStepId}
                />
            )}
            {editingStep && (
                <EditStep
                    onClose={() => setEditingStep(null)}
                    oldData={editingStep}
                    onStepUpdated={() => {
                        // Query invalidation will automatically trigger refetch
                        setEditingStep(null);
                    }}
                />
            )}
            {deletingStepId && (
                <DeleteStep
                    onClose={() => setDeletingStepId(null)}
                    id={deletingStepId}
                />
            )}
            {showCreateStep && (
                <CreateStep
                    onClose={() => setShowCreateStep(false)}
                    phaseId={phaseId}
                    requestTypeId={requestTypeId}
                    currentStepsCount={displaySteps.length}
                    onStepCreated={() => {
                        // Query invalidation will automatically trigger refetch
                    }}
                />
            )}
        </div>
    );
}

