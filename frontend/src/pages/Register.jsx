import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../AuthContext'
import { FileText, Mail, Lock, ArrowRight, Loader2 } from 'lucide-react'
import { Button } from '../components/ui/Button'
import { Input } from '../components/ui/Input'
import { Card, CardContent, CardFooter } from '../components/ui/Card'
import { toast } from 'sonner'

export default function Register() {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [loading, setLoading] = useState(false)
    const { signUp } = useAuth()
    const navigate = useNavigate()

    const handleSubmit = async (e) => {
        e.preventDefault()
        if (password !== confirmPassword) return toast.error('Passwords do not match')
        if (password.length < 6) return toast.error('Password must be at least 6 characters')
        setLoading(true)
        try {
            await signUp(email, password)
            toast.success('Account created! You can now sign in.')
            navigate('/dashboard')
        } catch (err) {
            toast.error(err.message || 'Failed to create account')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="min-h-screen w-full flex items-center justify-center bg-zinc-950 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(120,119,198,0.3),rgba(255,255,255,0))]"></div>
            <div className="absolute bottom-0 left-0 right-0 top-0 bg-[linear-gradient(to_right,#4f4f4f2e_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f2e_1px,transparent_1px)] bg-[size:14px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]"></div>

            <div className="w-full max-w-md px-4 z-10 animate-fade-in">
                <div className="flex flex-col items-center mb-8 space-y-2">
                    <div className="p-3 rounded-2xl bg-primary/10 ring-1 ring-primary/20 mb-2">
                        <FileText className="w-8 h-8 text-primary" />
                    </div>
                    <h1 className="text-3xl font-bold tracking-tight text-white">Create an account</h1>
                    <p className="text-zinc-400">Enter your details to get started</p>
                </div>

                <Card className="border-zinc-800 shadow-2xl">
                    <CardContent className="pt-6">
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-zinc-300">Email</label>
                                <div className="relative">
                                    <Mail className="absolute left-3 top-2.5 h-4 w-4 text-zinc-500" />
                                    <Input type="email" placeholder="name@example.com" value={email} onChange={(e) => setEmail(e.target.value)} className="pl-9" required />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-zinc-300">Password</label>
                                <div className="relative">
                                    <Lock className="absolute left-3 top-2.5 h-4 w-4 text-zinc-500" />
                                    <Input type="password" placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} className="pl-9" required />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-zinc-300">Confirm Password</label>
                                <div className="relative">
                                    <Lock className="absolute left-3 top-2.5 h-4 w-4 text-zinc-500" />
                                    <Input type="password" placeholder="••••••••" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} className="pl-9" required />
                                </div>
                            </div>
                            <Button type="submit" className="w-full" disabled={loading}>
                                {loading ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Creating...</> : <><ArrowRight className="mr-2 h-4 w-4" /> Sign Up</>}
                            </Button>
                        </form>
                    </CardContent>
                    <CardFooter className="justify-center border-t border-zinc-800/50 pt-6">
                        <p className="text-sm text-zinc-400">Already have an account? <Link to="/login" className="text-primary hover:text-primary/80 font-medium transition-colors">Sign in</Link></p>
                    </CardFooter>
                </Card>
            </div>
        </div>
    )
}