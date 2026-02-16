import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import { Users, CalendarDays, FileText, GraduationCap, Star, Trash2, Plus, Check, X } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

type Tab = "users" | "bookings" | "blog" | "professors" | "reviews";

export default function Admin() {
  const { user, loading, isAdmin } = useAuth();
  const navigate = useNavigate();
  const [tab, setTab] = useState<Tab>("users");

  useEffect(() => {
    if (!loading && (!user || !isAdmin)) navigate("/");
  }, [user, loading, isAdmin]);

  if (loading || !isAdmin) return null;

  const tabs: { id: Tab; label: string; icon: any }[] = [
    { id: "users", label: "Usuarios", icon: Users },
    { id: "bookings", label: "Reservas", icon: CalendarDays },
    { id: "blog", label: "Blog", icon: FileText },
    { id: "professors", label: "Profesores", icon: GraduationCap },
    { id: "reviews", label: "Reseñas", icon: Star },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="pt-24 pb-16 container mx-auto px-4">
        <h1 className="text-3xl font-heading mb-6">PANEL DE ADMINISTRACIÓN</h1>

        <div className="flex flex-wrap gap-2 mb-8">
          {tabs.map((t) => (
            <Button
              key={t.id}
              variant={tab === t.id ? "default" : "outline"}
              size="sm"
              onClick={() => setTab(t.id)}
              className="font-heading"
            >
              <t.icon className="h-4 w-4 mr-1" /> {t.label}
            </Button>
          ))}
        </div>

        {tab === "users" && <AdminUsers />}
        {tab === "bookings" && <AdminBookings />}
        {tab === "blog" && <AdminBlog />}
        {tab === "professors" && <AdminProfessors />}
        {tab === "reviews" && <AdminReviews />}
      </div>
      <Footer />
    </div>
  );
}

function AdminUsers() {
  const [profiles, setProfiles] = useState<any[]>([]);
  useEffect(() => {
    supabase.from("profiles").select("*").then(({ data }) => setProfiles(data || []));
  }, []);
  return (
    <div>
      <h2 className="font-heading text-xl mb-4">USUARIOS REGISTRADOS</h2>
      {profiles.length === 0 ? <p className="text-muted-foreground">No hay usuarios.</p> : (
        <div className="space-y-2">
          {profiles.map((p) => (
            <div key={p.id} className="flex items-center justify-between p-3 border border-border rounded-lg">
              <div>
                <p className="font-medium text-sm">{p.full_name || "Sin nombre"}</p>
                <p className="text-xs text-muted-foreground">{p.user_id}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function AdminBookings() {
  const [bookings, setBookings] = useState<any[]>([]);
  useEffect(() => {
    supabase.from("bookings").select("*").order("booking_date", { ascending: true }).limit(50).then(({ data }) => setBookings(data || []));
  }, []);
  return (
    <div>
      <h2 className="font-heading text-xl mb-4">RESERVAS</h2>
      {bookings.length === 0 ? <p className="text-muted-foreground">No hay reservas.</p> : (
        <div className="space-y-2">
          {bookings.map((b) => (
            <div key={b.id} className="flex items-center justify-between p-3 border border-border rounded-lg text-sm">
              <span>{b.booking_date} · {b.time_slot}</span>
              <span className="text-muted-foreground">{b.user_id.slice(0, 8)}...</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function AdminBlog() {
  const [posts, setPosts] = useState<any[]>([]);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [imageUrl, setImageUrl] = useState("");

  const load = () => supabase.from("blog_posts").select("*").order("created_at", { ascending: false }).then(({ data }) => setPosts(data || []));
  useEffect(() => { load(); }, []);

  const create = async () => {
    if (!title || !content) { toast.error("Título y contenido requeridos"); return; }
    const { error } = await supabase.from("blog_posts").insert({
      title, content, image_url: imageUrl || null, published: true,
    });
    if (error) { toast.error("Error al crear post"); return; }
    toast.success("Post creado");
    setTitle(""); setContent(""); setImageUrl("");
    load();
  };

  const remove = async (id: string) => {
    await supabase.from("blog_posts").delete().eq("id", id);
    toast.success("Post eliminado");
    load();
  };

  const togglePublish = async (id: string, current: boolean) => {
    await supabase.from("blog_posts").update({ published: !current }).eq("id", id);
    load();
  };

  return (
    <div>
      <h2 className="font-heading text-xl mb-4">GESTIONAR BLOG</h2>
      <div className="p-4 border border-border rounded-lg mb-6 space-y-3">
        <Label>Título</Label>
        <Input value={title} onChange={(e) => setTitle(e.target.value)} />
        <Label>Contenido</Label>
        <Textarea value={content} onChange={(e) => setContent(e.target.value)} rows={4} />
        <Label>URL de imagen (opcional)</Label>
        <Input value={imageUrl} onChange={(e) => setImageUrl(e.target.value)} placeholder="https://..." />
        <Button onClick={create} className="font-heading"><Plus className="h-4 w-4 mr-1" /> CREAR POST</Button>
      </div>
      <div className="space-y-2">
        {posts.map((p) => (
          <div key={p.id} className="flex items-center justify-between p-3 border border-border rounded-lg">
            <div>
              <p className="font-medium text-sm">{p.title}</p>
              <p className="text-xs text-muted-foreground">{p.published ? "Publicado" : "Borrador"}</p>
            </div>
            <div className="flex gap-2">
              <Button size="sm" variant="outline" onClick={() => togglePublish(p.id, p.published)}>
                {p.published ? <X className="h-3 w-3" /> : <Check className="h-3 w-3" />}
              </Button>
              <Button size="sm" variant="outline" onClick={() => remove(p.id)}>
                <Trash2 className="h-3 w-3" />
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function AdminProfessors() {
  const [professors, setProfessors] = useState<any[]>([]);
  const [name, setName] = useState("");
  const [specialty, setSpecialty] = useState("");
  const [bio, setBio] = useState("");

  const load = () => supabase.from("professors").select("*").order("created_at", { ascending: false }).then(({ data }) => setProfessors(data || []));
  useEffect(() => { load(); }, []);

  const create = async () => {
    if (!name) { toast.error("Nombre requerido"); return; }
    const { error } = await supabase.from("professors").insert({ name, specialty: specialty || null, bio: bio || null });
    if (error) { toast.error("Error al crear profesor"); return; }
    toast.success("Profesor añadido");
    setName(""); setSpecialty(""); setBio("");
    load();
  };

  const remove = async (id: string) => {
    await supabase.from("professors").delete().eq("id", id);
    toast.success("Profesor eliminado");
    load();
  };

  const toggleActive = async (id: string, current: boolean) => {
    await supabase.from("professors").update({ active: !current }).eq("id", id);
    load();
  };

  return (
    <div>
      <h2 className="font-heading text-xl mb-4">GESTIONAR PROFESORES</h2>
      <div className="p-4 border border-border rounded-lg mb-6 space-y-3">
        <Label>Nombre</Label>
        <Input value={name} onChange={(e) => setName(e.target.value)} />
        <Label>Especialidad</Label>
        <Input value={specialty} onChange={(e) => setSpecialty(e.target.value)} />
        <Label>Biografía</Label>
        <Textarea value={bio} onChange={(e) => setBio(e.target.value)} rows={3} />
        <Button onClick={create} className="font-heading"><Plus className="h-4 w-4 mr-1" /> AÑADIR PROFESOR</Button>
      </div>
      <div className="space-y-2">
        {professors.map((p) => (
          <div key={p.id} className="flex items-center justify-between p-3 border border-border rounded-lg">
            <div>
              <p className="font-medium text-sm">{p.name}</p>
              <p className="text-xs text-muted-foreground">{p.active ? "Activo" : "Inactivo"}</p>
            </div>
            <div className="flex gap-2">
              <Button size="sm" variant="outline" onClick={() => toggleActive(p.id, p.active)}>
                {p.active ? "Desactivar" : "Activar"}
              </Button>
              <Button size="sm" variant="outline" onClick={() => remove(p.id)}>
                <Trash2 className="h-3 w-3" />
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function AdminReviews() {
  const [reviews, setReviews] = useState<any[]>([]);
  const load = () => supabase.from("reviews").select("*").order("created_at", { ascending: false }).then(({ data }) => setReviews(data || []));
  useEffect(() => { load(); }, []);

  const approve = async (id: string) => {
    await supabase.from("reviews").update({ approved: true }).eq("id", id);
    toast.success("Reseña aprobada");
    load();
  };

  const remove = async (id: string) => {
    await supabase.from("reviews").delete().eq("id", id);
    toast.success("Reseña eliminada");
    load();
  };

  return (
    <div>
      <h2 className="font-heading text-xl mb-4">GESTIONAR RESEÑAS</h2>
      {reviews.length === 0 ? <p className="text-muted-foreground">No hay reseñas.</p> : (
        <div className="space-y-2">
          {reviews.map((r) => (
            <div key={r.id} className="flex items-center justify-between p-3 border border-border rounded-lg">
              <div>
                <div className="flex gap-0.5 mb-1">
                  {Array.from({ length: r.rating }).map((_, i) => (
                    <Star key={i} className="h-3 w-3 fill-foreground text-foreground" />
                  ))}
                </div>
                <p className="text-sm">{r.comment}</p>
                <p className="text-xs text-muted-foreground">{r.approved ? "Aprobada" : "Pendiente"}</p>
              </div>
              <div className="flex gap-2">
                {!r.approved && (
                  <Button size="sm" variant="outline" onClick={() => approve(r.id)}>
                    <Check className="h-3 w-3" />
                  </Button>
                )}
                <Button size="sm" variant="outline" onClick={() => remove(r.id)}>
                  <Trash2 className="h-3 w-3" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
