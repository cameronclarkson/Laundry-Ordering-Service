import { ShirtIcon as Tshirt, Package2, Gift, HelpCircle, Settings, User } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { useRouter } from "next/navigation"

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

  return (
    <>
      {/* Desktop sidebar */}
      <div className="hidden lg:flex h-screen w-[200px] flex-col fixed left-0 top-0 border-r pt-8 p-4 bg-background">
        {/* Main Navigation */}
        <nav className="flex-1">
          <div className="space-y-2">
            {menuItems.map((item) => {
              const Icon = item.icon
              return (
                <Button
                  key={item.value}
                  variant={activeView === item.value ? "secondary" : "ghost"}
                  className={cn("w-full justify-start", activeView === item.value && "bg-primary/10")}
                  onClick={() => setActiveView(item.value)}
                >
                  <Icon className="mr-2 h-4 w-4" />
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
          <Button
            variant="ghost"
            className="w-full justify-start text-gray-600 hover:text-gray-900"
            onClick={() => router.push('/admin')}
          >
            <Settings className="mr-2 h-4 w-4" />
            Admin Dashboard
          </Button>
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
          <Button
            variant="ghost"
            className="flex-1 flex-col py-2 h-16"
            onClick={() => router.push('/admin')}
          >
            <Settings className="h-5 w-5 mb-1" />
            <span className="text-xs">Admin</span>
          </Button>
        </nav>
      </div>
    </>
  )
}

