"use client"

import { motion } from "framer-motion"
import { HeroSection } from "../../components/about/hero-section"
import { StatCounter } from "../../components/about/stat-counter"
import { SectionReveal } from "../../components/about/section-reveal"
import { Button } from "../../components/ui/button"
import { Card, CardContent } from "../../components/ui/card"
import { Badge } from "../../components/ui/badge"
import { Globe, Building, Users, BookOpen, Handshake, MapPin, TrendingUp, Award } from "lucide-react"
import { Link } from "react-router-dom"

export default function CollaborationsPage() {
  const partners = [
    { name: "Harvard Medical School", logo: "https://upload.wikimedia.org/wikipedia/en/thumb/3/33/Harvard_Medical_School_shield.svg/1200px-Harvard_Medical_School_shield.svg.png", country: "USA" },
    { name: "Johns Hopkins University", logo: "https://brand.jhu.edu/assets/uploads/sites/5/2014/06/university_logo_small_vertical_blue.png", country: "USA" },
    { name: "Mayo Clinic", logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b9/Mayo_Clinic_2011_logo.svg/320px-Mayo_Clinic_2011_logo.svg.png", country: "USA" },
    { name: "Stanford Medicine", logo: "https://identity.stanford.edu/wp-content/uploads/sites/3/2020/07/stanford-medicine-stack.png", country: "USA" },
    { name: "Oxford University", logo: "https://www.ox.ac.uk/sites/files/oxford/media_wysiwyg/logo_oxford_university_blue.gif", country: "UK" },
    { name: "University of Tokyo", logo: "https://www.u-tokyo.ac.jp/content/400020145.png", country: "Japan" },
    { name: "Charité Berlin", logo: "https://www.charite.de/fileadmin/user_upload/portal/charite/presse/publikationen/Logos/logo-charite-universitaetsmedizin-berlin.png", country: "Germany" },
    { name: "Karolinska Institute", logo: "https://ki.se/sites/default/files/2022-01/ki_logo_cmyk.png", country: "Sweden" },
    { name: "University of Melbourne", logo: "https://www.unimelb.edu.au/__data/assets/image/0006/3287751/logo-online.png", country: "Australia" },
    { name: "University of Toronto", logo: "https://upload.wikimedia.org/wikipedia/en/thumb/9/9a/University_of_Toronto_seal.svg/1200px-University_of_Toronto_seal.svg.png", country: "Canada" },
    { name: "Sorbonne University", logo: "https://upload.wikimedia.org/wikipedia/en/thumb/a/a6/Sorbonne_Universit%C3%A9_logo.svg/1200px-Sorbonne_Universit%C3%A9_logo.svg.png", country: "France" },
    { name: "ETH Zurich", logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/af/ETH_Zurich_Logo_black.svg/1200px-ETH_Zurich_Logo_black.svg.png", country: "Switzerland" },
  ]

  const collaborationTypes = [
    {
      title: "Research Partnerships",
      description: "Joint research initiatives with leading medical institutions worldwide",
      count: "120+",
      icon: <BookOpen className="h-6 w-6" />,
      color: "blue" as const,
      details: "Collaborative studies spanning multiple specialties and continents",
    },
    {
      title: "Academic Alliances",
      description: "Educational partnerships with universities and medical schools",
      count: "85+",
      icon: <Building className="h-6 w-6" />,
      color: "green" as const,
      details: "Joint degree programs and research exchange initiatives",
    },
    {
      title: "Clinical Networks",
      description: "Collaborations with hospitals and healthcare systems",
      count: "200+",
      icon: <Users className="h-6 w-6" />,
      color: "purple" as const,
      details: "Real-world evidence studies and clinical trial networks",
    },
    {
      title: "Technology Partners",
      description: "Strategic partnerships with healthcare technology companies",
      count: "45+",
      icon: <TrendingUp className="h-6 w-6" />,
      color: "amber" as const,
      details: "Innovation labs and digital health platform integrations",
    },
  ]

  const globalPresence = [
    { region: "North America", institutions: 145, countries: 3, growth: "+12%" },
    { region: "Europe", institutions: 178, countries: 28, growth: "+18%" },
    { region: "Asia-Pacific", institutions: 132, countries: 15, growth: "+25%" },
    { region: "Latin America", institutions: 67, countries: 12, growth: "+22%" },
    { region: "Africa", institutions: 43, countries: 18, growth: "+35%" },
    { region: "Middle East", institutions: 28, countries: 8, growth: "+28%" },
  ]

  const successStories = [
    {
      title: "Global COVID-19 Research Initiative",
      description:
        "Coordinated research efforts across 45 countries to accelerate vaccine development and treatment protocols during the pandemic, establishing new standards for global health emergency response.",
      partners: "Harvard, Oxford, Tokyo University, WHO",
      impact: "Reduced vaccine development time by 40%",
      badge: "2020-2022",
      participants: "15,000+ researchers",
      publications: "2,800+ papers",
    },
    {
      title: "AI in Radiology Consortium",
      description:
        "Multi-institutional collaboration to develop AI-powered diagnostic tools for medical imaging across different populations, ensuring algorithmic fairness and global applicability.",
      partners: "Stanford, Mayo Clinic, Charité, 12+ institutions",
      impact: "94% diagnostic accuracy improvement",
      badge: "2021-2024",
      participants: "8,500+ radiologists",
      publications: "450+ papers",
    },
    {
      title: "Rare Disease Research Network",
      description:
        "International network focused on collaborative research for rare genetic disorders, sharing data and resources globally to accelerate treatment development for underserved patient populations.",
      partners: "Johns Hopkins, Karolinska, 25+ institutions",
      impact: "12 new treatment protocols developed",
      badge: "2019-Present",
      participants: "3,200+ researchers",
      publications: "680+ papers",
    },
  ]

  const PartnerLogo = ({ partner, index }: { partner: any; index: number }) => (
    <SectionReveal delay={index * 0.05}>
      <motion.div
        className="flex items-center justify-center p-6 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 hover:shadow-md transition-all duration-300 group"
        whileHover={{ scale: 1.02, y: -2 }}
      >
        <div className="text-center">
          <img
            src={partner.logo || "https://via.placeholder.com/120x60?text=Logo"}
            alt={partner.name}
            className="max-h-12 w-auto object-contain mx-auto filter dark:invert-[0.85] group-hover:scale-110 transition-transform duration-300"
          />
          <p className="text-xs text-muted-foreground mt-2 font-medium">{partner.country}</p>
        </div>
      </motion.div>
    </SectionReveal>
  )

  return (
    <div className="min-h-screen">
      <HeroSection
        title="Global Collaborations"
        subtitle="Building bridges across continents to advance medical research through strategic partnerships with leading institutions, fostering innovation and knowledge sharing worldwide."
        backgroundClass="bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-950/30 dark:to-orange-950/30"
      >
        <div className="flex flex-wrap justify-center gap-4">
          <Button
            size="lg"
            className="bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700"
          >
            Become a Partner
          </Button>
          <Button variant="outline" size="lg">
            Explore Partnerships
          </Button>
        </div>
      </HeroSection>

      {/* Partnership Network Overview */}
      <section className="py-16 md:py-24">
        <div className="container px-4 md:px-6">
          <SectionReveal>
            <div className="text-center max-w-4xl mx-auto mb-16">
              <Badge variant="outline" className="mb-4 text-amber-600 border-amber-200">
                Partnership Network
              </Badge>
              <h2 className="text-3xl md:text-4xl font-bold mb-6">Connecting Healthcare Worldwide</h2>
              <p className="text-xl text-muted-foreground leading-relaxed">
                Our global network spans across continents, connecting researchers, clinicians, and institutions in the
                pursuit of medical advancement. Together, we're breaking down barriers and accelerating the pace of
                healthcare innovation.
              </p>
            </div>
          </SectionReveal>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            <StatCounter
              value="450+"
              label="Partner Institutions"
              description="Leading medical centers worldwide"
              icon={<Building className="h-6 w-6" />}
              color="blue"
              delay={0.1}
            />
            <StatCounter
              value="84"
              label="Countries"
              description="Global presence and reach"
              icon={<Globe className="h-6 w-6" />}
              color="green"
              delay={0.2}
            />
            <StatCounter
              value="15,000+"
              label="Collaborative Researchers"
              description="Active in our network"
              icon={<Users className="h-6 w-6" />}
              color="purple"
              delay={0.3}
            />
            <StatCounter
              value="2,800+"
              label="Joint Publications"
              description="Collaborative research output"
              icon={<BookOpen className="h-6 w-6" />}
              color="amber"
              delay={0.4}
            />
          </div>
        </div>
      </section>

      {/* Strategic Partners */}
      <section className="py-16 md:py-24 bg-gray-50 dark:bg-gray-900/50">
        <div className="container px-4 md:px-6">
          <SectionReveal>
            <div className="text-center max-w-4xl mx-auto mb-16">
              <Badge variant="outline" className="mb-4 text-blue-600 border-blue-200">
                Strategic Partners
              </Badge>
              <h2 className="text-3xl md:text-4xl font-bold mb-6">World-Renowned Institutions</h2>
              <p className="text-xl text-muted-foreground">
                We collaborate with the world's most prestigious medical institutions and research centers to drive
                innovation and advance healthcare knowledge across all specialties.
              </p>
            </div>
          </SectionReveal>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {partners.map((partner, index) => (
              <PartnerLogo key={partner.name} partner={partner} index={index} />
            ))}
          </div>
        </div>
      </section>

      {/* Collaboration Types */}
      <section className="py-16 md:py-24">
        <div className="container px-4 md:px-6">
          <SectionReveal>
            <div className="text-center max-w-4xl mx-auto mb-16">
              <Badge variant="outline" className="mb-4 text-purple-600 border-purple-200">
                Collaboration Types
              </Badge>
              <h2 className="text-3xl md:text-4xl font-bold mb-6">Diverse Partnership Models</h2>
              <p className="text-xl text-muted-foreground">
                We engage in various forms of collaboration to maximize impact and ensure comprehensive medical research
                coverage across all areas of healthcare innovation.
              </p>
            </div>
          </SectionReveal>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            {collaborationTypes.map((type, index) => (
              <SectionReveal key={type.title} delay={index * 0.1}>
                <Card className="h-full hover:shadow-lg transition-all duration-300 border-2 hover:border-blue-200 dark:hover:border-blue-800 group">
                  <CardContent className="p-6 text-center">
                    <motion.div
                      className={`p-4 rounded-full bg-${type.color}-50 dark:bg-${type.color}-900/30 w-fit mx-auto mb-6`}
                      whileHover={{ scale: 1.1, rotate: 5 }}
                      transition={{ duration: 0.2 }}
                    >
                      <div className={`text-${type.color}-600 dark:text-${type.color}-400`}>{type.icon}</div>
                    </motion.div>
                    <h3 className="text-xl font-bold mb-3">{type.title}</h3>
                    <p className="text-muted-foreground mb-4 text-sm leading-relaxed">{type.description}</p>
                    <Badge variant="outline" className="text-lg font-bold mb-3">
                      {type.count}
                    </Badge>
                    <p className="text-xs text-muted-foreground">{type.details}</p>
                  </CardContent>
                </Card>
              </SectionReveal>
            ))}
          </div>
        </div>
      </section>

      {/* Global Presence */}
      <section className="py-16 md:py-24 bg-blue-50 dark:bg-blue-950/30">
        <div className="container px-4 md:px-6">
          <div className="grid gap-12 lg:grid-cols-2 items-center">
            <SectionReveal direction="left">
              <div>
                <Badge variant="outline" className="mb-4 text-blue-600 border-blue-200">
                  Global Presence
                </Badge>
                <h2 className="text-3xl md:text-4xl font-bold mb-6">Worldwide Research Network</h2>
                <p className="text-xl text-muted-foreground mb-8">
                  Our partnerships span across all continents, creating a truly global network for medical research
                  collaboration. Each region brings unique perspectives and expertise to our collective mission.
                </p>

                <div className="space-y-4">
                  {globalPresence.map((region, index) => (
                    <SectionReveal key={region.region} delay={index * 0.1}>
                      <motion.div
                        className="flex items-center justify-between p-4 bg-white dark:bg-gray-800 rounded-lg border hover:shadow-md transition-all duration-300"
                        whileHover={{ scale: 1.02, x: 5 }}
                      >
                        <div className="flex items-center space-x-3">
                          <MapPin className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                          <div>
                            <h3 className="font-semibold">{region.region}</h3>
                            <p className="text-sm text-muted-foreground">{region.countries} countries</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <Badge variant="secondary" className="font-bold mb-1">
                            {region.institutions} institutions
                          </Badge>
                          <p className="text-xs text-green-600 dark:text-green-400 font-medium">
                            {region.growth} growth
                          </p>
                        </div>
                      </motion.div>
                    </SectionReveal>
                  ))}
                </div>
              </div>
            </SectionReveal>

            <SectionReveal direction="right" delay={0.3}>
              <div className="relative">
                <div className="absolute -z-10 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-gradient-to-r from-blue-400/20 to-amber-400/20 rounded-full blur-3xl"></div>
                <motion.img
                  src="https://images.unsplash.com/photo-1557804506-669a67965ba0?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1674&q=80"
                  alt="Global Collaboration Network"
                  className="rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-800"
                  whileHover={{ scale: 1.02, rotate: 1 }}
                  transition={{ duration: 0.3 }}
                />
              </div>
            </SectionReveal>
          </div>
        </div>
      </section>

      {/* Success Stories */}
      <section className="py-16 md:py-24">
        <div className="container px-4 md:px-6">
          <SectionReveal>
            <div className="text-center max-w-4xl mx-auto mb-16">
              <Badge variant="outline" className="mb-4 text-green-600 border-green-200">
                Success Stories
              </Badge>
              <h2 className="text-3xl md:text-4xl font-bold mb-6">Transformative Collaborations</h2>
              <p className="text-xl text-muted-foreground">
                Highlighting impactful collaborations that have advanced medical research, improved patient outcomes,
                and set new standards for global healthcare innovation.
              </p>
            </div>
          </SectionReveal>

          <div className="grid gap-8 lg:grid-cols-3">
            {successStories.map((story, index) => (
              <SectionReveal key={story.title} delay={index * 0.1}>
                <Card className="h-full hover:shadow-lg transition-all duration-300 border-2 hover:border-green-200 dark:hover:border-green-800">
                  <CardContent className="p-6">
                    <div className="flex justify-between items-start mb-4">
                      <Badge variant="outline" className="font-mono">
                        {story.badge}
                      </Badge>
                      <motion.div whileHover={{ scale: 1.1, rotate: 5 }} transition={{ duration: 0.2 }}>
                        <Award className="h-5 w-5 text-amber-500" />
                      </motion.div>
                    </div>

                    <h3 className="text-xl font-bold mb-3">{story.title}</h3>
                    <p className="text-muted-foreground mb-4 leading-relaxed text-sm">{story.description}</p>

                    <div className="space-y-3">
                      <div>
                        <p className="text-sm font-medium text-blue-600 dark:text-blue-400">Key Partners:</p>
                        <p className="text-sm text-muted-foreground">{story.partners}</p>
                      </div>

                      <div>
                        <p className="text-sm font-medium text-green-600 dark:text-green-400">Impact:</p>
                        <p className="text-sm font-semibold">{story.impact}</p>
                      </div>

                      <div className="grid grid-cols-2 gap-2 pt-2">
                        <div className="text-center p-2 bg-gray-50 dark:bg-gray-800 rounded">
                          <p className="text-xs text-muted-foreground">Participants</p>
                          <p className="text-sm font-bold">{story.participants}</p>
                        </div>
                        <div className="text-center p-2 bg-gray-50 dark:bg-gray-800 rounded">
                          <p className="text-xs text-muted-foreground">Publications</p>
                          <p className="text-sm font-bold">{story.publications}</p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </SectionReveal>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 md:py-24 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="container px-4 md:px-6">
          <SectionReveal>
            <div className="text-center max-w-4xl mx-auto">
              <motion.div
                whileHover={{ scale: 1.05, rotate: 5 }}
                transition={{ duration: 0.2 }}
                className="p-4 rounded-full bg-white/10 w-fit mx-auto mb-6"
              >
                <Handshake className="h-12 w-12" />
              </motion.div>
              <h2 className="text-3xl md:text-4xl font-bold mb-6">Partner With Us</h2>
              <p className="text-xl mb-8 text-blue-100 leading-relaxed">
                Join our global network of leading medical institutions and researchers. Together, we can accelerate
                medical breakthroughs, improve healthcare outcomes, and create lasting impact for patients worldwide.
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <Button variant="secondary" size="lg">
                  Become a Partner
                </Button>
                <Button
                  variant="outline"
                  size="lg"
                  className="border-white text-white hover:bg-white hover:text-blue-600"
                >
                  Learn More
                </Button>
              </div>
            </div>
          </SectionReveal>
        </div>
      </section>
    </div>
  )
} 