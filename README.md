# 📄 IMS Resume CV Generator

**IMS Resume CV Generator** is a **full-stack, production-ready app** for instantly creating professional resumes as downloadable **PDFs**, with **live PNG previews**, all **in RAM** — no disk clutter.  
Built with **FastAPI**, **Jinja2**, **WeasyPrint**, **PyMuPDF**, and a modern **Next.js + React 19** frontend using **Tailwind CSS**, **Radix UI**, and **Zustand**.

---

## 🚀 Features

✅ **FastAPI backend** — secure, typed, production-ready  
✅ **Dynamic PDF resumes** — WeasyPrint for rendering, Jinja2 for templating  
✅ **Live PNG previews** — PyMuPDF converts first page instantly  
✅ **No disk writes** — safe for ephemeral cloud hosting  
✅ **Fully dynamic form** — covers academics, training, experience, projects, skills  
✅ **JSON import/export** — instant form filling and saving  
✅ **Modern frontend** — Next.js 15, React 19, Tailwind, Shadcn/ui, Radix, Zustand  
✅ **Container-ready** — deploy anywhere with a clean **single-stage Dockerfile**

---

## 🗂️ Project Structure

```

.
├── app.py             # FastAPI backend API
├── model.py           # Pydantic models (FormData, etc.)
├── dateFormater.py    # Date formatting helper
├── templates/         # Jinja2 HTML templates
│   ├── exp\_resume.html
│   ├── fresh\_resume.html
│   └── IMS.jpg        # Logo/image used in resumes
├── fonts/             # Custom fonts (e.g. calibri.ttf)
├── out/               # Next.js static export output
├── requirements.txt   # Python dependencies
├── Dockerfile         # Single-stage production Dockerfile
└── frontend/          # Next.js frontend source

````

---

## ⚙️ How It Works

1️⃣ Fill out a multi-section form (photo, academics, training, experience, projects, more)  
2️⃣ Import or export JSON to reuse your data easily  
3️⃣ Click **Generate Resume** → frontend POSTs data to `/api/generate-resume`  
4️⃣ FastAPI renders **two resume templates** (experienced & fresher)  
5️⃣ **WeasyPrint** creates the PDFs, **PyMuPDF** extracts a PNG preview  
6️⃣ Frontend displays **side-by-side previews** in a dialog  
7️⃣ Click **Download PDF** → download instantly — all stays in memory

---

## 🧩 Tech Stack

### 🖥️ **Frontend**

- **Next.js 15.3.4** with Turbopack
- **React 19**
- **Tailwind CSS 4**
- **Zustand** for state management
- **Radix UI**, **Shadcn/ui** for accessible components
- **Lucide React** for icons
- **TypeScript**, **ESLint**, **clsx**, **cva**

### ⚡ **Backend**

- **FastAPI** — robust Python API
- **Jinja2** — flexible templating
- **WeasyPrint** — HTML/CSS → PDF
- **PyMuPDF** (`fitz`) — PDF to PNG preview
- **Pydantic** — strict request validation
- **Uvicorn** — ASGI server

---

## ✅ Local Development

### 1️⃣ Clone

```bash
git clone https://github.com/Ritik-912/IMS_Resume_CV_gen
cd IMS_Resume_CV_gen
````

### 2️⃣ Install backend

```bash
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt
```

### 3️⃣ Install frontend

```bash
cd frontend
npm install
```

### 4️⃣ Run backend

```bash
uvicorn app:app --reload --host 0.0.0.0 --port 7860
```

### 5️⃣ Run frontend

```bash
cd frontend
npm run dev
```

Open ➜ [http://localhost:3000](http://localhost:3000)

---

## 🐳 Docker Deployment

Production-ready **single-stage Dockerfile** included.

**Build & Run:**

```bash
docker build -t IMS_Resume_CV_gen .
docker run -p 7860:7860 IMS_Resume_CV_gen
```

✅ Perfect for **Hugging Face Spaces**, **Fly.io**, **Railway**, **Render**, **Heroku container**, or any modern container cloud.

> **Tip:** Before building, run:
>
> ```bash
> cd frontend
> npm run build && npm run export
> ```
>
> This generates the static export in `out/`, which the backend serves.

---

## ⚡ Deployment Tips implemented

✅ WeasyPrint works best when fonts & images use absolute paths (`file://`)
✅ All PDFs & previews stay in RAM — perfect for ephemeral cloud runs
✅ Serve your **Next.js static output** (`out/`) directly with FastAPI `StaticFiles`

---

## ✨ [Live Demo](https://huggingface.co/spaces/ritik22912/IMS_Resume_CV_gen_)

---

## 🙌 Credits

* Fonts, icons, logos — belong to their respective owners
* Created by [**Ritik Kumar**](https://www.linkedin.com/in/ritik-kumar-886a1422b/)

---

## 📜 License

**Apache License 2.0**

---

## 🤝 Contributing

Ideas? Bugs? Open an **Issue** or **Pull Request** — contributions welcome!

---

**Happy resume building! 🚀**
