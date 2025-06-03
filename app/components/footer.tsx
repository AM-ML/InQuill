import { Link } from "react-router-dom"
import { Facebook, Twitter, Instagram, Linkedin, Mail } from "lucide-react"

export default function Footer() {
  return (
    <footer className="bg-slate-50 dark:bg-gray-900/50 border-t">
      <div className="container px-4 md:px-6 py-12 md:py-16">
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          <div className="space-y-4">
            <Link to="/" className="flex items-center space-x-2">
              <div className="bg-gradient-to-r from-blue-600 to-blue-400 rounded-md w-8 h-8"></div>
              <span className="font-bold text-xl">MedResearch</span>
            </Link>
            <p className="text-sm text-muted-foreground">
              Advancing medical knowledge through research, education, and collaboration.
            </p>
            <div className="flex space-x-3">
              <Link to="#" className="text-muted-foreground hover:text-primary">
                <Facebook className="h-5 w-5" />
                <span className="sr-only">Facebook</span>
              </Link>
              <Link to="#" className="text-muted-foreground hover:text-primary">
                <Twitter className="h-5 w-5" />
                <span className="sr-only">Twitter</span>
              </Link>
              <Link to="#" className="text-muted-foreground hover:text-primary">
                <Instagram className="h-5 w-5" />
                <span className="sr-only">Instagram</span>
              </Link>
              <Link to="#" className="text-muted-foreground hover:text-primary">
                <Linkedin className="h-5 w-5" />
                <span className="sr-only">LinkedIn</span>
              </Link>
            </div>
          </div>
          <div className="space-y-4">
            <h3 className="font-medium text-lg">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/articles" className="text-muted-foreground hover:text-primary">
                  Articles
                </Link>
              </li>
              <li>
                <Link to="/research" className="text-muted-foreground hover:text-primary">
                  Research
                </Link>
              </li>
              <li>
                <Link to="/journals" className="text-muted-foreground hover:text-primary">
                  Journals
                </Link>
              </li>
              <li>
                <Link to="/conferences" className="text-muted-foreground hover:text-primary">
                  Conferences
                </Link>
              </li>
              <li>
                <Link to="/resources" className="text-muted-foreground hover:text-primary">
                  Resources
                </Link>
              </li>
            </ul>
          </div>
          <div className="space-y-4">
            <h3 className="font-medium text-lg">Categories</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/categories/cardiology" className="text-muted-foreground hover:text-primary">
                  Cardiology
                </Link>
              </li>
              <li>
                <Link to="/categories/neurology" className="text-muted-foreground hover:text-primary">
                  Neurology
                </Link>
              </li>
              <li>
                <Link to="/categories/immunology" className="text-muted-foreground hover:text-primary">
                  Immunology
                </Link>
              </li>
              <li>
                <Link to="/categories/genetics" className="text-muted-foreground hover:text-primary">
                  Genetics
                </Link>
              </li>
              <li>
                <Link to="/categories/oncology" className="text-muted-foreground hover:text-primary">
                  Oncology
                </Link>
              </li>
            </ul>
          </div>
          <div className="space-y-4">
            <h3 className="font-medium text-lg">Contact</h3>
            <ul className="space-y-2 text-sm">
              <li className="flex items-start space-x-2">
                <Mail className="h-5 w-5 text-muted-foreground mt-0.5" />
                <span className="text-muted-foreground">contact@medresearch.org</span>
              </li>
            </ul>
            <div className="pt-2">
              <Link
                to="/contact"
                className="inline-flex h-9 items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 bg-gradient-to-r from-blue-600 to-blue-400 hover:from-blue-700 hover:to-blue-500"
              >
                Contact Us
              </Link>
            </div>
          </div>
        </div>
        <div className="mt-12 pt-8 border-t text-center text-sm text-muted-foreground">
          <p>© {new Date().getFullYear()} MedResearch. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}
