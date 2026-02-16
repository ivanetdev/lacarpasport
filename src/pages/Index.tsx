import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, Clock, Users, Dumbbell } from "lucide-react";
import { Button } from "@/components/ui/button";
import heroImage from "@/assets/hero-gym.jpg";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const SCHEDULE_PREVIEW = ["6:30", "7:30", "8:30", "9:30", "14:30", "17:00", "18:00", "19:00"];

const features = [
  { icon: Clock, title: "Horarios Flexibles", desc: "8 sesiones diarias de lunes a viernes, clases de 50 minutos." },
  { icon: Users, title: "Profesores Expertos", desc: "Entrenadores cualificados para guiarte en cada sesión." },
  { icon: Dumbbell, title: "Equipamiento Pro", desc: "Instalaciones de primer nivel para tu entrenamiento." },
];

export default function Index() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Hero */}
      <section className="relative h-[90vh] flex items-center justify-center overflow-hidden">
        <img src={heroImage} alt="LA Carpa Sports Gym" className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0 bg-foreground/70" />
        <div className="relative z-10 text-center px-4">
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-5xl md:text-7xl lg:text-8xl font-heading text-primary-foreground mb-4 tracking-wider"
          >
            LA CARPA SPORTS
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-lg md:text-xl text-primary-foreground/80 mb-8 max-w-lg mx-auto"
          >
            Tu espacio de entrenamiento. Reserva tu clase y empieza hoy.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <Button asChild size="lg" className="bg-background text-foreground hover:bg-background/90 font-heading tracking-wider">
              <Link to="/auth">RESERVAR CLASE <ArrowRight className="ml-2 h-4 w-4" /></Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="border-primary-foreground/40 text-primary-foreground hover:bg-primary-foreground/10 font-heading tracking-wider">
              <Link to="/horarios">VER HORARIOS</Link>
            </Button>
          </motion.div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-heading text-center mb-12">¿POR QUÉ LA CARPA?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((f, i) => (
              <motion.div
                key={f.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15 }}
                className="text-center p-8 border border-border rounded-lg hover:bg-card transition-colors"
              >
                <f.icon className="h-10 w-10 mx-auto mb-4 text-foreground" />
                <h3 className="font-heading text-xl mb-2">{f.title}</h3>
                <p className="text-sm text-muted-foreground">{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Schedule preview */}
      <section className="py-20 bg-primary text-primary-foreground">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-heading mb-4">HORARIOS DE CLASE</h2>
          <p className="text-primary-foreground/70 mb-8">Lunes a Viernes · Sesiones de 50 minutos</p>
          <div className="flex flex-wrap justify-center gap-3 mb-8">
            {SCHEDULE_PREVIEW.map((t) => (
              <span key={t} className="px-4 py-2 border border-primary-foreground/30 rounded font-heading text-lg">
                {t}
              </span>
            ))}
          </div>
          <Button asChild variant="outline" className="border-primary-foreground/40 text-primary-foreground hover:bg-primary-foreground/10 font-heading">
            <Link to="/horarios">RESERVAR AHORA</Link>
          </Button>
        </div>
      </section>

      <Footer />
    </div>
  );
}
