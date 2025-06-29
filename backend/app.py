from fastapi import FastAPI
from fastapi.responses import JSONResponse
from fastapi.responses import FileResponse
from fastapi.middleware.cors import CORSMiddleware
from fastapi.encoders import jsonable_encoder
from fastapi.staticfiles import StaticFiles
from model import FormData
from weasyprint import HTML
from jinja2 import Environment, FileSystemLoader
from pathlib import Path
import base64
from dateFormater import format_dates
import fitz  # PyMuPDF
from io import BytesIO

app = FastAPI()

# ✅ Production-grade CORS (adjust for your deployed domain)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["POST"],
    allow_headers=["Content-Type"],
)

# ✅ Jinja setup
TEMPLATE_DIR = Path(__file__).parent / "templates"
jinja_env = Environment(
    loader=FileSystemLoader(str(TEMPLATE_DIR)),
    block_start_string="((%",
    block_end_string="%))",
    variable_start_string="(((",
    variable_end_string=")))",
    comment_start_string="/**",
    comment_end_string="**/",
    autoescape=False
)

# ✅ PDF rendering helper
def render_pdf_and_preview(template_name: str, context: dict) -> tuple[bytes, bytes]:
    template = jinja_env.get_template(template_name)

    # Example: absolute font path
    font_path = Path(__file__).parent / "fonts" / "calibri.ttf"
    context["calibri_path"] = font_path.resolve().as_posix()
    logo_path = Path(__file__).parent / "templates" / "IMS.jpg"
    context["ims_logo_path"] = logo_path.resolve().as_uri()

    html_out = template.render(**context)
    html = HTML(string=html_out)
    pdf_bytes = html.write_pdf()
    # Convert first page to PNG with PyMuPDF
    pdf = fitz.open(stream=pdf_bytes, filetype="pdf")
    page = pdf[0]
    pix = page.get_pixmap(dpi=150)
    png_bytes = pix.tobytes("png")

    return pdf_bytes, png_bytes

# ✅ API route for generating PDF resumes
@app.post("/api/generate-resume")
async def generate_resume(data: FormData):
    context = format_dates(jsonable_encoder(data))

    pdf1, png1 = render_pdf_and_preview("exp_resume.html", context)
    pdf2, png2 = render_pdf_and_preview("fresh_resume.html", context)

    pdf1_b64 = base64.b64encode(pdf1).decode("utf-8")
    png1_b64 = base64.b64encode(png1).decode("utf-8")
    pdf2_b64 = base64.b64encode(pdf2).decode("utf-8")
    png2_b64 = base64.b64encode(png2).decode("utf-8")

    return JSONResponse(content={
        "resumes": [
            {"preview": f"data:image/png;base64,{png1_b64}", "base64": pdf1_b64, "filename": "experienced_resume.pdf"},
            {"preview": f"data:image/png;base64,{png2_b64}", "base64": pdf2_b64, "filename": "fresher_resume.pdf"},
        ]
    })

# ✅ Serve static Next.js export (the `out` folder)
frontend_dir = Path(__file__).parent / "out"
app.mount("/", StaticFiles(directory=frontend_dir, html=True), name="frontend")