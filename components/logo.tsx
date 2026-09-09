import Image from "next/image"

type LogoProps = {
  variant?: "dark" | "light"
}

// Logo sederhana: ikon + tulisan "Sinopsis Coffee".
export function Logo({ variant = "dark" }: LogoProps) {
  const isLight = variant === "light"

  return (
    <div className="flex items-center gap-2">
      <div
        className={`flex items-center justify-center rounded-lg p-1.5 ${
          isLight ? "bg-white/20" : "bg-amber-900"
        }`}
      >
        <Image
          src="/images/icon.png"
          alt="Sinopsis Coffee"
          width={22}
          height={22}
          className="h-[22px] w-[22px]"
        />
      </div>
      <span
        className={`text-xl font-bold tracking-tight ${
          isLight ? "text-white" : "text-stone-900"
        }`}
      >
        Sinopsis{" "}
        <span className={isLight ? "text-amber-300" : "text-amber-600"}>
          Coffee
        </span>
      </span>
    </div>
  )
}