import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import Link from "next/link"
import { IconArrowLeft, IconDownload } from "@tabler/icons-react"

export default function CaseStudiesGuidePage() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">How to Write Case Studies</h1>
          <p className="text-muted-foreground">A complete guide to creating compelling case studies</p>
        </div>
        <div className="flex gap-2">
          <Link href="/api/case-studies/download-template">
            <Button variant="outline">
              <IconDownload className="h-4 w-4 mr-2" />
              Download Template
            </Button>
          </Link>
          <Link href="/protected/case-studies">
            <Button variant="ghost">
              <IconArrowLeft className="h-4 w-4 mr-2" />
              Back to List
            </Button>
          </Link>
        </div>
      </div>

      <div className="space-y-8">
        {/* Overview */}
        <Card>
          <CardHeader>
            <CardTitle>Overview</CardTitle>
            <CardDescription>What goes where: Form vs MDX</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h4 className="font-semibold mb-2">✏️ Form Fields (Metadata)</h4>
              <p className="text-sm text-muted-foreground mb-2">
                These fields are used for filtering, SEO, and layout on the listing page:
              </p>
              <ul className="list-disc list-inside text-sm space-y-1 text-muted-foreground">
                <li>Title, slug, summary</li>
                <li>Subject, industry, role, timeline</li>
                <li>Tags, skills, tech stack</li>
                <li>Links, metrics, results</li>
                <li>Cover image and gallery</li>
              </ul>
            </div>
            <Separator />
            <div>
              <h4 className="font-semibold mb-2">📝 MDX Content (Narrative)</h4>
              <p className="text-sm text-muted-foreground mb-2">
                The MDX body contains your complete story and detailed analysis:
              </p>
              <ul className="list-disc list-inside text-sm space-y-1 text-muted-foreground">
                <li>Introduction and context</li>
                <li>Problem statement and goals</li>
                <li>Approach and methodology</li>
                <li>Challenges and tradeoffs</li>
                <li>Detailed results and insights</li>
                <li>Key takeaways and next steps</li>
              </ul>
            </div>
          </CardContent>
        </Card>

        {/* MDX Template Structure */}
        <Card>
          <CardHeader>
            <CardTitle>MDX Template Structure</CardTitle>
            <CardDescription>Recommended sections for your case study</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <h4 className="font-semibold mb-2">1. Overview</h4>
              <p className="text-sm text-muted-foreground">
                Start with a compelling introduction. What is this case study about? Why should readers care?
              </p>
            </div>

            <div>
              <h4 className="font-semibold mb-2">2. Context</h4>
              <p className="text-sm text-muted-foreground">
                Provide background information. What was the situation? What prompted this work?
              </p>
            </div>

            <div>
              <h4 className="font-semibold mb-2">3. Problem & Goals</h4>
              <p className="text-sm text-muted-foreground">
                Clearly articulate the problem and what you were trying to achieve. Include specific goals.
              </p>
            </div>

            <div>
              <h4 className="font-semibold mb-2">4. Approach</h4>
              <p className="text-sm text-muted-foreground">
                Describe your methodology, process, and key activities. What did you actually do?
              </p>
            </div>

            <div>
              <h4 className="font-semibold mb-2">5. Challenges and Tradeoffs</h4>
              <p className="text-sm text-muted-foreground">
                Be honest about obstacles faced and decisions made. What did you optimize for? What did you sacrifice?
              </p>
            </div>

            <div>
              <h4 className="font-semibold mb-2">6. Results</h4>
              <p className="text-sm text-muted-foreground">
                Share outcomes, both quantitative and qualitative. What worked? What didn't?
              </p>
            </div>

            <div>
              <h4 className="font-semibold mb-2">7. Key Takeaways</h4>
              <p className="text-sm text-muted-foreground">
                Summarize the most important lessons learned and insights gained.
              </p>
            </div>

            <div>
              <h4 className="font-semibold mb-2">8. Next Steps</h4>
              <p className="text-sm text-muted-foreground">
                Optional: What happens next? What would you do differently? Include a call to action.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Writing Tips */}
        <Card>
          <CardHeader>
            <CardTitle>Writing Tips</CardTitle>
            <CardDescription>Best practices for compelling case studies</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold mb-2">✅ Do</h4>
                <ul className="text-sm space-y-2 text-muted-foreground">
                  <li>• Be specific with numbers and examples</li>
                  <li>• Show your process, not just results</li>
                  <li>• Include failures and what you learned</li>
                  <li>• Use visuals (screenshots, diagrams)</li>
                  <li>• Tell a story with clear structure</li>
                  <li>• Make it skimmable with headers</li>
                  <li>• Be honest about limitations</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-2">❌ Don't</h4>
                <ul className="text-sm space-y-2 text-muted-foreground">
                  <li>• Use vague descriptions</li>
                  <li>• Only focus on successes</li>
                  <li>• Write walls of text</li>
                  <li>• Skip the problem definition</li>
                  <li>• Ignore the process</li>
                  <li>• Make unsupported claims</li>
                  <li>• Forget the audience</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* MDX Formatting */}
        <Card>
          <CardHeader>
            <CardTitle>MDX Formatting Guide</CardTitle>
            <CardDescription>How to format your content</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h4 className="font-semibold mb-2">Headers</h4>
              <pre className="bg-muted p-3 rounded text-sm">
                {`# Main Title
## Section Header
### Subsection`}
              </pre>
            </div>

            <div>
              <h4 className="font-semibold mb-2">Lists</h4>
              <pre className="bg-muted p-3 rounded text-sm">
                {`- Bullet point
- Another point

1. Numbered item
2. Another item`}
              </pre>
            </div>

            <div>
              <h4 className="font-semibold mb-2">Emphasis</h4>
              <pre className="bg-muted p-3 rounded text-sm">
                {`**Bold text**
*Italic text*
> Blockquote or important callout`}
              </pre>
            </div>

            <div>
              <h4 className="font-semibold mb-2">Code</h4>
              <pre className="bg-muted p-3 rounded text-sm">
                {`\`inline code\`

\`\`\`javascript
// Code block
const example = "with syntax highlighting";
\`\`\``}
              </pre>
            </div>

            <div>
              <h4 className="font-semibold mb-2">Images</h4>
              <pre className="bg-muted p-3 rounded text-sm">
                {`![Alt text](https://example.com/image.jpg)`}
              </pre>
            </div>

            <div>
              <h4 className="font-semibold mb-2">Links</h4>
              <pre className="bg-muted p-3 rounded text-sm">
                {`[Link text](https://example.com)`}
              </pre>
            </div>
          </CardContent>
        </Card>

        {/* Workflow */}
        <Card>
          <CardHeader>
            <CardTitle>Recommended Workflow</CardTitle>
            <CardDescription>Step-by-step process</CardDescription>
          </CardHeader>
          <CardContent>
            <ol className="space-y-3 text-sm">
              <li className="flex gap-3">
                <span className="font-semibold">1.</span>
                <span className="text-muted-foreground">
                  Download the MDX template and open it in your text editor
                </span>
              </li>
              <li className="flex gap-3">
                <span className="font-semibold">2.</span>
                <span className="text-muted-foreground">
                  Write your case study following the template structure
                </span>
              </li>
              <li className="flex gap-3">
                <span className="font-semibold">3.</span>
                <span className="text-muted-foreground">
                  Prepare your images and upload them to the Media tab
                </span>
              </li>
              <li className="flex gap-3">
                <span className="font-semibold">4.</span>
                <span className="text-muted-foreground">
                  Fill in all metadata fields in the form (tabs 2-4)
                </span>
              </li>
              <li className="flex gap-3">
                <span className="font-semibold">5.</span>
                <span className="text-muted-foreground">
                  Copy your MDX content into the MDX Body textarea
                </span>
              </li>
              <li className="flex gap-3">
                <span className="font-semibold">6.</span>
                <span className="text-muted-foreground">
                  Save as draft and preview before publishing
                </span>
              </li>
              <li className="flex gap-3">
                <span className="font-semibold">7.</span>
                <span className="text-muted-foreground">
                  When ready, change status to "Published" and save
                </span>
              </li>
            </ol>
          </CardContent>
        </Card>

        {/* Example */}
        <Card>
          <CardHeader>
            <CardTitle>Example Case Study</CardTitle>
            <CardDescription>See how metadata and MDX work together</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h4 className="font-semibold mb-2">Form Fields Example:</h4>
              <ul className="text-sm space-y-1 text-muted-foreground">
                <li><strong>Title:</strong> Redesigning the User Onboarding Flow</li>
                <li><strong>Summary:</strong> Reduced drop-off from 40% to 8% through user research and iterative design</li>
                <li><strong>Type:</strong> Problem-solving</li>
                <li><strong>Role:</strong> Lead Product Designer</li>
                <li><strong>Timeline:</strong> 3 months (Q1 2024)</li>
                <li><strong>Metrics:</strong> 80% reduction in drop-off, 75% faster time-to-value</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-2">MDX Content Example:</h4>
              <pre className="bg-muted p-3 rounded text-sm overflow-x-auto">
                {`# Overview

When we noticed a 40% drop-off rate in our onboarding...

## Context

Our SaaS platform had used the same flow for 3 years...

# Problem

## Goals

- Reduce drop-off below 10%
- Decrease time to first value
- Maintain data collection requirements

# Approach

We took a user-first approach:

1. Conducted 50 user interviews
2. Analyzed drop-off points
3. Created 5 prototype variations
4. A/B tested with real users

...`}
              </pre>
            </div>
          </CardContent>
        </Card>

        {/* MDX Syntax Warning */}
        <div className="bg-yellow-50 dark:bg-yellow-950/20 border-2 border-yellow-300 dark:border-yellow-700 p-6 rounded-lg">
          <h3 className="text-lg font-semibold mb-3 text-yellow-900 dark:text-yellow-200">
            ⚠️ Important: MDX Syntax
          </h3>
          <p className="mb-3 text-yellow-800 dark:text-yellow-300">
            MDX has special characters that need to be escaped. Common issues:
          </p>
          <ul className="list-disc list-inside space-y-2 text-yellow-800 dark:text-yellow-300 mb-4">
            <li><strong>Curly braces:</strong> Escape as <code className="bg-yellow-100 dark:bg-yellow-900 px-1 rounded">{'{'}</code> and <code className="bg-yellow-100 dark:bg-yellow-900 px-1 rounded">{'}'}</code> or use code blocks</li>
            <li><strong>Angle brackets:</strong> Escape as <code className="bg-yellow-100 dark:bg-yellow-900 px-1 rounded">{'<'}</code> and <code className="bg-yellow-100 dark:bg-yellow-900 px-1 rounded">{'>'}</code></li>
            <li><strong>Code examples:</strong> Always put code with special characters in code blocks (triple backticks)</li>
          </ul>
          <p className="text-sm text-yellow-700 dark:text-yellow-400">
            📖 See <code>MDX_SYNTAX_GUIDE.md</code> in the project root for complete documentation
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-4 justify-center pt-4">
          <Link href="/api/case-studies/download-template">
            <Button size="lg">
              <IconDownload className="h-4 w-4 mr-2" />
              Download Template
            </Button>
          </Link>
          <Link href="/protected/case-studies/new">
            <Button size="lg" variant="outline">
              Create Case Study
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}





