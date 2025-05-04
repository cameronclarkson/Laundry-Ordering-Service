import { Check, Clock, Lock, Phone, Star, Truck, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ZipCodeChecker } from "@/components/zip-code-checker"

export default function ComforterCleaningLanding() {
  return (
    <div className="flex min-h-screen flex-col">
      {/* Urgency Banner */}
      <div className="flex h-10 w-full items-center justify-center bg-[#FF7A59] px-4 text-center text-base font-bold text-white">
        🔥 Only 25 spots at $99 — Offer ends 04/30! 🔥
      </div>

      <main className="flex-1">
        {/* Hero Section */}
        <section className="container mx-auto px-4 py-12 md:py-16 lg:py-20">
          <div className="mx-auto max-w-5xl">
            <div className="grid gap-8 md:grid-cols-2 md:gap-12">
              <div className="flex flex-col justify-center space-y-6">
                <h1 className="text-4xl font-bold leading-tight tracking-tighter md:text-5xl lg:text-6xl">
                  Refresh & Sanitize 5 Comforters for Just $99
                </h1>
                <p className="text-lg text-muted-foreground md:text-xl">
                  Remove 99% of dust mites & allergens — delivered back to your door in 24–48 hours.
                </p>
                <div className="space-y-4">
                  <Button className="h-auto w-full px-6 py-3 text-base font-medium bg-[#FF7A59] hover:bg-[#e56b4f] text-white rounded-lg md:w-auto">
                    Book My Pickup Now
                  </Button>

                  {/* ZIP Code Checker Component */}
                  <ZipCodeChecker />

                  {/* Price & Savings Callout */}
                  <div className="mt-4 flex items-baseline space-x-2">
                    <span className="text-3xl font-bold text-[#333]">$99</span>
                    <span className="text-lg line-through text-[#777]">$199</span>
                    <span className="text-sm font-medium text-[#FF7A59]">You save $100 today!</span>
                  </div>
                </div>
              </div>
              <div className="relative flex items-center justify-center rounded-lg bg-muted p-2">
                <img
                  src="/crisp-white-comforter-stack.png"
                  alt="Clean comforters stacked"
                  className="rounded-lg object-cover"
                  width={500}
                  height={400}
                />
              </div>
            </div>
          </div>
        </section>

        {/* Benefits and Testimonials */}
        <section className="container mx-auto px-4 py-12">
          <div className="mx-auto max-w-5xl">
            <div className="grid gap-8 md:grid-cols-2 md:gap-12">
              {/* Four-Point Benefits List */}
              <div className="space-y-6">
                <h2 className="text-2xl font-bold">What You Get</h2>
                <ul className="space-y-4">
                  {[
                    {
                      title: "Expert Deep-Cleaning",
                      description: "50-point professional care for all comforter types",
                    },
                    {
                      title: "Free Pickup & Delivery",
                      description: "We come to you—no extra charge",
                    },
                    {
                      title: "Eco-Friendly Detergents",
                      description: "Safe for your family & the planet",
                    },
                    {
                      title: "100% Satisfaction Guarantee",
                      description: "Love it or it's free—your money back",
                    },
                  ].map((benefit, index) => (
                    <li key={index} className="flex items-start space-x-3">
                      <div className="mt-0.5 flex-shrink-0 rounded-full bg-[#28a745] p-1 text-white">
                        <Check className="h-4 w-4" />
                      </div>
                      <div>
                        <h3 className="font-medium">{benefit.title}</h3>
                        <p className="text-muted-foreground">{benefit.description}</p>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Testimonials */}
              <div className="space-y-6">
                <h2 className="text-2xl font-bold">What Our Customers Say</h2>
                <div className="space-y-4">
                  {[
                    {
                      stars: 5,
                      text: "My comforters have never looked better! The service was amazing and the price was unbeatable.",
                      name: "Sarah M.",
                    },
                    {
                      stars: 5,
                      text: "I was skeptical at first, but the results were incredible. My comforters look brand new!",
                      name: "John D.",
                    },
                  ].map((testimonial, index) => (
                    <div key={index} className="rounded-lg bg-[#F9F9F9] p-4 shadow-sm">
                      <div className="mb-2 flex">
                        {Array(testimonial.stars)
                          .fill(0)
                          .map((_, i) => (
                            <Star key={i} className="h-4 w-4 fill-[#FFC107] text-[#FFC107]" />
                          ))}
                      </div>
                      <p className="mb-2">"{testimonial.text}"</p>
                      <p className="text-sm text-muted-foreground">— {testimonial.name}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* How It Works */}
        <section className="bg-muted py-12">
          <div className="container mx-auto px-4">
            <div className="mx-auto max-w-5xl text-center">
              <h2 className="mb-8 text-2xl font-bold">How It Works in 3 Easy Steps</h2>
              <div className="grid gap-8 md:grid-cols-3">
                {[
                  {
                    icon: <Clock className="h-12 w-12 text-[#FF7A59]" />,
                    title: "Schedule Your Pickup",
                    description: "Pick a time in two clicks—no forms, no hassle.",
                  },
                  {
                    icon: <Sparkles className="h-12 w-12 text-[#FF7A59]" />,
                    title: "We Deep-Clean",
                    description: "24-hour turnaround in our allergen-free facility.",
                  },
                  {
                    icon: <Truck className="h-12 w-12 text-[#FF7A59]" />,
                    title: "Enjoy Fresh Comforters",
                    description: "Delivered right back—fluffy, sanitized, like-new.",
                  },
                ].map((step, index) => (
                  <div key={index} className="flex flex-col items-center">
                    <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-white shadow-sm">
                      {step.icon}
                    </div>
                    <h3 className="mb-2 text-lg font-medium">{step.title}</h3>
                    <p className="text-muted-foreground">{step.description}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Trust & Guarantee */}
        <section className="container mx-auto px-4 py-8">
          <div className="mx-auto max-w-5xl">
            <div className="flex flex-wrap items-center justify-center gap-6 text-center md:gap-12">
              <div className="flex items-center space-x-2">
                <Lock className="h-5 w-5 text-[#FF7A59]" />
                <span>100% Money-Back Guarantee</span>
              </div>
              <div className="flex items-center space-x-2">
                <Check className="h-5 w-5 text-[#28a745]" />
                <span>Fully Insured & Eco-Certified</span>
              </div>
              <div className="flex items-center space-x-2">
                <Phone className="h-5 w-5 text-[#FF7A59]" />
                <span>Need Help? (555) 123-4567</span>
              </div>
            </div>
          </div>
        </section>

        {/* Footer CTA */}
        <section className="sticky bottom-0 border-t bg-white py-4 shadow-md">
          <div className="container mx-auto px-4">
            <div className="flex flex-col items-center justify-between space-y-4 md:flex-row md:space-y-0">
              <p className="text-lg font-medium">Ready for fresher, allergen-free comforters?</p>
              <Button className="h-auto w-full px-6 py-3 text-base font-medium bg-[#FF7A59] hover:bg-[#e56b4f] text-white rounded-lg md:w-auto">
                Schedule My $99 Pickup
              </Button>
            </div>
          </div>
        </section>
      </main>
    </div>
  )
}
