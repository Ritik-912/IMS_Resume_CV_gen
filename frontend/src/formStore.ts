// src/formStore.ts
import { create } from "zustand"

// ─────────────────────────────────────────────────────────────────────────────
// 2) Your canonical FormData type
// ─────────────────────────────────────────────────────────────────────────────
export type Academic = {
  course: string
  institute: string
  pass_year: string
  grade: string
}

export type Training = {
  organisation: string
  project: string
  learnings: string[]
  duration: string
}

export type ExperienceItem = {
  organisation: string
  project: string
  responsibilities: string[]
  designation: string
  startDate: string  // "YYYY-MM"
  endDate: string    // "YYYY-MM"
}

export type Project = { title: string; description: string }
export type Certification = { title: string; issuer: string }

export type FormData = {
  photo: string | null
  name: string
  phone: string
  email: string
  linkedin: string
  objective: string
  dob: string
  address: string
  strengths: string
  hobbies: string
  languages: string
  proficiencies: string[]
  coCurricular: string[]
  academics: Academic[]
  trainings: Training[]
  experience: ExperienceItem[]
  projects: Project[]
  certifications: Certification[]
}

interface FormStore {
  data: FormData
  setField: <K extends keyof FormData>(key: K, value: FormData[K]) => void
  reset: () => void
}

const initialData: FormData = {
  photo: null,
  name: "",
  phone: "",
  email: "",
  linkedin: "",
  objective: "",
  dob: "",
  address: "",
  strengths: "",
  hobbies: "",
  languages: "",
  proficiencies: [],
  coCurricular: [],
  academics: [],
  trainings: [],
  experience: [],
  projects: [],
  certifications: [],
}

export const useFormStore = create<FormStore>((set) => ({
  data: initialData,
  setField: (key, value) =>
    set((s) => ({ data: { ...s.data, [key]: value } })),
  reset: () => set(() => ({ data: initialData })),
}))