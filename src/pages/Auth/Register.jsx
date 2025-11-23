import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { uploadImageToCloudinary } from '../../services/cloudinaryService';
import api from '../../services/axiosConfig';
import { FaEye, FaEyeSlash, FaCamera } from 'react-icons/fa';

const Register = () => {
    const [formData, setFormData] = useState({
        names: '',
        lastNames: '',
        documentNumber: '',
        email: '',
        password: '',
        confirmPassword: '',
        birthDate: '',
        address: '',
        phone: '',
        documentTypeId: '',
        neighborhoodId: '',
        role: 'CUSTOMER',
    });
    const [documentTypes, setDocumentTypes] = useState([]);
    const [neighborhoods, setNeighborhoods] = useState([]);
    const [imageFile, setImageFile] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const { register } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [docTypesRes, neighborhoodsRes] = await Promise.all([
                    api.get('/api/document-types'),
                    api.get('/api/neighborhoods')
                ]);
                setDocumentTypes(docTypesRes.data);
                setNeighborhoods(neighborhoodsRes.data);
            } catch (err) {
                console.error("Error fetching form data:", err);
            }
        };
        fetchData();
    }, []);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImageFile(file);
            setImagePreview(URL.createObjectURL(file));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        if (formData.password !== formData.confirmPassword) {
            setError('Las contraseñas no coinciden');
            setIsLoading(false);
            return;
        }

        try {
            let imageUrl = null;
            if (imageFile) {
                console.log('Uploading image to Cloudinary...', imageFile);
                imageUrl = await uploadImageToCloudinary(imageFile);
                console.log('Image uploaded successfully:', imageUrl);
            } else {
                console.log('No image file selected');
            }

            const userData = {
                ...formData,
                profilePhotoUrl: imageUrl,
            };

            console.log('Sending registration data:', userData);
            const result = await register(userData);

            if (result.success) {
                navigate('/'); // Redirect to home since user is now logged in
            } else {
                setError(result.message);
            }
        } catch (err) {
            setError('Ocurrió un error durante el registro. Por favor intente de nuevo.');
            console.error('Registration error:', err);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
            <div className="sm:mx-auto sm:w-full sm:max-w-md">
                <Link to="/" className="flex justify-center mb-6">
                    <h1 className="text-4xl font-extrabold text-indigo-600 tracking-tight hover:text-acento-primario transition-colors duration-300 ease-in-initial">PetCare</h1>
                </Link>
                <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
                    Crea tu cuenta en PetCare
                </h2>
                <p className="mt-2 text-center text-sm text-gray-600">
                    ¿Ya tienes una cuenta?{' '}
                    <Link to="/login" className="font-medium text-indigo-600 hover:text-indigo-500">
                        Inicia sesión
                    </Link>
                </p>
            </div>

            <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-2xl lg:max-w-4xl">
                <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
                    <form className="space-y-6" onSubmit={handleSubmit}>
                        {error && (
                            <div className="bg-red-50 border-l-4 border-red-400 p-4">
                                <div className="flex">
                                    <div className="ml-3">
                                        <p className="text-sm text-red-700">{error}</p>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Image Upload - Centered and Styled */}
                        <div className="flex flex-col items-center justify-center mb-6">
                            <div className="relative group">
                                <div className="h-32 w-32 rounded-full overflow-hidden bg-gray-100 border-4 border-white shadow-lg">
                                    {imagePreview ? (
                                        <img src={imagePreview} alt="Profile preview" className="h-full w-full object-cover" />
                                    ) : (
                                        <div className="h-full w-full flex items-center justify-center bg-gray-200 text-gray-400">
                                            <FaCamera className="h-12 w-12" />
                                        </div>
                                    )}
                                </div>
                                <label
                                    htmlFor="file-upload"
                                    className="absolute bottom-0 right-0 bg-indigo-600 rounded-full p-2 cursor-pointer shadow-md hover:bg-indigo-700 transition-colors"
                                >
                                    <FaCamera className="h-4 w-4 text-white" />
                                    <input
                                        id="file-upload"
                                        name="file-upload"
                                        type="file"
                                        className="sr-only"
                                        accept="image/*"
                                        onChange={handleImageChange}
                                    />
                                </label>
                            </div>
                            <span className="mt-2 text-sm text-gray-500">Sube tu foto de perfil</span>
                        </div>

                        <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-2">
                            <div>
                                <label htmlFor="names" className="block text-sm font-medium text-gray-700">
                                    Nombres
                                </label>
                                <div className="mt-1">
                                    <input
                                        id="names"
                                        name="names"
                                        type="text"
                                        required
                                        value={formData.names}
                                        onChange={handleChange}
                                        className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                    />
                                </div>
                            </div>

                            <div>
                                <label htmlFor="lastNames" className="block text-sm font-medium text-gray-700">
                                    Apellidos
                                </label>
                                <div className="mt-1">
                                    <input
                                        id="lastNames"
                                        name="lastNames"
                                        type="text"
                                        required
                                        value={formData.lastNames}
                                        onChange={handleChange}
                                        className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                    />
                                </div>
                            </div>

                            <div>
                                <label htmlFor="documentTypeId" className="block text-sm font-medium text-gray-700">
                                    Tipo de Documento
                                </label>
                                <div className="mt-1">
                                    <select
                                        id="documentTypeId"
                                        name="documentTypeId"
                                        required
                                        value={formData.documentTypeId}
                                        onChange={handleChange}
                                        className="block w-full px-3 py-2 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                    >
                                        <option value="">Seleccione...</option>
                                        {documentTypes.map((type) => (
                                            <option key={type.id} value={type.id}>
                                                {type.name}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            <div>
                                <label htmlFor="documentNumber" className="block text-sm font-medium text-gray-700">
                                    Número de Documento
                                </label>
                                <div className="mt-1">
                                    <input
                                        id="documentNumber"
                                        name="documentNumber"
                                        type="text"
                                        required
                                        value={formData.documentNumber}
                                        onChange={handleChange}
                                        className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                    />
                                </div>
                            </div>

                            <div>
                                <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                                    Teléfono
                                </label>
                                <div className="mt-1">
                                    <input
                                        id="phone"
                                        name="phone"
                                        type="tel"
                                        required
                                        value={formData.phone}
                                        onChange={handleChange}
                                        className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                    />
                                </div>
                            </div>

                            <div>
                                <label htmlFor="birthDate" className="block text-sm font-medium text-gray-700">
                                    Fecha de Nacimiento
                                </label>
                                <div className="mt-1">
                                    <input
                                        id="birthDate"
                                        name="birthDate"
                                        type="date"
                                        required
                                        value={formData.birthDate}
                                        onChange={handleChange}
                                        className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                    />
                                </div>
                            </div>
                        </div>

                        <div>
                            <label htmlFor="address" className="block text-sm font-medium text-gray-700">
                                Dirección
                            </label>
                            <div className="mt-1">
                                <input
                                    id="address"
                                    name="address"
                                    type="text"
                                    required
                                    value={formData.address}
                                    onChange={handleChange}
                                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                />
                            </div>
                        </div>

                        <div>
                            <label htmlFor="neighborhoodId" className="block text-sm font-medium text-gray-700">
                                Barrio (Opcional)
                            </label>
                            <div className="mt-1">
                                <select
                                    id="neighborhoodId"
                                    name="neighborhoodId"
                                    value={formData.neighborhoodId}
                                    onChange={handleChange}
                                    className="block w-full px-3 py-2 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                >
                                    <option value="">Seleccione...</option>
                                    {neighborhoods.map((neighborhood) => (
                                        <option key={neighborhood.id} value={neighborhood.id}>
                                            {neighborhood.name}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                                Correo electrónico
                            </label>
                            <div className="mt-1">
                                <input
                                    id="email"
                                    name="email"
                                    type="email"
                                    autoComplete="email"
                                    required
                                    value={formData.email}
                                    onChange={handleChange}
                                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                />
                            </div>
                        </div>

                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                                Contraseña
                            </label>
                            <div className="mt-1 relative">
                                <input
                                    id="password"
                                    name="password"
                                    type={showPassword ? "text" : "password"}
                                    required
                                    value={formData.password}
                                    onChange={handleChange}
                                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm pr-10"
                                />
                                <button
                                    type="button"
                                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-500"
                                    onClick={() => setShowPassword(!showPassword)}
                                >
                                    {showPassword ? <FaEyeSlash className="h-5 w-5" /> : <FaEye className="h-5 w-5" />}
                                </button>
                            </div>
                        </div>

                        <div>
                            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                                Confirmar Contraseña
                            </label>
                            <div className="mt-1 relative">
                                <input
                                    id="confirmPassword"
                                    name="confirmPassword"
                                    type={showConfirmPassword ? "text" : "password"}
                                    required
                                    value={formData.confirmPassword}
                                    onChange={handleChange}
                                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm pr-10"
                                />
                                <button
                                    type="button"
                                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-500"
                                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                >
                                    {showConfirmPassword ? <FaEyeSlash className="h-5 w-5" /> : <FaEye className="h-5 w-5" />}
                                </button>
                            </div>
                        </div>

                        <div>
                            <button
                                type="submit"
                                disabled={isLoading}
                                className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 ${isLoading ? 'opacity-75 cursor-not-allowed' : ''
                                    }`}
                            >
                                {isLoading ? 'Creando cuenta...' : 'Crear cuenta'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Register;
