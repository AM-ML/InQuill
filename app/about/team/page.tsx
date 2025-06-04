"use client"

import { motion } from "framer-motion"
import { HeroSection } from "../../components/about/hero-section"
import { StatCounter } from "../../components/about/stat-counter"
import { SectionReveal } from "../../components/about/section-reveal"
import { Button } from "../../components/ui/button"
import { Card, CardContent } from "../../components/ui/card"
import { Badge } from "../../components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../components/ui/tabs"
import { Users, Award, BookOpen, Briefcase, Linkedin, Twitter, Mail, MapPin } from "lucide-react"
import { Link } from "react-router-dom"

export default function TeamPage() {
  const leadershipTeam = [
    {
      name: "Dr. Sarah Chen",
      title: "Chief Executive Officer",
      bio: "Dr. Chen is a renowned cardiologist with over 20 years of experience in medical research and healthcare leadership. She founded InQuill with the vision of democratizing access to medical knowledge worldwide.",
      image: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80",
      location: "Stanford, CA",
      specialties: ["Cardiology", "Healthcare Leadership", "Medical Innovation"],
      socialLinks: {
        linkedin: "#",
        twitter: "#",
        email: "sarah.chen@inquill.org",
      },
    },
    {
      name: "Dr. Michael Rodriguez",
      title: "Chief Research Officer",
      bio: "Dr. Rodriguez leads our research initiatives with expertise in AI applications in medicine. Previously, he served as the Director of Research at Johns Hopkins and has published over 150 peer-reviewed papers.",
      image: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80",
      location: "Baltimore, MD",
      specialties: ["AI in Medicine", "Research Strategy", "Data Science"],
      socialLinks: {
        linkedin: "#",
        twitter: "#",
        email: "michael.rodriguez@inquill.org",
      },
    },
    {
      name: "Dr. Emily Johnson",
      title: "Chief Medical Officer",
      bio: "Dr. Johnson brings clinical expertise as a practicing neurologist and former department chair at Mayo Clinic. She ensures our research maintains clinical relevance and translates into improved patient care.",
      image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1176&q=80",
      location: "Rochester, MN",
      specialties: ["Neurology", "Clinical Research", "Patient Care"],
      socialLinks: {
        linkedin: "#",
        twitter: "#",
        email: "emily.johnson@inquill.org",
      },
    },
    {
      name: "James Wilson",
      title: "Chief Technology Officer",
      bio: "James oversees our digital platform and technological innovations. With a background in both computer science and biomedical engineering, he bridges the gap between technology and healthcare.",
      image: "https://images.unsplash.com/photo-1560250097-0b93528c311a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1374&q=80",
      location: "San Francisco, CA",
      specialties: ["Healthcare Technology", "Platform Development", "Digital Innovation"],
      socialLinks: {
        linkedin: "#",
        twitter: "#",
        email: "james.wilson@inquill.org",
      },
    },
  ]

  const advisoryBoard = [
    {
      name: "Dr. Lisa Nguyen",
      title: "Advisor - Immunology",
      bio: "Leading immunologist and former NIH director with expertise in vaccine development and autoimmune disorders. Her research has been instrumental in advancing our understanding of immune system responses.",
      image: "https://images.unsplash.com/photo-1594824476967-48c8b964273f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1374&q=80",
      location: "Bethesda, MD",
      specialties: ["Immunology", "Vaccine Development", "Public Health Policy"],
      socialLinks: {
        linkedin: "#",
        email: "lisa.nguyen@advisor.inquill.org",
      },
    },
    {
      name: "Dr. Robert Kim",
      title: "Advisor - Oncology",
      bio: "Renowned oncologist and cancer researcher with groundbreaking work in personalized cancer therapy. He has led multiple international clinical trials and published extensively on precision medicine.",
      image: "https://images.unsplash.com/photo-1622253692010-333f2da6031d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1364&q=80",
      location: "Houston, TX",
      specialties: ["Oncology", "Precision Medicine", "Clinical Trials"],
      socialLinks: {
        linkedin: "#",
        email: "robert.kim@advisor.inquill.org",
      },
    },
    {
      name: "Dr. Maria Santos",
      title: "Advisor - Global Health",
      bio: "Former WHO director with extensive experience in global health initiatives and healthcare policy. She has worked in over 50 countries to improve healthcare access and outcomes.",
      image: "https://images.unsplash.com/photo-1551836022-d5d88e9218df?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1374&q=80",
      location: "Geneva, Switzerland",
      specialties: ["Global Health", "Healthcare Policy", "International Development"],
      socialLinks: {
        linkedin: "#",
        email: "maria.santos@advisor.inquill.org",
      },
    },
    {
      name: "Dr. David Thompson",
      title: "Advisor - Digital Health",
      bio: "Pioneer in digital health technologies and telemedicine with over 15 years of industry experience. He has founded three successful health tech companies and holds multiple patents.",
      image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80",
      location: "Boston, MA",
      specialties: ["Digital Health", "Telemedicine", "Health Tech Innovation"],
      socialLinks: {
        linkedin: "#",
        email: "david.thompson@advisor.inquill.org",
      },
    },
  ]

  const researchTeam = [
    {
      name: "Dr. Anna Kowalski",
      title: "Senior Research Scientist",
      bio: "Specialist in AI applications for medical imaging with a focus on early disease detection algorithms. She has developed several breakthrough diagnostic tools currently used in clinical practice.",
      image: "https://images.unsplash.com/photo-1580489944761-15a19d654956?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1361&q=80",
      location: "Cambridge, MA",
      specialties: ["Medical Imaging", "AI Algorithms", "Computer Vision"],
      socialLinks: {
        linkedin: "#",
        email: "anna.kowalski@inquill.org",
      },
    },
    {
      name: "Dr. Ahmed Hassan",
      title: "Research Scientist - Genetics",
      bio: "Expert in genomic medicine and personalized therapy development with extensive experience in clinical trials. His work focuses on rare genetic disorders and gene therapy applications.",
      image: "https://images.unsplash.com/photo-1615813967515-e1838c1c5116?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1374&q=80",
      location: "Philadelphia, PA",
      specialties: ["Genomics", "Gene Therapy", "Rare Diseases"],
      socialLinks: {
        linkedin: "#",
        email: "ahmed.hassan@inquill.org",
      },
    },
    {
      name: "Dr. Jennifer Park",
      title: "Research Scientist - Neurology",
      bio: "Neuroscientist focused on neurodegenerative diseases and brain-computer interface technologies. She leads our research into innovative treatments for Alzheimer's and Parkinson's disease.",
      image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1376&q=80",
      location: "Seattle, WA",
      specialties: ["Neuroscience", "Brain-Computer Interfaces", "Neurodegenerative Diseases"],
      socialLinks: {
        linkedin: "#",
        email: "jennifer.park@inquill.org",
      },
    },
    {
      name: "Dr. Carlos Mendez",
      title: "Research Scientist - Cardiology",
      bio: "Cardiovascular researcher specializing in preventive cardiology and heart disease risk assessment. His predictive models have been adopted by major healthcare systems worldwide.",
      image: "https://images.unsplash.com/photo-1594824476967-48c8b964273f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1374&q=80",
      location: "Miami, FL",
      specialties: ["Preventive Cardiology", "Risk Assessment", "Predictive Modeling"],
      socialLinks: {
        linkedin: "#",
        email: "carlos.mendez@inquill.org",
      },
    },
  ]

  const TeamCard = ({ member, index = 0 }: { member: any; index?: number }) => (
    <SectionReveal delay={index * 0.1}>
      <Card className="h-full hover:shadow-lg transition-all duration-300 border-2 hover:border-blue-200 dark:hover:border-blue-800">
        <CardContent className="p-0">
          <div className="aspect-square relative overflow-hidden rounded-t-lg">
            <motion.img
              src={member.image}
              alt={member.name}
              className="object-cover w-full h-full transition-transform duration-300"
              whileHover={{ scale: 1.05 }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300">
              <div className="absolute bottom-4 left-4 right-4">
                <div className="flex space-x-2">
                  {member.socialLinks?.linkedin && (
                    <motion.a
                      href={member.socialLinks.linkedin}
                      className="p-2 bg-white/20 backdrop-blur-sm rounded-full text-white hover:bg-white/30"
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Linkedin className="h-4 w-4" />
                    </motion.a>
                  )}
                  {member.socialLinks?.twitter && (
                    <motion.a
                      href={member.socialLinks.twitter}
                      className="p-2 bg-white/20 backdrop-blur-sm rounded-full text-white hover:bg-white/30"
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Twitter className="h-4 w-4" />
                    </motion.a>
                  )}
                  {member.socialLinks?.email && (
                    <motion.a
                      href={`mailto:${member.socialLinks.email}`}
                      className="p-2 bg-white/20 backdrop-blur-sm rounded-full text-white hover:bg-white/30"
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Mail className="h-4 w-4" />
                    </motion.a>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="p-6 space-y-4">
            <div>
              <h3 className="font-bold text-xl mb-1">{member.name}</h3>
              <p className="text-sm text-blue-600 dark:text-blue-400 font-medium mb-2">{member.title}</p>
              {member.location && (
                <div className="flex items-center text-xs text-muted-foreground mb-3">
                  <MapPin className="h-3 w-3 mr-1" />
                  {member.location}
                </div>
              )}
            </div>

            <p className="text-sm text-muted-foreground leading-relaxed line-clamp-3">{member.bio}</p>

            {member.specialties && (
              <div className="flex flex-wrap gap-1">
                {member.specialties.slice(0, 2).map((specialty: string, i: number) => (
                  <Badge key={i} variant="secondary" className="text-xs">
                    {specialty}
                  </Badge>
                ))}
                {member.specialties.length > 2 && (
                  <Badge variant="outline" className="text-xs">
                    +{member.specialties.length - 2} more
                  </Badge>
                )}
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </SectionReveal>
  )

  return (
    <div className="min-h-screen">
      <HeroSection
        title="Leadership & Team"
        subtitle="Meet the dedicated professionals driving innovation in medical research and advancing healthcare knowledge worldwide through expertise, collaboration, and unwavering commitment to excellence."
        backgroundClass="bg-gradient-to-br from-purple-50 to-blue-50 dark:from-purple-950/30 dark:to-blue-950/30"
      >
        <div className="flex flex-wrap justify-center gap-4">
          <Button
            size="lg"
            className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
          >
            Join Our Team
          </Button>
          <Button variant="outline" size="lg">
            View Open Positions
          </Button>
        </div>
      </HeroSection>

      {/* Leadership Team */}
      <section className="py-16 md:py-24">
        <div className="container px-4 md:px-6">
          <SectionReveal>
            <div className="text-center max-w-4xl mx-auto mb-16">
              <Badge variant="outline" className="mb-4 text-purple-600 border-purple-200">
                Leadership
              </Badge>
              <h2 className="text-3xl md:text-4xl font-bold mb-6">Visionary Leaders Driving Change</h2>
              <p className="text-xl text-muted-foreground leading-relaxed">
                Our leadership team combines decades of medical expertise, research excellence, and technological
                innovation to guide our mission of transforming healthcare through knowledge sharing and collaboration.
              </p>
            </div>
          </SectionReveal>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            {leadershipTeam.map((member, index) => (
              <TeamCard key={member.name} member={member} index={index} />
            ))}
          </div>
        </div>
      </section>

      {/* Team Values */}
      <section className="py-16 md:py-24 bg-gray-50 dark:bg-gray-900/50">
        <div className="container px-4 md:px-6">
          <div className="grid gap-12 lg:grid-cols-2 items-center">
            <SectionReveal direction="left">
              <div>
                <Badge variant="outline" className="mb-4 text-blue-600 border-blue-200">
                  Our Values
                </Badge>
                <h2 className="text-3xl md:text-4xl font-bold mb-6">The Principles That Unite Us</h2>
                <p className="text-xl text-muted-foreground mb-8">
                  Our team is bound together by shared values that guide our work and shape our approach to medical
                  research, collaboration, and innovation.
                </p>

                <div className="space-y-6">
                  {[
                    {
                      icon: <Users className="h-5 w-5" />,
                      title: "Collaboration",
                      description:
                        "We believe in the power of interdisciplinary collaboration to solve complex healthcare challenges and advance medical knowledge through diverse perspectives.",
                      color: "blue",
                    },
                    {
                      icon: <Award className="h-5 w-5" />,
                      title: "Excellence",
                      description:
                        "We maintain the highest standards of scientific rigor and integrity in all our research and educational initiatives, ensuring quality and reliability.",
                      color: "green",
                    },
                    {
                      icon: <BookOpen className="h-5 w-5" />,
                      title: "Knowledge Sharing",
                      description:
                        "We are committed to making medical knowledge accessible to healthcare professionals worldwide, breaking down barriers to critical information.",
                      color: "purple",
                    },
                  ].map((value, index) => (
                    <motion.div
                      key={value.title}
                      className="flex gap-4"
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.5, delay: index * 0.1 }}
                    >
                      <div className={`p-2 rounded-full bg-${value.color}-50 dark:bg-${value.color}-900/30 h-fit`}>
                        <div className={`text-${value.color}-600 dark:text-${value.color}-400`}>{value.icon}</div>
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold mb-2">{value.title}</h3>
                        <p className="text-muted-foreground leading-relaxed">{value.description}</p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </SectionReveal>

            <SectionReveal direction="right" delay={0.3}>
              <div className="relative">
                <div className="absolute -z-10 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-gradient-to-r from-purple-400/20 to-blue-400/20 rounded-full blur-3xl"></div>
                <motion.img
                  src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80"
                  alt="Team Values Illustration"
                  className="rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-800"
                  whileHover={{ scale: 1.02, rotate: -1 }}
                  transition={{ duration: 0.3 }}
                />
              </div>
            </SectionReveal>
          </div>
        </div>
      </section>

      {/* Advisory Board & Research Team */}
      <section className="py-16 md:py-24">
        <div className="container px-4 md:px-6">
          <SectionReveal>
            <div className="text-center max-w-4xl mx-auto mb-16">
              <Badge variant="outline" className="mb-4 text-green-600 border-green-200">
                Our Team
              </Badge>
              <h2 className="text-3xl md:text-4xl font-bold mb-6">Experts Across Every Discipline</h2>
              <p className="text-xl text-muted-foreground">
                Explore our diverse team of advisors, researchers, and specialists working together to advance medical
                knowledge and improve healthcare outcomes globally.
              </p>
            </div>
          </SectionReveal>

          <SectionReveal delay={0.3}>
            <Tabs defaultValue="advisory" className="w-full">
              <TabsList className="grid w-full grid-cols-2 max-w-md mx-auto mb-12">
                <TabsTrigger value="advisory" className="text-sm">
                  Advisory Board
                </TabsTrigger>
                <TabsTrigger value="research" className="text-sm">
                  Research Team
                </TabsTrigger>
              </TabsList>

              <TabsContent value="advisory">
                <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
                  {advisoryBoard.map((member, index) => (
                    <TeamCard key={member.name} member={member} index={index} />
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="research">
                <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
                  {researchTeam.map((member, index) => (
                    <TeamCard key={member.name} member={member} index={index} />
                  ))}
                </div>
              </TabsContent>
            </Tabs>
          </SectionReveal>
        </div>
      </section>

      {/* Team Statistics */}
      <section className="py-16 md:py-24 bg-blue-50 dark:bg-blue-950/30">
        <div className="container px-4 md:px-6">
          <SectionReveal>
            <div className="text-center max-w-3xl mx-auto mb-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-6">Our Team by the Numbers</h2>
              <p className="text-xl text-muted-foreground">
                A diverse, global team united by our shared mission to advance medical research and improve healthcare
                outcomes.
              </p>
            </div>
          </SectionReveal>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            <StatCounter
              value="150+"
              label="Team Members"
              description="Across all departments worldwide"
              icon={<Users className="h-6 w-6" />}
              color="blue"
              delay={0.1}
            />
            <StatCounter
              value="25+"
              label="Medical Specialties"
              description="Represented in our team"
              icon={<Award className="h-6 w-6" />}
              color="green"
              delay={0.2}
            />
            <StatCounter
              value="500+"
              label="Years Combined Experience"
              description="In medical research and healthcare"
              icon={<Briefcase className="h-6 w-6" />}
              color="purple"
              delay={0.3}
            />
            <StatCounter
              value="40+"
              label="Countries Represented"
              description="In our global team"
              icon={<MapPin className="h-6 w-6" />}
              color="amber"
              delay={0.4}
            />
          </div>
        </div>
      </section>

      {/* Join Our Team */}
      <section className="py-16 md:py-24">
        <div className="container px-4 md:px-6">
          <SectionReveal>
            <div className="text-center max-w-3xl mx-auto">
              <h2 className="text-3xl md:text-4xl font-bold mb-6">Join Our Mission</h2>
              <p className="text-xl text-muted-foreground mb-8">
                We're always looking for passionate professionals to join our mission of advancing medical research and
                education. Discover opportunities to make a meaningful impact in healthcare.
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <Button
                  size="lg"
                  className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
                >
                  View Open Positions
                </Button>
                <Button variant="outline" size="lg">
                  Learn About Our Culture
                </Button>
              </div>
            </div>
          </SectionReveal>
        </div>
      </section>
    </div>
  )
} 