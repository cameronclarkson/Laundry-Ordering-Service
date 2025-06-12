import { ShirtIcon as Tshirt, Package2, Gift, HelpCircle, Settings, User } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/auth-context"
import Image from "next/image"

interface SideNavProps {
  activeView: string
  setActiveView: (view: string) => void
}

export function SideNav({ activeView, setActiveView }: SideNavProps) {
  const menuItems = [
    { icon: Tshirt, label: "Laundry", value: "home" },
    { icon: Package2, label: "Orders", value: "orders" },
    { icon: Gift, label: "Referrals", value: "referrals" },
    { icon: HelpCircle, label: "Support", value: "support" },
  ]

  const router = useRouter()
  const { user } = useAuth()
  const isAdmin = !!user?.user_metadata?.isAdmin

  // Debug logging
  console.log("Current user:", user)
  console.log("User metadata:", user?.user_metadata)

  return (
    <>
      {/* Desktop sidebar */}
      <div className="hidden lg:flex h-screen w-[200px] flex-col fixed left-0 top-0 border-r pt-8 p-4 bg-gradient-to-b from-blue-200 via-white to-white">
        {/* Add the logo here */}
        <div className="flex items-center justify-center h-20 mb-4">
          <Image
            src="/images/logo.svg"
            alt="Laundry Service Logo"
            width={150}
            height={84}
            priority
          />
        </div>
        {/* Main Navigation */}
        <nav className="flex-1">
          <div className="space-y-2">
            {menuItems.map((item) => {
              const Icon = item.icon
              return (
                <Button
                  key={item.value}
                  variant={activeView === item.value ? "secondary" : "ghost"}
                  className={cn(
                    "w-full justify-start text-blue-900 hover:bg-blue-200/60",
                    activeView === item.value && "bg-blue-900/10 border-l-4 border-blue-900 text-blue-900 font-bold border-blue-800"
                  )}
                  onClick={() => setActiveView(item.value)}
                >
                  <Icon className={cn("mr-2 h-4 w-4", activeView === item.value ? "text-blue-900" : "text-blue-500")} />
                  {item.label}
                </Button>
              )
            })}
          </div>
        </nav>

        {/* Account and Admin Section fixed to bottom */}
        <div className="space-y-2 pt-4 mt-auto border-t border-gray-200">
          <Button
            variant="ghost"
            className="w-full justify-start text-gray-600 hover:text-gray-900"
            onClick={() => setActiveView("account")}
          >
            <User className="mr-2 h-4 w-4" />
            Account
          </Button>
          {isAdmin && (
            <Button
              variant="ghost"
              className="w-full justify-start text-gray-600 hover:text-gray-900"
              onClick={() => router.push('/admin')}
            >
              <Settings className="mr-2 h-4 w-4" />
              Admin Dashboard
            </Button>
          )}
        </div>
      </div>

      {/* Mobile bottom navigation */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-background border-t">
        <nav className="flex justify-around">
          {menuItems.map((item) => {
            const Icon = item.icon
            return (
              <Button
                key={item.value}
                variant="ghost"
                className={cn("flex-1 flex-col py-2 h-16", activeView === item.value && "text-primary")}
                onClick={() => setActiveView(item.value)}
              >
                <Icon className="h-5 w-5 mb-1" />
                <span className="text-xs">{item.label}</span>
              </Button>
            )
          })}
          {/* Account Button for mobile */}
          <Button
            variant="ghost"
            className="flex-1 flex-col py-2 h-16"
            onClick={() => setActiveView("account")}
          >
            <User className="h-5 w-5 mb-1" />
            <span className="text-xs">Account</span>
          </Button>
          {/* Admin Button for mobile */}
          {isAdmin && (
            <Button
              variant="ghost"
              className="flex-1 flex-col py-2 h-16"
              onClick={() => router.push('/admin')}
            >
              <Settings className="h-5 w-5 mb-1" />
              <span className="text-xs">Admin</span>
            </Button>
          )}
        </nav>
      </div>
    </>
  )
}

