"use client"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { MultiStepLaundryOrderForm } from "./multi-step-laundry-order-form"
import { Orders } from "./orders"
import { ShirtIcon as Tshirt, HelpCircle, ArrowRight } from "lucide-react"
import { useState } from "react"
import { SideNav } from "./side-nav"
import { ReferralScreen } from "./referral-screen"
import { SupportScreen } from "./support-screen"

export function LaundryServiceHome() {
  const [activeView, setActiveView] = useState("home")

  const renderContent = () => {
    switch (activeView) {
      case "orders":
        return <Orders onBack={() => setActiveView("home")} />
      case "referrals":
        return <ReferralScreen />
      case "new-order":
        return <MultiStepLaundryOrderForm onBack={() => setActiveView("home")} />
      case "support":
        return <SupportScreen onBack={() => setActiveView("home")} />
      default:
        return <MultiStepLaundryOrderForm />
    }
  }

  return (
    <div className="flex min-h-screen bg-background">
      <SideNav activeView={activeView} setActiveView={setActiveView} />
      <main className="flex-1 p-8 pt-4 lg:pl-[200px]">
        {renderContent()}
      </main>
    </div>
  )
}

