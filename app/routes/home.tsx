import type { Route } from "./+types/home";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "AI Resume" },
    { name: "description", content: "Your AI-powered resume builder" },
  ];
}

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-gray-950 text-white">
      <h1 className="text-5xl font-bold tracking-tight">AI Resume</h1>
      <p className="mt-4 text-lg text-gray-400">Your AI-powered resume builder</p>
    </main>
  );
}
