import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../api'
import { FileText, FileSpreadsheet, Sparkles, Plus, Trash2, ArrowLeft } from 'lucide-react'

export default function ConfigWizard() {
    const [step, setStep] = useState(1)
    const [docType, setDocType] = useState('docx')
    const [title, setTitle] = useState('')
    const [sections, setSections] = useState([])
    const [newSection, setNewSection] = useState('')
    const [loading, setLoading] = useState(false)
    const [aiLoading, setAiLoading] = useState(false)
    const navigate = useNavigate()

    const handleAISuggest = async () => {
        if (!title) {
            alert('Please enter a document title first')
            return
        }

        setAiLoading(true)
        try {
            const response = await api.post('/generate/outline', {
                topic: title,
                type: docType,
                num_sections: 5
            })
            setSections(response.data.sections)
        } catch (error) {
            alert('Failed to generate outline: ' + (error.response?.data?.detail || error.message))
        } finally {
            setAiLoading(false)
        }
    }

    const addSection = () => {
        if (newSection.trim()) {
            setSections([...sections, newSection.trim()])
            setNewSection('')
        }
    }

    const removeSection = (index) => {
        setSections(sections.filter((_, i) => i !== index))
    }

    const createProject = async () => {
        if (sections.length === 0) {
            alert('Please add at least one section')
            return
        }

        setLoading(true)
        try {
            // Create project
            const projectResponse = await api.post('/projects/', {
                title,
                type: docType
            })

            const projectId = projectResponse.data.id

            // Create sections
            for (let i = 0; i < sections.length; i++) {
                await api.post(`/projects/${projectId}/sections`, {
                    title: sections[i],
                    order_index: i,
                    content: null
                })
            }

            navigate(`/editor/${projectId}`)
        } catch (error) {
            alert('Failed to create project: ' + (error.response?.data?.detail || error.message))
            setLoading(false)
        }
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 px-4 py-12">
            <div className="max-w-3xl mx-auto">
                <button
                    onClick={() => navigate('/dashboard')}
                    className="btn-secondary mb-6 inline-flex items-center space-x-2"
                >
                    <ArrowLeft className="w-4 h-4" />
                    <span>Back to Dashboard</span>
                </button>

                <div className="card">
                    <h1 className="text-3xl font-bold text-white mb-8">Create New Project</h1>

                    {/* Step 1: Document Type & Title */}
                    {step === 1 && (
                        <div className="space-y-6">
                            <div>
                                <label className="block text-sm font-medium text-slate-300 mb-3">
                                    Document Type
                                </label>
                                <div className="grid grid-cols-2 gap-4">
                                    <button
                                        onClick={() => setDocType('docx')}
                                        className={`p-6 rounded-xl border-2 transition-all ${docType === 'docx'
                                                ? 'border-primary-500 bg-primary-500/10'
                                                : 'border-slate-600 hover:border-slate-500'
                                            }`}
                                    >
                                        <FileText className={`w-12 h-12 mx-auto mb-3 ${docType === 'docx' ? 'text-primary-400' : 'text-slate-400'
                                            }`} />
                                        <h3 className="text-lg font-semibold text-white">Word Document</h3>
                                        <p className="text-sm text-slate-400 mt-1">.docx format</p>
                                    </button>

                                    <button
                                        onClick={() => setDocType('pptx')}
                                        className={`p-6 rounded-xl border-2 transition-all ${docType === 'pptx'
                                                ? 'border-primary-500 bg-primary-500/10'
                                                : 'border-slate-600 hover:border-slate-500'
                                            }`}
                                    >
                                        <FileSpreadsheet className={`w-12 h-12 mx-auto mb-3 ${docType === 'pptx' ? 'text-primary-400' : 'text-slate-400'
                                            }`} />
                                        <h3 className="text-lg font-semibold text-white">PowerPoint</h3>
                                        <p className="text-sm text-slate-400 mt-1">.pptx format</p>
                                    </button>
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-300 mb-2">
                                    Document Title / Topic
                                </label>
                                <input
                                    type="text"
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                    className="input-field"
                                    placeholder="e.g., Market Analysis of the EV Industry in 2025"
                                />
                            </div>

                            <button
                                onClick={() => setStep(2)}
                                disabled={!title}
                                className="btn-primary w-full"
                            >
                                Continue to Structure
                            </button>
                        </div>
                    )}

                    {/* Step 2: Document Structure */}
                    {step === 2 && (
                        <div className="space-y-6">
                            <div>
                                <div className="flex items-center justify-between mb-4">
                                    <h2 className="text-xl font-semibold text-white">
                                        {docType === 'docx' ? 'Section Titles' : 'Slide Titles'}
                                    </h2>
                                    <button
                                        onClick={handleAISuggest}
                                        disabled={aiLoading}
                                        className="btn-secondary flex items-center space-x-2"
                                    >
                                        <Sparkles className="w-4 h-4" />
                                        <span>{aiLoading ? 'Generating...' : 'AI Suggest'}</span>
                                    </button>
                                </div>

                                <div className="space-y-3">
                                    {sections.map((section, index) => (
                                        <div key={index} className="flex items-center space-x-2">
                                            <div className="flex-1 px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white">
                                                {index + 1}. {section}
                                            </div>
                                            <button
                                                onClick={() => removeSection(index)}
                                                className="p-2 hover:bg-red-500/20 rounded-lg text-red-400 transition-colors"
                                            >
                                                <Trash2 className="w-5 h-5" />
                                            </button>
                                        </div>
                                    ))}
                                </div>

                                <div className="flex items-center space-x-2 mt-4">
                                    <input
                                        type="text"
                                        value={newSection}
                                        onChange={(e) => setNewSection(e.target.value)}
                                        onKeyPress={(e) => e.key === 'Enter' && addSection()}
                                        className="input-field flex-1"
                                        placeholder={`Add ${docType === 'docx' ? 'section' : 'slide'} title...`}
                                    />
                                    <button
                                        onClick={addSection}
                                        className="btn-secondary"
                                    >
                                        <Plus className="w-5 h-5" />
                                    </button>
                                </div>
                            </div>

                            <div className="flex space-x-3">
                                <button
                                    onClick={() => setStep(1)}
                                    className="btn-secondary flex-1"
                                >
                                    Back
                                </button>
                                <button
                                    onClick={createProject}
                                    disabled={loading || sections.length === 0}
                                    className="btn-primary flex-1"
                                >
                                    {loading ? 'Creating...' : 'Create Project'}
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}
