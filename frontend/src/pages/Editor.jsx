import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import api from '../api'
import { ArrowLeft, Save, Download, Wand2, RefreshCw, MoreVertical, Check } from 'lucide-react'
import { Button } from '../components/ui/Button'
import { Input } from '../components/ui/Input'
import { Skeleton } from '../components/ui/Skeleton'
import { toast } from 'sonner'

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
            const response = await api.post(`/generate/section/${sectionId}`)
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
                instruction: refineInput[sectionId]
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
            // Trigger download
            window.open(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/export?projectId=${projectId}`, '_blank')
            // Note: The above is a placeholder if using Supabase Functions. 
            // Since we have a backend endpoint:
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
            <div className="min-h-screen bg-zinc-100 dark:bg-zinc-950 flex items-center justify-center">
                <div className="space-y-4 w-full max-w-md px-4">
                    <Skeleton className="h-8 w-3/4 mx-auto" />
                    <Skeleton className="h-4 w-1/2 mx-auto" />
                    <div className="space-y-2 pt-8">
                        <Skeleton className="h-4 w-full" />
                        <Skeleton className="h-4 w-full" />
                        <Skeleton className="h-4 w-2/3" />
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-zinc-100 dark:bg-zinc-950 flex flex-col">
            {/* Top Bar */}
            <header className="h-14 border-b border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 flex items-center justify-between px-4 sticky top-0 z-50">
                <div className="flex items-center space-x-4">
                    <Button variant="ghost" size="sm" onClick={() => navigate('/dashboard')}>
                        <ArrowLeft className="w-4 h-4 mr-2" /> Dashboard
                    </Button>
                    <div className="h-6 w-px bg-zinc-200 dark:bg-zinc-800" />
                    <h1 className="font-semibold text-sm truncate max-w-[200px] sm:max-w-md">
                        {project?.title}
                    </h1>
                    <span className="text-xs px-2 py-0.5 rounded-full bg-zinc-100 dark:bg-zinc-800 text-zinc-500 uppercase tracking-wider font-medium">
                        {project?.type}
                    </span>
                </div>
                <div className="flex items-center space-x-2">
                    <Button variant="outline" size="sm" onClick={handleExport}>
                        <Download className="w-4 h-4 mr-2" /> Export
                    </Button>
                </div>
            </header>

            <div className="flex-1 flex overflow-hidden">
                {/* Main Editor Area (Paper UI) */}
                <main className="flex-1 overflow-y-auto p-8 flex justify-center bg-zinc-100 dark:bg-zinc-950/50">
                    <div className="w-full max-w-[816px] min-h-[1056px] bg-white text-zinc-900 shadow-2xl paper-shadow mb-8 animate-fade-in">
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

                                        {section.content ? (
                                            <div className="font-serif text-lg leading-relaxed text-zinc-700 whitespace-pre-wrap">
                                                {section.content}
                                            </div>
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
                <aside className="w-80 border-l border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 overflow-y-auto">
                    <div className="p-4 border-b border-zinc-200 dark:border-zinc-800">
                        <h3 className="font-semibold text-sm uppercase tracking-wider text-muted-foreground">
                            Document Sections
                        </h3>
                    </div>

                    <div className="p-4 space-y-6">
                        {sections.map((section, index) => (
                            <div key={section.id} className="space-y-3 p-4 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/50">
                                <div className="flex items-start justify-between">
                                    <span className="text-xs font-medium text-muted-foreground bg-zinc-200 dark:bg-zinc-800 px-2 py-1 rounded">
                                        {index + 1}
                                    </span>
                                    {section.content && <Check className="w-4 h-4 text-green-500" />}
                                </div>

                                <h4 className="font-medium text-sm line-clamp-2" title={section.title}>
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
                                                    className="h-8 text-xs"
                                                    value={refineInput[section.id] || ''}
                                                    onChange={(e) => setRefineInput(prev => ({ ...prev, [section.id]: e.target.value }))}
                                                />
                                                <Button
                                                    size="icon"
                                                    variant="secondary"
                                                    className="h-8 w-8 shrink-0"
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
                                                className="w-full text-xs h-6 text-muted-foreground"
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
