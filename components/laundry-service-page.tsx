"use client"

import React from "react"
import { MultiStepLaundryOrderForm } from "./multi-step-laundry-order-form"
import { MyAccount } from "./my-account"
import { LoginForm } from "./login-form"
import { useAuth } from "@/lib/auth-context"
import { SideNav } from "./side-nav"
import { Orders } from "./orders"
import { ReferralScreen } from "./referral-screen"
import { SupportScreen } from "./support-screen"

export function LaundryServicePage() {
  const [activeView, setActiveView] = React.useState("home")
  const { user } = useAuth()

  if (!user) {
    return <LoginForm />
  }

  const renderContent = () => {
    switch (activeView) {
      case "home":
        return <MultiStepLaundryOrderForm />
      case "orders":
        return <Orders onBack={() => setActiveView("home")} />
      case "referrals":
        return <ReferralScreen />
      case "support":
        return <SupportScreen onBack={() => setActiveView("home")} />
      case "account":
        return <MyAccount onBack={() => setActiveView("home")} />
      default:
        return <MultiStepLaundryOrderForm />
    }
  }

  return (
    <div className="flex min-h-screen bg-background">
      <SideNav activeView={activeView} setActiveView={setActiveView} />
      
      <main className="flex-1 p-8 pt-4 lg:pl-[200px]">
        <div className="max-w-2xl mx-auto">
          {renderContent()}
        </div>
      </main>
    </div>
  )
}

