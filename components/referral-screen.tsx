"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Copy, Share2 } from "lucide-react"
import { useState, useEffect } from "react"
import { useAuth } from "@/lib/auth-context"
import { supabase } from "@/lib/supabase"

interface ReferralCode {
  id: string
  code: string
  discount_amount: number
  description: string
  times_used: number
  max_uses: number
}

export function ReferralScreen() {
  const { user } = useAuth()
  const [copiedCode, setCopiedCode] = useState<string | null>(null)
  const [referralCodes, setReferralCodes] = useState<ReferralCode[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function fetchReferralCodes() {
      if (!user) return
      
      try {
        const { data, error } = await supabase
          .from('referral_codes')
          .select('*')
          .eq('user_id', user.id)
          .order('discount_amount', { ascending: true })
        
        if (error) {
          console.error('Error fetching referral codes:', error)
          return
        }
        
        if (data && data.length > 0) {
          setReferralCodes(data)
        } else {
          console.log('No referral codes found, using fallback')
          // Fallback to generated codes if none found in database
          setReferralCodes([
            {
              id: '1',
              code: `FRIEND10-${user.id.slice(0, 8)}`,
              discount_amount: 10,
              description: "Give your friend $10 off their first order",
              times_used: 0,
              max_uses: 10
            },
            {
              id: '2',
              code: `FRIEND25-${user.id.slice(0, 8)}`,
              discount_amount: 25,
              description: "Give your friend $25 off their first order",
              times_used: 0,
              max_uses: 10
            }
          ])
        }
      } catch (error) {
        console.error('Error:', error)
      } finally {
        setIsLoading(false)
      }
    }
    
    fetchReferralCodes()
  }, [user])

  const handleCopyCode = async (code: string) => {
    try {
      await navigator.clipboard.writeText(code)
      setCopiedCode(code)
      setTimeout(() => setCopiedCode(null), 2000)
    } catch (err) {
      console.error("Failed to copy code:", err)
    }
  }

  const handleShare = async (code: ReferralCode) => {
    try {
      await navigator.share({
        title: "WashMaster Referral",
        text: `Use my referral code ${code.code} to get $${code.discount_amount} off your first order at WashMaster!`,
        url: "https://washmaster.com",
      })
    } catch (err) {
      console.error("Failed to share:", err)
    }
  }

  if (isLoading) {
    return (
      <div className="w-full max-w-2xl mx-auto p-4">
        <Card>
          <CardContent className="p-8 flex justify-center">
            <p>Loading your referral codes...</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="w-full max-w-2xl mx-auto p-4">
      <Card>
        <CardHeader>
          <CardTitle>Refer & Earn</CardTitle>
          <CardDescription>
            Share these codes with friends and earn credits when they place their first order
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="bg-primary/5 rounded-lg p-4 text-center mb-6">
            <p className="text-lg font-medium">Your Available Credits</p>
            <p className="text-3xl font-bold text-primary">${user?.user_metadata?.credits || 0}</p>
          </div>

          <div className="space-y-6">
            {referralCodes.map((referral) => (
              <Card key={referral.id} className="relative overflow-hidden">
                <CardContent className="p-6">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="space-y-2">
                      <h3 className="font-semibold text-lg">${referral.discount_amount} Off First Order</h3>
                      <p className="text-sm text-muted-foreground">{referral.description}</p>
                      <p className="text-sm text-muted-foreground">
                        You'll receive ${referral.discount_amount} in credits when they complete their first order
                      </p>
                      {referral.times_used > 0 && (
                        <p className="text-xs text-muted-foreground">
                          Used {referral.times_used} time{referral.times_used !== 1 ? 's' : ''} 
                          {referral.max_uses && ` (${referral.max_uses - referral.times_used} remaining)`}
                        </p>
                      )}
                    </div>
                    <div className="flex flex-col sm:flex-row gap-2 min-w-[200px]">
                      <div className="relative flex-1">
                        <Input value={referral.code} readOnly className="bg-muted pr-20" />
                        <Button
                          size="sm"
                          variant="ghost"
                          className="absolute right-0 top-0 h-full px-3 hover:bg-muted/50"
                          onClick={() => handleCopyCode(referral.code)}
                        >
                          <Copy className="h-4 w-4" />
                          <span className="sr-only">Copy code</span>
                        </Button>
                      </div>
                      <Button variant="outline" className="shrink-0" onClick={() => handleShare(referral)}>
                        <Share2 className="h-4 w-4 mr-2" />
                        Share
                      </Button>
                    </div>
                  </div>
                  {copiedCode === referral.code && (
                    <div className="absolute inset-0 flex items-center justify-center bg-background/80 backdrop-blur-sm transition-opacity">
                      <p className="text-sm font-medium">Copied to clipboard!</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="bg-muted rounded-lg p-6 mt-6">
            <h3 className="font-semibold mb-2">How it works</h3>
            <ol className="list-decimal list-inside space-y-2 text-sm text-muted-foreground">
              <li>Share your referral code with friends</li>
              <li>They get a discount on their first order</li>
              <li>You earn credits when they complete their order</li>
              <li>Use your credits on your next order</li>
            </ol>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

