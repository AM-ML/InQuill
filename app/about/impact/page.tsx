"use client"

import { motion } from "framer-motion"
import { HeroSection } from "../../components/about/hero-section"
import { StatCounter } from "../../components/about/stat-counter"
import { SectionReveal } from "../../components/about/section-reveal"
import { Button } from "../../components/ui/button"
import { Card, CardContent } from "../../components/ui/card"
import { Badge } from "../../components/ui/badge"
import { Progress } from "../../components/ui/progress"
import { 
  Globe, 
  BookOpen, 
  Users, 
  Heart, 
  Stethoscope, 
  Brain, 
  Dna, 
  Microscope, 
  BarChart3, 
  TrendingUp 
} from "lucide-react"
import { Link } from "react-router-dom"

export default function ImpactPage() {
  const impactAreas = [
    {
      specialty: "Cardiology",
      publications: "2,450+",
      citations: "42,000+",
      icon: <Heart className="h-6 w-6" />,
      color: "red" as const,
      description:
        "Pioneering research in heart disease prevention, treatment innovations, and cardiac imaging technologies.",
      improvement: 35,
    },
    {
      specialty: "Neurology",
      publications: "1,870+",
      citations: "38,500+",
      icon: <Brain className="h-6 w-6" />,
      color: "purple" as const,
      description: "Groundbreaking studies in neurological disorders, brain imaging, and cognitive function research.",
      improvement: 42,
    },
    {
      specialty: "Oncology",
      publications: "3,120+",
      citations: "56,700+",
      icon: <Microscope className="h-6 w-6" />,
      color: "amber" as const,
      description:
        "Transformative cancer research spanning early detection methods, targeted therapies, and immunotherapy.",
      improvement: 28,
    },
    {
      specialty: "Immunology",
      publications: "1,650+",
      citations: "29,300+",
      icon: <Stethoscope className="h-6 w-6" />,
      color: "blue" as const,
      description: "Innovative research in autoimmune disorders, vaccine development, and immune system modulation.",
      improvement: 31,
    },
    {
      specialty: "Genetics",
      publications: "1,920+",
      citations: "33,800+",
      icon: <Dna className="h-6 w-6" />,
      color: "green" as const,
      description: "Cutting-edge genetic research, gene therapy developments, and personalized medicine approaches.",
      improvement: 45,
    },
    {
      specialty: "Public Health",
      publications: "2,280+",
      citations: "41,200+",
      icon: <Globe className="h-6 w-6" />,
      color: "blue" as const,
      description:
        "Impactful research on global health challenges, disease prevention, and healthcare system optimization.",
      improvement: 38,
    },
  ]

  const healthcareOutcomes = [
    {
      metric: "Reduced Treatment Time",
      improvement: 35,
      description: "Research-backed protocols have reduced average treatment times across participating hospitals.",
      color: "green",
    },
    {
      metric: "Improved Diagnostic Accuracy",
      improvement: 42,
      description: "AI-assisted diagnostic tools developed through our research have significantly improved accuracy.",
      color: "blue",
    },
    {
      metric: "Patient Recovery Rates",
      improvement: 28,
      description:
        "Evidence-based treatment protocols have improved patient recovery rates across multiple specialties.",
      color: "purple",
    },
  ]

  return (
    <div className="min-h-screen">
      <HeroSection
        title="Research Impact"
        subtitle="Measuring our contribution to advancing medical knowledge and improving healthcare outcomes worldwide through data-driven research and global collaboration."
        backgroundClass="bg-gradient-to-br from-green-50 to-blue-50 dark:from-green-950/30 dark:to-blue-950/30"
      >
        <div className="flex flex-wrap justify-center gap-4">
          <Button
            size="lg"
            className="bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700"
          >
            View Impact Reports
          </Button>
          <Button variant="outline" size="lg">
            Download Data
          </Button>
        </div>
      </HeroSection>

      {/* Global Reach */}
      <section className="py-16 md:py-24">
        <div className="container px-4 md:px-6">
          <SectionReveal>
            <div className="text-center max-w-4xl mx-auto mb-16">
              <Badge variant="outline" className="mb-4 text-green-600 border-green-200">
                Global Reach
              </Badge>
              <h2 className="text-3xl md:text-4xl font-bold mb-6">Worldwide Healthcare Transformation</h2>
              <p className="text-xl text-muted-foreground leading-relaxed">
                Our research and educational resources reach healthcare professionals across the globe, making a
                measurable difference in patient care and medical outcomes in every continent.
              </p>
            </div>
          </SectionReveal>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            <StatCounter
              value="190+"
              label="Countries Reached"
              description="Global healthcare impact"
              icon={<Globe className="h-6 w-6" />}
              color="blue"
              delay={0.1}
            />
            <StatCounter
              value="5.2M+"
              label="Healthcare Professionals"
              description="Actively using our platform"
              icon={<Users className="h-6 w-6" />}
              color="green"
              delay={0.2}
            />
            <StatCounter
              value="12,000+"
              label="Research Publications"
              description="Peer-reviewed articles"
              icon={<BookOpen className="h-6 w-6" />}
              color="purple"
              delay={0.3}
            />
            <StatCounter
              value="850+"
              label="Institutional Partners"
              description="Leading medical centers"
              icon={<Microscope className="h-6 w-6" />}
              color="amber"
              delay={0.4}
            />
          </div>
        </div>
      </section>

      {/* Research Breakthroughs */}
      <section className="py-16 md:py-24 bg-gray-50 dark:bg-gray-900/50">
        <div className="container px-4 md:px-6">
          <div className="grid gap-12 lg:grid-cols-2 items-center">
            <SectionReveal direction="left">
              <div>
                <Badge variant="outline" className="mb-4 text-blue-600 border-blue-200">
                  Research Breakthroughs
                </Badge>
                <h2 className="text-3xl md:text-4xl font-bold mb-6">Transforming Medical Practice</h2>
                <p className="text-xl text-muted-foreground mb-8">
                  Our platform has facilitated groundbreaking discoveries that have transformed medical practice and
                  significantly improved patient care outcomes worldwide.
                </p>

                <div className="space-y-6">
                  {[
                    {
                      icon: <Heart className="h-5 w-5" />,
                      title: "Cardiovascular Innovations",
                      description:
                        "Supported research leading to novel diagnostic tools for early detection of heart disease, reducing mortality rates by 23% in participating hospitals.",
                      color: "red",
                    },
                    {
                      icon: <Brain className="h-5 w-5" />,
                      title: "Neurological Advancements",
                      description:
                        "Facilitated collaborative research that identified new biomarkers for early Alzheimer's detection, enabling intervention before significant cognitive decline.",
                      color: "purple",
                    },
                    {
                      icon: <Dna className="h-5 w-5" />,
                      title: "Genetic Medicine",
                      description:
                        "Supported pioneering gene therapy research that has led to treatments for previously incurable genetic disorders, transforming patient outcomes.",
                      color: "green",
                    },
                  ].map((breakthrough, index) => (
                    <motion.div
                      key={breakthrough.title}
                      className="flex gap-4"
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.5, delay: index * 0.1 }}
                    >
                      <div
                        className={`p-2 rounded-full bg-${breakthrough.color}-50 dark:bg-${breakthrough.color}-900/30 h-fit`}
                      >
                        <div className={`text-${breakthrough.color}-600 dark:text-${breakthrough.color}-400`}>
                          {breakthrough.icon}
                        </div>
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold mb-2">{breakthrough.title}</h3>
                        <p className="text-muted-foreground leading-relaxed">{breakthrough.description}</p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </SectionReveal>

            <SectionReveal direction="right" delay={0.3}>
              <div className="relative">
                <div className="absolute -z-10 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-gradient-to-r from-green-400/20 to-blue-400/20 rounded-full blur-3xl"></div>
                <motion.img
                  src="https://images.unsplash.com/photo-1532938911079-1b06ac7ceec7?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1332&q=80"
                  alt="Medical Research Breakthroughs"
                  className="rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-800"
                  whileHover={{ scale: 1.02, rotate: -1 }}
                  transition={{ duration: 0.3 }}
                />
              </div>
            </SectionReveal>
          </div>
        </div>
      </section>

      {/* Impact by Specialty */}
      <section className="py-16 md:py-24">
        <div className="container px-4 md:px-6">
          <SectionReveal>
            <div className="text-center max-w-4xl mx-auto mb-16">
              <Badge variant="outline" className="mb-4 text-purple-600 border-purple-200">
                Impact by Specialty
              </Badge>
              <h2 className="text-3xl md:text-4xl font-bold mb-6">Advancing Every Medical Field</h2>
              <p className="text-xl text-muted-foreground">
                Our research has made significant contributions across various medical specialties, driving innovation
                and improving outcomes in each field.
              </p>
            </div>
          </SectionReveal>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {impactAreas.map((area, index) => (
              <SectionReveal key={area.specialty} delay={index * 0.1}>
                <Card className="h-full hover:shadow-lg transition-all duration-300 border-2 hover:border-blue-200 dark:hover:border-blue-800">
                  <CardContent className="p-6">
                    <div className={`p-3 rounded-full bg-${area.color}-50 dark:bg-${area.color}-900/30 w-fit mb-4`}>
                      <div className={`text-${area.color}-600 dark:text-${area.color}-400`}>{area.icon}</div>
                    </div>
                    <h3 className="text-xl font-bold mb-2">{area.specialty}</h3>
                    <p className="text-muted-foreground mb-4 text-sm leading-relaxed">{area.description}</p>

                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <div>
                          <p className={`text-lg font-bold text-${area.color}-600 dark:text-${area.color}-400`}>
                            {area.publications}
                          </p>
                          <p className="text-xs text-muted-foreground">Publications</p>
                        </div>
                        <div>
                          <p className={`text-lg font-bold text-${area.color}-600 dark:text-${area.color}-400`}>
                            {area.citations}
                          </p>
                          <p className="text-xs text-muted-foreground">Citations</p>
                        </div>
                      </div>

                      <div>
                        <div className="flex justify-between items-center mb-1">
                          <span className="text-sm font-medium">Patient Outcome Improvement</span>
                          <Badge variant="secondary">+{area.improvement}%</Badge>
                        </div>
                        <Progress value={area.improvement} className="h-2" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </SectionReveal>
            ))}
          </div>
        </div>
      </section>

      {/* Healthcare Outcomes */}
      <section className="py-16 md:py-24 bg-blue-50 dark:bg-blue-950/30">
        <div className="container px-4 md:px-6">
          <div className="grid gap-12 lg:grid-cols-2 items-center">
            <SectionReveal direction="right">
              <div className="relative">
                <div className="absolute -z-10 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-gradient-to-r from-blue-400/20 to-purple-400/20 rounded-full blur-3xl"></div>
                <motion.img
                  src="https://images.unsplash.com/photo-1576091160550-2173dba999ef?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80"
                  alt="Healthcare Outcomes Visualization"
                  className="rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-800"
                  whileHover={{ scale: 1.02, rotate: 1 }}
                  transition={{ duration: 0.3 }}
                />
              </div>
            </SectionReveal>

            <SectionReveal direction="left" delay={0.2}>
              <div>
                <Badge variant="outline" className="mb-4 text-blue-600 border-blue-200">
                  Healthcare Outcomes
                </Badge>
                <h2 className="text-3xl md:text-4xl font-bold mb-6">Measurable Patient Impact</h2>
                <p className="text-xl text-muted-foreground mb-8">
                  Our research has directly contributed to improved patient care and healthcare outcomes worldwide, with
                  measurable improvements across key metrics.
                </p>

                <div className="space-y-6">
                  {healthcareOutcomes.map((outcome, index) => (
                    <motion.div
                      key={outcome.metric}
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.5, delay: index * 0.1 }}
                    >
                      <div className="flex justify-between items-center mb-2">
                        <h3 className="font-semibold">{outcome.metric}</h3>
                        <Badge
                          className={`bg-${outcome.color}-100 text-${outcome.color}-800 dark:bg-${outcome.color}-900/30 dark:text-${outcome.color}-400`}
                        >
                          +{outcome.improvement}%
                        </Badge>
                      </div>
                      <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                        <motion.div
                          className={`h-full bg-gradient-to-r from-${outcome.color}-600 to-${outcome.color}-400`}
                          initial={{ width: 0 }}
                          whileInView={{ width: `${outcome.improvement + 20}%` }}
                          viewport={{ once: true }}
                          transition={{ duration: 1, delay: 0.5 + index * 0.1 }}
                        />
                      </div>
                      <p className="text-sm text-muted-foreground mt-2 leading-relaxed">{outcome.description}</p>
                    </motion.div>
                  ))}
                </div>
              </div>
            </SectionReveal>
          </div>
        </div>
      </section>

      {/* Research Growth */}
      <section className="py-16 md:py-24">
        <div className="container px-4 md:px-6">
          <SectionReveal>
            <div className="text-center max-w-4xl mx-auto mb-16">
              <Badge variant="outline" className="mb-4 text-amber-600 border-amber-200">
                Research Growth
              </Badge>
              <h2 className="text-3xl md:text-4xl font-bold mb-6">Accelerating Medical Discovery</h2>
              <p className="text-xl text-muted-foreground">
                Our platform continues to expand its impact on medical research and healthcare innovation, with
                exponential growth in research output and global reach.
              </p>
            </div>
          </SectionReveal>

          <SectionReveal delay={0.3}>
            <Card className="max-w-4xl mx-auto">
              <CardContent className="p-8">
                <div className="flex items-center justify-center mb-8">
                  <motion.div whileHover={{ scale: 1.1, rotate: 5 }} transition={{ duration: 0.2 }}>
                    <BarChart3 className="h-12 w-12 text-blue-600 dark:text-blue-400" />
                  </motion.div>
                </div>

                <div className="h-64 bg-gray-100 dark:bg-gray-800 rounded-lg flex items-end justify-around p-6">
                  {[
                    { year: 2020, value: 35, publications: 4200 },
                    { year: 2021, value: 48, publications: 5760 },
                    { year: 2022, value: 62, publications: 7440 },
                    { year: 2023, value: 75, publications: 9000 },
                    { year: 2024, value: 89, publications: 10680 },
                    { year: 2025, value: 95, publications: 11400 },
                  ].map((data, index) => (
                    <motion.div
                      key={data.year}
                      className="w-12 bg-gradient-to-t from-blue-600 to-blue-400 rounded-t-md relative group cursor-pointer"
                      initial={{ height: 0 }}
                      whileInView={{ height: `${data.value}%` }}
                      viewport={{ once: true }}
                      transition={{ duration: 1, delay: index * 0.1 }}
                      whileHover={{ scale: 1.05 }}
                    >
                      <div className="absolute -top-12 left-1/2 -translate-x-1/2 bg-blue-600 text-white text-xs py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                        {data.publications}+ publications
                      </div>
                    </motion.div>
                  ))}
                </div>

                <div className="flex justify-around mt-4">
                  {[2020, 2021, 2022, 2023, 2024, 2025].map((year) => (
                    <div key={year} className="text-sm text-muted-foreground font-medium">
                      {year}
                    </div>
                  ))}
                </div>

                <p className="text-center text-muted-foreground mt-6">
                  Annual growth in research publications facilitated through our platform
                </p>
              </CardContent>
            </Card>
          </SectionReveal>
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
                <TrendingUp className="h-12 w-12" />
              </motion.div>
              <h2 className="text-3xl md:text-4xl font-bold mb-6">Be Part of Our Impact</h2>
              <p className="text-xl mb-8 text-blue-100">
                Join thousands of healthcare professionals and researchers who are using our platform to advance medical
                knowledge and improve patient outcomes worldwide.
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <Button size="lg" variant="secondary">
                  Join Our Platform
                </Button>
                <Button
                  variant="outline"
                  size="lg"
                  className="border-white text-white hover:bg-white hover:text-blue-600"
                >
                  View Research Data
                </Button>
              </div>
            </div>
          </SectionReveal>
        </div>
      </section>
    </div>
  )
} 