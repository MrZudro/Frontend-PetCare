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

// Páginas Admin
import AdminLw from './pages/AdminLw';
import ProductsPage from './components/admin/ProductsPage';
import ServicesPage from './components/admin/ServicesPage';
import ConfigurationPage from './components/admin/ConfigurationPage';
import EmployeesPage from './components/admin/EmployeesPage';
import VaccinesPage from './components/admin/VaccinesPage';
import ReportesPage from './components/admin/ReportsPage';
import ProfilePage from './components/admin/ProfilePage';

// Componentes
import Layout from './components/layout/Layout';
import LayoutAdmin from './components/admin/LayoutAdmin'
import AuthLayout from './layouts/AuthLayout';
import DashboardLayout from './layouts/DashboardLayout';
import ProtectedRoute from './components/ProtectedRoute';

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
    ), // ruta disponible para no identificados y CUSTOMER
  },
  {
    path: '/wishlist',
    element: (
      <ProtectedRoute allowedRoles={['CUSTOMER']}>
        <Layout>
          <WishlistMq />
        </Layout>
      </ProtectedRoute>
    ), // ruta disponible para CUSTOMER
  },
  {
    path: '/veterinary',
    element: (
      <Layout>
        <VeterinaryLw />
      </Layout>
    ), // ruta disponible para NO IDENTIFICADOS Y CUSTOMER
  },
  {
    path: '/products',
    element: (
      <Layout>
        <ProductsLg />
      </Layout>
    ), // ruta disponible para NO IDENTIFICADOS Y CUSTOMER
  },
  {
    path: '/services',
    element: (
      <Layout>
        <ServicesLg />
      </Layout>
    ), // ruta disponible para NO IDENTIFICADOS Y CUSTOMER
  },
  {
    path: '/pets',
    element: (
      <ProtectedRoute allowedRoles={['CUSTOMER']}>
        <Layout>
          <FormPets />
        </Layout>
      </ProtectedRoute>
    ),  // ruta disponible para CUSTOMER
  }, {
    path: '/car',
    element: (
      <ProtectedRoute allowedRoles={['CUSTOMER']}>
        <Layout>
          <BuyCartTL />
        </Layout>
      </ProtectedRoute>
    ), // ruta disponible para CUSTOMER
  }, {
    path: '/myperfil',
    element: (
      <ProtectedRoute allowedRoles={['CUSTOMER']}>
        <Layout>
          <UserProfileViewLg />
        </Layout>
      </ProtectedRoute>
    ),  // ruta disponible para CUSTOMER
  },
  // Auth Routes, DISPONIBLE PARA TODOS
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
  // Dashboard Employee Routes, UNICAMENTE ROL EMPLOYEE
  {
    path: '/employee',
    element: (
      <ProtectedRoute allowedRoles={['EMPLOYEE']}>
        <DashboardLayout />
      </ProtectedRoute>
    ),
    children: [
      {
        index: true,
        element: <DashboardPage />,
      },
      // CARGO VETERINARIAN
      {
        path: 'agenda',
        element: (
          <ProtectedRoute allowedRoles={['EMPLOYEE']} allowedCargos={['VETERINARIAN']}>
            <Agenda />
          </ProtectedRoute>
        ),
      },
      {
        path: 'consultation',
        element: (
          <ProtectedRoute allowedRoles={['EMPLOYEE']} allowedCargos={['VETERINARIAN']}>
            <ConsultationForm />
          </ProtectedRoute>
        ),
      },
      {
        path: 'hospitalization',
        element: (
          <ProtectedRoute allowedRoles={['EMPLOYEE']} allowedCargos={['VETERINARIAN']}>
            <Hospitalization />
          </ProtectedRoute>
        ),
      },
      // CARGO CASHIER
      {
        path: 'pos',
        element: (
          <ProtectedRoute allowedRoles={['EMPLOYEE']} allowedCargos={['CASHIER']}>
            <POS />
          </ProtectedRoute>
        ),
      },
      {
        path: 'clients',
        element: (
          <ProtectedRoute allowedRoles={['EMPLOYEE']} allowedCargos={['CASHIER']}>
            <ClientManagement />
          </ProtectedRoute>
        ),
      },
      {
        path: 'pets',
        element: (
          <ProtectedRoute allowedRoles={['EMPLOYEE']} allowedCargos={['CASHIER']}>
            <PetManagement />
          </ProtectedRoute>
        ),
      },
      {
        path: 'appointments',
        element: (
          <ProtectedRoute allowedRoles={['EMPLOYEE']} allowedCargos={['CASHIER']}>
            <AppointmentManagement />
          </ProtectedRoute>
        ),
      },
    ],
  },
  {
    path: '/pethistory/:petId',
    element: (
      <ProtectedRoute allowedRoles={['CUSTOMER']}>
        <Layout>
          <PetDetailLw />
        </Layout>
      </ProtectedRoute>
    ), //RUTA UNICAMENTE CUSTOMER
  },
  {
    path: '/car',
    element: (
      <ProtectedRoute allowedRoles={['CUSTOMER']}>
        <Layout>
          <BuyCartTL />
        </Layout>
      </ProtectedRoute>
    ), //RUTA UNICAMENTE CUSTOMER
  },
  {
    // Dashboard Admin Routes, UNICAMENTE ROL ADMIN
    path: '/admin',
    element: (
      <ProtectedRoute allowedRoles={['ADMIN']}>
        <LayoutAdmin />
      </ProtectedRoute>
    ),
    children: [
      { index: true, element: <AdminLw /> },              // Dashboard principal
      { path: 'productos', element: <ProductsPage /> },   // Productos
      { path: 'servicios', element: <ServicesPage /> },   // Servicios
      { path: 'configuracion', element: <ConfigurationPage /> }, // Configuración
      { path: 'empleados', element: <EmployeesPage /> },  // Empleados
      { path: 'vacunas', element: <VaccinesPage /> },  // Inventario de vacunas
      { path: 'reportes', element: <ReportesPage /> },  // Reportes
      { path: 'perfil', element: <ProfilePage /> },  // Perfil
    ],
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
