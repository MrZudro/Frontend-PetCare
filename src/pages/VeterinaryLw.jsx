import React from 'react';
import VeterinaryClinics from '../components/veterinary/VeterinaryClinics';

export default function VeterinaryLw() {
    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <header className="bg-white shadow-sm">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <h1 className="text-4xl font-extrabold text-gray-900 text-center">
                        Veterinarias 🏥⚕️
                    </h1>
                    <p className="text-center text-gray-500 mt-2 text-lg">
                        Cuidamos la salud y felicidad de tu mascota con atención de calidad y confianza.
                    </p>
                </div>
            </header>

            {/* Veterinary Clinics Component */}
            <VeterinaryClinics />
        </div>
    );
}

