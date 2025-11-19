import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../AuthContext'
import api from '../api'
import { FileText, Plus, LogOut, FileSpreadsheet, Loader2 } from 'lucide-react'
import { Button } from '../components/ui/Button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/Card'
import { toast } from 'sonner'

export default function Dashboard() {
    const [projects, setProjects] = useState([])
    const [loading, setLoading] = useState(true)
    const { user, signOut } = useAuth()
    const navigate = useNavigate()

    useEffect(() => {
        loadProjects()
    }, [])

    const loadProjects = async () => {
        try {
            const response = await api.get('/projects/')
            setProjects(response.data)
        } catch (error) {
            console.error('Failed to load projects:', error)
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

    return (
        <div className="min-h-screen bg-background text-foreground">
            {/* Header */}
            <header className="border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                            <div className="bg-primary/10 p-2 rounded-lg">
                                <FileText className="w-6 h-6 text-primary" />
                            </div>
                            <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-purple-400 bg-clip-text text-transparent">
                                NexWrit
                            </h1>
                        </div>
                        <div className="flex items-center space-x-4">
                            <span className="text-sm text-muted-foreground hidden sm:inline-block">{user?.email}</span>
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={handleSignOut}
                                className="text-muted-foreground hover:text-foreground"
                            >
                                <LogOut className="w-4 h-4 mr-2" />
                                Sign Out
                            </Button>
                        </div>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 animate-fade-in">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 gap-4">
                    <div>
                        <h2 className="text-3xl font-bold tracking-tight">My Projects</h2>
                        <p className="text-muted-foreground mt-1">Manage your AI-powered documents</p>
                    </div>
                </div>

                {loading ? (
                    <div className="flex items-center justify-center py-20">
                        <Loader2 className="w-8 h-8 text-primary animate-spin" />
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {/* New Project Card */}
                        <button
                            onClick={() => navigate('/config')}
                            className="group relative flex flex-col items-center justify-center h-[200px] rounded-xl border-2 border-dashed border-muted-foreground/25 hover:border-primary/50 hover:bg-primary/5 transition-all duration-300"
                        >
                            <div className="p-4 rounded-full bg-primary/10 group-hover:bg-primary/20 transition-colors mb-4">
                                <Plus className="w-8 h-8 text-primary" />
                            </div>
                            <h3 className="text-lg font-semibold group-hover:text-primary transition-colors">Create New Project</h3>
                            <p className="text-sm text-muted-foreground mt-1">Start from scratch or AI template</p>
                        </button>

                        {/* Project Cards */}
                        {projects.map((project) => (
                            <Card
                                key={project.id}
                                onClick={() => navigate(`/editor/${project.id}`)}
                                className="h-[200px] cursor-pointer hover:border-primary/50 hover:shadow-lg group relative overflow-hidden"
                            >
                                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                                <CardHeader>
                                    <div className="flex items-start justify-between">
                                        <div className={`p-2 rounded-lg ${project.type === 'docx' ? 'bg-blue-500/10 text-blue-500' : 'bg-orange-500/10 text-orange-500'
                                            }`}>
                                            {project.type === 'docx' ? (
                                                <FileText className="w-5 h-5" />
                                            ) : (
                                                <FileSpreadsheet className="w-5 h-5" />
                                            )}
                                        </div>
                                        <span className="text-xs font-medium px-2 py-1 rounded-full bg-secondary text-secondary-foreground">
                                            {project.status || 'Draft'}
                                        </span>
                                    </div>
                                    <CardTitle className="mt-4 line-clamp-1 group-hover:text-primary transition-colors">
                                        {project.title}
                                    </CardTitle>
                                    <CardDescription>
                                        Last updated {new Date(project.updated_at || project.created_at).toLocaleDateString()}
                                    </CardDescription>
                                </CardHeader>
                            </Card>
                        ))}
                    </div>
                )}
            </main>
        </div>
    )
}
