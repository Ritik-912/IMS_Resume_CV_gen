import React, { useRef, useState, ChangeEvent } from "react"
import { useFormStore, FormData } from "@/formStore"
import { exportToJson, importFromJson } from "@/jsonutils"
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogDescription, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

export default function ResumeForm() {
  const { data, setField, reset } = useFormStore()
  const [showPreview, setShowPreview] = useState(false)
  const [previews, setPreviews] = useState<string[]>([])
  const [pdfFiles, setPdfFiles] = useState<{ filename: string, base64: string }[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const jsonInputRef = useRef<HTMLInputElement>(null);
  const [isLoading, setIsLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  const handleInput = <K extends keyof FormData>(
    key: K,
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const value = e.target.value
    setField(key, value as FormData[K])
  }

  const handleArrayChange = (
    key: keyof FormData,
    index: number,
    field: string,
    value: any
  ) => {
    const arr = [...(data[key] as any[])]
    arr[index] = { ...arr[index], [field]: value }
    setField(key, arr as any)
  }

  const addItem = (key: keyof FormData, item: any) => {
    setField(key, ([...data[key] as any[], item] as any))
  }

  const removeItem = (key: keyof FormData, index: number) => {
    const arr = [...(data[key] as any[])]
    arr.splice(index, 1)
    setField(key, arr as any)
  }

  const handleReset = () => {
    reset(); // Reset Zustand state
    setPreviews([]);
    setShowPreview(false);
    if (fileInputRef.current) {
      fileInputRef.current.value = ""; // Clear native file input’s name
    }
    if (jsonInputRef.current) {
      jsonInputRef.current.value = ""; // ✅ Clear JSON input too!
    }
    setErrorMessage(null);
  };

  const handleImport = async (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      try {
        const imported = await importFromJson(e.target.files[0])
        for (const key in imported) {
          setField(key as keyof FormData, (imported as any)[key])
        }
        setErrorMessage(null);
      } catch (err) {
        console.error(err)
        setErrorMessage("Failed to import JSON file. Please ensure it's a valid format.");
      }
    }
  }

  const handleExport = async () => {
    try {
      await exportToJson(data);
      setErrorMessage(null);
    } catch (err) {
      console.error(err);
      setErrorMessage("Failed to export JSON data.");
    }
  }

  const generateResumes = async () => {
    setIsLoading(true);
    setErrorMessage(null);
    try {
      const res = await fetch('/api/generate-resume', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })

      if (!res.ok) {
        // Handle HTTP errors
        const errorData = await res.json();
        throw new Error(errorData.message || 'Failed to generate resume. Please try again.');
      }

      const result = await res.json();
      setPreviews(result.resumes.map((r: any) => r.preview));
      setPdfFiles(result.resumes.map((r: any) => ({ filename: r.filename, base64: r.base64 })));
      setShowPreview(true);
    } catch (error: any) {
      console.error("Error generating resumes:", error);
      setErrorMessage(error.message || "An unexpected error occurred while generating resumes.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="p-6 space-y-6">
      <Card className="p-4">
        <CardHeader>
          <CardTitle>Fill data well and create your resume in one click!</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Basic Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label>Photo</Label>
              <Input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files?.[0] || null;
                  if (file) {
                    const reader = new FileReader();
                    reader.onload = () => {
                      useFormStore.getState().setField("photo", reader.result as string);
                    };
                    reader.readAsDataURL(file);
                  }
                }}
              />
              {data.photo && (
                <img
                  src={data.photo}
                  alt="Uploaded Preview"
                  style={{ width: 150, height: 150, objectFit: "cover", borderRadius: 8 }}
                />
              )}
            </div>
            <div>
              <Label>Name</Label>
              <Input value={data.name} onChange={e => handleInput('name', e)} />
            </div>
            <div>
              <Label>Phone</Label>
              <Input value={data.phone} onChange={e => handleInput('phone', e)} />
            </div>
            <div>
              <Label>Email</Label>
              <Input value={data.email} onChange={e => handleInput('email', e)} />
            </div>
            <div>
              <Label>LinkedIn</Label>
              <Input value={data.linkedin} onChange={e => handleInput('linkedin', e)} />
            </div>
            <div>
              <Label>Date of Birth</Label>
              <Input type="date" value={data.dob} onChange={e => handleInput('dob', e)} />
            </div>
          </div>

          {/* Objective */}
          <div>
            <Label>Objective</Label>
            <Textarea value={data.objective} onChange={e => handleInput('objective', e)} />
          </div>

          {/* Academics */}
          <div>
            <Label>Academic Record</Label>
            {data.academics.map((a, i) => (
              <Card key={i} className="mb-2">
                <CardContent className="space-y-2">
                  <Input
                    placeholder="Particulars (Course Name)"
                    value={a.course}
                    onChange={e => handleArrayChange('academics', i, 'course', e.target.value)}
                  />
                  <Input
                    placeholder="Institution/University"
                    value={a.institute}
                    onChange={e => handleArrayChange('academics', i, 'institute', e.target.value)}
                  />
                  <Input
                    placeholder="Year of Passing"
                    value={a.pass_year}
                    type="year"
                    onChange={e => handleArrayChange('academics', i, 'pass_year', e.target.value)}
                  />
                  <Input
                    placeholder="Performance (% or cgpa)"
                    value={a.grade}
                    onChange={e => handleArrayChange('academics', i, 'grade', e.target.value)}
                  />
                  <Button variant="destructive" size="sm" onClick={() => removeItem('academics', i)}>
                    Remove Academic Record
                  </Button>
                </CardContent>
              </Card>
            ))}
            <Button size="sm" onClick={() => addItem('academics', { course: '', institute: '', pass_year: '', grade: '' })}>
              Add Academic Record
            </Button>
          </div>

          {/* Training */}
          <div>
            <Label>Summer Training</Label>
            {data.trainings.map((t, i) => (
              <Card key={i} className="mb-2">
                <CardContent className="space-y-2">
                  <Input
                    placeholder="Organization"
                    value={t.organisation}
                    onChange={e => handleArrayChange('trainings', i, 'organisation', e.target.value)}
                  />
                  <Input
                    placeholder="Project"
                    value={t.project}
                    onChange={e => handleArrayChange('trainings', i, 'project', e.target.value)}
                  />
                  <div>
                    <Label>Learnings</Label>
                    {t.learnings.map((item, idx) => (
                      <div key={idx} className="flex items-center space-x-2">
                        <Input
                          value={item}
                          onChange={e => {
                            const arr = [...t.learnings]
                            arr[idx] = e.target.value
                            const updatedTrainings = [...data.trainings]
                            updatedTrainings[i] = { ...t, learnings: arr }
                            setField('trainings', updatedTrainings)
                          }}
                        />
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => {
                            const arr = [...t.learnings]
                            arr.splice(idx, 1)
                            const updatedTrainings = [...data.trainings]
                            updatedTrainings[i] = { ...t, learnings: arr }
                            setField('trainings', updatedTrainings)
                          }}
                        >
                          Remove
                        </Button>
                      </div>
                    ))}
                    <Button
                      size="sm"
                      onClick={() => {
                        const arr = [...t.learnings, '']
                        const updatedTrainings = [...data.trainings]
                        updatedTrainings[i] = { ...t, learnings: arr }
                        setField('trainings', updatedTrainings)
                      }}
                    >
                      Add learning
                    </Button>
                  </div>
                  <Input
                    placeholder="Duration (in days)"
                    value={t.duration}
                    onChange={e => handleArrayChange('trainings', i, 'duration', e.target.value)}
                  />
                  <Button variant="destructive" size="sm" onClick={() => removeItem('trainings', i)}>
                    Remove Training
                  </Button>
                </CardContent>
              </Card>
            ))}
            <Button size="sm" onClick={() => addItem('trainings', { organisation: '', project: '', learnings: [], duration: '' })}>
              Add Training
            </Button>
          </div>

          {/* Experience */}
          <div>
            <Label>Work Experience</Label>
            {data.experience.map((exp, i) => (
              <Card key={i} className="mb-2">
                <CardContent className="space-y-2">
                  <Input
                    placeholder="Organization"
                    value={exp.organisation}
                    onChange={e => handleArrayChange('experience', i, 'organisation', e.target.value)}
                  />
                  <Input
                    placeholder="Project"
                    value={exp.project}
                    onChange={e => handleArrayChange('experience', i, 'project', e.target.value)}
                  />
                  <div>
                    <Label>Responsibilities</Label>
                    {exp.responsibilities.map((item, idx) => (
                      <div key={idx} className="flex items-center space-x-2">
                        <Input
                          value={item}
                          onChange={e => {
                            const arr = [...exp.responsibilities]
                            arr[idx] = e.target.value
                            const updatedResponsibilties = [...data.experience]
                            updatedResponsibilties[i] = { ...exp, responsibilities: arr }
                            setField('experience', updatedResponsibilties)
                          }}
                        />
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => {
                            const arr = [...exp.responsibilities]
                            arr.splice(idx, 1)
                            const updatedResponsibilities = [...data.experience]
                            updatedResponsibilities[i] = { ...exp, responsibilities: arr }
                            setField('experience', updatedResponsibilities)
                          }}
                        >
                          Remove
                        </Button>
                      </div>
                    ))}
                    <Button
                      size="sm"
                      onClick={() => {
                        const arr = [...exp.responsibilities, '']
                        const updatedResponsibilities = [...data.experience]
                        updatedResponsibilities[i] = { ...exp, responsibilities: arr }
                        setField('experience', updatedResponsibilities)
                      }}
                    >
                      Add Responsibilities
                    </Button>
                  </div>
                  <Input
                    placeholder="Designation"
                    value={exp.designation}
                    onChange={e => handleArrayChange('experience', i, 'designation', e.target.value)}
                  />
                  <Input
                    placeholder="From"
                    type="month"
                    value={exp.startDate}
                    onChange={e => handleArrayChange('experience', i, 'startDate', e.target.value)}
                  />
                  <Input
                    placeholder="To"
                    type="month"
                    value={exp.endDate}
                    onChange={e => handleArrayChange('experience', i, 'endDate', e.target.value)}
                  />
                  <Button variant="destructive" size="sm" onClick={() => removeItem('experience', i)}>
                    Remove this Experience
                  </Button>
                </CardContent>
              </Card>
            ))}
            <Button size="sm" onClick={() => addItem('experience', { organisation: '', project: '', responsibilities: [], designation: '', startDate: '', endDate: '' })}>
              Add Work Experience
            </Button>
          </div>

          {/* Projects */}
          <div>
            <Label>Projects</Label>
            {data.projects.map((p, i) => (
              <Card key={i} className="mb-2">
                <CardContent className="space-y-2">
                  <Input
                    placeholder="Title"
                    value={p.title}
                    onChange={e => handleArrayChange('projects', i, 'title', e.target.value)}
                  />
                  <Textarea
                    placeholder="Description"
                    value={p.description}
                    onChange={e => handleArrayChange('projects', i, 'description', e.target.value)}
                  />
                  <Button variant="destructive" size="sm" onClick={() => removeItem('projects', i)}>
                    Remove Project
                  </Button>
                </CardContent>
              </Card>
            ))}
            <Button size="sm" onClick={() => addItem('projects', { title: '', description: '' })}>
              Add Project
            </Button>
          </div>

          {/* Certifications */}
          <div>
            <Label>Certifications</Label>
            {data.certifications.map((c, i) => (
              <Card key={i} className="mb-2">
                <CardContent className="space-y-2">
                  <Input
                    placeholder="Title"
                    value={c.title}
                    onChange={e => handleArrayChange('certifications', i, 'title', e.target.value)}
                  />
                  <Textarea
                    placeholder="Issued by"
                    value={c.issuer}
                    onChange={e => handleArrayChange('certifications', i, 'issuer', e.target.value)}
                  />
                  <Button variant="destructive" size="sm" onClick={() => removeItem('certifications', i)}>
                    Remove this Certificate
                  </Button>
                </CardContent>
              </Card>
            ))}
            <Button size="sm" onClick={() => addItem('certifications', { title: '', issuer: '' })}>
              Add Certificate
            </Button>
          </div>

          {/*  Proficiencies */}
          <div>
            <Label>Proficiencies</Label>
            {data.proficiencies.map((item, idx) => (
              <div key={idx} className="flex items-center space-x-2">
                <Input
                  value={item}
                  onChange={e => {
                    const arr = [...data.proficiencies]
                    arr[idx] = e.target.value
                    setField('proficiencies', arr)
                  }}
                />
                <Button variant="destructive" size="sm" onClick={() => removeItem('proficiencies', idx)}>
                  Remove
                </Button>
              </div>
            ))}
            <Button size="sm" onClick={() => addItem('proficiencies', '')}>
              Add Proficiency
            </Button>
          </div>

          {/*  Proficiencies */}
          <div>
            <Label>Achievements and Co-Curricular Activities</Label>
            {data.coCurricular.map((item, idx) => (
              <div key={idx} className="flex items-center space-x-2">
                <Input
                  value={item}
                  onChange={e => {
                    const arr = [...data.coCurricular]
                    arr[idx] = e.target.value
                    setField('coCurricular', arr)
                  }}
                />
                <Button variant="destructive" size="sm" onClick={() => removeItem('coCurricular', idx)}>
                  Remove
                </Button>
              </div>
            ))}
            <Button size="sm" onClick={() => addItem('coCurricular', '')}>
              Add Participations
            </Button>
          </div>

          <div>
            <Label>Strengths</Label>
            <Input value={data.strengths} onChange={e => handleInput('strengths', e)} />
          </div>

          <div>
            <Label>Hobbies</Label>
            <Input value={data.hobbies} onChange={e => handleInput('hobbies', e)} />
          </div>

          <div>
            <Label>Languages</Label>
            <Input value={data.languages} onChange={e => handleInput('languages', e)} />
          </div>

          <div>
            <Label>Address</Label>
            <Textarea value={data.address} onChange={e => handleInput('address', e)} />
          </div>

          {/* Import / Export Buttons */}
          <div className="flex space-x-2">
            <Button onClick={handleExport}>Export JSON</Button>
            <div>
              <Label>Upload Json to automatically fill form.</Label>
              <Input ref={jsonInputRef} placeholder="Input Json file for instant filling" type="file" accept="application/json" onChange={handleImport} /></div>
            <Button variant="outline" onClick={handleReset}>Reset</Button>
          </div>

          {/* Generate Resume */}
          <Button onClick={generateResumes} disabled={isLoading}>
            {isLoading ? (
              <div className="flex items-center">
                <svg className="animate-spin h-5 w-5 mr-3 text-white" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Generating...
              </div>
            ) : (
              "Generate Resume"
            )}
          </Button>

          <Button onClick={() => setShowPreview(true)} disabled={previews.length === 0}>
            View Last Preview
          </Button>
        </CardContent>
      </Card>

      {/* Error Message Display */}
      {errorMessage && (
        <Alert variant="destructive">
          <AlertTitle>Error!</AlertTitle>
          <AlertDescription>
            {errorMessage}
            <Button variant="ghost" size="sm" onClick={() => setErrorMessage(null)}>Close</Button>
          </AlertDescription>
        </Alert>
      )}

      {/* Preview Dialog */}
      <Dialog open={showPreview} onOpenChange={setShowPreview}>
        <DialogTrigger />
        <DialogContent className="flex flex-col max-h-[90vh]">
          <DialogHeader>
            <DialogTitle>Resume Previews</DialogTitle>
            <DialogDescription>
              Here are your generated resumes. Preview them below and download the PDF.
            </DialogDescription>
          </DialogHeader>
          <div className="overflow-y-auto flex-1">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {previews.map((url, idx) => (
              <Card key={idx} className="p-2">
                <img src={url} alt={`Resume Preview ${idx + 1}`} className="w-full object-contain border rounded" />

                <Button
                  className="mt-4"
                  onClick={() => {
                    const pdf = pdfFiles[idx];
                    const binary = atob(pdf.base64);
                    const bytes = new Uint8Array(binary.length);
                    for (let i = 0; i < binary.length; i++) {
                      bytes[i] = binary.charCodeAt(i);
                    }
                    const blob = new Blob([bytes], { type: 'application/pdf' });
                    const link = document.createElement('a');
                    link.href = URL.createObjectURL(blob);
                    link.download = pdf.filename;
                    link.click();
                  }}
                >
                  Download PDF
                </Button>
              </Card>
            ))}
            </div>
          </div>
          <DialogFooter className="pt-4">
            <Button onClick={() => setShowPreview(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}