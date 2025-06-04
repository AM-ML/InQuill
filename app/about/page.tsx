"use client"

import { motion } from "framer-motion"
import { HeroSection } from "../components/about/hero-section"
import { SectionReveal } from "../components/about/section-reveal"
import { SectionHeading } from "../components/about/section-heading"
import { Button } from "../components/ui/button"
import { Card, CardContent } from "../components/ui/card"
import { Badge } from "../components/ui/badge"
import { 
  Heart, 
  BookOpen, 
  Users, 
  Globe, 
  ArrowRight, 
  Microscope, 
  Building, 
  Handshake 
} from "lucide-react"
import { Link } from "react-router-dom"

export default function AboutPage() {
  const aboutSections = [
    {
      title: "Our Mission",
      description: "Learn about our purpose and vision for medical research",
      href: "/about/mission",
      icon: <Heart className="h-6 w-6" />,
      color: "blue",
    },
    {
      title: "Research Impact",
      description: "Discover how our work is changing healthcare globally",
      href: "/about/impact",
      icon: <Microscope className="h-6 w-6" />,
      color: "green",
    },
    {
      title: "Leadership & Team",
      description: "Meet the experts behind our groundbreaking research",
      href: "/about/team",
      icon: <Users className="h-6 w-6" />,
      color: "purple",
    },
    {
      title: "Global Collaborations",
      description: "Explore our partnerships with institutions worldwide",
      href: "/about/collaborations",
      icon: <Handshake className="h-6 w-6" />,
      color: "amber",
    },
  ]

  const stats = [
    {
      value: "15+",
      label: "Years of Excellence",
      icon: <Building className="h-6 w-6" />,
      color: "blue",
    },
    {
      value: "450+",
      label: "Partner Institutions",
      icon: <Handshake className="h-6 w-6" />,
      color: "green",
    },
    {
      value: "12,000+",
      label: "Research Publications",
      icon: <BookOpen className="h-6 w-6" />,
      color: "purple",
    },
    {
      value: "5.2M+",
      label: "Healthcare Professionals",
      icon: <Users className="h-6 w-6" />,
      color: "amber",
    },
  ]

  return (
    <div className="min-h-screen">
      <HeroSection 
        title="About InQuill"
        subtitle="Advancing healthcare through innovative research, global collaboration, and knowledge sharing. Our mission is to improve lives through medical discovery and education."
      >
        <div className="flex flex-wrap justify-center gap-4">
          <Button 
            size="lg" 
            className="bg-gradient-to-r from-blue-600 to-blue-400 hover:from-blue-700 hover:to-blue-500"
          >
            Our History
          </Button>
          <Button variant="outline" size="lg">
            Meet Our Team
          </Button>
        </div>
      </HeroSection>

      {/* Overview Stats Section */}
      <section className="py-16 md:py-24">
        <div className="container px-4 md:px-6">
          <SectionReveal>
            <SectionHeading
              title="Global Impact"
              subtitle="Our contributions to medical research and healthcare worldwide"
              align="center"
              className="mb-12"
            />
          </SectionReveal>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {stats.map((stat, index) => (
              <SectionReveal key={stat.label} delay={index * 0.1}>
                <Card className="overflow-hidden border-t-4 border-t-transparent hover:border-t-blue-500 transition-all duration-300 hover:shadow-md h-full">
                  <CardContent className="p-6">
                    <div className="flex items-center space-x-4">
                      <div className={`p-3 rounded-full bg-${stat.color}-50 dark:bg-${stat.color}-900/20 text-${stat.color}-600 dark:text-${stat.color}-400`}>
                        {stat.icon}
                      </div>
                      <div>
                        <motion.div
                          initial={{ opacity: 0, scale: 0.5 }}
                          whileInView={{ opacity: 1, scale: 1 }}
                          viewport={{ once: true }}
                          transition={{ duration: 0.5, delay: index * 0.1 + 0.2 }}
                          className={`text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-${stat.color}-600 to-${stat.color}-400`}
                        >
                          {stat.value}
                        </motion.div>
                        <p className="text-sm text-muted-foreground">{stat.label}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </SectionReveal>
            ))}
          </div>
        </div>
      </section>

      {/* About Sections */}
      <section className="py-16 md:py-24 bg-gray-50 dark:bg-gray-900/50">
        <div className="container px-4 md:px-6">
          <SectionReveal>
            <SectionHeading
              title="Learn More About Us"
              subtitle="Explore our mission, impact, team, and global partnerships"
              align="center"
              className="mb-12"
            />
          </SectionReveal>

          <div className="grid gap-8 md:grid-cols-2">
            {aboutSections.map((section, index) => (
              <SectionReveal key={section.title} delay={index * 0.1}>
                <Link to={section.href}>
                  <Card className="h-full hover:shadow-lg transition-all duration-300 group">
                    <CardContent className="p-8">
                      <div className="flex justify-between items-start">
                        <div className={`p-3 rounded-full bg-${section.color}-50 dark:bg-${section.color}-900/20 text-${section.color}-600 dark:text-${section.color}-400 group-hover:scale-110 transition-transform duration-300`}>
                          {section.icon}
                        </div>
                        <ArrowRight className="h-5 w-5 text-gray-400 group-hover:text-primary group-hover:translate-x-1 transition-all duration-300" />
                      </div>
                      <h3 className="text-xl font-bold mt-6 mb-2 group-hover:text-primary transition-colors duration-300">{section.title}</h3>
                      <p className="text-muted-foreground">{section.description}</p>
                    </CardContent>
                  </Card>
                </Link>
              </SectionReveal>
            ))}
          </div>
        </div>
      </section>

      {/* Vision */}
      <section className="py-16 md:py-24">
        <div className="container px-4 md:px-6">
          <div className="grid gap-12 lg:grid-cols-2 items-center">
            <SectionReveal direction="left">
              <div>
                <Badge variant="outline" className="mb-4 text-blue-600 border-blue-200">
                  Our Vision
                </Badge>
                <h2 className="text-3xl md:text-4xl font-bold mb-6">Transforming Healthcare Through Knowledge</h2>
                <p className="text-xl text-muted-foreground mb-8 leading-relaxed">
                  We envision a world where medical research transcends boundaries, empowering healthcare professionals
                  with cutting-edge knowledge and tools to provide optimal patient care. Our commitment extends beyond
                  research to creating lasting impact in global health outcomes.
                </p>
                <Button 
                  size="lg" 
                  className="bg-gradient-to-r from-blue-600 to-blue-400 hover:from-blue-700 hover:to-blue-500"
                >
                  <Link to="/about/mission">Learn About Our Mission</Link>
                </Button>
              </div>
            </SectionReveal>

            <SectionReveal direction="right" delay={0.3}>
              <div className="relative">
                <div className="absolute -z-10 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-gradient-to-r from-blue-400/20 to-purple-400/20 rounded-full blur-3xl"></div>
                <motion.img
                  src="https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80"
                  alt="Our Vision"
                  className="rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-800"
                  whileHover={{ scale: 1.02, rotate: 1 }}
                  transition={{ duration: 0.3 }}
                />
              </div>
            </SectionReveal>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 md:py-24 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="container px-4 md:px-6">
          <SectionReveal>
            <div className="text-center max-w-3xl mx-auto">
              <motion.div
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.2 }}
                className="p-4 rounded-full bg-white/10 w-fit mx-auto mb-6"
              >
                <Globe className="h-12 w-12" />
              </motion.div>
              <h2 className="text-3xl md:text-4xl font-bold mb-6">Join Our Mission</h2>
              <p className="text-xl mb-8 text-blue-100">
                Be part of our global community working to advance medical knowledge and improve healthcare outcomes for
                all. Together, we can transform the future of medicine.
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <Button size="lg" variant="secondary">
                  Become a Partner
                </Button>
                <Button
                  variant="outline"
                  size="lg"
                  className="border-white text-white hover:bg-white hover:text-blue-600"
                >
                  Contact Us
                </Button>
              </div>
            </div>
          </SectionReveal>
        </div>
      </section>
    </div>
  )
} 