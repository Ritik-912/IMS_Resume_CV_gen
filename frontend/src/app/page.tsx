"use client"

import ResumeForm from "@/components/ResumeForm"

export default function HomePage() {
  return (
    <main className="min-h-screen bg-white text-black py-10">
      <h1 className="text-3xl font-bold text-center mb-8">IMS Resume Builder</h1>
      <ResumeForm />
    </main>
  )
}