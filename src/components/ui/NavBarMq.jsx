import logo from '../../assets/logo.png'
export default function NavBarMq() {
    const user = null; // Por ahora funcional, pero esto debe validar el localStorage
    return (
        <nav>
            <div>
                <img src={logo} alt="logo de la marca" />
                <h1></h1>
            </div>
            <ul>
                <li></li>
                <li></li>
                <li></li>
            </ul>
            {user == null ? (
                <div>
                    <button>Iniciar Sesion</button>
                    <button>Registrarse</button>
                </div>
            ):(
                <div>
                    <img src="" alt="" />
                    <button>Mis mascotas</button>
                </div>
            )}
        </nav>
    )
}
