"use client"

import { DashboardLayout } from "@/components/dashboard-layout"
import { useSearchParams } from "next/navigation"

export default function Dashboard() {
  const searchParams = useSearchParams()
  const section = searchParams.get('section') || "daily-overview"
  
  return <DashboardLayout defaultSection={section} />
}
