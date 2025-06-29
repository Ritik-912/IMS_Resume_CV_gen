// src/jsonutils.ts
import { FormData } from "@/formStore"

export async function exportToJson(data: FormData) {
  // ✅ Already JSON safe: photo is base64 or null
  const exportData = { ...data }

  const blob = new Blob([JSON.stringify(exportData, null, 2)], {
    type: "application/json",
  })

  const url = URL.createObjectURL(blob)
  const a = document.createElement("a")
  a.href = url
  a.download = "resume-data.json"
  a.click()
}

export async function importFromJson(file: File): Promise<FormData> {
  return new Promise((res, rej) => {
    const reader = new FileReader()
    reader.onload = () => {
      try {
        const parsed = JSON.parse(reader.result as string)

        // ✅ Ensure only base64 or null
        if (typeof parsed.photo !== "string" || !parsed.photo.startsWith("data:")) {
          parsed.photo = null
        }

        res(parsed)
      } catch (e) {
        rej(e)
      }
    }
    reader.onerror = rej
    reader.readAsText(file)
  })
}