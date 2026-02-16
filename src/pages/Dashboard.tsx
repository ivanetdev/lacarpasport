import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { CalendarDays, User } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function Dashboard() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const [bookings, setBookings] = useState<any[]>([]);
  const [profile, setProfile] = useState<any>(null);

  useEffect(() => {
    if (!loading && !user) navigate("/auth");
  }, [user, loading]);

  useEffect(() => {
    if (!user) return;
    supabase.from("profiles").select("*").eq("user_id", user.id).single().then(({ data }) => setProfile(data));
    supabase
      .from("bookings")
      .select("*")
      .eq("user_id", user.id)
      .gte("booking_date", format(new Date(), "yyyy-MM-dd"))
      .order("booking_date", { ascending: true })
      .then(({ data }) => setBookings(data || []));
  }, [user]);

  if (loading) return null;

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="pt-24 pb-16 container mx-auto px-4 max-w-3xl">
        <div className="flex items-center gap-3 mb-8">
          <div className="h-12 w-12 bg-primary text-primary-foreground rounded-full flex items-center justify-center">
            <User className="h-6 w-6" />
          </div>
          <div>
            <h1 className="text-2xl font-heading">HOLA, {profile?.full_name?.toUpperCase() || "ATLETA"}</h1>
            <p className="text-sm text-muted-foreground">{user?.email}</p>
          </div>
        </div>

        <section>
          <div className="flex items-center gap-2 mb-4">
            <CalendarDays className="h-5 w-5" />
            <h2 className="font-heading text-xl">PRÓXIMAS RESERVAS</h2>
          </div>
          {bookings.length === 0 ? (
            <div className="text-center py-12 border border-border rounded-lg">
              <p className="text-muted-foreground mb-4">No tienes reservas próximas</p>
              <Button onClick={() => navigate("/horarios")} className="font-heading">
                RESERVAR CLASE
              </Button>
            </div>
          ) : (
            <div className="space-y-3">
              {bookings.map((b) => (
                <div key={b.id} className="flex items-center justify-between p-4 border border-border rounded-lg">
                  <div>
                    <p className="font-heading text-sm">
                      {format(new Date(b.booking_date), "EEEE d MMMM", { locale: es }).toUpperCase()}
                    </p>
                    <p className="text-muted-foreground text-sm">{b.time_slot} · 50 min</p>
                  </div>
                  <span className="text-xs bg-primary text-primary-foreground px-2 py-1 rounded font-heading">
                    {b.status?.toUpperCase()}
                  </span>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
      <Footer />
    </div>
  );
}
