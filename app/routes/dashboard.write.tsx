"use client"

import { useState, useEffect, useCallback, useMemo, useRef } from "react"
import { motion } from "framer-motion"
import { useLocation, useNavigate } from "react-router-dom"
import { Save, Eye, Send, ImageIcon, X } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card"
import { Button } from "../components/ui/button"
import { Input } from "../components/ui/input"
import { Label } from "../components/ui/label"
import { Badge } from "../components/ui/badge"
import { Textarea } from "../components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select"
import { Separator } from "../components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs"
import { Switch } from "../components/ui/switch"
import TipTapEditor, { TipTapEditorRef } from "../components/editor/tiptap-editor"
import TipTapRenderer from "../components/editor/tiptap-renderer"
import { useAuth } from "../lib/contexts/AuthContext"
import { useToast } from "../hooks/use-toast"
import { apiClient } from "../lib/utils/apiClient"

interface Article {
  _id?: string
  title: string
  description: string
  content: any
  category: string
  tags: string[]
  coverImage: string
  status: "draft" | "published"
}

export default function WriteArticlePage() {
  const { user } = useAuth()
  const location = useLocation()
  const navigate = useNavigate()
  const { toast } = useToast()
  const editorRef = useRef<TipTapEditorRef>(null)
  
  // Article state
  const [article, setArticle] = useState<Article>({
    title: "",
    description: "",
    content: { type: "doc", content: [] },
    category: "",
    tags: [],
    coverImage: "",
    status: "draft"
  })
  
  // UI state
  const [isLoading, setIsLoading] = useState(false)
  const [activeTab, setActiveTab] = useState<"write" | "preview">("write")
  const [coverImageFile, setCoverImageFile] = useState<File | null>(null)
  const [coverImagePreview, setCoverImagePreview] = useState<string>("")
  const [tagInput, setTagInput] = useState<string>("")
  
  // Derived state
  const isEditMode = useMemo(() => {
    return Boolean(article._id)
  }, [article._id])

  // Handle article field changes
  const handleChange = useCallback((field: keyof Article, value: any) => {
    setArticle(prev => ({ ...prev, [field]: value }))
  }, [])
  
  // Handle editor content change
  const handleEditorChange = useCallback((content: any) => {
    setArticle(prev => ({ ...prev, content }))
  }, [])
  
  // Handle tag input
  const handleTagInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setTagInput(e.target.value)
  }, [])
  
  // Handle adding a tag
  const handleAddTag = useCallback(() => {
    if (!tagInput.trim()) return
    
    setArticle(prev => ({
      ...prev,
      tags: [...new Set([...prev.tags, tagInput.trim()])]
    }))
    
    setTagInput("")
  }, [tagInput])
  
  // Handle removing a tag
  const handleRemoveTag = useCallback((tagToRemove: string) => {
    setArticle(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }))
  }, [])
  
  // Handle tag input key press (add tag on Enter)
  const handleTagKeyPress = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      handleAddTag()
    }
  }, [handleAddTag])
  
  // Handle cover image selection
  const handleCoverImageChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    
    // Create preview URL
    const previewUrl = URL.createObjectURL(file)
    setCoverImageFile(file)
    setCoverImagePreview(previewUrl)
    
    // We don't set the article.coverImage here - that happens on save when we upload to the server
  }, [])
  
  // Clear cover image
  const handleClearCoverImage = useCallback(() => {
    setCoverImageFile(null)
    setCoverImagePreview("")
    setArticle(prev => ({ ...prev, coverImage: "" }))
  }, [])
  
  // Check if we're editing an existing article
  useEffect(() => {
    const searchParams = new URLSearchParams(location.search)
    const editId = searchParams.get('id')
    
    if (editId) {
      setIsLoading(true)
      
      apiClient.articles.getById(editId)
        .then(response => {
          const articleData = response.article
          
          setArticle({
            _id: articleData._id,
            title: articleData.title,
            description: articleData.description || "",
            content: articleData.content,
            category: articleData.category || "",
            tags: Array.isArray(articleData.tags) ? articleData.tags : [],
            coverImage: articleData.coverImage || "",
            status: articleData.status
          })
          
          if (articleData.coverImage) {
            setCoverImagePreview(articleData.coverImage)
          }
        })
        .catch(error => {
          console.error("Error fetching article:", error)
          toast({
            title: "Error loading article",
            description: "Could not load the article for editing.",
          })
        })
        .finally(() => {
          setIsLoading(false)
        })
    }
  }, [location.search, toast])

  // Save article as draft
  const handleSaveDraft = useCallback(async () => {
    if (!article.title) {
      toast({
        title: "Title required",
        description: "Please provide a title for your article before saving.",
      })
      return
    }
    
    // Make sure we have the latest editor content
    if (editorRef.current) {
      const editorContent = editorRef.current.getJSON()
      setArticle(prev => ({ ...prev, content: { type: "doc", content: editorContent.content } }))
    }

    setIsLoading(true)
    try {
      // Prepare article data
      const articleData = {
        ...article,
        status: "draft"
      }
      
      // Upload cover image if we have a new one
      if (coverImageFile) {
        const formData = new FormData()
        formData.append('image', coverImageFile)
        
        const uploadResponse = await apiClient.uploads.articleImage(coverImageFile)
        articleData.coverImage = uploadResponse.file.url
      }
      
      // Create or update article
      let response
      if (isEditMode) {
        response = await apiClient.articles.update(article._id!, articleData)
      } else {
        response = await apiClient.articles.create(articleData)
      }
      
      // Update article state with response data
      setArticle({
        ...response,
        tags: Array.isArray(response.tags) ? response.tags : []
      })
      
      // Update URL if we created a new article
      if (!isEditMode) {
        navigate(`/dashboard/write?id=${response._id}`, { replace: true })
      }
      
      toast({
        title: "Draft saved",
        description: "Your article has been saved as a draft.",
      })
    } catch (error) {
      console.error("Error saving draft:", error)
      toast({
        title: "Error saving draft",
        description: "An error occurred while saving your draft.",
      })
    } finally {
      setIsLoading(false)
    }
  }, [article, coverImageFile, isEditMode, navigate, toast])

  // Publish article
  const handlePublish = useCallback(async () => {
    if (!article.title || !article.category) {
      toast({
        title: "Missing information",
        description: "Please provide a title and category before publishing.",
      })
      return
    }
    
    // Make sure we have the latest editor content
    if (editorRef.current) {
      const editorContent = editorRef.current.getJSON()
      setArticle(prev => ({ ...prev, content: { type: "doc", content: editorContent.content } }))
    }

    setIsLoading(true)
    try {
      // Prepare article data
      const articleData = {
        ...article,
        status: "published"
      }
      
      // Upload cover image if we have a new one
      if (coverImageFile) {
        const formData = new FormData()
        formData.append('image', coverImageFile)
        
        const uploadResponse = await apiClient.uploads.articleImage(coverImageFile)
        articleData.coverImage = uploadResponse.file.url
      }
      
      // Create or update article
      let response
      if (isEditMode) {
        response = await apiClient.articles.update(article._id!, articleData)
      } else {
        response = await apiClient.articles.create(articleData)
      }
      
      // Update article state with response data
      setArticle({
        ...response,
        tags: Array.isArray(response.tags) ? response.tags : []
      })
      
      // Navigate to articles list
      toast({
        title: "Article published!",
        description: "Your article is now live and visible to readers.",
      })
      
      // Redirect to articles page after a short delay
      setTimeout(() => {
        navigate('/dashboard/articles')
      }, 1500)
    } catch (error) {
      console.error("Error publishing:", error)
      toast({
        title: "Error publishing",
        description: "An error occurred while publishing your article.",
      })
    } finally {
      setIsLoading(false)
    }
  }, [article, coverImageFile, isEditMode, navigate, toast])

  // Toggle preview mode
  const handleTogglePreview = useCallback(() => {
    // Make sure we have the latest editor content before switching to preview
    if (activeTab === "write" && editorRef.current) {
      const editorContent = editorRef.current.getJSON()
      setArticle(prev => ({ ...prev, content: { type: "doc", content: editorContent.content } }))
    }
    
    setActiveTab(prev => prev === "write" ? "preview" : "write")
  }, [activeTab])

  // Categories list
  const categories = [
    { value: "medicine", label: "Medicine" },
    { value: "technology", label: "Technology" },
    { value: "research", label: "Research" },
    { value: "education", label: "Education" },
    { value: "news", label: "News" },
    { value: "opinion", label: "Opinion" }
  ]

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            {isEditMode ? "Edit Article" : "Write New Article"}
          </h1>
          <p className="text-muted-foreground">
            {isEditMode ? "Make changes to your article" : "Create and publish your article"}
          </p>
        </div>
        
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleTogglePreview}
            disabled={isLoading}
          >
            {activeTab === "write" ? (
              <>
                <Eye className="h-4 w-4 mr-2" />
                Preview
              </>
            ) : (
              <>
                <span className="i-lucide-edit h-4 w-4 mr-2" />
                Edit
              </>
            )}
          </Button>
          
          <Button
            variant="outline"
            size="sm"
            onClick={handleSaveDraft}
            disabled={isLoading}
          >
            <Save className="h-4 w-4 mr-2" />
            Save Draft
          </Button>
          
          <Button
            size="sm"
            onClick={handlePublish}
            disabled={isLoading}
            className="bg-gradient-to-r from-blue-600 to-blue-400 hover:from-blue-700 hover:to-blue-500"
          >
            <Send className="h-4 w-4 mr-2" />
            Publish
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-6">
        {/* Main content area */}
        <div className="col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Article Content</CardTitle>
              <CardDescription>
                Write your article content below
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as "write" | "preview")}>
                <TabsContent value="write" className="mt-0">
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="title">Title</Label>
                      <Input
                        id="title"
                        placeholder="Enter article title"
                        value={article.title}
                        onChange={(e) => handleChange("title", e.target.value)}
                        className="text-lg font-medium"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="description">Description</Label>
                      <Textarea
                        id="description"
                        placeholder="Brief description of your article (appears in previews)"
                        value={article.description}
                        onChange={(e) => handleChange("description", e.target.value)}
                        rows={3}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label>Content</Label>
                      <TipTapEditor
                        ref={editorRef}
                        initialContent={article.content}
                        onChange={handleEditorChange}
                        placeholder="Start writing your article..."
                      />
                    </div>
                  </div>
                </TabsContent>
                
                <TabsContent value="preview" className="mt-0">
                  <div className="space-y-6">
                    <div>
                      <h1 className="text-3xl font-bold mb-2">{article.title || "Untitled Article"}</h1>
                      {article.description && (
                        <p className="text-muted-foreground">{article.description}</p>
                      )}
                    </div>
                    
                    {coverImagePreview && (
                      <div className="relative w-full h-64 rounded-lg overflow-hidden">
                        <img 
                          src={coverImagePreview} 
                          alt="Cover" 
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}
                    
                    <div className="prose prose-lg dark:prose-invert max-w-none">
                      <TipTapRenderer content={article.content} />
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Publish settings */}
          <Card>
            <CardHeader>
              <CardTitle>Publish Settings</CardTitle>
              <CardDescription>
                Configure article metadata
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="category">Category</Label>
                <Select 
                  value={article.category} 
                  onValueChange={(value) => handleChange("category", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem key={category.value} value={category.value}>
                        {category.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="tags">Tags</Label>
                <div className="flex space-x-2">
                  <Input
                    id="tags"
                    placeholder="Add a tag"
                    value={tagInput}
                    onChange={handleTagInputChange}
                    onKeyPress={handleTagKeyPress}
                  />
                  <Button 
                    variant="secondary" 
                    onClick={handleAddTag}
                    type="button"
                  >
                    Add
                  </Button>
                </div>
                
                <div className="flex flex-wrap gap-2 mt-2">
                  {article.tags.map((tag) => (
                    <Badge key={tag} variant="secondary" className="flex items-center gap-1">
                      {tag}
                      <button 
                        onClick={() => handleRemoveTag(tag)}
                        className="ml-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 p-0.5"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
              </div>
              
              <Separator />
              
              <div className="space-y-2">
                <Label htmlFor="cover-image">Cover Image</Label>
                
                {coverImagePreview ? (
                  <div className="relative w-full h-40 rounded-lg overflow-hidden border">
                    <img 
                      src={coverImagePreview} 
                      alt="Cover preview" 
                      className="w-full h-full object-cover"
                    />
                    <Button
                      variant="destructive"
                      size="sm"
                      className="absolute top-2 right-2"
                      onClick={handleClearCoverImage}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ) : (
                  <div className="flex items-center justify-center w-full h-40 border-2 border-dashed rounded-lg">
                    <label className="flex flex-col items-center justify-center w-full h-full cursor-pointer">
                      <div className="flex flex-col items-center justify-center pt-5 pb-6">
                        <ImageIcon className="h-10 w-10 text-gray-400" />
                        <p className="mt-2 text-sm text-gray-500">Click to upload cover image</p>
                      </div>
                      <input 
                        type="file" 
                        className="hidden"
                        accept="image/*"
                        onChange={handleCoverImageChange}
                      />
                    </label>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
} 