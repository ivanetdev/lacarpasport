import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { MapPin, Clock, Star, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { motion } from "framer-motion";

const SCHEDULE = [
  { time: "6:30 - 7:20", label: "Sesión 1" },
  { time: "7:30 - 8:20", label: "Sesión 2" },
  { time: "8:30 - 9:20", label: "Sesión 3" },
  { time: "9:30 - 10:20", label: "Sesión 4" },
  { time: "14:30 - 15:20", label: "Sesión 5" },
  { time: "17:00 - 17:50", label: "Sesión 6" },
  { time: "18:00 - 18:50", label: "Sesión 7" },
  { time: "19:00 - 19:50", label: "Sesión 8" },
];

function getCurrentSession() {
  const now = new Date();
  const h = now.getHours();
  const m = now.getMinutes();
  const mins = h * 60 + m;
  const sessions = [
    { start: 390, end: 440 },   // 6:30-7:20
    { start: 450, end: 500 },   // 7:30-8:20
    { start: 510, end: 560 },   // 8:30-9:20
    { start: 570, end: 620 },   // 9:30-10:20
    { start: 870, end: 920 },   // 14:30-15:20
    { start: 1020, end: 1070 }, // 17:00-17:50
    { start: 1080, end: 1130 }, // 18:00-18:50
    { start: 1140, end: 1190 }, // 19:00-19:50
  ];
  const day = now.getDay();
  if (day === 0 || day === 6) return -1; // Weekend
  return sessions.findIndex((s) => mins >= s.start && mins <= s.end);
}

interface Review {
  id: string;
  rating: number;
  comment: string | null;
  created_at: string;
  profiles?: { full_name: string | null } | null;
}

export default function Info() {
  const { user } = useAuth();
  const [activeSession, setActiveSession] = useState(getCurrentSession());
  const [reviews, setReviews] = useState<Review[]>([]);
  const [newComment, setNewComment] = useState("");
  const [newRating, setNewRating] = useState(5);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const iv = setInterval(() => setActiveSession(getCurrentSession()), 60000);
    return () => clearInterval(iv);
  }, []);

  useEffect(() => {
    supabase
      .from("reviews")
      .select("*")
      .eq("approved", true)
      .order("created_at", { ascending: false })
      .limit(20)
      .then(({ data }) => setReviews(data || []));
  }, []);

  const handleReview = async () => {
    if (!user) { toast.error("Inicia sesión para dejar una reseña"); return; }
    if (!newComment.trim()) { toast.error("Escribe un comentario"); return; }
    setSubmitting(true);
    const { error } = await supabase.from("reviews").insert({
      user_id: user.id,
      rating: newRating,
      comment: newComment.trim(),
    });
    setSubmitting(false);
    if (error) { toast.error("Error al enviar"); return; }
    toast.success("¡Reseña enviada! Será visible tras la aprobación.");
    setNewComment("");
    setNewRating(5);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="pt-24 pb-16 container mx-auto px-4">
        <h1 className="text-3xl md:text-4xl font-heading text-center mb-12">INFORMACIÓN</h1>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
          {/* Location */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <MapPin className="h-5 w-5" />
              <h2 className="font-heading text-2xl">UBICACIÓN</h2>
            </div>
            <p className="text-muted-foreground mb-4">Calle Ejemplo 123, Ciudad, CP 12345</p>
            <div className="w-full h-64 bg-muted rounded-lg flex items-center justify-center">
              <p className="text-muted-foreground text-sm">Mapa (configurable por admin)</p>
            </div>
          </div>

          {/* Schedule */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Clock className="h-5 w-5" />
              <h2 className="font-heading text-2xl">HORARIO EN DIRECTO</h2>
            </div>
            <p className="text-sm text-muted-foreground mb-4">Lunes a Viernes</p>
            <div className="space-y-2">
              {SCHEDULE.map((s, i) => (
                <div
                  key={i}
                  className={`flex items-center justify-between p-3 rounded border ${
                    i === activeSession
                      ? "bg-primary text-primary-foreground border-primary"
                      : "border-border"
                  }`}
                >
                  <span className="font-heading text-sm">{s.label}</span>
                  <span className="text-sm">{s.time}</span>
                  {i === activeSession && (
                    <span className="text-xs bg-primary-foreground/20 px-2 py-0.5 rounded">EN CURSO</span>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Reviews */}
        <section>
          <div className="flex items-center gap-2 mb-8 justify-center">
            <Star className="h-5 w-5" />
            <h2 className="font-heading text-2xl">RESEÑAS</h2>
          </div>

          {/* Submit review */}
          {user && (
            <div className="max-w-lg mx-auto mb-12 p-6 border border-border rounded-lg">
              <h3 className="font-heading text-lg mb-4">DEJA TU RESEÑA</h3>
              <div className="flex gap-1 mb-3">
                {[1, 2, 3, 4, 5].map((n) => (
                  <button key={n} onClick={() => setNewRating(n)}>
                    <Star className={`h-5 w-5 ${n <= newRating ? "fill-foreground text-foreground" : "text-muted-foreground"}`} />
                  </button>
                ))}
              </div>
              <Textarea
                placeholder="Tu experiencia en LA Carpa Sports..."
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                maxLength={500}
                className="mb-3"
              />
              <Button onClick={handleReview} disabled={submitting} className="font-heading">
                <Send className="h-4 w-4 mr-2" /> ENVIAR
              </Button>
            </div>
          )}

          {reviews.length === 0 ? (
            <p className="text-center text-muted-foreground">No hay reseñas todavía.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {reviews.map((r, i) => (
                <motion.div
                  key={r.id}
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.05 }}
                  className="p-6 border border-border rounded-lg"
                >
                  <div className="flex gap-0.5 mb-2">
                    {Array.from({ length: r.rating }).map((_, j) => (
                      <Star key={j} className="h-4 w-4 fill-foreground text-foreground" />
                    ))}
                  </div>
                  <p className="text-sm text-muted-foreground">{r.comment}</p>
                </motion.div>
              ))}
            </div>
          )}
        </section>
      </div>
      <Footer />
    </div>
  );
}
