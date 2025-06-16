"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { RefreshCw, CheckCircle, XCircle, AlertTriangle } from "lucide-react"

export function DebugConnection() {
  const [testing, setTesting] = useState(false)
  const [results, setResults] = useState<any>(null)

  const testConnection = async () => {
    setTesting(true)
    try {
      console.log("Testing Google Sheets connection...")

      const response = await fetch("/api/inventory")
      const data = await response.json()

      setResults({
        status: response.ok ? "success" : "error",
        statusCode: response.status,
        data: data,
        timestamp: new Date().toISOString(),
      })

      console.log("Connection test results:", data)
    } catch (error) {
      console.error("Connection test failed:", error)
      setResults({
        status: "error",
        error: error.message,
        timestamp: new Date().toISOString(),
      })
    } finally {
      setTesting(false)
    }
  }

  const getStatusIcon = () => {
    if (!results) return <AlertTriangle className="h-5 w-5 text-yellow-400" />
    if (results.status === "success") return <CheckCircle className="h-5 w-5 text-green-400" />
    return <XCircle className="h-5 w-5 text-red-400" />
  }

  const getStatusColor = () => {
    if (!results) return "bg-yellow-500/20 text-yellow-400 border-yellow-500/30"
    if (results.status === "success") return "bg-green-500/20 text-green-400 border-green-500/30"
    return "bg-red-500/20 text-red-400 border-red-500/30"
  }

  return (
    <Card className="bg-slate-800/50 border-slate-700/50 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="text-white flex items-center">
          {getStatusIcon()}
          <span className="ml-2">Google Sheets Connection Test</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <Badge className={getStatusColor()}>
            {!results ? "Not Tested" : results.status === "success" ? "Connected" : "Failed"}
          </Badge>
          <Button
            onClick={testConnection}
            disabled={testing}
            className="bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-600 hover:to-purple-600"
          >
            {testing ? (
              <>
                <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                Testing...
              </>
            ) : (
              "Test Connection"
            )}
          </Button>
        </div>

        {results && (
          <div className="space-y-2">
            <div className="text-sm">
              <span className="text-slate-400">Status Code:</span>
              <span className="text-white ml-2">{results.statusCode}</span>
            </div>
            <div className="text-sm">
              <span className="text-slate-400">Timestamp:</span>
              <span className="text-white ml-2">{new Date(results.timestamp).toLocaleString()}</span>
            </div>
            {results.data && (
              <div className="text-sm">
                <span className="text-slate-400">Items Found:</span>
                <span className="text-white ml-2">{Array.isArray(results.data) ? results.data.length : "N/A"}</span>
              </div>
            )}
            {results.error && (
              <div className="text-sm">
                <span className="text-slate-400">Error:</span>
                <span className="text-red-400 ml-2">{results.error}</span>
              </div>
            )}
            <details className="mt-4">
              <summary className="text-slate-400 cursor-pointer hover:text-white">View Raw Response</summary>
              <pre className="mt-2 p-3 bg-slate-900/50 rounded text-xs text-slate-300 overflow-auto max-h-40">
                {JSON.stringify(results, null, 2)}
              </pre>
            </details>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
