import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../AuthContext'
import api from '../api'
import { FileText, FileSpreadsheet, Wand2, ArrowRight, ArrowLeft, Plus, Trash2, Loader2 } from 'lucide-react'
import { Button } from '../components/ui/Button'
import { Card } from '../components/ui/Card'
import { Input } from '../components/ui/Input'
import { toast } from 'sonner'

export default function ConfigWizard() {
    const [step, setStep] = useState(1)
    const [docType, setDocType] = useState('')
    const [title, setTitle] = useState('')
    const [sections, setSections] = useState([])
    const [loading, setLoading] = useState(false)
    const [generating, setGenerating] = useState(false)
    const navigate = useNavigate()

    const handleNext = () => {
        if (step === 1) {
            if (!docType) {
                toast.error('Please select a document type')
                return
            }
            if (!title) {
                toast.error('Please enter a title')
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

    const moveSection = (index, direction) => {
        if (direction === 'up' && index === 0) return;
        if (direction === 'down' && index === sections.length - 1) return;

        const newSections = [...sections];
        const targetIndex = direction === 'up' ? index - 1 : index + 1;

        // Swap elements
        [newSections[index], newSections[targetIndex]] = [newSections[targetIndex], newSections[index]];

        setSections(newSections);
    }

    const generateOutline = async () => {
        setGenerating(true)
        try {
            // FIX: Changed 'doc_type' to 'type' to match backend schema
            const response = await api.post('/generate/outline', {
                topic: title,
                type: docType
            })

            // FIX: Ensure we handle the response format correctly
            const outline = response.data.sections.map(item => ({ title: item }))
            setSections(outline)
            toast.success('Outline generated successfully!')
        } catch (error) {
            console.error('Failed to generate outline:', error)
            toast.error('Failed to generate outline. Please try again.')
        } finally {
            setGenerating(false)
        }
    }

    const createProject = async () => {
        if (sections.length === 0) {
            toast.error('Please add at least one section')
            return
        }

        if (sections.some(s => !s.title.trim())) {
            toast.error('Please fill in all section titles')
            return
        }

        setLoading(true)
        try {
            const projectRes = await api.post('/projects/', {
                title,
                type: docType
            })
            const projectId = projectRes.data.id

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
        <div className="min-h-screen bg-zinc-950 relative flex items-center justify-center p-4">
            {/* Background Effects */}
            <div className="fixed inset-0 z-0">
                <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(120,119,198,0.15),rgba(255,255,255,0))]"></div>
                <div className="absolute bottom-0 left-0 right-0 top-0 bg-[linear-gradient(to_right,#4f4f4f2e_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f2e_1px,transparent_1px)] bg-[size:14px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]"></div>
            </div>

            <div className="w-full max-w-4xl relative z-10 animate-slide-up">
                {/* Steps Indicator */}
                <div className="mb-8 flex items-center justify-center">
                    <div className={`flex items-center space-x-2 px-4 py-2 rounded-full border ${step === 1 ? 'border-primary/50 bg-primary/10 text-primary' : 'border-zinc-800 bg-zinc-900 text-zinc-500'}`}>
                        <div className="w-6 h-6 rounded-full flex items-center justify-center border border-current text-xs font-bold">1</div>
                        <span className="text-sm font-medium">Basics</span>
                    </div>
                    <div className="w-12 h-px bg-zinc-800 mx-2" />
                    <div className={`flex items-center space-x-2 px-4 py-2 rounded-full border ${step === 2 ? 'border-primary/50 bg-primary/10 text-primary' : 'border-zinc-800 bg-zinc-900 text-zinc-500'}`}>
                        <div className="w-6 h-6 rounded-full flex items-center justify-center border border-current text-xs font-bold">2</div>
                        <span className="text-sm font-medium">Structure</span>
                    </div>
                </div>

                <Card className="border-zinc-800 bg-zinc-900/60 backdrop-blur-xl shadow-2xl overflow-hidden">
                    <div className="p-8 sm:p-12">
                        {step === 1 ? (
                            <div className="space-y-8 animate-fade-in">
                                <div className="text-center space-y-2">
                                    <h2 className="text-3xl font-bold tracking-tight text-white">Start New Project</h2>
                                    <p className="text-zinc-400">Choose your document type and topic</p>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <button
                                        onClick={() => setDocType('docx')}
                                        className={`relative p-6 rounded-xl border-2 transition-all duration-200 flex flex-col items-center space-y-4 group ${docType === 'docx'
                                            ? 'border-primary bg-primary/5 ring-1 ring-primary/20'
                                            : 'border-zinc-800 bg-zinc-900/50 hover:border-primary/50 hover:bg-zinc-800'
                                            }`}
                                    >
                                        <div className={`p-4 rounded-full transition-colors ${docType === 'docx' ? 'bg-blue-500/20 text-blue-400' : 'bg-zinc-800 text-zinc-400 group-hover:text-blue-400 group-hover:bg-blue-500/10'}`}>
                                            <FileText className="w-8 h-8" />
                                        </div>
                                        <div className="text-center">
                                            <h3 className="font-semibold text-lg text-white">Word Document</h3>
                                            <p className="text-sm text-zinc-500 mt-1">Professional reports & articles</p>
                                        </div>
                                    </button>

                                    <button
                                        onClick={() => setDocType('pptx')}
                                        className={`relative p-6 rounded-xl border-2 transition-all duration-200 flex flex-col items-center space-y-4 group ${docType === 'pptx'
                                            ? 'border-primary bg-primary/5 ring-1 ring-primary/20'
                                            : 'border-zinc-800 bg-zinc-900/50 hover:border-primary/50 hover:bg-zinc-800'
                                            }`}
                                    >
                                        <div className={`p-4 rounded-full transition-colors ${docType === 'pptx' ? 'bg-orange-500/20 text-orange-400' : 'bg-zinc-800 text-zinc-400 group-hover:text-orange-400 group-hover:bg-orange-500/10'}`}>
                                            <FileSpreadsheet className="w-8 h-8" />
                                        </div>
                                        <div className="text-center">
                                            <h3 className="font-semibold text-lg text-white">PowerPoint</h3>
                                            <p className="text-sm text-zinc-500 mt-1">Engaging presentations</p>
                                        </div>
                                    </button>
                                </div>

                                <div className="space-y-3">
                                    <label className="text-sm font-medium text-zinc-300 ml-1">Document Topic / Title</label>
                                    <Input
                                        placeholder="e.g., The Future of Artificial Intelligence"
                                        value={title}
                                        onChange={(e) => setTitle(e.target.value)}
                                        className="h-12 text-lg bg-zinc-950/50 border-zinc-800 focus:border-primary"
                                    />
                                </div>

                                <div className="flex justify-end pt-4">
                                    <Button onClick={handleNext} size="lg" className="w-full md:w-auto">
                                        Next Step <ArrowRight className="ml-2 w-4 h-4" />
                                    </Button>
                                </div>
                            </div>
                        ) : (
                            <div className="space-y-8 animate-fade-in">
                                <div className="text-center space-y-2">
                                    <h2 className="text-3xl font-bold tracking-tight text-white">Structure Your Document</h2>
                                    <p className="text-zinc-400">Define the sections or slides for "{title}"</p>
                                </div>

                                <div className="flex justify-center">
                                    <Button
                                        onClick={generateOutline}
                                        disabled={generating}
                                        variant="secondary"
                                        className="bg-indigo-500/10 text-indigo-400 hover:bg-indigo-500/20 border border-indigo-500/20"
                                    >
                                        {generating ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Wand2 className="w-4 h-4 mr-2" />}
                                        {generating ? 'Dreaming up outline...' : 'AI Suggest Outline'}
                                    </Button>
                                </div>

                                <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar bg-zinc-950/30 p-4 rounded-xl border border-zinc-800/50">
                                    {sections.length === 0 && (
                                        <div className="text-center py-12 text-zinc-500 italic">
                                            No sections yet. Add manually or use AI.
                                        </div>
                                    )}
                                    {sections.map((section, index) => (
                                        <div key={index} className="flex items-center gap-3 animate-fade-in group">
                                            <div className="flex flex-col -space-y-1">
                                                <button
                                                    onClick={() => moveSection(index, 'up')}
                                                    disabled={index === 0}
                                                    className="text-zinc-600 hover:text-primary disabled:opacity-30"
                                                >
                                                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 15l-6-6-6 6" /></svg>
                                                </button>
                                                <button
                                                    onClick={() => moveSection(index, 'down')}
                                                    disabled={index === sections.length - 1}
                                                    className="text-zinc-600 hover:text-primary disabled:opacity-30"
                                                >
                                                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M6 9l6 6 6-6" /></svg>
                                                </button>
                                            </div>
                                            <span className="text-xs font-mono text-zinc-500 w-6 text-right">{index + 1}.</span>
                                            <Input
                                                value={section.title}
                                                onChange={(e) => updateSection(index, e.target.value)}
                                                placeholder={`Section ${index + 1} title`}
                                                className="bg-zinc-900 border-zinc-800 focus:border-primary"
                                            />
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                onClick={() => removeSection(index)}
                                                className="text-zinc-500 hover:text-red-400 hover:bg-red-500/10"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </Button>
                                        </div>
                                    ))}
                                    <Button
                                        variant="outline"
                                        onClick={addSection}
                                        className="w-full border-dashed border-zinc-700 bg-transparent hover:border-primary hover:text-primary hover:bg-primary/5 mt-2"
                                    >
                                        <Plus className="w-4 h-4 mr-2" /> Add Section
                                    </Button>
                                </div>

                                <div className="flex justify-between pt-4 border-t border-zinc-800">
                                    <Button variant="ghost" onClick={handleBack} className="text-zinc-400 hover:text-white">
                                        <ArrowLeft className="mr-2 w-4 h-4" /> Back
                                    </Button>
                                    <Button onClick={createProject} disabled={loading || sections.length === 0} size="lg">
                                        {loading ? (
                                            <>
                                                <Loader2 className="w-4 h-4 mr-2 animate-spin" /> Creating...
                                            </>
                                        ) : 'Create Project'}
                                    </Button>
                                </div>
                            </div>
                        )}
                    </div>
                </Card>
            </div>
        </div>
    )
}