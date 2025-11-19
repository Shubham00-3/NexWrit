import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import api from '../api'
import { ArrowLeft, Download, Wand2, RefreshCw, Check } from 'lucide-react'
import { Button } from '../components/ui/Button'
import { Input } from '../components/ui/Input'
import { Skeleton } from '../components/ui/Skeleton'
import { toast } from 'sonner'

// --- NEW: Custom Markdown Renderer for Professional Typography ---
const RichTextRenderer = ({ content }) => {
    if (!content) return null

    return (
        <div className="space-y-3 font-serif text-zinc-700">
            {content.split('\n').map((line, i) => {
                const trimmed = line.trim()
                if (!trimmed) return <br key={i} />

                // Helper to parse bold syntax (**text**)
                const processText = (text) => {
                    const parts = text.split(/(\*\*.*?\*\*)/g)
                    return parts.map((part, index) => {
                        if (part.startsWith('**') && part.endsWith('**')) {
                            return <strong key={index} className="font-bold text-zinc-900">{part.slice(2, -2)}</strong>
                        }
                        return part
                    })
                }

                // Style Bullet Points
                if (trimmed.startsWith('* ') || trimmed.startsWith('- ') || trimmed.startsWith('• ')) {
                    const cleanText = trimmed.replace(/^[\*\-\•]\s/, '')
                    return (
                        <div key={i} className="flex items-start gap-3 pl-2 md:pl-4">
                            <div className="mt-2.5 h-1.5 w-1.5 shrink-0 rounded-full bg-zinc-400" />
                            <div className="text-lg leading-relaxed">{processText(cleanText)}</div>
                        </div>
                    )
                }

                // Style Headers (Lines starting with #)
                if (trimmed.startsWith('#')) {
                    const text = trimmed.replace(/^#+\s/, '');
                    return <h3 key={i} className="text-xl font-bold text-zinc-900 mt-4 mb-2">{text}</h3>
                }

                // Style Standard Paragraphs
                return (
                    <p key={i} className="text-lg leading-relaxed">
                        {processText(trimmed)}
                    </p>
                )
            })}
        </div>
    )
}

export default function Editor() {
    const { projectId } = useParams()
    const navigate = useNavigate()
    const [project, setProject] = useState(null)
    const [sections, setSections] = useState([])
    const [loading, setLoading] = useState(true)
    const [generating, setGenerating] = useState({})
    const [refining, setRefining] = useState({})
    const [refineInput, setRefineInput] = useState({})

    useEffect(() => {
        loadProjectData()
    }, [projectId])

    const loadProjectData = async () => {
        try {
            const [projRes, sectRes] = await Promise.all([
                api.get(`/projects/${projectId}`),
                api.get(`/projects/${projectId}/sections`)
            ])
            setProject(projRes.data)
            setSections(sectRes.data.sort((a, b) => a.order_index - b.order_index))
        } catch (error) {
            console.error('Failed to load project:', error)
            toast.error('Failed to load project data')
        } finally {
            setLoading(false)
        }
    }

    const handleGenerate = async (sectionId) => {
        setGenerating(prev => ({ ...prev, [sectionId]: true }))
        try {
            const response = await api.post(`/generate/section/${sectionId}`, {
                section_id: sectionId
            })
            updateSectionContent(sectionId, response.data.content)
            toast.success('Content generated successfully')
        } catch (error) {
            console.error('Generation failed:', error)
            toast.error('Failed to generate content')
        } finally {
            setGenerating(prev => ({ ...prev, [sectionId]: false }))
        }
    }

    const handleRefine = async (sectionId) => {
        if (!refineInput[sectionId]) return

        setRefining(prev => ({ ...prev, [sectionId]: true }))
        try {
            const response = await api.post(`/generate/refine/${sectionId}`, {
                section_id: sectionId,
                refinement_prompt: refineInput[sectionId]
            })
            updateSectionContent(sectionId, response.data.content)
            setRefineInput(prev => ({ ...prev, [sectionId]: '' }))
            toast.success('Content refined successfully')
        } catch (error) {
            console.error('Refinement failed:', error)
            toast.error('Failed to refine content')
        } finally {
            setRefining(prev => ({ ...prev, [sectionId]: false }))
        }
    }

    const updateSectionContent = (sectionId, content) => {
        setSections(sections.map(s =>
            s.id === sectionId ? { ...s, content } : s
        ))
    }

    const handleExport = async () => {
        try {
            const response = await api.get(`/export/${projectId}`, { responseType: 'blob' })
            const url = window.URL.createObjectURL(new Blob([response.data]))
            const link = document.createElement('a')
            link.href = url
            link.setAttribute('download', `${project.title}.${project.type}`)
            document.body.appendChild(link)
            link.click()
            link.remove()
            toast.success('Export started')
        } catch (error) {
            console.error('Export failed:', error)
            toast.error('Failed to export document')
        }
    }

    if (loading) {
        return (
            <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
                <div className="space-y-4 w-full max-w-md px-4">
                    <Skeleton className="h-8 w-3/4 mx-auto bg-zinc-800" />
                    <Skeleton className="h-4 w-1/2 mx-auto bg-zinc-800" />
                    <div className="space-y-2 pt-8">
                        <Skeleton className="h-4 w-full bg-zinc-800" />
                        <Skeleton className="h-4 w-full bg-zinc-800" />
                        <Skeleton className="h-4 w-2/3 bg-zinc-800" />
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-zinc-950 flex flex-col">
            {/* Top Bar */}
            <header className="h-14 border-b border-zinc-800 bg-zinc-950/70 backdrop-blur-xl flex items-center justify-between px-4 sticky top-0 z-50">
                <div className="flex items-center space-x-4">
                    <Button variant="ghost" size="sm" onClick={() => navigate('/dashboard')} className="text-zinc-400 hover:text-white">
                        <ArrowLeft className="w-4 h-4 mr-2" /> Dashboard
                    </Button>
                    <div className="h-6 w-px bg-zinc-800" />
                    <h1 className="font-semibold text-sm text-zinc-200 truncate max-w-[200px] sm:max-w-md">
                        {project?.title}
                    </h1>
                    <span className="text-xs px-2 py-0.5 rounded-full bg-zinc-900 text-zinc-400 border border-zinc-800 uppercase tracking-wider font-medium">
                        {project?.type}
                    </span>
                </div>
                <div className="flex items-center space-x-2">
                    <Button variant="outline" size="sm" onClick={handleExport} className="border-zinc-700 text-zinc-300 hover:bg-zinc-800 hover:text-white">
                        <Download className="w-4 h-4 mr-2" /> Export
                    </Button>
                </div>
            </header>

            <div className="flex-1 flex overflow-hidden">
                {/* Main Editor Area (Paper UI) */}
                <main className="flex-1 overflow-y-auto p-8 flex justify-center bg-zinc-950 relative">
                    <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(120,119,198,0.1),rgba(255,255,255,0))]" />

                    <div className="w-full max-w-[816px] min-h-[1056px] bg-white text-zinc-900 shadow-2xl shadow-black/50 mb-8 animate-fade-in z-10 paper-shadow">
                        <div className="p-[96px]">
                            <h1 className="font-serif text-4xl font-bold mb-12 text-center leading-tight">
                                {project?.title}
                            </h1>

                            <div className="space-y-12">
                                {sections.map((section) => (
                                    <div key={section.id} className="group relative">
                                        <h2 className="font-serif text-2xl font-bold mb-4 text-zinc-800">
                                            {section.title}
                                        </h2>

                                        {/* --- USED THE NEW RENDERER HERE --- */}
                                        {section.content ? (
                                            <RichTextRenderer content={section.content} />
                                        ) : (
                                            <div className="p-8 border-2 border-dashed border-zinc-200 rounded-lg bg-zinc-50 flex flex-col items-center justify-center text-zinc-400 space-y-2">
                                                <p className="text-sm italic">No content generated yet</p>
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </main>

                {/* Right Sidebar (Controls) */}
                <aside className="w-80 border-l border-zinc-800 bg-zinc-950/70 backdrop-blur-xl overflow-y-auto">
                    <div className="p-4 border-b border-zinc-800">
                        <h3 className="font-semibold text-sm uppercase tracking-wider text-zinc-500">
                            Document Sections
                        </h3>
                    </div>

                    <div className="p-4 space-y-6">
                        {sections.map((section, index) => (
                            <div key={section.id} className="space-y-3 p-4 rounded-lg border border-zinc-800 bg-zinc-900/50">
                                <div className="flex items-start justify-between">
                                    <span className="text-xs font-medium text-zinc-500 bg-zinc-800 px-2 py-1 rounded">
                                        {index + 1}
                                    </span>
                                    {section.content && <Check className="w-4 h-4 text-green-500" />}
                                </div>

                                <h4 className="font-medium text-sm text-zinc-200 line-clamp-2" title={section.title}>
                                    {section.title}
                                </h4>

                                <div className="space-y-2 pt-2">
                                    {!section.content ? (
                                        <Button
                                            size="sm"
                                            className="w-full"
                                            onClick={() => handleGenerate(section.id)}
                                            loading={generating[section.id]}
                                        >
                                            <Wand2 className="w-3 h-3 mr-2" /> Generate Content
                                        </Button>
                                    ) : (
                                        <div className="space-y-2">
                                            <div className="flex gap-2">
                                                <Input
                                                    placeholder="Refine instruction..."
                                                    className="h-8 text-xs bg-zinc-950 border-zinc-700 text-zinc-200"
                                                    value={refineInput[section.id] || ''}
                                                    onChange={(e) => setRefineInput(prev => ({ ...prev, [section.id]: e.target.value }))}
                                                />
                                                <Button
                                                    size="icon"
                                                    variant="secondary"
                                                    className="h-8 w-8 shrink-0 bg-zinc-800 hover:bg-zinc-700 text-zinc-300"
                                                    onClick={() => handleRefine(section.id)}
                                                    loading={refining[section.id]}
                                                    disabled={!refineInput[section.id]}
                                                >
                                                    <RefreshCw className="w-3 h-3" />
                                                </Button>
                                            </div>
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                className="w-full text-xs h-6 text-zinc-500 hover:text-zinc-300"
                                                onClick={() => handleGenerate(section.id)}
                                                loading={generating[section.id]}
                                            >
                                                Regenerate Completely
                                            </Button>
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </aside>
            </div>
        </div>
    )
}