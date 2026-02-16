import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { format, addDays, startOfWeek, isBefore, isToday } from "date-fns";
import { es } from "date-fns/locale";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useNavigate } from "react-router-dom";

const TIME_SLOTS = ["6:30", "7:30", "8:30", "9:30", "14:30", "17:00", "18:00", "19:00"];
const WEEKDAYS = ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes"];

export default function Schedule() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [weekStart, setWeekStart] = useState(() => {
    const now = new Date();
    return startOfWeek(now, { weekStartsOn: 1 });
  });
  const [bookings, setBookings] = useState<any[]>([]);
  const [myBookings, setMyBookings] = useState<any[]>([]);

  const weekDates = WEEKDAYS.map((_, i) => addDays(weekStart, i));

  useEffect(() => {
    if (user) {
      supabase
        .from("bookings")
        .select("*")
        .eq("user_id", user.id)
        .gte("booking_date", format(weekDates[0], "yyyy-MM-dd"))
        .lte("booking_date", format(weekDates[4], "yyyy-MM-dd"))
        .then(({ data }) => setMyBookings(data || []));
    }
  }, [user, weekStart]);

  const isBooked = (date: Date, slot: string) =>
    myBookings.some((b) => b.booking_date === format(date, "yyyy-MM-dd") && b.time_slot === slot);

  const isPast = (date: Date) => isBefore(date, new Date()) && !isToday(date);

  const handleBook = async (date: Date, slot: string) => {
    if (!user) {
      navigate("/auth");
      return;
    }
    const dateStr = format(date, "yyyy-MM-dd");
    if (isBooked(date, slot)) {
      const { error } = await supabase.from("bookings").delete().eq("user_id", user.id).eq("booking_date", dateStr).eq("time_slot", slot);
      if (error) { toast.error("Error al cancelar"); return; }
      setMyBookings((prev) => prev.filter((b) => !(b.booking_date === dateStr && b.time_slot === slot)));
      toast.success("Reserva cancelada");
    } else {
      const { data, error } = await supabase.from("bookings").insert({ user_id: user.id, booking_date: dateStr, time_slot: slot }).select().single();
      if (error) { toast.error("Error al reservar"); return; }
      setMyBookings((prev) => [...prev, data]);
      toast.success("¡Clase reservada!");
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="pt-24 pb-16 container mx-auto px-4">
        <h1 className="text-3xl md:text-4xl font-heading text-center mb-2">HORARIOS Y RESERVAS</h1>
        <p className="text-center text-muted-foreground mb-8">Lunes a Viernes · Clases de 50 minutos</p>

        <div className="flex items-center justify-center gap-4 mb-8">
          <Button variant="outline" size="icon" onClick={() => setWeekStart((d) => addDays(d, -7))}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <span className="font-heading text-lg">
            {format(weekDates[0], "d MMM", { locale: es })} — {format(weekDates[4], "d MMM yyyy", { locale: es })}
          </span>
          <Button variant="outline" size="icon" onClick={() => setWeekStart((d) => addDays(d, 7))}>
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[600px]">
            <thead>
              <tr>
                <th className="p-3 text-left font-heading text-sm text-muted-foreground">HORA</th>
                {weekDates.map((d, i) => (
                  <th key={i} className="p-3 text-center">
                    <span className="font-heading text-sm">{WEEKDAYS[i]}</span>
                    <br />
                    <span className="text-xs text-muted-foreground">{format(d, "d MMM", { locale: es })}</span>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {TIME_SLOTS.map((slot) => (
                <tr key={slot} className="border-t border-border">
                  <td className="p-3 font-heading text-sm">{slot}</td>
                  {weekDates.map((date, i) => {
                    const booked = isBooked(date, slot);
                    const past = isPast(date);
                    return (
                      <td key={i} className="p-2 text-center">
                        <Button
                          size="sm"
                          variant={booked ? "default" : "outline"}
                          className={`w-full text-xs font-heading ${past ? "opacity-30 pointer-events-none" : ""}`}
                          onClick={() => handleBook(date, slot)}
                          disabled={past}
                        >
                          {booked ? "RESERVADO" : "RESERVAR"}
                        </Button>
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {!user && <p className="text-center text-muted-foreground text-sm mt-6">Inicia sesión para reservar tu clase.</p>}
      </div>
      <Footer />
    </div>
  );
}
