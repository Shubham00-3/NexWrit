import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../AuthContext'
import api from '../api'
import { FileText, Plus, LogOut, FileSpreadsheet, Loader2, Search, Calendar, MoreVertical, Trash2 } from 'lucide-react'
import { Button } from '../components/ui/Button'
import { Card, CardHeader, CardContent } from '../components/ui/Card'
import { Input } from '../components/ui/Input'
import { toast } from 'sonner'
import { Logo } from '../components/Logo'
import { ThemeToggle } from '../components/ThemeToggle'

export default function Dashboard() {
    const [projects, setProjects] = useState([])
    const [loading, setLoading] = useState(true)
    const [searchQuery, setSearchQuery] = useState('')
    const [activeMenu, setActiveMenu] = useState(null)
    const { user, signOut } = useAuth()
    const navigate = useNavigate()

    useEffect(() => { loadProjects() }, [])

    useEffect(() => {
        const handleClickOutside = () => setActiveMenu(null)
        document.addEventListener('click', handleClickOutside)
        return () => document.removeEventListener('click', handleClickOutside)
    }, [])

    const loadProjects = async () => {
        try {
            const response = await api.get('/projects')
            setProjects(response.data)
        } catch (error) {
            toast.error('Failed to load projects')
        } finally {
            setLoading(false)
        }
    }

    const handleSignOut = async () => {
        try {
            await signOut()
            navigate('/login')
            toast.success('Signed out successfully')
        } catch (error) {
            toast.error('Failed to sign out')
        }
    }

    const handleDeleteProject = async (e, projectId) => {
        e.stopPropagation()
        if (!window.confirm('Are you sure you want to delete this project?')) {
            setActiveMenu(null)
            return
        }

        try {
            await api.delete(`/projects/${projectId}`)
            setProjects(projects.filter(p => p.id !== projectId))
            toast.success('Project deleted')
        } catch (error) {
            toast.error('Failed to delete project')
        } finally {
            setActiveMenu(null)
        }
    }

    const filteredProjects = projects.filter(p => p.title.toLowerCase().includes(searchQuery.toLowerCase()))

    return (
        <div className="min-h-screen bg-background relative selection:bg-primary/20">
            <div className="fixed inset-0 z-0 pointer-events-none">
                <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(120,119,198,0.15),rgba(255,255,255,0))]"></div>
                <div className="absolute bottom-0 left-0 right-0 top-0 bg-[linear-gradient(to_right,#4f4f4f2e_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f2e_1px,transparent_1px)] bg-[size:14px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]"></div>
            </div>

            <header className="sticky top-0 z-50 w-full border-b border-border bg-background/70 backdrop-blur-xl">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex h-16 items-center justify-between">
                        <div onClick={() => navigate('/dashboard')} className="cursor-pointer transition-opacity hover:opacity-80">
                            <Logo />
                        </div>
                        <div className="flex items-center gap-4">
                            <ThemeToggle />
                            <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-full bg-secondary border border-border">
                                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                                <span className="text-xs font-medium text-muted-foreground">{user?.email}</span>
                            </div>
                            <Button variant="ghost" size="sm" onClick={handleSignOut} className="text-muted-foreground hover:text-foreground hover:bg-secondary">
                                <LogOut className="w-4 h-4 mr-2" /> Sign Out
                            </Button>
                        </div>
                    </div>
                </div>
            </header>

            <main className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10 animate-fade-in">
                    <div>
                        <h1 className="text-3xl font-bold text-foreground tracking-tight mb-2">Dashboard</h1>
                        <p className="text-muted-foreground">Manage and create your AI-powered documents.</p>
                    </div>
                    <div className="flex items-center gap-3">
                        <div className="relative hidden sm:block">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                            <Input placeholder="Search projects..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="pl-9 w-64 bg-background border-border" />
                        </div>
                        <Button onClick={() => navigate('/config')} className="shadow-lg shadow-primary/20"><Plus className="w-4 h-4 mr-2" /> New Project</Button>
                    </div>
                </div>

                {loading ? (
                    <div className="flex flex-col items-center justify-center py-20 gap-4"><Loader2 className="w-10 h-10 text-primary animate-spin" /><p className="text-muted-foreground animate-pulse">Loading workspace...</p></div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        <button onClick={() => navigate('/config')} className="group relative h-[220px] flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-border bg-card/50 hover:bg-card hover:border-primary/50 transition-all duration-300">
                            <div className="p-4 rounded-full bg-secondary group-hover:bg-primary/10 group-hover:scale-110 transition-all duration-300 mb-4 ring-1 ring-border group-hover:ring-primary/20"><Plus className="w-6 h-6 text-muted-foreground group-hover:text-primary" /></div>
                            <h3 className="font-semibold text-muted-foreground group-hover:text-foreground">Create Project</h3>
                        </button>

                        {filteredProjects.map((project) => (
                            <Card key={project.id} onClick={() => navigate(`/editor/${project.id}`)} className="group relative h-[220px] flex flex-col cursor-pointer border-border bg-card/40 backdrop-blur-sm hover:bg-card/60 hover:border-primary/30 hover:shadow-2xl hover:shadow-primary/5 transition-all duration-300 overflow-hidden">
                                <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                                <CardHeader className="relative p-5 pb-0">
                                    <div className="flex items-start justify-between mb-4">
                                        <div className={`p-2.5 rounded-xl ring-1 inset-0 ${project.type === 'docx' ? 'bg-blue-500/10 text-blue-400 ring-blue-500/20' : 'bg-orange-500/10 text-orange-400 ring-orange-500/20'}`}>
                                            {project.type === 'docx' ? <FileText className="w-5 h-5" /> : <FileSpreadsheet className="w-5 h-5" />}
                                        </div>
                                        <span className={`px-2 py-1 rounded-md text-[10px] font-semibold uppercase tracking-wider border ${project.status === 'completed' ? 'bg-green-500/10 text-green-400 border-green-500/20' : 'bg-secondary text-muted-foreground border-border'}`}>{project.status || 'Draft'}</span>
                                    </div>
                                </CardHeader>
                                <CardContent className="relative p-5 flex-1 flex flex-col justify-end">
                                    <h3 className="font-bold text-lg text-foreground group-hover:text-primary leading-tight mb-3 line-clamp-2">{project.title}</h3>
                                    <div className="flex items-center justify-between pt-4 border-t border-border">
                                        <div className="flex items-center gap-1.5 text-xs text-muted-foreground group-hover:text-foreground"><Calendar className="w-3.5 h-3.5" /><span>{new Date(project.created_at).toLocaleDateString()}</span></div>
                                        <div className="relative">
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="h-8 w-8 hover:bg-secondary rounded-full"
                                                onClick={(e) => {
                                                    e.stopPropagation()
                                                    setActiveMenu(activeMenu === project.id ? null : project.id)
                                                }}
                                            >
                                                <MoreVertical className="w-4 h-4" />
                                            </Button>

                                            {activeMenu === project.id && (
                                                <div className="absolute right-0 bottom-full mb-2 w-32 rounded-lg border border-border bg-popover p-1 shadow-lg z-50">
                                                    <button
                                                        onClick={(e) => handleDeleteProject(e, project.id)}
                                                        className="flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-sm text-destructive hover:bg-destructive/10 hover:text-destructive transition-colors"
                                                    >
                                                        <Trash2 className="w-4 h-4" />
                                                        Delete
                                                    </button>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                )}
            </main>
        </div>
    )
}