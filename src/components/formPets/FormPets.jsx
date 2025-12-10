import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { uploadImageToCloudinary } from '../../services/cloudinaryService';
import api from '../../services/axiosConfig';
import { useNavigate, Link } from 'react-router-dom';
import { FaPaw, FaPlus, FaArrowLeft, FaMars, FaVenus, FaWeight, FaBirthdayCake, FaPalette, FaMicrochip } from 'react-icons/fa';

const FormPets = () => {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  // Data States
  const [pets, setPets] = useState([]);
  const [species, setSpecies] = useState([]);
  const [races, setRaces] = useState([]);

  // UI States
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [error, setError] = useState('');

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    specieId: '',
    idRace: '',
    microchip: '',
    color: '',
    gender: '',
    weight: '',
    birthdate: '',
    imageUrl: '',
  });
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  // Derived State
  const filteredRaces = races.filter(race => race.specieId === parseInt(formData.specieId));

  useEffect(() => {
    if (!isAuthenticated) {
      // navigate('/login'); // Optional: Redirect if not authenticated
      return;
    }

    const loadData = async () => {
      setLoading(true);
      try {
        // Fetch dependencies in parallel
        const [speciesRes, racesRes] = await Promise.all([
          api.get('/api/species'),
          api.get('/api/races')
        ]);

        setSpecies(speciesRes.data);
        setRaces(racesRes.data);

        // Fetch User's Pets
        if (user && user.id) {
          try {
            const petsRes = await api.get(`/api/pets/user/${user.id}`);
            setPets(petsRes.data);
            // If user has no pets, show form by default
            if (petsRes.data.length === 0) {
              setShowForm(true);
            }
          } catch (err) {
            console.error("Error fetching pets:", err);
            // If error fetching pets (e.g., 404 if none found), assume empty
            setPets([]);
            setShowForm(true);
          }
        }
      } catch (err) {
        console.error("Error loading initial data:", err);
        setError("Error al cargar los datos necesarios.");
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [isAuthenticated, user, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
      // Reset race if specie changes
      ...(name === 'specieId' ? { idRace: '' } : {})
    }));
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
    if (!user || !user.id) {
      setError("Usuario no identificado.");
      return;
    }

    setSubmitting(true);
    setError('');

    try {
      let imageUrl = formData.imageUrl;

      if (imageFile) {
        imageUrl = await uploadImageToCloudinary(imageFile);
      }

      const payload = {
        name: formData.name,
        birthdate: formData.birthdate,
        microchip: formData.microchip || null,
        color: formData.color,
        weight: formData.weight || null,
        gender: formData.gender,
        imageUrl: imageUrl,
        idRace: parseInt(formData.idRace),
        idUser: user.id
      };

      await api.post('/api/pets', payload);

      // Refresh pets list
      const petsRes = await api.get(`/api/pets/user/${user.id}`);
      setPets(petsRes.data);

      // Reset form and return to list
      resetForm();
      setShowForm(false);

    } catch (err) {
      console.error("Error creating pet:", err);
      setError("Error al registrar la mascota. Verifique los datos.");
    } finally {
      setSubmitting(false);
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      specieId: '',
      idRace: '',
      microchip: '',
      color: '',
      gender: '',
      weight: '',
      birthdate: '',
      imageUrl: '',
    });
    setImageFile(null);
    setImagePreview(null);
  };

  const calculateAge = (birthdate) => {
    const today = new Date();
    const birthDate = new Date(birthdate);
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  // --- VIEW: PET LIST ---
  if (!showForm && pets.length > 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900">Mis Mascotas</h2>
          <button
            onClick={() => setShowForm(true)}
            className="flex items-center gap-2 bg-primary hover:bg-primary-hover text-white px-6 py-2 rounded-full shadow-lg transition-all duration-300 transform hover:-translate-y-1"
          >
            <FaPlus /> Nueva Mascota
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {pets.map((pet) => (
            <Link key={pet.id} to={`/pethistory/${pet.id}`} className="block">
              <div className="bg-white rounded-2xl shadow-xl overflow-hidden hover:shadow-2xl transition-shadow duration-300 border border-gray-100">
                <div className="h-48 overflow-hidden relative group">
                  {pet.imageUrl ? (
                    <img src={pet.imageUrl} alt={pet.name} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                  ) : (
                    <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                      <FaPaw className="text-6xl text-gray-300" />
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
                    <span className="text-white font-medium">{pet.raceName || 'Raza desconocida'}</span>
                  </div>
                </div>

                <div className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-2xl font-bold text-gray-800">{pet.name}</h3>
                      <p className="text-sm text-gray-500">{pet.specieName || 'Mascota'}</p>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${pet.gender === 'Macho' ? 'bg-blue-100 text-blue-800' : 'bg-pink-100 text-pink-800'}`}>
                      {pet.gender}
                    </span>
                  </div>

                  <div className="space-y-2 text-sm text-gray-600">
                    <div className="flex items-center gap-2">
                      <FaBirthdayCake className="text-primary" />
                      <span>{calculateAge(pet.birthdate)} años ({pet.birthdate})</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <FaPalette className="text-primary" />
                      <span>{pet.color}</span>
                    </div>
                    {pet.weight && (
                      <div className="flex items-center gap-2">
                        <FaWeight className="text-primary" />
                        <span>{pet.weight} kg</span>
                      </div>
                    )}
                    {pet.microchip && (
                      <div className="flex items-center gap-2">
                        <FaMicrochip className="text-primary" />
                        <span>Chip: {pet.microchip}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    );
  }

  // --- VIEW: FORM ---
  return (
    <div className="max-w-3xl mx-auto my-10 p-8 bg-white shadow-2xl rounded-2xl">
      <div className="flex items-center mb-8 border-b pb-4">
        {pets.length > 0 && (
          <button
            onClick={() => setShowForm(false)}
            className="mr-4 text-gray-500 hover:text-primary transition-colors"
          >
            <FaArrowLeft size={20} />
          </button>
        )}
        <h2 className="text-3xl font-bold text-gray-800">
          {pets.length === 0 ? '¡Bienvenido! Registra tu primera mascota' : 'Registrar Nueva Mascota'}
        </h2>
      </div>

      {error && (
        <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6 rounded-r">
          <p className="text-red-700">{error}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">

        {/* Image Upload */}
        <div className="flex justify-center mb-8">
          <div className="relative group cursor-pointer">
            <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-primary/20 shadow-inner bg-gray-50 flex items-center justify-center">
              {imagePreview ? (
                <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
              ) : (
                <FaPaw className="text-4xl text-gray-300" />
              )}
            </div>
            <label htmlFor="image-upload" className="absolute bottom-0 right-0 bg-primary text-white p-2 rounded-full shadow-lg cursor-pointer hover:bg-primary-hover transition-colors">
              <FaPlus size={14} />
              <input
                id="image-upload"
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="hidden"
              />
            </label>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Basic Info */}
          <div className="space-y-1">
            <label className="block text-sm font-medium text-gray-700">Nombre</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
              placeholder="Nombre de tu mascota"
            />
          </div>

          <div className="space-y-1">
            <label className="block text-sm font-medium text-gray-700">Fecha de Nacimiento</label>
            <input
              type="date"
              name="birthdate"
              value={formData.birthdate}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
            />
          </div>

          {/* Species & Race */}
          <div className="space-y-1">
            <label className="block text-sm font-medium text-gray-700">Especie</label>
            <select
              name="specieId"
              value={formData.specieId}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-all bg-white"
            >
              <option value="">Selecciona una especie</option>
              {species.map(specie => (
                <option key={specie.id} value={specie.id}>{specie.name}</option>
              ))}
            </select>
          </div>

          <div className="space-y-1">
            <label className="block text-sm font-medium text-gray-700">Raza</label>
            <select
              name="idRace"
              value={formData.idRace}
              onChange={handleChange}
              required
              disabled={!formData.specieId}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-all bg-white disabled:bg-gray-100 disabled:text-gray-400"
            >
              <option value="">{formData.specieId ? 'Selecciona una raza' : 'Primero selecciona especie'}</option>
              {filteredRaces.map(race => (
                <option key={race.id} value={race.id}>{race.name}</option>
              ))}
            </select>
          </div>

          {/* Details */}
          <div className="space-y-1">
            <label className="block text-sm font-medium text-gray-700">Género</label>
            <div className="flex gap-4 mt-1">
              <label className={`flex-1 flex items-center justify-center gap-2 p-2 rounded-lg border cursor-pointer transition-all ${formData.gender === 'Macho' ? 'bg-blue-50 border-blue-500 text-blue-700' : 'border-gray-200 hover:bg-gray-50'}`}>
                <input
                  type="radio"
                  name="gender"
                  value="Macho"
                  checked={formData.gender === 'Macho'}
                  onChange={handleChange}
                  className="hidden"
                />
                <FaMars /> Macho
              </label>
              <label className={`flex-1 flex items-center justify-center gap-2 p-2 rounded-lg border cursor-pointer transition-all ${formData.gender === 'Hembra' ? 'bg-pink-50 border-pink-500 text-pink-700' : 'border-gray-200 hover:bg-gray-50'}`}>
                <input
                  type="radio"
                  name="gender"
                  value="Hembra"
                  checked={formData.gender === 'Hembra'}
                  onChange={handleChange}
                  className="hidden"
                />
                <FaVenus /> Hembra
              </label>
            </div>
          </div>

          <div className="space-y-1">
            <label className="block text-sm font-medium text-gray-700">Color</label>
            <input
              type="text"
              name="color"
              value={formData.color}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
              placeholder="Ej: Negro, Manchas..."
            />
          </div>

          <div className="space-y-1">
            <label className="block text-sm font-medium text-gray-700">Peso (kg) <span className="text-gray-400 text-xs">(Opcional)</span></label>
            <input
              type="number"
              step="0.1"
              name="weight"
              value={formData.weight}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
              placeholder="0.0"
            />
          </div>

          <div className="space-y-1">
            <label className="block text-sm font-medium text-gray-700">Microchip <span className="text-gray-400 text-xs">(Opcional)</span></label>
            <input
              type="text"
              name="microchip"
              value={formData.microchip}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
              placeholder="Código del chip"
            />
          </div>
        </div>

        <div className="pt-6">
          <button
            type="submit"
            disabled={submitting}
            className={`w-full py-3 px-6 rounded-lg text-white font-semibold shadow-lg transition-all transform hover:-translate-y-0.5 ${submitting ? 'bg-gray-400 cursor-not-allowed' : 'bg-primary hover:bg-primary-hover'
              }`}
          >
            {submitting ? (
              <span className="flex items-center justify-center gap-2">
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Guardando...
              </span>
            ) : (
              'Guardar Mascota'
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default FormPets;