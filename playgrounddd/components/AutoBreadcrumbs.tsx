"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"

// Optional: customize labels per segment
const LABELS: Record<string, string> = {
  components: "Components",
  docs: "Documentation",
}

function titleize(segment: string) {
  const decoded = decodeURIComponent(segment)
  if (LABELS[decoded]) return LABELS[decoded]
  return decoded
    .replace(/[-_]+/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase())
}

type AutoBreadcrumbsProps = {
  /** Show a root crumb (e.g., Home) */
  rootLabel?: string
  rootHref?: string
  /** Hide certain segments */
  hideSegments?: string[]
}

export function AutoBreadcrumbs({
  rootLabel = "Home",
  rootHref = "/",
  hideSegments = [],
}: AutoBreadcrumbsProps) {
  const pathname = usePathname() || "/"

  // Remove query/hash just in case; usePathname typically returns path-only.
  const cleanPath = pathname.split("?")[0].split("#")[0]

  const segments = cleanPath
    .split("/")
    .filter(Boolean)
    .filter((s) => !hideSegments.includes(s))

  // Build cumulative hrefs: /a, /a/b, /a/b/c...
  const crumbs = segments.map((seg, idx) => {
    const href = "/" + segments.slice(0, idx + 1).join("/")
    return { segment: seg, href, label: titleize(seg) }
  })

  return (
    <Breadcrumb>
      <BreadcrumbList>
        {/* Root */}
        <BreadcrumbItem>
          <BreadcrumbLink asChild>
            <Link href={rootHref}>{rootLabel}</Link>
          </BreadcrumbLink>
        </BreadcrumbItem>

        {crumbs.map((c, idx) => {
          const isLast = idx === crumbs.length - 1

          return (
            <React.Fragment key={c.href}>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                {isLast ? (
                  <BreadcrumbPage>{c.label}</BreadcrumbPage>
                ) : (
                  <BreadcrumbLink asChild>
                    <Link href={c.href}>{c.label}</Link>
                  </BreadcrumbLink>
                )}
              </BreadcrumbItem>
            </React.Fragment>
          )
        })}
      </BreadcrumbList>
    </Breadcrumb>
  )
}
