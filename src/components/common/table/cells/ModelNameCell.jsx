import React from 'react';
import Cell from './Cell';

const ModelNameCell = ({ value }) => {
    // Extract model name from "App\Models\ModelName"
    const modelName = value?.split('\\').pop() || value;
    return <Cell value={modelName} />;
};

export default ModelNameCell;
