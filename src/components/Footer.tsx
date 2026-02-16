import { Link } from "react-router-dom";
import { Dumbbell, MapPin, Clock, Mail } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-primary text-primary-foreground py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Dumbbell className="h-6 w-6" />
              <span className="font-heading text-lg">LA CARPA SPORTS</span>
            </div>
            <p className="text-sm opacity-70">Tu gimnasio de confianza. Entrena con los mejores profesionales.</p>
          </div>
          <div>
            <h4 className="font-heading text-sm mb-4">NAVEGACIÓN</h4>
            <div className="space-y-2 text-sm opacity-70">
              <Link to="/horarios" className="block hover:opacity-100 transition-opacity">Horarios</Link>
              <Link to="/profesores" className="block hover:opacity-100 transition-opacity">Profesores</Link>
              <Link to="/blog" className="block hover:opacity-100 transition-opacity">Blog</Link>
              <Link to="/info" className="block hover:opacity-100 transition-opacity">Info & Ubicación</Link>
            </div>
          </div>
          <div>
            <h4 className="font-heading text-sm mb-4">CONTACTO</h4>
            <div className="space-y-2 text-sm opacity-70">
              <div className="flex items-center gap-2"><MapPin className="h-4 w-4" /> Tu dirección aquí</div>
              <div className="flex items-center gap-2"><Clock className="h-4 w-4" /> Lun - Vie: 6:30 - 20:00</div>
              <div className="flex items-center gap-2"><Mail className="h-4 w-4" /> info@lacarpasports.com</div>
            </div>
          </div>
        </div>
        <div className="mt-8 pt-8 border-t border-primary-foreground/20 text-center text-sm opacity-50">
          © {new Date().getFullYear()} LA Carpa Sports. Todos los derechos reservados.
        </div>
      </div>
    </footer>
  );
}
