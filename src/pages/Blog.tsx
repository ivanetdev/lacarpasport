import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { motion } from "framer-motion";

interface BlogPost {
  id: string;
  title: string;
  content: string;
  image_url: string | null;
  created_at: string;
}

export default function Blog() {
  const [posts, setPosts] = useState<BlogPost[]>([]);

  useEffect(() => {
    supabase
      .from("blog_posts")
      .select("*")
      .eq("published", true)
      .order("created_at", { ascending: false })
      .then(({ data }) => setPosts(data || []));
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="pt-24 pb-16 container mx-auto px-4">
        <h1 className="text-3xl md:text-4xl font-heading text-center mb-2">NOTICIAS</h1>
        <p className="text-center text-muted-foreground mb-12">Lo último de LA Carpa Sports</p>

        {posts.length === 0 ? (
          <p className="text-center text-muted-foreground py-20">No hay noticias publicadas todavía.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {posts.map((post, i) => (
              <motion.article
                key={post.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="border border-border rounded-lg overflow-hidden hover:shadow-lg transition-shadow"
              >
                {post.image_url && (
                  <img src={post.image_url} alt={post.title} className="w-full h-48 object-cover" />
                )}
                <div className="p-6">
                  <time className="text-xs text-muted-foreground">
                    {format(new Date(post.created_at), "d MMMM yyyy", { locale: es })}
                  </time>
                  <h3 className="font-heading text-xl mt-2 mb-3">{post.title}</h3>
                  <p className="text-sm text-muted-foreground line-clamp-3">{post.content}</p>
                </div>
              </motion.article>
            ))}
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
}
