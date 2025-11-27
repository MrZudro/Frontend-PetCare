import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';

// Raíz de Tailwind
import './index.css';

// Páginas
import HomeMq from './pages/HomeMq';
import WishlistMq from './pages/WishlistMq';
import VeterinaryLw from './pages/VeterinaryLw';
import ProductsLg from './pages/ProductsLg';
import ServicesLg from './pages/ServicesLg';
import FormPets from './components/formPets/FormPets';
import PetDetailLw from './pages/PetDetailLw';
import BuyCartTL from './pages/BuyCartTL';
import UserProfileViewLg from './pages/UserProfileViewLg';


// Auth Pages
import Login from './pages/Auth/Login';
import Register from './pages/Auth/Register';
import ForgotPassword from './pages/Auth/ForgotPassword';
import ResetPassword from './pages/Auth/ResetPassword';

// Componentes
import Layout from './components/layout/Layout';
import AuthLayout from './layouts/AuthLayout';
import DashboardLayout from './layouts/DashboardLayout';

// Dashboard Pages/Components
import DashboardPage from './pages/dashboard/DashboardPage';
import Agenda from './components/dashboard/veterinarian/Agenda';
import ConsultationForm from './components/dashboard/veterinarian/ConsultationForm';
import Hospitalization from './components/dashboard/veterinarian/Hospitalization';
import POS from './components/dashboard/cashier/POS';
import ClientManagement from './components/dashboard/cashier/ClientManagement';
import PetManagement from './components/dashboard/cashier/PetManagement';
import AppointmentManagement from './components/dashboard/cashier/AppointmentManagement';

// Aquí se asignan las rutas
const rutas = createBrowserRouter([
  {
    path: '/',
    element: (
      <Layout>
        <HomeMq />
      </Layout>
    ),
  },
  {
    path: '/wishlist',
    element: (
      <Layout>
        <WishlistMq />
      </Layout>
    ),
  },
  {
    path: '/veterinary',
    element: (
      <Layout>
        <VeterinaryLw />
      </Layout>
    ),
  },
  {
    path: '/products',
    element: (
      <Layout>
        <ProductsLg />
      </Layout>
    ),
  },
  {
    path: '/services',
    element: (
      <Layout>
        <ServicesLg />
      </Layout>
    ),
  },
  {
    path: '/pets',
    element: (
      <Layout>
        <FormPets />
      </Layout>
    ),
  }, {
    path: '/car',
    element: (
      <Layout>
        <BuyCartTL />
      </Layout>
    ),
  },{
    path: '/profile',
    element: (
      <Layout>
        <UserProfileViewLg />
      </Layout>
    ),
  },
  // Auth Routes
  {
    element: <AuthLayout />,
    children: [
      {
        path: '/login',
        element: <Login />,
      },

      {
        path: '/forgot-password',
        element: <ForgotPassword />,
      },
      {
        path: '/reset-password',
        element: <ResetPassword />,
      },
    ],
  },
  {
    path: '/register',
    element: <Register />,
  },
  // Dashboard Routes
  {
    path: '/dashboard',
    element: <DashboardLayout />,
    children: [
      {
        index: true,
        element: <DashboardPage />,
      },
      // Veterinarian Routes
      {
        path: 'agenda',
        element: <Agenda />,
      },
      {
        path: 'consultation',
        element: <ConsultationForm />,
      },
      {
        path: 'hospitalization',
        element: <Hospitalization />,
      },
      // Cashier Routes
      {
        path: 'pos',
        element: <POS />,
      },
      {
        path: 'clients',
        element: <ClientManagement />,
      },
      {
        path: 'pets',
        element: <PetManagement />,
      },
      {
        path: 'appointments',
        element: <AppointmentManagement />,
      },
    ],
  },
  {
    path: '/pethistory',
    element: (
      <Layout>
        <PetDetailLw />
      </Layout>
    ),
  },
    {
    path: '/car',
    element: (
      <Layout>
        <BuyCartTL/>
      </Layout>
    ),
  },
]);

// Renderizado de la aplicación
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AuthProvider>
      <RouterProvider router={rutas} />
    </AuthProvider>
  </StrictMode>
);
