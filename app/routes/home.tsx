import type { Route } from "./+types/home";

import Navbar from "../components/Navbar";
import ParticleBackground from "../components/ParticleBackground";
import { resumes } from "../../constants";
import ResumeCards from "~/components/ResumeCards";
import { usePuterStore } from "~/lib/puter";
import { useLocation, useNavigate } from "react-router";
import { useEffect } from "react";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Free AI Resume" },
    { name: "description", content: "Your AI-powered resume feedback tool" },
  ];
}

export default function Home() {



  const {auth} = usePuterStore()
  
  const navigate = useNavigate()
  useEffect(() => {
    if (!auth.isAuthenticated)navigate('/auth?next=/');
      // Handle authenticated state
    
  }, [auth.isAuthenticated ]);


  return (
    <main className="interactive-background">
      <ParticleBackground />
      <Navbar />
    
      <section className="main-section">
        <div className="page-heading py-16">
          <h1>track your applications and get AI-powered feedback</h1>
          <p>Your AI-powered resume feedback tool</p>
        </div>

        <div className="resumes-section "></div>
        {resumes.length > 0 && (
          <div className="resumes-section">
            {resumes.map((resume) => (
              <ResumeCards key={resume.id} resume={resume} />
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
