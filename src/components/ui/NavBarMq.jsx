import logo from '../../assets/logo.png'
import userPng from '../../assets/descarga.png'
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
    const userData = {
        "name" : "Manuel",
        "lastName" : "Quiazua"
    }

    return (
        <>
            {/* === Barra de navegación principal === */}
            <nav className='flex justify-between h-18 p-4 relative bg-card text-texto sombra-inferior
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
                    <Link to={'/services'} ><li className='styleLinks'>Servicios</li></Link>
                    <Link to={'/products'} ><li className='styleLinks'>Productos</li></Link>
                    <Link to={'/Veterinary'} ><li className='styleLinks'>Clinicas</li></Link>
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
                            <Link to={'/Auth/Login'}>
                                <button className='styleButton rounded-r hover:bg-acento-secundario
                                                    transition-all duration-300 ease-in-out transform hover:scale-105'>
                                    Iniciar Sesion
                                </button>
                            </Link>
                            <Link to={'/Auth/Register'}>
                                <button className='styleButton rounded-l hover:bg-acento-secundario
                                                    transition-all duration-300 ease-in-out transform hover:scale-105'>
                                    Registrarse
                                </button>
                            </Link>
                        </div>
                    ) : (
                        <div className='hidden lg:flex items-center space-x-4'>
                            <Link to={'/wishlist'}><FaHeart className=' text-[20px]
                                                                        hover:text-acento-primario
                                                                        transition-all duration-300 ease-in-out
                                                                        transform hover:scale-105'/></Link>
                            
                            <Link to={'/car'}><FaShoppingCart className='   text-[20px]
                                                                            hover:text-acento-primario
                                                                            transition-all duration-300 ease-in-out
                                                                            transform hover:scale-120
                                                                            '/></Link>
                            
                            <Link to={'myperfil'}>
                                <img src={userPng} alt="Imagen de perfil" className='   
                                                            w-11 h-11 rounded-full
                                                            transition-all duration-300 ease-in-out
                                                            transform hover:scale-105' />
                            </Link>

                            <Link to={'/pets'}>
                                <button className=' styleButton hover:bg-acento-secundario
                                                    transition-all duration-300 ease-in-out 
                                                    transform hover:scale-105'>
                                                        Mis mascotas
                                </button>
                            </Link>

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
                    <Link to={'/services'} >
                        <li className='styleLinksMobile text-2xl'>
                            Servicios <FaLongArrowAltRight />
                        </li>
                    </Link>
                    <Link to={'/products'} >
                        <li className='styleLinksMobile text-2xl'>
                            Productos <FaLongArrowAltRight />
                        </li>
                    </Link>
                    <Link to={'/veterinary'} >
                        <li className='styleLinksMobile text-2xl'>
                            Veterinarias <FaLongArrowAltRight />
                        </li>
                    </Link>
                    <Link to={'/pets'}>
                        <li className='styleLinksMobile text-2xl'>
                            Mis mascotas <FaLongArrowAltRight />
                        </li>
                    </Link>
                </ul>

                {/* Botones de sesión o usuario */}
                {user == null ? (
                    <div className='flex flex-col gap-2 mt-40 items-center'>
                        <Link to={'/Auth/Login'}>
                            <button className='styleButton'>Iniciar Sesion</button>
                        </Link>
                        <Link to={'/Auth/Register'}>
                            <button className='styleButton'>Registrarse</button>                   
                        </Link>
                    </div>
                ) : (
                    <div className='mt-40'>
                        <ul >
                            <Link to={'/wishlist'} >
                                <li className='styleLinksMobile mt-2'>
                                    Wishlist<FaHeart />
                                </li>
                            </Link>
                            <Link to={'/car'} >
                                <li className='styleLinksMobile mt-2'>
                                    Mi carrito<FaShoppingCart />
                                </li>
                            </Link>
                        </ul>
                        <div className='mt-20'>
                            <Link to={'/myperfil'} className='flex flex-row items-center '>
                                <img src={userPng} alt="imagen de perfil" className='w-12 h-12 rounded-full ' />
                                <div className=' flex flex-col ml-5 font-light text-[14px] space-x-1'>
                                    <label>{userData.name} {userData.lastName}</label>
                                    <label>Customer</label>
                                    {/*Aqui perfectamente caben otros datos pero luego pondre mas */}

                                </div>
                            </Link>                            
                        </div>
                    </div>
                )}
            </div>
        </>
    );
}
