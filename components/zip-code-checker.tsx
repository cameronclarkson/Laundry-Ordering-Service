"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { isAtlantaAreaZipCode } from "@/lib/utils"

export function ZipCodeChecker() {
  const [zipCode, setZipCode] = useState("")
  const [isAvailable, setIsAvailable] = useState<boolean | null>(null)
  const [isChecking, setIsChecking] = useState(false)

  const checkAvailability = () => {
    if (!zipCode || zipCode.length !== 5) return

    setIsChecking(true)

    // Check if ZIP code is in Atlanta area
    setTimeout(() => {
      const available = isAtlantaAreaZipCode(zipCode)
      setIsAvailable(available)
      setIsChecking(false)
    }, 500)
  }

  return (
    <div className="mt-4 space-y-4">
      <div className="flex max-w-sm flex-col space-y-2 sm:flex-row sm:space-x-2 sm:space-y-0">
        <Input
          type="text"
          placeholder="Enter ZIP Code"
          value={zipCode}
          onChange={(e) => {
            const value = e.target.value.replace(/\D/g, "")
            if (value.length <= 5) {
              setZipCode(value)
            }
          }}
          className="flex-1"
          maxLength={5}
        />
        <Button
          onClick={checkAvailability}
          disabled={zipCode.length !== 5 || isChecking}
          className="bg-blue-600 hover:bg-blue-700 text-white"
        >
          {isChecking ? "Checking..." : "Check Availability"}
        </Button>
      </div>

      {isAvailable !== null && (
        <div className={`text-sm ${isAvailable ? "text-green-600" : "text-red-600"}`}>
          {isAvailable
            ? "Great news! We service your area. Book your pickup now!"
            : "Sorry, we don't service your area yet. Please contact us for special arrangements."}
        </div>
      )}
    </div>
  )
}
