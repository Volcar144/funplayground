import { Suspense } from "react"
import Loading from "@/components/loading"

export default function LandingPage(){

  return(
    <Suspense fallback={<Loading />}>
      {/* ── Page wrapper ── */}
      <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 font-sans transition-colors duration-300">

      </div>

    </Suspense>
  )
}