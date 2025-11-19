import { FileText, Sparkles } from 'lucide-react'

export const Logo = ({ size = "default" }) => {
    const isLarge = size === "large"

    return (
        <div className="flex items-center gap-3 select-none">
            {/* Icon Container */}
            <div className={`
                relative flex items-center justify-center rounded-xl bg-gradient-to-br from-indigo-600 via-indigo-500 to-violet-600 shadow-lg shadow-indigo-500/25 border border-white/10
                ${isLarge ? 'w-12 h-12' : 'w-10 h-10'}
            `}>
                <FileText className={`${isLarge ? 'w-6 h-6' : 'w-5 h-5'} text-white`} strokeWidth={2.5} />

                {/* Subtle AI Sparkle Badge */}
                <div className="absolute -top-1 -right-1 bg-zinc-950 rounded-full p-0.5 border border-zinc-800">
                    <Sparkles className="w-3 h-3 text-amber-300 fill-amber-300" />
                </div>
            </div>

            {/* Typography */}
            <div className="flex flex-col">
                <span className={`font-bold tracking-tight text-white leading-none ${isLarge ? 'text-2xl' : 'text-xl'}`}>
                    Nex<span className="text-indigo-400">Writ</span>
                </span>
                {isLarge && (
                    <span className="text-[10px] font-medium text-zinc-500 uppercase tracking-widest mt-0.5">
                        AI Editor
                    </span>
                )}
            </div>
        </div>
    )
}
