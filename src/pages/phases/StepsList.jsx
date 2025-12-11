import React, { useState, useMemo } from 'react';
import { MdDragIndicator } from 'react-icons/md';
import { FaEye } from 'react-icons/fa';
import { MdAdd } from 'react-icons/md';
import ActiveCell from '@/components/common/table/cells/ActiveCell';
import useLocale from '@/utils/hooks/global/useLocale';
import { useReorderStepsMutation } from '@/api/hooks/usePhases';
import i18next from 'i18next';
import ViewStep from '@/pages/steps/ViewStep';
import CreateStep from '@/pages/steps/CreateStep';

export default function StepsList({ steps, phaseId, onReorderComplete }) {
    const { t } = useLocale();
    const { mutate: reorderSteps, isPending } = useReorderStepsMutation();
    const [reorderedSteps, setReorderedSteps] = useState(null);
    const [draggedIndex, setDraggedIndex] = useState(null);
    const [dragOverIndex, setDragOverIndex] = useState(null);
    const [isDragging, setIsDragging] = useState(false);
    const [viewingStepId, setViewingStepId] = useState(null);
    const [showCreateStep, setShowCreateStep] = useState(false);

    // Use reordered steps if available, otherwise use original steps
    const displaySteps = reorderedSteps || steps || [];

    // Create a map of original steps by ID for efficient lookup
    const originalStepsMap = useMemo(() => {
        const map = new Map();
        (steps || []).forEach(step => {
            map.set(step.id, step);
        });
        return map;
    }, [steps]);

    const handleDragStart = (e, index) => {
        setDraggedIndex(index);
        setIsDragging(true);
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

        // Create new order
        const newSteps = [...displaySteps];
        const draggedStep = newSteps[draggedIndex];
        
        // Remove from old position
        newSteps.splice(draggedIndex, 1);
        
        // Insert at new position
        newSteps.splice(dropIndex, 0, draggedStep);
        
        // Update order numbers
        const updatedSteps = newSteps.map((step, idx) => ({
            ...step,
            order: idx + 1
        }));

        setReorderedSteps(updatedSteps);
        setDraggedIndex(null);
        setDragOverIndex(null);
    };

    const handleDragEnd = (e) => {
        e.currentTarget.style.opacity = '1';
    };

    const handleSaveOrder = () => {
        if (!reorderedSteps || reorderedSteps.length === 0) {
            setIsDragging(false);
            setReorderedSteps(null);
            return;
        }

        // Find steps that changed order
        const updatesMap = new Map();
        
        reorderedSteps.forEach(step => {
            const originalStep = originalStepsMap.get(step.id);
            // Only update if order actually changed
            if (originalStep && originalStep.order !== step.order && !updatesMap.has(step.id)) {
                updatesMap.set(step.id, {
                    step_id: step.id,
                    new_order: step.order
                });
            }
        });

        const updates = Array.from(updatesMap.values());

        if (updates.length === 0) {
            setIsDragging(false);
            setReorderedSteps(null);
            return;
        }

        // Update each step - call API for each step that changed
        const updatePromises = updates.map(updateData => {
            return new Promise((resolve, reject) => {
                reorderSteps(
                    { phaseId, data: updateData },
                    {
                        onSuccess: () => resolve(),
                        onError: (error) => reject(error)
                    }
                );
            });
        });

        Promise.all(updatePromises)
            .then(() => {
                // All updates completed
                setTimeout(() => {
                    setIsDragging(false);
                    setReorderedSteps(null);
                    if (onReorderComplete) {
                        onReorderComplete();
                    }
                }, 500);
            })
            .catch(() => {
                // Some updates failed, still reset
                setIsDragging(false);
                setReorderedSteps(null);
            });
    };

    const handleCancelOrder = () => {
        setIsDragging(false);
        setReorderedSteps(null);
        setDraggedIndex(null);
        setDragOverIndex(null);
    };

    if (!steps || steps.length === 0) {
        return (
            <div className="ml-8 py-4">
                <p className="text-sm text-gray-500">{t('phases.no_steps')}</p>
            </div>
        );
    }

    return (
        <div className="ml-8 py-4">
            <div className="flex items-center justify-between mb-3">
                <h4 className="text-sm font-semibold text-gray-700">
                    {t('phases.steps')}
                </h4>
                <div className="flex items-center gap-2">
                    {!isDragging && (
                        <button
                            onClick={() => setShowCreateStep(true)}
                            className="px-3 py-1 text-xs bg-primary-600 text-white rounded hover:bg-primary-700 flex items-center gap-1"
                        >
                            <MdAdd className="w-4 h-4" />
                            {t('common.add')}
                        </button>
                    )}
                    {isDragging && (
                        <div className="flex gap-2">
                            <button
                                onClick={handleSaveOrder}
                                disabled={isPending}
                                className="px-3 py-1 text-xs bg-primary-600 text-white rounded hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {t('common.save')}
                            </button>
                            <button
                                onClick={handleCancelOrder}
                                disabled={isPending}
                                className="px-3 py-1 text-xs bg-gray-500 text-white rounded hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {t('common.cancel')}
                            </button>
                        </div>
                    )}
                </div>
            </div>
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
                                    <ActiveCell info={{ getValue: () => step.status }} />
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
            {viewingStepId && (
                <ViewStep
                    onClose={() => setViewingStepId(null)}
                    stepId={viewingStepId}
                />
            )}
            {showCreateStep && (
                <CreateStep
                    onClose={() => setShowCreateStep(false)}
                    phaseId={phaseId}
                    currentStepsCount={displaySteps.length}
                    onStepCreated={() => {
                        if (onReorderComplete) {
                            onReorderComplete();
                        }
                    }}
                />
            )}
        </div>
    );
}

