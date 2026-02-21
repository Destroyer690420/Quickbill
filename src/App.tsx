import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { Features } from './components/Features';
import { Philosophy } from './components/Philosophy';
import { Protocol } from './components/Protocol';
import { Footer } from './components/Footer';

const App = () => {
  return (
    <div className="min-h-[100dvh] bg-[var(--color-indigo-midnight)] overflow-x-hidden selection:bg-[var(--color-green-volt)] selection:text-[var(--color-indigo-midnight)]">
      <Navbar />
      <Hero />
      <Features />
      <Philosophy />
      <Protocol />
      <Footer />
    </div>
  )
}

export default App
