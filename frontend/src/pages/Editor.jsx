import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import api from '../api'
import { ArrowLeft, Download, Wand2, RefreshCw, Check, ThumbsUp, ThumbsDown, MessageSquare, Save, Trash2 } from 'lucide-react'
import { Button } from '../components/ui/Button'
import { Input } from '../components/ui/Input'
import { Skeleton } from '../components/ui/Skeleton'
import { toast } from 'sonner'
import { ThemeToggle } from '../components/ThemeToggle'

// --- Rich Text Renderer ---
const RichTextRenderer = ({ content }) => {
    if (!content) return null

    return (
        <div className="space-y-3 font-serif text-foreground/80">
            {content.split('\n').map((line, i) => {
                const trimmed = line.trim()
                if (!trimmed) return <br key={i} />

                const processText = (text) => {
                    const parts = text.split(/(\*\*.*?\*\*)/g)
                    return parts.map((part, index) => {
                        if (part.startsWith('**') && part.endsWith('**')) {
                            return <strong key={index} className="font-bold text-foreground">{part.slice(2, -2)}</strong>
                        }
                        return part
                    })
                }

                if (trimmed.startsWith('* ') || trimmed.startsWith('- ') || trimmed.startsWith('• ')) {
                    const cleanText = trimmed.replace(/^[\*\-\•]\s/, '')
                    return (
                        <div key={i} className="flex items-start gap-3 pl-2 md:pl-4">
                            <div className="mt-2.5 h-1.5 w-1.5 shrink-0 rounded-full bg-muted-foreground" />
                            <div className="text-lg leading-relaxed">{processText(cleanText)}</div>
                        </div>
                    )
                }

                if (trimmed.startsWith('#')) {
                    const text = trimmed.replace(/^#+\s/, '');
                    return <h3 key={i} className="text-xl font-bold text-foreground mt-4 mb-2">{text}</h3>
                }

                return <p key={i} className="text-lg leading-relaxed">{processText(trimmed)}</p>
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

    // New state for comments
    const [commentInput, setCommentInput] = useState({})
    const [showCommentBox, setShowCommentBox] = useState({})

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

    const handleFeedback = async (sectionId, isPositive) => {
        try {
            // Optimistic UI update or just toast
            toast.success(isPositive ? 'Marked as helpful' : 'Marked as not helpful')
            // Fire and forget backend call
            await api.post(`/projects/sections/${sectionId}/feedback`, { is_positive: isPositive })
        } catch (error) {
            // Silent fail or console log
            console.error('Feedback failed', error)
        }
    }

    const handleDeleteComment = async (sectionId, commentId) => {
        try {
            await api.delete(`/projects/comments/${commentId}`)

            // Update UI immediately by filtering out the deleted comment
            setSections(sections.map(section => {
                if (section.id === sectionId) {
                    return {
                        ...section,
                        comments: section.comments.filter(c => c.id !== commentId)
                    }
                }
                return section
            }))

            toast.success('Note deleted')
        } catch (error) {
            toast.error('Failed to delete note')
        }
    }

    const handleSaveComment = async (sectionId) => {
        if (!commentInput[sectionId]) return
        try {
            // Get the saved comment from backend response
            const response = await api.post(`/projects/sections/${sectionId}/comments`, { text: commentInput[sectionId] })
            const newComment = response.data

            // Update local state immediately
            setSections(sections.map(section => {
                if (section.id === sectionId) {
                    return {
                        ...section,
                        comments: [...(section.comments || []), newComment]
                    }
                }
                return section
            }))

            toast.success('Note saved')
            setCommentInput(prev => ({ ...prev, [sectionId]: '' }))
            // Keep the box open so they can see what they typed
        } catch (error) {
            toast.error('Failed to save note')
        }
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
            toast.error('Failed to export document')
        }
    }

    if (loading) {
        return (
            <div className="min-h-screen bg-background flex items-center justify-center">
                <Skeleton className="h-8 w-3/4 bg-secondary" />
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-background flex flex-col">
            <header className="h-14 border-b border-border bg-background/70 backdrop-blur-xl flex items-center justify-between px-4 sticky top-0 z-50">
                <div className="flex items-center space-x-4">
                    <Button variant="ghost" size="sm" onClick={() => navigate('/dashboard')} className="text-muted-foreground hover:text-foreground">
                        <ArrowLeft className="w-4 h-4 mr-2" /> Dashboard
                    </Button>
                    <div className="h-6 w-px bg-border" />
                    <h1 className="font-semibold text-sm text-foreground truncate max-w-[200px]">{project?.title}</h1>
                    <span className="text-xs px-2 py-0.5 rounded-full bg-secondary text-muted-foreground border border-border uppercase tracking-wider font-medium">{project?.type}</span>
                </div>
                <div className="flex items-center gap-2">
                    <ThemeToggle />
                    <Button variant="outline" size="sm" onClick={handleExport} className="border-border text-muted-foreground hover:bg-secondary hover:text-foreground">
                        <Download className="w-4 h-4 mr-2" /> Export
                    </Button>
                </div>
            </header>

            <div className="flex-1 flex overflow-hidden">
                <main className="flex-1 overflow-y-auto p-8 flex justify-center bg-secondary/30 relative">
                    <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(120,119,198,0.1),rgba(255,255,255,0))]" />
                    <div className="w-full max-w-[816px] min-h-[1056px] bg-card text-card-foreground shadow-2xl shadow-black/10 dark:shadow-black/50 mb-8 animate-fade-in z-10 paper-shadow border border-border/50">
                        <div className="p-[96px]">
                            <h1 className="font-serif text-4xl font-bold mb-12 text-center leading-tight">{project?.title}</h1>
                            <div className="space-y-12">
                                {sections.map((section) => (
                                    <div key={section.id} className="group relative">
                                        <h2 className="font-serif text-2xl font-bold mb-4 text-foreground/90">{section.title}</h2>
                                        {section.content ? (
                                            <RichTextRenderer content={section.content} />
                                        ) : (
                                            <div className="p-8 border-2 border-dashed border-border rounded-lg bg-secondary/50 flex flex-col items-center justify-center text-muted-foreground space-y-2"><p className="text-sm italic">No content generated yet</p></div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </main>

                <aside className="w-80 border-l border-border bg-background/70 backdrop-blur-xl overflow-y-auto">
                    <div className="p-4 border-b border-border"><h3 className="font-semibold text-sm uppercase tracking-wider text-muted-foreground">Sections</h3></div>
                    <div className="p-4 space-y-6">
                        {sections.map((section, index) => (
                            <div key={section.id} className="space-y-3 p-4 rounded-lg border border-border bg-card/50">
                                <div className="flex items-start justify-between">
                                    <span className="text-xs font-medium text-muted-foreground bg-secondary px-2 py-1 rounded">{index + 1}</span>
                                    {section.content && <Check className="w-4 h-4 text-green-500" />}
                                </div>
                                <h4 className="font-medium text-sm text-foreground line-clamp-2" title={section.title}>{section.title}</h4>

                                {/* Action Buttons */}
                                <div className="space-y-2 pt-2">
                                    {!section.content ? (
                                        <Button size="sm" className="w-full" onClick={() => handleGenerate(section.id)} loading={generating[section.id]}><Wand2 className="w-3 h-3 mr-2" /> Generate</Button>
                                    ) : (
                                        <div className="space-y-3">
                                            {/* Refine Input */}
                                            <div className="flex gap-2">
                                                <Input placeholder="Refine..." className="h-8 text-xs bg-background border-border text-foreground" value={refineInput[section.id] || ''} onChange={(e) => setRefineInput(prev => ({ ...prev, [section.id]: e.target.value }))} />
                                                <Button size="icon" variant="secondary" className="h-8 w-8 shrink-0 bg-secondary hover:bg-secondary/80 text-muted-foreground" onClick={() => handleRefine(section.id)} loading={refining[section.id]} disabled={!refineInput[section.id]}><RefreshCw className="w-3 h-3" /></Button>
                                            </div>

                                            {/* Feedback & Notes Bar */}
                                            <div className="flex items-center justify-between pt-1">
                                                <div className="flex gap-1">
                                                    <Button size="icon" variant="ghost" className="h-7 w-7 text-muted-foreground hover:text-green-400 hover:bg-green-400/10" onClick={() => handleFeedback(section.id, true)}><ThumbsUp className="w-3.5 h-3.5" /></Button>
                                                    <Button size="icon" variant="ghost" className="h-7 w-7 text-muted-foreground hover:text-red-400 hover:bg-red-400/10" onClick={() => handleFeedback(section.id, false)}><ThumbsDown className="w-3.5 h-3.5" /></Button>
                                                </div>
                                                <Button size="icon" variant="ghost" className={`h-7 w-7 ${showCommentBox[section.id] ? 'text-primary' : 'text-muted-foreground'} hover:text-foreground`} onClick={() => setShowCommentBox(prev => ({ ...prev, [section.id]: !prev[section.id] }))}><MessageSquare className="w-3.5 h-3.5" /></Button>
                                            </div>

                                            {/* --- NEW: Comments List --- */}
                                            {section.comments && section.comments.length > 0 && (
                                                <div className="space-y-2 mb-3 mt-2 px-1">
                                                    {section.comments.map((comment) => (
                                                        <div key={comment.id} className="group flex justify-between items-start gap-2 bg-secondary/50 p-2 rounded border border-border text-xs text-muted-foreground">
                                                            <p className="break-words flex-1">{comment.text}</p>
                                                            <button
                                                                onClick={() => handleDeleteComment(section.id, comment.id)}
                                                                className="opacity-0 group-hover:opacity-100 transition-opacity text-muted-foreground hover:text-red-400"
                                                                title="Delete note"
                                                            >
                                                                <Trash2 className="w-3 h-3" />
                                                            </button>
                                                        </div>
                                                    ))}
                                                </div>
                                            )}

                                            {/* Note Input */}
                                            {showCommentBox[section.id] && (
                                                <div className="flex gap-2 animate-fade-in">
                                                    <Input placeholder="Add a note..." className="h-8 text-xs bg-background border-border text-foreground" value={commentInput[section.id] || ''} onChange={(e) => setCommentInput(prev => ({ ...prev, [section.id]: e.target.value }))} />
                                                    <Button size="icon" variant="ghost" className="h-8 w-8 text-muted-foreground hover:text-primary" onClick={() => handleSaveComment(section.id)}><Save className="w-3.5 h-3.5" /></Button>
                                                </div>
                                            )}

                                            <Button variant="ghost" size="sm" className="w-full text-xs h-6 text-muted-foreground hover:text-foreground" onClick={() => handleGenerate(section.id)} loading={generating[section.id]}>Regenerate</Button>
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