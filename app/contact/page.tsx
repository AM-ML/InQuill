"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Button } from "../components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card"
import { Input } from "../components/ui/input"
import { Label } from "../components/ui/label"
import { Textarea } from "../components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select"
import { Alert, AlertDescription } from "../components/ui/alert"
import { Badge } from "../components/ui/badge"
import { Separator } from "../components/ui/separator"
import {
  Phone,
  Mail,
  MapPin,
  Clock,
  Send,
  CheckCircle,
  Building,
  Globe,
  MessageSquare,
  Users,
  Calendar,
} from "lucide-react"
import { Link } from "react-router-dom"
import { useToast } from "../hooks/use-toast"

const contactFormSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  phone: z.string().optional(),
  subject: z.string().min(1, "Please select a subject"),
  message: z.string().min(10, "Message must be at least 10 characters"),
  organization: z.string().optional(),
})

type ContactFormData = z.infer<typeof contactFormSchema>

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: "easeOut",
    },
  },
}

export default function ContactPage() {
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { toast } = useToast()

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
    reset,
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactFormSchema),
  })

  const onSubmit = async (data: ContactFormData) => {
    setIsSubmitting(true)

    try {
      // Call the API endpoint
      const response = await fetch(`${import.meta.env.VITE_API_URL || ''}/api/contact`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
        credentials: 'include'
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.message || 'Failed to send message')
      }

      // Show success message
      setIsSubmitted(true)
      reset()
    } catch (error) {
      console.error('Error submitting form:', error)
      // Show error toast
      toast({
        title: "Message not sent",
        description: error instanceof Error ? error.message : "Failed to send your message. Please try again later.",
        type: "error"
      })
    } finally {
      setIsSubmitting(false)
    }

    // Hide success message after 5 seconds
    setTimeout(() => setIsSubmitted(false), 5000)
  }

  const contactInfo = [
    {
      icon: Phone,
      title: "Phone",
      value: "+1 (555) 123-4567",
      description: "Mon-Fri, 9AM-6PM EST",
      action: "tel:+15551234567",
    },
    {
      icon: Mail,
      title: "Email",
      value: "contact@inquill.org",
      description: "We'll respond within 24 hours",
      action: "mailto:contact@inquill.org",
    },
    {
      icon: MapPin,
      title: "Address",
      value: "123 Research Drive, Medical District",
      description: "Boston, MA 02115, USA",
      action: "#map-section",
    },
    {
      icon: Clock,
      title: "Office Hours",
      value: "Monday - Friday",
      description: "9:00 AM - 6:00 PM EST",
      action: null,
    },
  ]

  const departments = [
    {
      name: "General Inquiries",
      email: "info@inquill.org",
      description: "Questions about our research and services",
    },
    {
      name: "Research Collaboration",
      email: "research@inquill.org",
      description: "Partnership and collaboration opportunities",
    },
    {
      name: "Media & Press",
      email: "press@inquill.org",
      description: "Media inquiries and press releases",
    },
    {
      name: "Careers",
      email: "careers@inquill.org",
      description: "Job opportunities and applications",
    },
  ]

  const faqs = [
    {
      question: "How quickly will I receive a response?",
      answer:
        "We typically respond to all inquiries within 24 hours during business days. For urgent matters, please call our main phone line.",
    },
    {
      question: "Can I schedule a meeting or consultation?",
      answer:
        "Yes! Please mention your preferred meeting times in your message, and we'll coordinate with our team to find a suitable time.",
    },
    {
      question: "Do you accept research proposals?",
      answer:
        "We welcome research collaboration proposals. Please use the 'Research Collaboration' subject and include detailed information about your proposal.",
    },
    {
      question: "How can I stay updated on your latest research?",
      answer:
        "Subscribe to our newsletter on the homepage, follow our social media channels, or check our Articles section for the latest publications.",
    },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50/50 via-white to-indigo-50/30 dark:from-gray-900 dark:via-gray-900 dark:to-blue-950/20">
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="container mx-auto px-4 py-12"
      >
        {/* Hero Section */}
        <motion.div variants={itemVariants} className="text-center mb-16">
          <motion.h1
            className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-blue-600 via-purple-600 to-blue-800 bg-clip-text text-transparent"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            Get in Touch
          </motion.h1>
          <motion.p
            className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            Have questions about our research? Want to collaborate? We'd love to hear from you. Our team is here to help
            advance medical knowledge together.
          </motion.p>
        </motion.div>

        {/* Success Message */}
        {isSubmitted && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="mb-8"
          >
            <Alert className="border-green-200 bg-green-50 dark:bg-green-950/20 dark:border-green-800">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <AlertDescription className="text-green-800 dark:text-green-200">
                Thank you for your message! We've received your inquiry and will respond within 24 hours.
              </AlertDescription>
            </Alert>
          </motion.div>
        )}

        <div className="grid lg:grid-cols-3 gap-12">
          {/* Contact Form */}
          <motion.div variants={itemVariants} className="lg:col-span-2">
            <Card className="shadow-xl border-0 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm">
              <CardHeader className="pb-8">
                <CardTitle className="text-2xl flex items-center gap-2">
                  <MessageSquare className="h-6 w-6 text-blue-600" />
                  Send us a Message
                </CardTitle>
                <CardDescription className="text-base">
                  Fill out the form below and we'll get back to you as soon as possible.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="name">Full Name *</Label>
                      <Input id="name" {...register("name")} placeholder="Enter your full name" className="h-11" />
                      {errors.name && <p className="text-sm text-red-600">{errors.name.message}</p>}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email Address *</Label>
                      <Input
                        id="email"
                        type="email"
                        {...register("email")}
                        placeholder="Enter your email address"
                        className="h-11"
                      />
                      {errors.email && <p className="text-sm text-red-600">{errors.email.message}</p>}
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone Number</Label>
                      <Input id="phone" {...register("phone")} placeholder="Enter your phone number" className="h-11" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="organization">Organization</Label>
                      <Input
                        id="organization"
                        {...register("organization")}
                        placeholder="Your organization or institution"
                        className="h-11"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="subject">Subject *</Label>
                    <Select onValueChange={(value) => setValue("subject", value)}>
                      <SelectTrigger className="h-11">
                        <SelectValue placeholder="Select a subject" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="general">General Inquiry</SelectItem>
                        <SelectItem value="research">Research Collaboration</SelectItem>
                        <SelectItem value="partnership">Partnership Opportunity</SelectItem>
                        <SelectItem value="media">Media & Press</SelectItem>
                        <SelectItem value="careers">Career Opportunities</SelectItem>
                        <SelectItem value="technical">Technical Support</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                    {errors.subject && <p className="text-sm text-red-600">{errors.subject.message}</p>}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="message">Message *</Label>
                    <Textarea
                      id="message"
                      {...register("message")}
                      placeholder="Please provide details about your inquiry..."
                      className="min-h-[120px] resize-none"
                    />
                    {errors.message && <p className="text-sm text-red-600">{errors.message.message}</p>}
                  </div>

                  <Button type="submit" className="w-full h-12 text-base font-medium" disabled={isSubmitting}>
                    {isSubmitting ? (
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        Sending Message...
                      </div>
                    ) : (
                      <div className="flex items-center gap-2">
                        <Send className="h-4 w-4" />
                        Send Message
                      </div>
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </motion.div>

          {/* Contact Information */}
          <motion.div variants={itemVariants} className="space-y-8">
            {/* Contact Cards */}
            <div className="space-y-4">
              {contactInfo.map((info, index) => (
                <motion.div
                  key={info.title}
                  variants={itemVariants}
                  whileHover={{ scale: 1.02 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <Card className="p-4 hover:shadow-lg transition-all duration-300 border-0 bg-white/60 dark:bg-gray-900/60 backdrop-blur-sm">
                    <div className="flex items-start gap-4">
                      <div className="p-2 rounded-lg bg-blue-100 dark:bg-blue-900/30">
                        <info.icon className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-sm text-muted-foreground">{info.title}</h3>
                        {info.action ? (
                          <a
                            href={info.action}
                            className="font-medium text-foreground hover:text-blue-600 transition-colors"
                          >
                            {info.value}
                          </a>
                        ) : (
                          <p className="font-medium text-foreground">{info.value}</p>
                        )}
                        <p className="text-sm text-muted-foreground mt-1">{info.description}</p>
                      </div>
                    </div>
                  </Card>
                </motion.div>
              ))}
            </div>

            {/* Department Contacts */}
            <Card className="p-6 border-0 bg-white/60 dark:bg-gray-900/60 backdrop-blur-sm">
              <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
                <Building className="h-5 w-5 text-blue-600" />
                Department Contacts
              </h3>
              <div className="space-y-4">
                {departments.map((dept, index) => (
                  <div key={dept.name} className="space-y-1">
                    <div className="flex items-center justify-between">
                      <h4 className="font-medium text-sm">{dept.name}</h4>
                      <Badge variant="outline" className="text-xs">
                        <Mail className="h-3 w-3 mr-1" />
                        Email
                      </Badge>
                    </div>
                    <a
                      href={`mailto:${dept.email}`}
                      className="text-sm text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 transition-colors"
                    >
                      {dept.email}
                    </a>
                    <p className="text-xs text-muted-foreground">{dept.description}</p>
                    {index < departments.length - 1 && <Separator className="mt-3" />}
                  </div>
                ))}
              </div>
            </Card>
          </motion.div>
        </div>

        {/* Map Section */}
        <motion.div variants={itemVariants} className="mt-16" id="map-section">
          <Card className="overflow-hidden border-0 shadow-xl">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl flex items-center justify-center gap-2">
                <MapPin className="h-6 w-6 text-blue-600" />
                Visit Our Location
              </CardTitle>
              <CardDescription>Find us in the heart of Boston's Medical District</CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              <div className="relative h-96 bg-gradient-to-br from-blue-100 to-indigo-100 dark:from-blue-900/20 dark:to-indigo-900/20">
                {/* Map Placeholder */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center space-y-4">
                    <div className="w-16 h-16 mx-auto bg-blue-600 rounded-full flex items-center justify-center">
                      <MapPin className="h-8 w-8 text-white" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg">InQuill Headquarters</h3>
                      <p className="text-muted-foreground">123 Research Drive, Medical District</p>
                      <p className="text-muted-foreground">Boston, MA 02115, USA</p>
                    </div>
                    <Button variant="outline" className="mt-4">
                      <Globe className="h-4 w-4 mr-2" />
                      View on Google Maps
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* FAQ Section */}
        <motion.div variants={itemVariants} className="mt-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Frequently Asked Questions</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Quick answers to common questions about contacting us and our services.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {faqs.map((faq, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                whileHover={{ scale: 1.02 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <Card className="h-full p-6 hover:shadow-lg transition-all duration-300 border-0 bg-white/60 dark:bg-gray-900/60 backdrop-blur-sm">
                  <h3 className="font-semibold text-lg mb-3 text-blue-900 dark:text-blue-100">{faq.question}</h3>
                  <p className="text-muted-foreground leading-relaxed">{faq.answer}</p>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Call to Action */}
        <motion.div variants={itemVariants} className="mt-16 text-center">
          <Card className="p-8 border-0 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
            <h2 className="text-2xl font-bold mb-4">Ready to Collaborate?</h2>
            <p className="text-blue-100 mb-6 max-w-2xl mx-auto">
              Join our network of researchers, institutions, and healthcare professionals working together to advance
              medical knowledge and improve patient outcomes.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button variant="secondary" size="lg" className="font-medium">
                <Users className="h-4 w-4 mr-2" />
                Learn About Partnerships
              </Button>
              <Button variant="outline" size="lg" className="bg-white/10 border-white/20 text-white hover:bg-white/20">
                <Calendar className="h-4 w-4 mr-2" />
                Schedule a Meeting
              </Button>
            </div>
          </Card>
        </motion.div>
      </motion.div>
    </div>
  )
} 