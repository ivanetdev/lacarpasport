import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { User } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { motion } from "framer-motion";

interface Professor {
  id: string;
  name: string;
  specialty: string | null;
  bio: string | null;
  photo_url: string | null;
}

export default function Professors() {
  const [professors, setProfessors] = useState<Professor[]>([]);

  useEffect(() => {
    supabase.from("professors").select("*").eq("active", true).then(({ data }) => setProfessors(data || []));
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="pt-24 pb-16 container mx-auto px-4">
        <h1 className="text-3xl md:text-4xl font-heading text-center mb-2">NUESTROS PROFESORES</h1>
        <p className="text-center text-muted-foreground mb-12">El equipo que te acompaña en cada sesión</p>

        {professors.length === 0 ? (
          <p className="text-center text-muted-foreground py-20">Próximamente se añadirán los profesores.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {professors.map((p, i) => (
              <motion.div
                key={p.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="border border-border rounded-lg overflow-hidden hover:shadow-lg transition-shadow"
              >
                {p.photo_url ? (
                  <img src={p.photo_url} alt={p.name} className="w-full h-64 object-cover" />
                ) : (
                  <div className="w-full h-64 bg-muted flex items-center justify-center">
                    <User className="h-16 w-16 text-muted-foreground" />
                  </div>
                )}
                <div className="p-6">
                  <h3 className="font-heading text-xl mb-1">{p.name}</h3>
                  {p.specialty && <p className="text-sm text-muted-foreground mb-3">{p.specialty}</p>}
                  {p.bio && <p className="text-sm text-muted-foreground">{p.bio}</p>}
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
}
