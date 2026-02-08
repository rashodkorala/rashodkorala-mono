import { CASE_STUDY_MDX_TEMPLATE } from "@/lib/constants/case-study-template"
import { NextResponse } from "next/server"

export async function GET() {
  // Return the template as a downloadable .mdx file
  return new NextResponse(CASE_STUDY_MDX_TEMPLATE, {
    headers: {
      "Content-Type": "text/markdown",
      "Content-Disposition": 'attachment; filename="case-study-template.mdx"',
    },
  })
}



