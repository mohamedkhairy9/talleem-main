import React from 'react';

export default function Logo({
    size = 'size-14',
    textSize = 'text-lg',
    rounded = 'rounded-xl',
    onClick
}) {
    return (
        <span
            onClick={onClick}
            className={`${size} ${textSize} ${rounded} cursor-default bg-blue-600 shrink-0 text-white font-semibold tracking-wide  flex items-center justify-center`}
        >
            T
        </span>
    );
}
