import React from 'react';

const Loader = ({ message = 'Loading...' }) => {
    return (
        <div className="min-h-[240px] flex flex-col items-center justify-center gap-4 text-center py-12">
            <div className="w-16 h-16 rounded-full border-4 border-gray-200 border-t-gray-900 animate-spin"></div>
            <p className="text-gray-600 font-medium">{message}</p>
        </div>
    );
};

export default Loader;
