import Link from 'next/link'
import { ArrowRight, Heart, MapPin, Users, TrendingUp } from 'lucide-react'

export default function Home() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary-600 to-primary-800 text-white">
        <div className="container mx-auto px-4 py-20 md:py-32">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6 animate-fadeIn">
              Homeless Aid Platform
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-primary-100 animate-fadeIn">
              AI-powered platform connecting homeless individuals with resources,
              shelters, jobs, and support services.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fadeIn">
              <Link
                href="/login"
                className="btn btn-primary bg-white text-primary-600 hover:bg-gray-100 inline-flex items-center justify-center gap-2"
              >
                Get Started
                <ArrowRight className="w-5 h-5" />
              </Link>
              <Link
                href="/about"
                className="btn bg-primary-700 hover:bg-primary-600 inline-flex items-center justify-center"
              >
                Learn More
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
            Powerful Features
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <FeatureCard
              icon={<MapPin className="w-8 h-8" />}
              title="Smart Routing"
              description="AI-powered route optimization for volunteers and individuals"
            />
            <FeatureCard
              icon={<Users className="w-8 h-8" />}
              title="Resource Matching"
              description="Intelligent matching with shelters, jobs, and training programs"
            />
            <FeatureCard
              icon={<Heart className="w-8 h-8" />}
              title="Needs Assessment"
              description="Comprehensive AI-driven needs analysis and risk prediction"
            />
            <FeatureCard
              icon={<TrendingUp className="w-8 h-8" />}
              title="Analytics"
              description="Real-time insights and performance tracking"
            />
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-8 text-center">
            <StatCard number="10,000+" label="Individuals Helped" />
            <StatCard number="500+" label="Active Volunteers" />
            <StatCard number="150+" label="Partner Organizations" />
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-primary-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Ready to Make a Difference?
          </h2>
          <p className="text-xl mb-8 text-primary-100 max-w-2xl mx-auto">
            Join our platform today and help connect homeless individuals with
            the resources they need.
          </p>
          <Link
            href="/login"
            className="btn bg-white text-primary-600 hover:bg-gray-100 inline-flex items-center gap-2"
          >
            Get Started Now
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-300 py-12">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-white font-bold text-lg mb-4">
                Homeless Aid Platform
              </h3>
              <p className="text-sm">
                Empowering communities to help those in need through technology
                and compassion.
              </p>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Platform</h4>
              <ul className="space-y-2 text-sm">
                <li><Link href="/about" className="hover:text-white">About</Link></li>
                <li><Link href="/features" className="hover:text-white">Features</Link></li>
                <li><Link href="/pricing" className="hover:text-white">Pricing</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Resources</h4>
              <ul className="space-y-2 text-sm">
                <li><Link href="/docs" className="hover:text-white">Documentation</Link></li>
                <li><Link href="/support" className="hover:text-white">Support</Link></li>
                <li><Link href="/api" className="hover:text-white">API</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Legal</h4>
              <ul className="space-y-2 text-sm">
                <li><Link href="/privacy" className="hover:text-white">Privacy</Link></li>
                <li><Link href="/terms" className="hover:text-white">Terms</Link></li>
                <li><Link href="/contact" className="hover:text-white">Contact</Link></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-sm">
            <p>&copy; 2024 Homeless Aid Platform. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}

function FeatureCard({ icon, title, description }: {
  icon: React.ReactNode
  title: string
  description: string
}) {
  return (
    <div className="card text-center hover:shadow-lg transition-shadow">
      <div className="text-primary-600 mb-4 flex justify-center">{icon}</div>
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </div>
  )
}

function StatCard({ number, label }: { number: string; label: string }) {
  return (
    <div className="card">
      <div className="text-4xl font-bold text-primary-600 mb-2">{number}</div>
      <div className="text-gray-600">{label}</div>
    </div>
  )
}
