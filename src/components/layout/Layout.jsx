import NavBarMq from '../ui/NavBarMq'
import FooterMq from '../ui/FooterMq'

export default function Layout({ children }) {
    return (
        <>
            <NavBarMq />
            <main>
                {children}
            </main>
            <FooterMq />
        </>
    )
}