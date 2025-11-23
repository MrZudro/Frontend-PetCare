import React from 'react';

export default function TitleTL({ text }) {
    return (
        <h1 className="text-3xl md:text-4xl font-bold text-texto text-center mb-8">
            {text}
        </h1>
    );
}