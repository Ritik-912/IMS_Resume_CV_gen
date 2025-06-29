from typing import List, Optional
from pydantic import BaseModel, EmailStr, HttpUrl
from pydantic.types import constr


# Define constraints as type aliases
YearMonth = constr(pattern=r"^\d{4}-\d{2}$")

class Academic(BaseModel):
    course: str
    institute: str
    pass_year: str  # optionally use constr for year
    grade: str


class Training(BaseModel):
    organisation: str
    project: str
    learnings: List[str]
    duration: str


class ExperienceItem(BaseModel):
    organisation: str
    project: str
    responsibilities: List[str]
    designation: str
    startDate: YearMonth #type: ignore
    endDate: YearMonth #type: ignore


class Project(BaseModel):
    title: str
    description: str


class Certification(BaseModel):
    title: str
    issuer: str


class FormData(BaseModel):
    photo: str | None = None
    name: str
    phone: str
    email: EmailStr
    linkedin: Optional[HttpUrl] | None = None
    objective: Optional[str] | None = None
    dob: str  # could be date
    address: Optional[str] | None = None
    strengths: str
    hobbies: str
    languages: str
    proficiencies: Optional[List[str]] | None = None
    coCurricular: Optional[List[str]] | None = None
    academics: List[Academic]
    trainings: Optional[List[Training]] | None = None
    experience: Optional[List[ExperienceItem]] | None = None
    projects: Optional[List[Project]] | None = None
    certifications: Optional[List[Certification]] | None = None