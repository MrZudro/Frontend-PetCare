import React from 'react';

const DashboardPage = () => {
    return (
        <div className="flex flex-col items-center justify-center h-full text-center p-8">
            <div className="bg-white p-8 rounded-2xl shadow-lg max-w-2xl">
                <h1 className="text-3xl font-bold text-gray-800 mb-4">Bienvenido al Dashboard de PetCare</h1>
                <p className="text-gray-600 text-lg">
                    Selecciona una opción del menú lateral para comenzar a trabajar.
                </p>
                <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-4 bg-blue-50 rounded-xl border border-blue-100">
                        <h3 className="font-semibold text-blue-800">Rol Actual</h3>
                        <p className="text-blue-600">VETERINARIAN (Mocked)</p>
                    </div>
                    <div className="p-4 bg-green-50 rounded-xl border border-green-100">
                        <h3 className="font-semibold text-green-800">Estado</h3>
                        <p className="text-green-600">Activo</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DashboardPage;
