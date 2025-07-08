import { Banner } from '@components/Home/Banner';
import { Navbar } from '@components/Navbar';

export default function HomePage() {
    return (
        <>
            <Navbar />
            <main style={{ position: 'relative' }}>
                <Banner />
            </main>
        </>
    );
}
