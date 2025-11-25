import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ArrowRight, Play, Sparkles, Zap, Clock } from "lucide-react"

export function HeroSection() {
  return (
    <section className="relative overflow-hidden pb-20 pt-16 md:pb-32 md:pt-24">
      {/* Background decoration */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute left-1/4 top-0 h-[500px] w-[500px] rounded-full bg-primary/10 blur-3xl" />
        <div className="absolute right-1/4 top-1/2 h-[400px] w-[400px] rounded-full bg-accent/10 blur-3xl" />
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
          {/* Left Content */}
          <div className="text-center lg:text-left">
            <Badge variant="secondary" className="mb-6 gap-2 px-4 py-2">
              <Sparkles className="h-4 w-4 text-primary" />
              AI-Powered Design Tool
            </Badge>

            <h1 className="mb-6 text-balance text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
              Create Stunning Event Posters in{" "}
              <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">Seconds</span>
            </h1>

            <p className="mb-8 text-pretty text-lg text-muted-foreground sm:text-xl">
              Transform your event ideas into professional posters and flyers with AI. Perfect for churches, businesses,
              weddings, birthdays, and more.
            </p>

            <div className="mb-10 flex flex-col items-center gap-4 sm:flex-row lg:justify-start">
              <Button size="lg" className="w-full gap-2 sm:w-auto" asChild>
                <Link href="/generator">
                  Start Creating Free
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" className="w-full gap-2 sm:w-auto bg-transparent">
                <Play className="h-4 w-4" />
                Watch Demo
              </Button>
            </div>

            {/* Stats */}
            <div className="flex flex-wrap justify-center gap-8 lg:justify-start">
              <div className="flex items-center gap-2">
                <Zap className="h-5 w-5 text-primary" />
                <span className="text-sm text-muted-foreground">
                  <strong className="text-foreground">50K+</strong> Posters Created
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-primary" />
                <span className="text-sm text-muted-foreground">
                  <strong className="text-foreground">30 sec</strong> Avg. Generation
                </span>
              </div>
            </div>
          </div>

          {/* Right Content - Poster Showcase */}
          <div className="relative">
            <div className="relative mx-auto max-w-md lg:max-w-none">
              {/* Main Poster */}
              <div className="relative z-10 overflow-hidden rounded-2xl border border-border bg-card shadow-2xl">
                <img
                  src="/professional-church-event-poster-with-modern-desig.jpg"
                  alt="AI Generated Church Event Poster"
                  className="h-auto w-full"
                />
              </div>

              {/* Floating Cards */}
              <div className="absolute -left-4 top-8 z-20 animate-float rounded-xl border border-border bg-card p-3 shadow-lg sm:-left-8">
                <div className="flex items-center gap-2">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-green-100">
                    <Sparkles className="h-4 w-4 text-green-600" />
                  </div>
                  <div>
                    <p className="text-xs font-medium">AI Generated</p>
                    <p className="text-xs text-muted-foreground">In 28 seconds</p>
                  </div>
                </div>
              </div>

              <div
                className="absolute -right-4 bottom-16 z-20 animate-float rounded-xl border border-border bg-card p-3 shadow-lg sm:-right-8"
                style={{ animationDelay: "1s" }}
              >
                <div className="flex items-center gap-2">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10">
                    <Zap className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <p className="text-xs font-medium">HD Export</p>
                    <p className="text-xs text-muted-foreground">Print Ready</p>
                  </div>
                </div>
              </div>

              {/* Background blur effect */}
              <div className="absolute -bottom-8 -right-8 h-72 w-72 rounded-full bg-primary/20 blur-3xl" />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
