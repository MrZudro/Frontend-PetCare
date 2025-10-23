import logo from '../../assets/logo.png'
// Icons
import { FaShoppingCart } from "react-icons/fa";
import { FaHeart } from "react-icons/fa";
import { IoMenu } from "react-icons/io5";
import { IoClose } from "react-icons/io5";
import { FaLongArrowAltRight } from "react-icons/fa";

// Estados de React
import { useState } from 'react';
import { Link } from 'react-router-dom';

export default function NavBarMq() {
    const user = null; // Por ahora funcional, pero esto debe validar el localStorage
    const [openMenu, setOpenMenu] = useState(false);

    return (
        <>
            {/* === Barra de navegación principal === */}
            <nav className='flex justify-between h-18 p-4 relative bg-card text-texto shadow-2xl
                            2xl:mx-[10vw] rounded-2xl'>
                {/* Logo + título */}
                <div className='flex items-center cursor-pointer'>
                    <img src={logo} alt="logo de la marca" className='w-20 h-20' />
                    <h1 
                        className=' font-bold text-4xl hover:text-acento-primario 
                                    transition-colors duration-300 ease-in-initial'>
                        PetCare
                    </h1>
                </div>

                {/* Menú principal (visible en desktop) */}
                <ul className='hidden lg:flex space-x-15 items-center font-medium'>
                    <Link to={'/services'} />
                    <li className='styleLinks'>Servicios</li>
                    <li className='styleLinks'>Productos</li>
                    <li className='styleLinks'>Clinicas</li>
                </ul>

                {/* Botones e íconos */}
                <div className='flex items-center'>
                    {/* Ícono de menú (visible solo en móvil) */}
                    <IoMenu 
                        className='lg:hidden text-4xl cursor-pointer' 
                        onClick={() => setOpenMenu(true)} 
                    />

                    {/* Botones de usuario/inicio de sesión visibles en Desktop */}
                    {user == null ? (
                        <div className='hidden lg:flex pr-10'>
                            <button className='styleButton rounded-r hover:bg-acento-secundario
                                                transition-all duration-300 ease-in-out transform hover:scale-105'>
                                Iniciar Sesion
                            </button>
                            <button className='styleButton rounded-l hover:bg-acento-secundario
                                                transition-all duration-300 ease-in-out transform hover:scale-105'>
                                Registrarse
                            </button>
                        </div>
                    ) : (
                        <div className='hidden md:flex items-center space-x-4'>
                            <FaHeart />
                            <FaShoppingCart />
                            <img src="" alt="" className='w-8 h-8 rounded-full border' />
                            <button>Mis mascotas</button>
                        </div>
                    )}
                </div>
            </nav>

            {/* === Fondo borroso === */}
            <div 
                className={`
                    fixed inset-0 bg-black/20 backdrop-blur-sm z-40
                    transition-opacity duration-300 ease-in-out
                    ${openMenu ? 'opacity-100 visible' : 'opacity-0 invisible'} 
                `} 
                onClick={() => setOpenMenu(false)}
                // Esto pregunta si el menu esta abierto, y cambia la opacidad, ademas cuando se hace click fuera del menu, sobre el div, cierra el menu 
            />

            {/* === Menú desplegable lateral === */}
            <div
                className={`
                    fixed top-0 right-0 h-screen w-[70vw]
                    bg-white shadow-xl z-50 p-6
                    transition-transform duration-300 ease-in-out
                    ${openMenu ? 'translate-x-0' : 'translate-x-full'}
                `}
            >
                {/* Botón de cierre */}
                <div className='w-full'>
                    <IoClose 
                        className='text-4xl ml-auto cursor-pointer' 
                        onClick={() => setOpenMenu(false)} 
                    />
                </div>

                {/* Enlaces del menú */}
                <ul className='flex flex-col space-y-4 text-xl mt-40'>
                    <li className='flex flex-row items-center justify-between text-2xl'>
                        Servicios <FaLongArrowAltRight />
                    </li>
                    <li className='flex flex-row items-center justify-between text-2xl'>
                        Productos <FaLongArrowAltRight />
                    </li>
                    <li className='flex flex-row items-center justify-between text-2xl'>
                        Veterinarias <FaLongArrowAltRight />
                    </li>
                </ul>

                {/* Botones de sesión o usuario */}
                {user == null ? (
                    <div className='flex flex-col gap-2 mt-40'>
                        <button className='styleButton'>Iniciar Sesion</button>
                        <button className='styleButton'>Registrarse</button>
                    </div>
                ) : (
                    <div className='mt-40'>
                        <FaHeart />
                        <FaShoppingCart />
                        <img src="" alt="" className='w-8 h-8 rounded-full border' />
                        <button>Mis mascotas</button>
                    </div>
                )}
            </div>
        </>
    );
}
