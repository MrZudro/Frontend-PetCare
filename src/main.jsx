import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';

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
  {
    path: '/admin',
    element: <LayoutAdmin />,
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
    <RouterProvider router={rutas} />
  </StrictMode>
);
