import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../AuthContext'
import api from '../api'
import { FileText, Plus, LogOut, FileSpreadsheet, Loader } from 'lucide-react'

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
        } finally {
            setLoading(false)
        }
    }

    const handleSignOut = async () => {
        await signOut()
        navigate('/login')
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
            {/* Header */}
            <header className="border-b border-slate-700 bg-slate-900/50 backdrop-blur-sm">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                            <div className="bg-primary-600 p-2 rounded-lg">
                                <FileText className="w-6 h-6 text-white" />
                            </div>
                            <h1 className="text-2xl font-bold text-white">NexWrit</h1>
                        </div>
                        <div className="flex items-center space-x-4">
                            <span className="text-slate-400">{user?.email}</span>
                            <button
                                onClick={handleSignOut}
                                className="btn-secondary flex items-center space-x-2"
                            >
                                <LogOut className="w-4 h-4" />
                                <span>Sign Out</span>
                            </button>
                        </div>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h2 className="text-3xl font-bold text-white mb-2">My Projects</h2>
                        <p className="text-slate-400">Create and manage your AI-powered documents</p>
                    </div>
                    <button
                        onClick={() => navigate('/config')}
                        className="btn-primary flex items-center space-x-2"
                    >
                        <Plus className="w-5 h-5" />
                        <span>New Project</span>
                    </button>
                </div>

                {loading ? (
                    <div className="flex items-center justify-center py-20">
                        <Loader className="w-8 h-8 text-primary-500 animate-spin" />
                    </div>
                ) : projects.length === 0 ? (
                    <div className="card text-center py-12">
                        <div className="flex justify-center mb-4">
                            <FileText className="w-16 h-16 text-slate-600" />
                        </div>
                        <h3 className="text-xl font-semibold text-white mb-2">No projects yet</h3>
                        <p className="text-slate-400 mb-6">Get started by creating your first document</p>
                        <button
                            onClick={() => navigate('/config')}
                            className="btn-primary inline-flex items-center space-x-2"
                        >
                            <Plus className="w-5 h-5" />
                            <span>Create Project</span>
                        </button>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {projects.map((project) => (
                            <div
                                key={project.id}
                                onClick={() => navigate(`/editor/${project.id}`)}
                                className="card hover:border-primary-500 transition-all cursor-pointer group"
                            >
                                <div className="flex items-start justify-between mb-4">
                                    <div className="bg-primary-600/20 p-3 rounded-lg group-hover:bg-primary-600/30 transition-colors">
                                        {project.type === 'docx' ? (
                                            <FileText className="w-6 h-6 text-primary-400" />
                                        ) : (
                                            <FileSpreadsheet className="w-6 h-6 text-primary-400" />
                                        )}
                                    </div>
                                    <span className="text-xs text-slate-500 uppercase tracking-wider">
                                        {project.type}
                                    </span>
                                </div>
                                <h3 className="text-lg font-semibold text-white mb-2 line-clamp-2">
                                    {project.title}
                                </h3>
                                <p className="text-sm text-slate-400">
                                    {new Date(project.created_at).toLocaleDateString()}
                                </p>
                            </div>
                        ))}
                    </div>
                )}
            </main>
        </div>
    )
}
