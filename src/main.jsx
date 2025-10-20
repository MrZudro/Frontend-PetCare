import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'

//Raiz de Tailwind
import './index.css'

//Paginas completas con las rutas
import HomeMq from './pages/HomeMq';

//Aqui se asignan las rutas, al final del desarrollo se agregara la seguridad
const rutas = createBrowserRouter([
  { path:'/', element:<HomeMq/>}
]);

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RouterProvider router={rutas}/>
  </StrictMode>,
)
