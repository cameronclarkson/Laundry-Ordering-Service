"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { useToast } from "@/components/ui/use-toast"
import { supabase } from "@/lib/supabase"
import { ArrowRight, WashingMachine, Clock, ThumbsUp } from "lucide-react"
import { Badge } from "@/components/ui/badge"

export default function AdminLandingPage() {
  const [landingContent, setLandingContent] = useState({
    title: "Fresh Clothes, Zero Effort",
    subtitle: "Professional laundry service, delivered to your door",
    description: "Let us handle your laundry while you focus on what matters most. Professional cleaning, pickup & delivery, all at affordable prices.",
    ctaText: "Schedule Pickup"
  })
  const [isSaving, setIsSaving] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [previewMode, setPreviewMode] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    const fetchLandingContent = async () => {
      try {
        setIsLoading(true)
        const { data, error } = await supabase
          .from('landing_page_content')
          .select('*')
          .eq('id', 1)
          .single()
        
        if (error && error.code !== 'PGRST116') throw error
        
        if (data) {
          setLandingContent({
            title: data.title,
            subtitle: data.subtitle,
            description: data.description,
            ctaText: data.cta_text
          })
        }
      } catch (error) {
        console.error("Error fetching landing page content:", error)
        toast({
          title: "Error",
          description: "Failed to load landing page content",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchLandingContent()
  }, [toast])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setLandingContent(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSave = async () => {
    setIsSaving(true)
    try {
      const { data: existingData } = await supabase
        .from('landing_page_content')
        .select('id')
        .eq('id', 1)
        .single()

      if (existingData) {
        // Update existing record
        const { error } = await supabase
          .from('landing_page_content')
          .update({
            title: landingContent.title,
            subtitle: landingContent.subtitle,
            description: landingContent.description,
            cta_text: landingContent.ctaText,
            updated_at: new Date()
          })
          .eq('id', 1)
        
        if (error) throw error
      } else {
        // Insert new record
        const { error } = await supabase
          .from('landing_page_content')
          .insert([{
            id: 1,
            title: landingContent.title,
            subtitle: landingContent.subtitle,
            description: landingContent.description,
            cta_text: landingContent.ctaText,
            created_at: new Date(),
            updated_at: new Date()
          }])
        
        if (error) throw error
      }

      toast({
        title: "Success",
        description: "Landing page content saved successfully",
      })
    } catch (error: any) {
      console.error("Error saving landing page content:", error)
      toast({
        title: "Error",
        description: error.message || "Failed to save landing page content",
        variant: "destructive",
      })
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <div className="container mx-auto py-10 px-4">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Landing Page Editor</h1>
        <div className="flex gap-4">
          <Button 
            variant="outline" 
            onClick={() => setPreviewMode(!previewMode)}
          >
            {previewMode ? "Edit Mode" : "Preview Mode"}
          </Button>
          <Button 
            onClick={handleSave} 
            disabled={isSaving || isLoading}
          >
            {isSaving ? "Saving..." : "Save Changes"}
          </Button>
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <p>Loading content...</p>
        </div>
      ) : previewMode ? (
        <div className="border rounded-lg p-6 bg-white">
          <h2 className="text-2xl font-bold mb-6">Landing Page Preview</h2>
          
          <div className="mb-10 space-y-4 bg-gradient-to-b from-blue-50 to-white p-8 rounded-lg">
            <Badge variant="outline" className="w-fit">Professional Laundry Services</Badge>
            <h1 className="text-4xl font-bold text-gray-900">{landingContent.title}</h1>
            <p className="text-xl text-gray-600">{landingContent.subtitle}</p>
            <p className="text-gray-600">{landingContent.description}</p>
            <Button size="lg" className="mt-4">
              {landingContent.ctaText} <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
          
          <div className="mt-8">
            <h3 className="text-xl font-semibold mb-4">Benefits Section Preview</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-blue-50 p-4 rounded-lg border border-blue-100 flex flex-col items-center text-center">
                <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center mb-2">
                  <WashingMachine className="h-5 w-5 text-blue-600" />
                </div>
                <h3 className="text-lg font-medium mb-1">Professional Quality</h3>
                <p className="text-sm text-gray-600">Expert cleaning that treats your clothes with care.</p>
              </div>
              
              <div className="bg-blue-50 p-4 rounded-lg border border-blue-100 flex flex-col items-center text-center">
                <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center mb-2">
                  <Clock className="h-5 w-5 text-blue-600" />
                </div>
                <h3 className="text-lg font-medium mb-1">Time-Saving</h3>
                <p className="text-sm text-gray-600">Free pickup and delivery service that fits your schedule.</p>
              </div>
              
              <div className="bg-blue-50 p-4 rounded-lg border border-blue-100 flex flex-col items-center text-center">
                <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center mb-2">
                  <ThumbsUp className="h-5 w-5 text-blue-600" />
                </div>
                <h3 className="text-lg font-medium mb-1">Satisfaction Guaranteed</h3>
                <p className="text-sm text-gray-600">If you're not satisfied, we'll re-clean your items.</p>
              </div>
            </div>
          </div>
          
          <div className="mt-4">
            <Button variant="secondary" onClick={() => setPreviewMode(false)}>
              Back to Editor
            </Button>
          </div>
        </div>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>Edit Landing Page Content</CardTitle>
            <CardDescription>
              Customize the content that appears on the landing page for your Facebook campaigns.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="title">Page Title</Label>
              <Input
                id="title"
                name="title"
                value={landingContent.title}
                onChange={handleInputChange}
                placeholder="Enter page title"
              />
              <p className="text-sm text-muted-foreground">This is the main headline of your landing page</p>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="subtitle">Subtitle</Label>
              <Input
                id="subtitle"
                name="subtitle"
                value={landingContent.subtitle}
                onChange={handleInputChange}
                placeholder="Enter subtitle"
              />
              <p className="text-sm text-muted-foreground">A brief tagline that appears below the title</p>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                name="description"
                value={landingContent.description}
                onChange={handleInputChange}
                placeholder="Enter description"
                rows={4}
              />
              <p className="text-sm text-muted-foreground">The main paragraph that explains your service</p>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="ctaText">Call to Action Text</Label>
              <Input
                id="ctaText"
                name="ctaText"
                value={landingContent.ctaText}
                onChange={handleInputChange}
                placeholder="Enter call to action text"
              />
              <p className="text-sm text-muted-foreground">The text that appears on the main button</p>
            </div>
            
            <div className="pt-4">
              <Button onClick={handleSave} disabled={isSaving}>
                {isSaving ? "Saving..." : "Save Changes"}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
} 