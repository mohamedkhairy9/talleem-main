import React from 'react';

export default function IdCell({info}) {
    return (
        <div className="font-mono text-sm font-medium text-blue-600">
            #{info.getValue()}
        </div>
    );
}
