import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../AuthContext'
import api from '../api'
import { FileText, Plus, LogOut, FileSpreadsheet, Loader2, Search, Calendar, MoreVertical } from 'lucide-react'
import { Button } from '../components/ui/Button'
import { Card, CardHeader, CardContent } from '../components/ui/Card'
import { Input } from '../components/ui/Input'
import { toast } from 'sonner'

export default function Dashboard() {
    const [projects, setProjects] = useState([])
    const [loading, setLoading] = useState(true)
    const [searchQuery, setSearchQuery] = useState('')
    const { user, signOut } = useAuth()
    const navigate = useNavigate()

    useEffect(() => { loadProjects() }, [])

    const loadProjects = async () => {
        try {
            const response = await api.get('/projects/')
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

    const filteredProjects = projects.filter(p => p.title.toLowerCase().includes(searchQuery.toLowerCase()))

    return (
        <div className="min-h-screen bg-zinc-950 relative selection:bg-primary/20">
            <div className="fixed inset-0 z-0 pointer-events-none">
                <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(120,119,198,0.15),rgba(255,255,255,0))]"></div>
                <div className="absolute bottom-0 left-0 right-0 top-0 bg-[linear-gradient(to_right,#4f4f4f2e_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f2e_1px,transparent_1px)] bg-[size:14px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]"></div>
            </div>

            <header className="sticky top-0 z-50 w-full border-b border-zinc-800/50 bg-zinc-950/70 backdrop-blur-xl">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex h-16 items-center justify-between">
                        <div className="flex items-center gap-2">
                            <div className="p-2 rounded-xl bg-primary/10 ring-1 ring-primary/20">
                                <FileText className="w-5 h-5 text-primary" />
                            </div>
                            <span className="text-lg font-bold text-white tracking-tight">NexWrit</span>
                        </div>
                        <div className="flex items-center gap-4">
                            <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-full bg-zinc-900/50 border border-zinc-800/50">
                                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                                <span className="text-xs font-medium text-zinc-400">{user?.email}</span>
                            </div>
                            <Button variant="ghost" size="sm" onClick={handleSignOut} className="text-zinc-400 hover:text-white hover:bg-zinc-800/50">
                                <LogOut className="w-4 h-4 mr-2" /> Sign Out
                            </Button>
                        </div>
                    </div>
                </div>
            </header>

            <main className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10 animate-fade-in">
                    <div>
                        <h1 className="text-3xl font-bold text-white tracking-tight mb-2">Dashboard</h1>
                        <p className="text-zinc-400">Manage and create your AI-powered documents.</p>
                    </div>
                    <div className="flex items-center gap-3">
                        <div className="relative hidden sm:block">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                            <Input placeholder="Search projects..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="pl-9 w-64" />
                        </div>
                        <Button onClick={() => navigate('/config')} className="shadow-lg shadow-primary/20"><Plus className="w-4 h-4 mr-2" /> New Project</Button>
                    </div>
                </div>

                {loading ? (
                    <div className="flex flex-col items-center justify-center py-20 gap-4"><Loader2 className="w-10 h-10 text-primary animate-spin" /><p className="text-zinc-500 animate-pulse">Loading workspace...</p></div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        <button onClick={() => navigate('/config')} className="group relative h-[220px] flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-zinc-800 bg-zinc-900/20 hover:bg-zinc-900/40 hover:border-primary/50 transition-all duration-300">
                            <div className="p-4 rounded-full bg-zinc-900 group-hover:bg-primary/10 group-hover:scale-110 transition-all duration-300 mb-4 ring-1 ring-zinc-800 group-hover:ring-primary/20"><Plus className="w-6 h-6 text-zinc-400 group-hover:text-primary" /></div>
                            <h3 className="font-semibold text-zinc-300 group-hover:text-white">Create Project</h3>
                        </button>

                        {filteredProjects.map((project) => (
                            <Card key={project.id} onClick={() => navigate(`/editor/${project.id}`)} className="group relative h-[220px] flex flex-col cursor-pointer border-zinc-800/50 bg-zinc-900/40 backdrop-blur-sm hover:bg-zinc-900/60 hover:border-primary/30 hover:shadow-2xl hover:shadow-primary/5 transition-all duration-300 overflow-hidden">
                                <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                                <CardHeader className="relative p-5 pb-0">
                                    <div className="flex items-start justify-between mb-4">
                                        <div className={`p-2.5 rounded-xl ring-1 inset-0 ${project.type === 'docx' ? 'bg-blue-500/10 text-blue-400 ring-blue-500/20' : 'bg-orange-500/10 text-orange-400 ring-orange-500/20'}`}>
                                            {project.type === 'docx' ? <FileText className="w-5 h-5" /> : <FileSpreadsheet className="w-5 h-5" />}
                                        </div>
                                        <span className={`px-2 py-1 rounded-md text-[10px] font-semibold uppercase tracking-wider border ${project.status === 'completed' ? 'bg-green-500/10 text-green-400 border-green-500/20' : 'bg-zinc-800 text-zinc-400 border-zinc-700'}`}>{project.status || 'Draft'}</span>
                                    </div>
                                </CardHeader>
                                <CardContent className="relative p-5 flex-1 flex flex-col justify-end">
                                    <h3 className="font-bold text-lg text-zinc-200 group-hover:text-white leading-tight mb-3 line-clamp-2">{project.title}</h3>
                                    <div className="flex items-center justify-between pt-4 border-t border-zinc-800/50">
                                        <div className="flex items-center gap-1.5 text-xs text-zinc-500 group-hover:text-zinc-400"><Calendar className="w-3.5 h-3.5" /><span>{new Date(project.created_at).toLocaleDateString()}</span></div>
                                        <div className="text-zinc-600 group-hover:text-zinc-400"><MoreVertical className="w-4 h-4" /></div>
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