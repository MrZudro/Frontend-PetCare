import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'

//Raiz de Tailwind
import './index.css'

//Paginas completas con las rutas
import HomeMq from './pages/HomeMq';
import Layout from './components/layout/Layout';
import WishlistMq from './pages/WishlistMq';
import VeterinaryLw from './pages/VeterinaryLw';
import ProductsLg from './pages/ProductsLg';
import ServicesLg from './pages/ServicesLg';
import FormPets from './components/formPets/FormPets';

//Aqui se asignan las rutas, al final del desarrollo se agregara la seguridad
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
    element:(
      <Layout>
        <WishlistMq/>
      </Layout>
    )
  },
  {path:'/veterinary', element:<VeterinaryLw/>},
  { path:'/products', element:<ProductsLg/>},
  { path:'/services', element:<ServicesLg/>},
  { path:'/pets', element:<FormPets/>}
]);

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RouterProvider router={rutas}/>
  </StrictMode>
)
