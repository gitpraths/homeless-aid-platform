'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  LayoutDashboard,
  Users,
  MapPin,
  Briefcase,
  GraduationCap,
  BarChart3,
  Settings,
  HelpCircle,
  UserPlus,
  Map,
  Package,
} from 'lucide-react'

interface SidebarProps {
  isOpen: boolean
  onClose: () => void
}

export default function Sidebar({ isOpen, onClose }: SidebarProps) {
  const pathname = usePathname()

  const navigation = [
    { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    { name: 'Individuals', href: '/dashboard/profiles', icon: Users },
    { name: 'Shelters', href: '/dashboard/shelters', icon: MapPin },
    { name: 'Jobs', href: '/dashboard/jobs', icon: Briefcase },
    { name: 'Training', href: '/dashboard/training', icon: GraduationCap },
    { name: 'Analytics', href: '/dashboard/analytics', icon: BarChart3 },
  ]

  const quickActions = [
    { name: 'Add Individual', href: '/dashboard/add-individual', icon: UserPlus },
    { name: 'View Map', href: '/dashboard/map', icon: Map },
    { name: 'Resources', href: '/dashboard/resources', icon: Package },
  ]

  const bottomLinks = [
    { name: 'Settings', href: '/settings', icon: Settings },
    { name: 'Help', href: '/help', icon: HelpCircle },
  ]

  return (
    <>
      {/* Overlay for mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 z-40 h-screen w-64 bg-white border-r border-gray-200 transition-transform duration-300 lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="flex items-center gap-2 p-6 border-b">
            <div className="w-10 h-10 bg-primary-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">HA</span>
            </div>
            <div>
              <h1 className="font-bold text-lg text-gray-900">Homeless Aid</h1>
              <p className="text-xs text-gray-500">Volunteer Portal</p>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 overflow-y-auto p-4">
            <div className="space-y-1">
              {navigation.map((item) => {
                const Icon = item.icon
                const isActive = pathname === item.href
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    onClick={onClose}
                    className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                      isActive
                        ? 'bg-primary-50 text-primary-600'
                        : 'text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    {item.name}
                  </Link>
                )
              })}
            </div>

            {/* Quick Actions */}
            <div className="mt-8">
              <h3 className="px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                Quick Actions
              </h3>
              <div className="space-y-1">
                {quickActions.map((item) => {
                  const Icon = item.icon
                  return (
                    <Link
                      key={item.name}
                      href={item.href}
                      onClick={onClose}
                      className="flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                    >
                      <Icon className="w-5 h-5" />
                      {item.name}
                    </Link>
                  )
                })}
              </div>
            </div>
          </nav>

          {/* Bottom Links */}
          <div className="p-4 border-t">
            {bottomLinks.map((item) => {
              const Icon = item.icon
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={onClose}
                  className="flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  <Icon className="w-5 h-5" />
                  {item.name}
                </Link>
              )
            })}
          </div>
        </div>
      </aside>
    </>
  )
}
