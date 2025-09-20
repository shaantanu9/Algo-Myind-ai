"use client"

import { useState } from "react"
import { Download, Share2, X, ImageIcon, FileText, Video, Twitter, Linkedin, Facebook, Copy, Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"

interface ExportModalProps {
  isOpen: boolean
  onClose: () => void
  algorithmId: string
  algorithmTitle: string
  currentStep: number
  animationType: "mermaid" | "flow" | "d3" | "three"
}

export function ExportModal({
  isOpen,
  onClose,
  algorithmId,
  algorithmTitle,
  currentStep,
  animationType,
}: ExportModalProps) {
  const [exportFormat, setExportFormat] = useState<"png" | "gif" | "mp4" | "pdf">("png")
  const [includeCode, setIncludeCode] = useState(true)
  const [includeExplanation, setIncludeExplanation] = useState(true)
  const [customMessage, setCustomMessage] = useState("")
  const [isExporting, setIsExporting] = useState(false)
  const [copiedLink, setCopiedLink] = useState(false)

  const shareUrl = `${typeof window !== "undefined" ? window.location.origin : ""}/algorithm/${algorithmId}?step=${currentStep}&type=${animationType}`

  const exportOptions = [
    {
      format: "png" as const,
      title: "Static Image",
      description: "High-quality PNG of current animation step",
      icon: ImageIcon,
      size: "~500KB",
    },
    {
      format: "gif" as const,
      title: "Animated GIF",
      description: "Full animation loop for social sharing",
      icon: Video,
      size: "~2MB",
    },
    {
      format: "mp4" as const,
      title: "Video (MP4)",
      description: "High-quality video with smooth transitions",
      icon: Video,
      size: "~5MB",
    },
    {
      format: "pdf" as const,
      title: "Study Guide",
      description: "Complete algorithm guide with code and explanations",
      icon: FileText,
      size: "~1MB",
    },
  ]

  const socialPlatforms = [
    {
      name: "Twitter",
      icon: Twitter,
      color: "bg-blue-500 hover:bg-blue-600",
      shareText: `Just learned ${algorithmTitle} with interactive animations! 🚀 Check out this amazing visualization:`,
    },
    {
      name: "LinkedIn",
      icon: Linkedin,
      color: "bg-blue-700 hover:bg-blue-800",
      shareText: `Mastering algorithms with interactive visualizations. Currently studying ${algorithmTitle} - the animations make complex concepts so much clearer!`,
    },
    {
      name: "Facebook",
      icon: Facebook,
      color: "bg-blue-600 hover:bg-blue-700",
      shareText: `Learning ${algorithmTitle} through interactive animations. This visualization approach makes DSA concepts so much easier to understand!`,
    },
  ]

  const handleExport = async () => {
    setIsExporting(true)

    try {
      // Simulate export process
      await new Promise((resolve) => setTimeout(resolve, 2000))

      // In a real implementation, this would:
      // 1. Capture the current animation frame/state
      // 2. Generate the requested format (PNG, GIF, MP4, PDF)
      // 3. Include additional content based on user preferences
      // 4. Trigger download

      const filename = `${algorithmId}-${animationType}-step-${currentStep + 1}.${exportFormat}`

      // Create a mock download
      const element = document.createElement("a")
      element.href = "data:text/plain;charset=utf-8," + encodeURIComponent(`Mock export: ${filename}`)
      element.download = filename
      element.style.display = "none"
      document.body.appendChild(element)
      element.click()
      document.body.removeChild(element)

      onClose()
    } catch (error) {
      console.error("Export failed:", error)
    } finally {
      setIsExporting(false)
    }
  }

  const handleSocialShare = (platform: (typeof socialPlatforms)[0]) => {
    const text = customMessage || platform.shareText
    const url = shareUrl

    let shareUrl_final = ""
    switch (platform.name) {
      case "Twitter":
        shareUrl_final = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`
        break
      case "LinkedIn":
        shareUrl_final = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}&summary=${encodeURIComponent(text)}`
        break
      case "Facebook":
        shareUrl_final = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}&quote=${encodeURIComponent(text)}`
        break
    }

    window.open(shareUrl_final, "_blank", "width=600,height=400")
  }

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl)
      setCopiedLink(true)
      setTimeout(() => setCopiedLink(false), 2000)
    } catch (error) {
      console.error("Failed to copy link:", error)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Share2 className="h-5 w-5 text-secondary" />
            Export & Share Algorithm
          </DialogTitle>
          <DialogDescription>
            Share your learning progress or export animations for presentations and social media
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="export" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="export">Export Animation</TabsTrigger>
            <TabsTrigger value="share">Share & Social</TabsTrigger>
          </TabsList>

          <TabsContent value="export" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Export Format Selection */}
              <div className="space-y-4">
                <h3 className="font-semibold text-lg">Export Format</h3>
                <div className="grid gap-3">
                  {exportOptions.map((option) => (
                    <Card
                      key={option.format}
                      className={`cursor-pointer transition-all hover:shadow-md ${
                        exportFormat === option.format ? "ring-2 ring-secondary bg-secondary/5" : ""
                      }`}
                      onClick={() => setExportFormat(option.format)}
                    >
                      <CardContent className="p-4">
                        <div className="flex items-center gap-3">
                          <option.icon className="h-5 w-5 text-secondary" />
                          <div className="flex-1">
                            <div className="font-medium">{option.title}</div>
                            <div className="text-sm text-muted-foreground">{option.description}</div>
                          </div>
                          <Badge variant="outline" className="text-xs">
                            {option.size}
                          </Badge>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>

              {/* Export Options */}
              <div className="space-y-4">
                <h3 className="font-semibold text-lg">Export Options</h3>
                <Card>
                  <CardContent className="p-4 space-y-4">
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <Label htmlFor="include-code" className="text-sm font-medium">
                          Include Code Implementation
                        </Label>
                        <Switch id="include-code" checked={includeCode} onCheckedChange={setIncludeCode} />
                      </div>
                      <div className="flex items-center justify-between">
                        <Label htmlFor="include-explanation" className="text-sm font-medium">
                          Include Step Explanations
                        </Label>
                        <Switch
                          id="include-explanation"
                          checked={includeExplanation}
                          onCheckedChange={setIncludeExplanation}
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="custom-message" className="text-sm font-medium">
                        Custom Watermark (Optional)
                      </Label>
                      <Input
                        id="custom-message"
                        placeholder="Add your name or message..."
                        value={customMessage}
                        onChange={(e) => setCustomMessage(e.target.value)}
                      />
                    </div>

                    <div className="bg-muted/30 rounded-lg p-3 text-sm">
                      <div className="font-medium mb-1">Current Export:</div>
                      <div className="text-muted-foreground">
                        {algorithmTitle} • Step {currentStep + 1} • {animationType.toUpperCase()} Animation
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Button onClick={handleExport} disabled={isExporting} className="w-full" size="lg">
                  {isExporting ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Exporting...
                    </>
                  ) : (
                    <>
                      <Download className="h-4 w-4 mr-2" />
                      Export {exportFormat.toUpperCase()}
                    </>
                  )}
                </Button>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="share" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Direct Link Sharing */}
              <div className="space-y-4">
                <h3 className="font-semibold text-lg">Direct Link</h3>
                <Card>
                  <CardContent className="p-4 space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="share-url" className="text-sm font-medium">
                        Shareable URL
                      </Label>
                      <div className="flex gap-2">
                        <Input id="share-url" value={shareUrl} readOnly className="font-mono text-sm" />
                        <Button variant="outline" size="sm" onClick={handleCopyLink}>
                          {copiedLink ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                        </Button>
                      </div>
                      {copiedLink && <p className="text-sm text-green-600">Link copied to clipboard!</p>}
                    </div>

                    <div className="bg-muted/30 rounded-lg p-3 text-sm">
                      <div className="font-medium mb-1">Link includes:</div>
                      <ul className="text-muted-foreground space-y-1">
                        <li>• Current animation step ({currentStep + 1})</li>
                        <li>• Animation type ({animationType})</li>
                        <li>• Algorithm context</li>
                      </ul>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Social Media Sharing */}
              <div className="space-y-4">
                <h3 className="font-semibold text-lg">Social Media</h3>
                <Card>
                  <CardContent className="p-4 space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="custom-share-message" className="text-sm font-medium">
                        Custom Message (Optional)
                      </Label>
                      <Textarea
                        id="custom-share-message"
                        placeholder="Add your own message to share with the link..."
                        value={customMessage}
                        onChange={(e) => setCustomMessage(e.target.value)}
                        rows={3}
                      />
                    </div>

                    <div className="space-y-2">
                      {socialPlatforms.map((platform) => (
                        <Button
                          key={platform.name}
                          variant="outline"
                          className={`w-full justify-start ${platform.color} text-white border-0`}
                          onClick={() => handleSocialShare(platform)}
                        >
                          <platform.icon className="h-4 w-4 mr-2" />
                          Share on {platform.name}
                        </Button>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* Viral Features Preview */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Viral Learning Features</CardTitle>
                <CardDescription>Help others discover algorithm learning through your shares</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                  <div className="text-center p-3 bg-muted/30 rounded-lg">
                    <div className="font-medium">Interactive Preview</div>
                    <div className="text-muted-foreground">Shared links show live animation preview</div>
                  </div>
                  <div className="text-center p-3 bg-muted/30 rounded-lg">
                    <div className="font-medium">Learning Progress</div>
                    <div className="text-muted-foreground">Track which algorithms you've mastered</div>
                  </div>
                  <div className="text-center p-3 bg-muted/30 rounded-lg">
                    <div className="font-medium">Community Impact</div>
                    <div className="text-muted-foreground">Help others discover visual learning</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <div className="flex justify-end pt-4 border-t">
          <Button variant="outline" onClick={onClose}>
            <X className="h-4 w-4 mr-2" />
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
