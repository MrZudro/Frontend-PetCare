import PurchaseHistoryXh from "../components/ui/PurchaseHistoryXh";
import SidebarXh from "../components/ui/SidebarXh"
import ConfigurationXh from "../components/ui/ConfigurationXh"

export default function UserProfileXh () {
    return (
        <>
            <div className="w-screen h-screen flex items-center justify-center bg-fondo">
                <div className="flex flex-col items-center justify-center bg-acento-secundario w-80 h-90 rounded-2xl shadow-card gap-4 p-5">
                    <h1 className="text-text-primary font-poppins font-bold text-center">Tu Perfil</h1>
                    <p>Hola, Gestiona tu información personal y de tus mascotas</p>
                </div>
            </div>
        </>
    )
}