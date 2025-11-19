import { PenLine } from 'lucide-react'

export const Logo = ({ size = "default" }) => {
    const isLarge = size === "large"

    // Sizes
    const containerSize = isLarge ? 'w-12 h-12' : 'w-9 h-9'
    const iconSize = isLarge ? 'w-6 h-6' : 'w-4 h-4'
    const textSize = isLarge ? 'text-3xl' : 'text-xl'
    const gap = isLarge ? 'gap-4' : 'gap-3'

    return (
        <div className={`flex items-center ${gap} select-none group`}>
            {/* 1. The Mark: Clean, Gradient, No Badges */}
            <div className={`
                relative flex items-center justify-center 
                ${containerSize}
                rounded-xl 
                bg-gradient-to-br from-indigo-500 via-violet-600 to-indigo-700
                shadow-lg shadow-indigo-500/20
                ring-1 ring-white/10
                transition-transform duration-300 group-hover:scale-105
            `}>
                {/* A subtle internal glow at the top */}
                <div className="absolute top-0 left-0 w-full h-1/2 bg-gradient-to-b from-white/20 to-transparent rounded-t-xl" />

                {/* The Icon: PenLine (Writing) implies "Authoring" better than a File */}
                <PenLine className={`${iconSize} text-white relative z-10`} strokeWidth={2.5} />
            </div>

            {/* 2. The Type: Modern, Tight, Professional */}
            <div className="flex flex-col justify-center">
                <span className={`font-bold tracking-tight text-zinc-100 leading-none ${textSize}`}>
                    Nex<span className="text-indigo-400">Writ</span>
                </span>
            </div>
        </div>
    )
}