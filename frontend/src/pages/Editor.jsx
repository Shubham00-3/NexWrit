import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import api from '../api'
import { ArrowLeft, Sparkles, Download, Loader, FileText } from 'lucide-react'

export default function Editor() {
    const { projectId } = useParams()
    const navigate = useNavigate()
    const [project, setProject] = useState(null)
    const [sections, setSections] = useState([])
    const [loading, setLoading] = useState(true)
    const [generatingId, setGeneratingId] = useState(null)
    const [refiningId, setRefiningId] = useState(null)
    const [refinementPrompts, setRefinementPrompts] = useState({})

    useEffect(() => {
        loadProject()
    }, [projectId])

    const loadProject = async () => {
        try {
            const [projectRes, sectionsRes] = await Promise.all([
                api.get(`/projects/${projectId}`),
                api.get(`/projects/${projectId}/sections`)
            ])
            setProject(projectRes.data)
            setSections(sectionsRes.data)
        } catch (error) {
            alert('Failed to load project: ' + (error.response?.data?.detail || error.message))
        } finally {
            setLoading(false)
        }
    }

    const generateContent = async (sectionId) => {
        setGeneratingId(sectionId)
        try {
            const response = await api.post(`/generate/section/${sectionId}`, {
                section_id: sectionId
            })
            // Update section in state
            setSections(sections.map(s => s.id === sectionId ? response.data : s))
        } catch (error) {
            alert('Failed to generate content: ' + (error.response?.data?.detail || error.message))
        } finally {
            setGeneratingId(null)
        }
    }

    const refineContent = async (sectionId) => {
        const prompt = refinementPrompts[sectionId]
        if (!prompt) return

        setRefiningId(sectionId)
        try {
            const response = await api.post(`/generate/refine/${sectionId}`, {
                section_id: sectionId,
                refinement_prompt: prompt
            })
            setSections(sections.map(s => s.id === sectionId ? response.data : s))
            setRefinementPrompts({ ...refinementPrompts, [sectionId]: '' })
        } catch (error) {
            alert('Failed to refine content: ' + (error.response?.data?.detail || error.message))
        } finally {
            setRefiningId(null)
        }
    }

    const exportDocument = async () => {
        try {
            const response = await api.get(`/export/${projectId}`, {
                responseType: 'blob'
            })

            const url = window.URL.createObjectURL(new Blob([response.data]))
            const link = document.createElement('a')
            link.href = url
            link.setAttribute('download', `${project.title}.${project.type}`)
            document.body.appendChild(link)
            link.click()
            link.remove()
        } catch (error) {
            alert('Failed to export document: ' + (error.response?.data?.detail || error.message))
        }
    }

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
                <Loader className="w-8 h-8 text-primary-500 animate-spin" />
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
            {/* Header */}
            <header className="border-b border-slate-700 bg-slate-900/50 backdrop-blur-sm sticky top-0 z-10">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                            <button
                                onClick={() => navigate('/dashboard')}
                                className="btn-secondary flex items-center space-x-2"
                            >
                                <ArrowLeft className="w-4 h-4" />
                                <span>Back</span>
                            </button>
                            <div>
                                <h1 className="text-xl font-bold text-white">{project.title}</h1>
                                <p className="text-sm text-slate-400">{project.type.toUpperCase()}</p>
                            </div>
                        </div>
                        <button
                            onClick={exportDocument}
                            className="btn-primary flex items-center space-x-2"
                        >
                            <Download className="w-4 h-4" />
                            <span>Export</span>
                        </button>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="space-y-6">
                    {sections.map((section, index) => (
                        <div key={section.id} className="card">
                            <div className="flex items-start justify-between mb-4">
                                <h2 className="text-xl font-semibold text-white">
                                    {index + 1}. {section.title}
                                </h2>
                                {!section.content && (
                                    <button
                                        onClick={() => generateContent(section.id)}
                                        disabled={generatingId === section.id}
                                        className="btn-primary flex items-center space-x-2 text-sm"
                                    >
                                        <Sparkles className="w-4 h-4" />
                                        <span>{generatingId === section.id ? 'Generating...' : 'Generate'}</span>
                                    </button>
                                )}
                            </div>

                            {section.content ? (
                                <div>
                                    <div className="bg-slate-700/50 rounded-lg p-4 mb-4">
                                        <p className="text-slate-200 whitespace-pre-wrap">{section.content}</p>
                                    </div>

                                    <div className="flex items-end space-x-2">
                                        <div className="flex-1">
                                            <label className="block text-sm font-medium text-slate-300 mb-2">
                                                Refine with AI
                                            </label>
                                            <input
                                                type="text"
                                                value={refinementPrompts[section.id] || ''}
                                                onChange={(e) => setRefinementPrompts({
                                                    ...refinementPrompts,
                                                    [section.id]: e.target.value
                                                })}
                                                onKeyPress={(e) => e.key === 'Enter' && refineContent(section.id)}
                                                className="input-field"
                                                placeholder="e.g., Make this more formal, Shorten to 100 words..."
                                            />
                                        </div>
                                        <button
                                            onClick={() => refineContent(section.id)}
                                            disabled={refiningId === section.id || !refinementPrompts[section.id]}
                                            className="btn-primary"
                                        >
                                            {refiningId === section.id ? 'Refining...' : 'Refine'}
                                        </button>
                                    </div>
                                </div>
                            ) : generatingId === section.id ? (
                                <div className="bg-slate-700/50 rounded-lg p-8 flex items-center justify-center">
                                    <Loader className="w-6 h-6 text-primary-500 animate-spin" />
                                </div>
                            ) : (
                                <div className="bg-slate-700/30 rounded-lg p-8 text-center">
                                    <FileText className="w-12 h-12 text-slate-600 mx-auto mb-2" />
                                    <p className="text-slate-400">No content yet. Click Generate to create content with AI.</p>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </main>
        </div>
    )
}
