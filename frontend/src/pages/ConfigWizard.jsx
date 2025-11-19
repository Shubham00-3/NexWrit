import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../AuthContext'
import api from '../api'
import { FileText, FileSpreadsheet, Wand2, ArrowRight, ArrowLeft, Plus, Trash2 } from 'lucide-react'
import { Button } from '../components/ui/Button'
import { Card, CardContent } from '../components/ui/Card'
import { Input } from '../components/ui/Input'
import { toast } from 'sonner'

export default function ConfigWizard() {
    const [step, setStep] = useState(1)
    const [docType, setDocType] = useState('')
    const [title, setTitle] = useState('')
    const [sections, setSections] = useState([])
    const [loading, setLoading] = useState(false)
    const { user } = useAuth()
    const navigate = useNavigate()

    const handleNext = () => {
        if (step === 1) {
            if (!docType || !title) {
                toast.error('Please select a document type and enter a title')
                return
            }
            setStep(2)
        }
    }

    const handleBack = () => {
        setStep(step - 1)
    }

    const addSection = () => {
        setSections([...sections, { title: '' }])
    }

    const updateSection = (index, value) => {
        const newSections = [...sections]
        newSections[index].title = value
        setSections(newSections)
    }

    const removeSection = (index) => {
        const newSections = sections.filter((_, i) => i !== index)
        setSections(newSections)
    }

    const generateOutline = async () => {
        setLoading(true)
        try {
            const response = await api.post('/generate/outline', {
                topic: title,
                doc_type: docType
            })

            const outline = response.data.outline.map(item => ({ title: item }))
            setSections(outline)
            toast.success('Outline generated successfully!')
        } catch (error) {
            console.error('Failed to generate outline:', error)
            toast.error('Failed to generate outline. Please try again.')
        } finally {
            setLoading(false)
        }
    }

    const createProject = async () => {
        if (sections.length === 0) {
            toast.error('Please add at least one section')
            return
        }

        // Validate empty sections
        if (sections.some(s => !s.title.trim())) {
            toast.error('Please fill in all section titles')
            return
        }

        setLoading(true)
        try {
            // 1. Create Project
            const projectRes = await api.post('/projects/', {
                title,
                type: docType
            })
            const projectId = projectRes.data.id

            // 2. Create Sections
            // We'll do this sequentially to ensure order (or Promise.all if backend handles it)
            // Using Promise.all for speed
            await Promise.all(sections.map((section, index) =>
                api.post(`/projects/${projectId}/sections`, {
                    title: section.title,
                    order_index: index
                })
            ))

            toast.success('Project created successfully!')
            navigate(`/editor/${projectId}`)
        } catch (error) {
            console.error('Failed to create project:', error)
            toast.error('Failed to create project. Please try again.')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="min-h-screen bg-background flex items-center justify-center p-4">
            <div className="w-full max-w-3xl animate-fade-in">
                {/* Progress Steps */}
                <div className="mb-8 flex items-center justify-center space-x-4">
                    <div className={`flex items-center justify-center w-10 h-10 rounded-full border-2 transition-colors ${step >= 1 ? 'border-primary bg-primary text-white' : 'border-muted text-muted-foreground'}`}>1</div>
                    <div className={`w-20 h-0.5 transition-colors ${step >= 2 ? 'bg-primary' : 'bg-muted'}`} />
                    <div className={`flex items-center justify-center w-10 h-10 rounded-full border-2 transition-colors ${step >= 2 ? 'border-primary bg-primary text-white' : 'border-muted text-muted-foreground'}`}>2</div>
                </div>

                <Card className="border-white/10 bg-zinc-900/50 backdrop-blur-xl shadow-2xl">
                    <CardContent className="p-8">
                        {step === 1 ? (
                            <div className="space-y-8 animate-slide-up">
                                <div className="text-center space-y-2">
                                    <h2 className="text-3xl font-bold tracking-tight">Start New Project</h2>
                                    <p className="text-muted-foreground">Choose your document type and topic</p>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <button
                                        onClick={() => setDocType('docx')}
                                        className={`p-6 rounded-xl border-2 transition-all duration-200 flex flex-col items-center space-y-4 hover:scale-[1.02] ${docType === 'docx'
                                                ? 'border-primary bg-primary/10 ring-2 ring-primary/20'
                                                : 'border-muted bg-zinc-900/50 hover:border-primary/50 hover:bg-zinc-900'
                                            }`}
                                    >
                                        <div className="p-4 rounded-full bg-blue-500/10 text-blue-500">
                                            <FileText className="w-8 h-8" />
                                        </div>
                                        <div className="text-center">
                                            <h3 className="font-semibold">Word Document</h3>
                                            <p className="text-sm text-muted-foreground mt-1">Professional reports & articles</p>
                                        </div>
                                    </button>

                                    <button
                                        onClick={() => setDocType('pptx')}
                                        className={`p-6 rounded-xl border-2 transition-all duration-200 flex flex-col items-center space-y-4 hover:scale-[1.02] ${docType === 'pptx'
                                                ? 'border-primary bg-primary/10 ring-2 ring-primary/20'
                                                : 'border-muted bg-zinc-900/50 hover:border-primary/50 hover:bg-zinc-900'
                                            }`}
                                    >
                                        <div className="p-4 rounded-full bg-orange-500/10 text-orange-500">
                                            <FileSpreadsheet className="w-8 h-8" />
                                        </div>
                                        <div className="text-center">
                                            <h3 className="font-semibold">PowerPoint</h3>
                                            <p className="text-sm text-muted-foreground mt-1">Engaging presentations</p>
                                        </div>
                                    </button>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Document Topic / Title</label>
                                    <Input
                                        placeholder="e.g., The Future of Artificial Intelligence"
                                        value={title}
                                        onChange={(e) => setTitle(e.target.value)}
                                        className="h-12 text-lg"
                                    />
                                </div>

                                <div className="flex justify-end pt-4">
                                    <Button onClick={handleNext} size="lg" className="w-full md:w-auto">
                                        Next Step <ArrowRight className="ml-2 w-4 h-4" />
                                    </Button>
                                </div>
                            </div>
                        ) : (
                            <div className="space-y-8 animate-slide-up">
                                <div className="text-center space-y-2">
                                    <h2 className="text-3xl font-bold tracking-tight">Structure Your Document</h2>
                                    <p className="text-muted-foreground">Define the sections or slides for "{title}"</p>
                                </div>

                                <div className="flex justify-center">
                                    <Button
                                        onClick={generateOutline}
                                        disabled={loading}
                                        variant="secondary"
                                        className="bg-indigo-500/10 text-indigo-400 hover:bg-indigo-500/20 border border-indigo-500/20"
                                    >
                                        <Wand2 className="w-4 h-4 mr-2" />
                                        {loading ? 'Generating...' : 'AI Suggest Outline'}
                                    </Button>
                                </div>

                                <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                                    {sections.map((section, index) => (
                                        <div key={index} className="flex items-center gap-2 animate-fade-in">
                                            <span className="text-sm text-muted-foreground w-6">{index + 1}.</span>
                                            <Input
                                                value={section.title}
                                                onChange={(e) => updateSection(index, e.target.value)}
                                                placeholder={`Section ${index + 1} title`}
                                            />
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                onClick={() => removeSection(index)}
                                                className="text-muted-foreground hover:text-destructive"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </Button>
                                        </div>
                                    ))}

                                    <Button
                                        variant="outline"
                                        onClick={addSection}
                                        className="w-full border-dashed border-muted-foreground/25 hover:border-primary/50 hover:text-primary"
                                    >
                                        <Plus className="w-4 h-4 mr-2" /> Add Section
                                    </Button>
                                </div>

                                <div className="flex justify-between pt-4 border-t border-border/50">
                                    <Button variant="ghost" onClick={handleBack}>
                                        <ArrowLeft className="mr-2 w-4 h-4" /> Back
                                    </Button>
                                    <Button onClick={createProject} disabled={loading || sections.length === 0} size="lg">
                                        {loading ? 'Creating...' : 'Create Project'}
                                    </Button>
                                </div>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
