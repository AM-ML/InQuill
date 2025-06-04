"use client"

import { motion } from "framer-motion"
import { HeroSection } from "../../components/about/hero-section"
import { StatCounter } from "../../components/about/stat-counter"
import { SectionReveal } from "../../components/about/section-reveal"
import { Button } from "../../components/ui/button"
import { Card, CardContent } from "../../components/ui/card"
import { Badge } from "../../components/ui/badge"
import { Heart, Lightbulb, Target, Award, Users, Microscope, Globe, TrendingUp } from "lucide-react"
import { Link } from "react-router-dom"

export default function MissionPage() {
  const milestones = [
    {
      year: "2010",
      title: "Foundation Established",
      description:
        "InQuill was founded with the mission to bridge the gap between medical research and clinical practice, starting with a small team of dedicated researchers.",
    },
    {
      year: "2013",
      title: "Digital Platform Launch",
      description:
        "Introduced our comprehensive online platform, making peer-reviewed research accessible to healthcare professionals worldwide through innovative technology.",
    },
    {
      year: "2016",
      title: "Global Research Network",
      description:
        "Expanded our network to include research institutions across 25 countries, fostering unprecedented international collaboration in medical research.",
    },
    {
      year: "2019",
      title: "AI Integration Initiative",
      description:
        "Pioneered the integration of artificial intelligence tools to enhance medical research capabilities and accelerate diagnostic innovations.",
    },
    {
      year: "2022",
      title: "Pandemic Response Leadership",
      description:
        "Led a global initiative to accelerate research and knowledge sharing during the health crisis, facilitating rapid vaccine development coordination.",
    },
    {
      year: "2025",
      title: "Next-Generation Platform",
      description:
        "Launched our advanced platform featuring personalized learning pathways, interactive research tools, and enhanced global collaboration features.",
    },
  ]

  const coreValues = [
    {
      icon: <Heart className="h-6 w-6" />,
      title: "Compassion",
      description:
        "We place patient well-being at the center of our research, recognizing that behind every data point is a human life deserving of care and dignity.",
      color: "blue" as const,
    },
    {
      icon: <Lightbulb className="h-6 w-6" />,
      title: "Innovation",
      description:
        "We embrace creative thinking and technological advancement to push the boundaries of medical knowledge and discover breakthrough solutions.",
      color: "green" as const,
    },
    {
      icon: <Target className="h-6 w-6" />,
      title: "Excellence",
      description:
        "We uphold the highest standards of scientific rigor and integrity in our research, ensuring reliable and impactful medical discoveries.",
      color: "purple" as const,
    },
  ]

  return (
    <div className="min-h-screen">
      <HeroSection
        title="Our Mission"
        subtitle="Advancing medical knowledge through innovative research, education, and global collaboration to improve healthcare outcomes worldwide."
      >
        <div className="flex flex-wrap justify-center gap-4">
          <Button
            size="lg"
            className="bg-gradient-to-r from-blue-600 to-blue-400 hover:from-blue-700 hover:to-blue-500"
          >
            Learn More About Us
          </Button>
          <Button variant="outline" size="lg">
            Contact Our Team
          </Button>
        </div>
      </HeroSection>

      {/* Vision Section */}
      <section className="py-16 md:py-24">
        <div className="container px-4 md:px-6">
          <SectionReveal>
            <div className="text-center max-w-4xl mx-auto mb-16">
              <Badge variant="outline" className="mb-4 text-blue-600 border-blue-200">
                Our Vision
              </Badge>
              <h2 className="text-3xl md:text-4xl font-bold mb-6">Transforming Healthcare Through Knowledge</h2>
              <p className="text-xl text-muted-foreground leading-relaxed">
                We envision a world where medical research transcends boundaries, empowering healthcare professionals
                with cutting-edge knowledge and tools to provide optimal patient care. Our commitment extends beyond
                research to creating lasting impact in global health outcomes.
              </p>
            </div>
          </SectionReveal>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            <StatCounter
              value="15+"
              label="Years of Excellence"
              description="Dedicated to advancing medical research"
              icon={<Award className="h-6 w-6" />}
              color="blue"
              delay={0.1}
            />
            <StatCounter
              value="12,000+"
              label="Research Articles"
              description="Peer-reviewed publications"
              icon={<Microscope className="h-6 w-6" />}
              color="green"
              delay={0.2}
            />
            <StatCounter
              value="5.2M+"
              label="Healthcare Professionals"
              description="Reached globally"
              icon={<Users className="h-6 w-6" />}
              color="purple"
              delay={0.3}
            />
            <StatCounter
              value="190+"
              label="Countries"
              description="Worldwide presence"
              icon={<Globe className="h-6 w-6" />}
              color="amber"
              delay={0.4}
            />
          </div>
        </div>
      </section>

      {/* Core Values */}
      <section className="py-16 md:py-24 bg-gray-50 dark:bg-gray-900/50">
        <div className="container px-4 md:px-6">
          <SectionReveal>
            <div className="text-center max-w-3xl mx-auto mb-16">
              <Badge variant="outline" className="mb-4 text-purple-600 border-purple-200">
                Core Values
              </Badge>
              <h2 className="text-3xl md:text-4xl font-bold mb-6">The Principles That Guide Us</h2>
              <p className="text-xl text-muted-foreground">
                Our values shape every aspect of our work and define our approach to medical research and collaboration.
              </p>
            </div>
          </SectionReveal>

          <div className="grid gap-8 md:grid-cols-3">
            {coreValues.map((value, index) => (
              <SectionReveal key={value.title} delay={index * 0.2}>
                <Card className="h-full hover:shadow-lg transition-all duration-300 border-2 hover:border-blue-200 dark:hover:border-blue-800">
                  <CardContent className="p-8 text-center">
                    <motion.div
                      className={`p-4 rounded-full bg-${value.color}-50 dark:bg-${value.color}-900/30 w-fit mx-auto mb-6`}
                      whileHover={{ scale: 1.1, rotate: 5 }}
                      transition={{ duration: 0.2 }}
                    >
                      <div className={`text-${value.color}-600 dark:text-${value.color}-400`}>{value.icon}</div>
                    </motion.div>
                    <h3 className="text-2xl font-bold mb-4">{value.title}</h3>
                    <p className="text-muted-foreground leading-relaxed">{value.description}</p>
                  </CardContent>
                </Card>
              </SectionReveal>
            ))}
          </div>
        </div>
      </section>

      {/* Milestones */}
      <section className="py-16 md:py-24">
        <div className="container px-4 md:px-6">
          <SectionReveal>
            <div className="text-center max-w-3xl mx-auto mb-16">
              <Badge variant="outline" className="mb-4 text-green-600 border-green-200">
                Milestones
              </Badge>
              <h2 className="text-3xl md:text-4xl font-bold mb-6">Our Journey of Impact</h2>
              <p className="text-xl text-muted-foreground">
                Key achievements that mark our evolution from a small research initiative to a global healthcare
                innovation leader.
              </p>
            </div>
          </SectionReveal>

          <div className="max-w-4xl mx-auto">
            <div className="relative">
              {/* Timeline line */}
              <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gradient-to-b from-blue-600 via-purple-600 to-blue-400"></div>

              <div className="space-y-12">
                {milestones.map((milestone, index) => (
                  <SectionReveal key={milestone.year} delay={index * 0.1}>
                    <div className="relative flex gap-8">
                      <motion.div
                        className="relative z-10 flex-shrink-0"
                        whileHover={{ scale: 1.1 }}
                        transition={{ duration: 0.2 }}
                      >
                        <div className="h-16 w-16 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 border-4 border-white dark:border-gray-900 flex items-center justify-center shadow-lg">
                          <span className="text-white font-bold text-sm">{milestone.year.slice(-2)}</span>
                        </div>
                      </motion.div>

                      <Card className="flex-1 hover:shadow-lg transition-all duration-300">
                        <CardContent className="p-6">
                          <Badge variant="outline" className="mb-3 font-mono">
                            {milestone.year}
                          </Badge>
                          <h3 className="text-xl font-bold mb-3">{milestone.title}</h3>
                          <p className="text-muted-foreground leading-relaxed">{milestone.description}</p>
                        </CardContent>
                      </Card>
                    </div>
                  </SectionReveal>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Strategic Goals */}
      <section className="py-16 md:py-24 bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-950/30 dark:to-purple-950/30">
        <div className="container px-4 md:px-6">
          <div className="grid gap-12 lg:grid-cols-2 items-center">
            <SectionReveal direction="left">
              <div>
                <Badge variant="outline" className="mb-4 text-blue-600 border-blue-200">
                  Strategic Goals
                </Badge>
                <h2 className="text-3xl md:text-4xl font-bold mb-6">Shaping the Future of Healthcare</h2>
                <p className="text-xl text-muted-foreground mb-8">
                  Our roadmap for the next decade focuses on expanding access, accelerating innovation, and empowering
                  the next generation of medical professionals.
                </p>

                <div className="space-y-6">
                  {[
                    {
                      icon: <Globe className="h-5 w-5" />,
                      title: "Expand Global Access",
                      description:
                        "Increase accessibility of cutting-edge medical research to healthcare professionals in underserved regions through digital platforms and localized content.",
                    },
                    {
                      icon: <TrendingUp className="h-5 w-5" />,
                      title: "Accelerate Innovation",
                      description:
                        "Foster interdisciplinary collaboration to develop breakthrough medical technologies and treatment approaches that address critical healthcare challenges.",
                    },
                    {
                      icon: <Users className="h-5 w-5" />,
                      title: "Empower Next Generation",
                      description:
                        "Develop comprehensive educational programs and mentorship opportunities for emerging medical researchers and healthcare professionals.",
                    },
                  ].map((goal, index) => (
                    <motion.div
                      key={goal.title}
                      className="flex gap-4"
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.5, delay: index * 0.1 }}
                    >
                      <div className="p-2 rounded-full bg-blue-100 dark:bg-blue-900/30 h-fit">
                        <div className="text-blue-600 dark:text-blue-400">{goal.icon}</div>
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold mb-2">{goal.title}</h3>
                        <p className="text-muted-foreground leading-relaxed">{goal.description}</p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </SectionReveal>

            <SectionReveal direction="right" delay={0.3}>
              <div className="relative">
                <div className="absolute -z-10 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-gradient-to-r from-blue-400/20 to-purple-400/20 rounded-full blur-3xl"></div>
                <motion.img
                  src="https://images.unsplash.com/photo-1586893079425-37b1d25e92f9?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80"
                  alt="Strategic Goals Visualization"
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
      <section className="py-16 md:py-24">
        <div className="container px-4 md:px-6">
          <SectionReveal>
            <div className="text-center max-w-3xl mx-auto">
              <h2 className="text-3xl md:text-4xl font-bold mb-6">Join Our Mission</h2>
              <p className="text-xl text-muted-foreground mb-8">
                Be part of our global community working to advance medical knowledge and improve healthcare outcomes for
                all.
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <Button
                  size="lg"
                  className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                >
                  Get Involved Today
                </Button>
                <Link to="/about">
                  <Button variant="outline" size="lg">
                    Learn More
                  </Button>
                </Link>
              </div>
            </div>
          </SectionReveal>
        </div>
      </section>
    </div>
  )
} 