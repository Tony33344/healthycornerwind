import Image from 'next/image'

export default function Home() {
  return (
    <main className="min-h-screen">
      {/* Hero Section */}
      <section className="relative h-screen bg-black flex items-center justify-center">
        <div className="absolute inset-0 z-0">
          <Image
            src="/images/hero-bg.jpg"
            alt="Camp Menina Wellness Retreat"
            fill
            priority
            className="object-cover opacity-60"
          />
        </div>
        
        <div className="relative z-10 text-center text-white px-4">
          <Image
            src="/images/logo.png"
            alt="Healthy Corner Logo"
            width={160}
            height={160}
            className="mx-auto mb-8"
          />
          
          <h1 className="brand-name text-6xl md:text-8xl font-bold mb-4">
            healthy corner
          </h1>
          
          <p className="brand-tagline text-sm md:text-base text-neutral-300">
            ALPSKI ZDRAVILIŠKI KAMP
          </p>
        </div>
      </section>

      {/* About Section */}
      <section className="py-24 px-4 bg-neutral-50">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <p className="text-sm uppercase tracking-[0.3em] text-neutral-700 mb-4">
              ABOUT US
            </p>
            <div className="w-16 h-1 bg-primary mb-6"></div>
            <h2 className="text-5xl md:text-6xl font-bold mb-6">
              Welcome to Camp Menina
            </h2>
            <p className="text-xl font-light text-neutral-700">
              Experience wellness in the heart of nature. Our retreat offers yoga, ice bathing, 
              and healthy cuisine in a serene alpine setting.
            </p>
          </div>
        </div>
      </section>
    </main>
  )
}
