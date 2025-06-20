"use client"

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Search, Building2, Clock, CheckCircle, AlertCircle, RefreshCw, DollarSign, Users, TrendingUp } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import type { B2BRequest } from "@/lib/google-sheets";
import { readGoogleSheet } from '@/lib/googleSheetsReader';
import Link from 'next/link';

export function B2BRequestsSection() {
  const [searchTerm, setSearchTerm] = useState("");
  const [b2bRequests, setB2bRequests] = useState<B2BRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedRequest, setSelectedRequest] = useState<B2BRequest | null>(null);
  const [customerHistory, setCustomerHistory] = useState<any[]>([]);
  const [liveUpdates, setLiveUpdates] = useState<string[]>([]);
  const { toast } = useToast();
  const [showDetails, setShowDetails] = useState(false);

  const fetchB2BRequests = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/b2b-requests");
      if (response.ok) {
        const data = await response.json();
        setB2bRequests(data);
      } else {
        toast({
          title: "Error",
          description: "Failed to fetch B2B requests",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error fetching B2B requests:", error);
      toast({
        title: "Error",
        description: "Failed to connect to B2B requests system",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchCustomerHistory = async () => {
    if (selectedRequest) {
      try {
        const response = await fetch(`/api/customers/customer_data_fetch?customerId=${selectedRequest.id}`);
        const customerRows = await response.json();
        setCustomerHistory(customerRows);
      } catch (error) {
        console.error('Error fetching customer history:', error);
      }
    }
  };

  useEffect(() => {
    fetchB2BRequests();

    // Set up WebSocket connection
    const ws = new WebSocket("ws://localhost:8080");

    ws.onopen = () => {
      console.log("Connected to WebSocket server");
    };

    ws.onmessage = (event) => {
      const message = JSON.parse(event.data);
      setLiveUpdates((prevUpdates) => [...prevUpdates, message]);
    };

    ws.onclose = () => {
      console.log("Disconnected from WebSocket server");
    };

    return () => {
      ws.close();
    };
  }, []);

  useEffect(() => {
    fetchCustomerHistory();

    const interval = setInterval(fetchCustomerHistory, 60000); // Refresh every 60 seconds

    return () => clearInterval(interval);
  }, [selectedRequest]);

  const filteredRequests = b2bRequests.filter(
    (request) =>
      request.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      request.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
      request.contact.toLowerCase().includes(searchTerm.toLowerCase()) ||
      request.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case "submitted":
      case "pending":
        return <Clock className="h-4 w-4" />;
      case "approved":
      case "completed":
        return <CheckCircle className="h-4 w-4" />;
      case "in progress":
        return <RefreshCw className="h-4 w-4" />;
      default:
        return <AlertCircle className="h-4 w-4" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "submitted":
      case "pending":
        return "bg-yellow-500/20 text-yellow-400 border-yellow-500/30";
      case "approved":
      case "completed":
        return "bg-green-500/20 text-green-400 border-green-500/30";
      case "in progress":
        return "bg-blue-500/20 text-blue-400 border-blue-500/30";
      default:
        return "bg-slate-500/20 text-slate-400 border-slate-500/30";
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority.toLowerCase()) {
      case "high":
        return "bg-red-500/20 text-red-400 border-red-500/30";
      case "medium":
        return "bg-orange-500/20 text-orange-400 border-orange-500/30";
      case "low":
        return "bg-green-500/20 text-green-400 border-green-500/30";
      default:
        return "bg-slate-500/20 text-slate-400 border-slate-500/30";
    }
  };

  const totalValue = b2bRequests.reduce((sum, request) => sum + request.estimatedValue, 0);
  const pendingRequests = b2bRequests.filter(request => 
    request.status.toLowerCase() === "submitted" || request.status.toLowerCase() === "pending"
  );
  const highPriorityRequests = b2bRequests.filter(request => 
    request.priority.toLowerCase() === "high"
  );

  const handleRowClick = (request: B2BRequest) => {
    setSelectedRequest(request);
    setShowDetails(true);
  };

  const handleBack = () => {
    setShowDetails(false);
    setSelectedRequest(null);
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-center h-64">
          <RefreshCw className="h-8 w-8 animate-spin text-cyan-400" />
          <span className="ml-2 text-white">Loading B2B requests...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-white">B2B Requests</h2>
          <p className="text-slate-400 mt-1">Business-to-business requests from the last 60 days</p>
        </div>
        <div className="flex space-x-2">
          <Button
            variant="outline"
            onClick={fetchB2BRequests}
            className="border-slate-600 text-slate-300 hover:bg-slate-800"
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="bg-slate-800/50 border-slate-700/50 backdrop-blur-sm">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-400 text-sm">Total Requests</p>
                <p className="text-2xl font-bold text-white">{b2bRequests.length}</p>
              </div>
              <div className="p-2 bg-cyan-500/20 rounded-lg">
                <Building2 className="h-6 w-6 text-cyan-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-800/50 border-slate-700/50 backdrop-blur-sm">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-400 text-sm">Pending Review</p>
                <p className="text-2xl font-bold text-yellow-400">{pendingRequests.length}</p>
              </div>
              <div className="p-2 bg-yellow-500/20 rounded-lg">
                <Clock className="h-6 w-6 text-yellow-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-800/50 border-slate-700/50 backdrop-blur-sm">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-400 text-sm">High Priority</p>
                <p className="text-2xl font-bold text-red-400">{highPriorityRequests.length}</p>
              </div>
              <div className="p-2 bg-red-500/20 rounded-lg">
                <AlertCircle className="h-6 w-6 text-red-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-800/50 border-slate-700/50 backdrop-blur-sm">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-400 text-sm">Total Value</p>
                <p className="text-2xl font-bold text-green-400">${totalValue.toFixed(2)}</p>
              </div>
              <div className="p-2 bg-green-500/20 rounded-lg">
                <DollarSign className="h-6 w-6 text-green-400" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content or Details Panel */}
      {showDetails && selectedRequest ? (
        <div className="fixed inset-0 z-50 bg-slate-900/95 flex flex-col p-8 overflow-y-auto">
          <button onClick={handleBack} className="mb-4 text-white flex items-center">
            <span className="mr-2">←</span> Back to Orders
          </button>
          <div className="bg-slate-800 rounded-lg p-6 w-full max-w-4xl mx-auto shadow-lg">
            <h2 className="text-3xl font-bold text-white mb-2 flex items-center">
              Order Details
              <span className="ml-4 text-base text-cyan-400">Order ID: {selectedRequest.id}</span>
            </h2>
            <div className="mb-4">
              <Link href={`/customers/${selectedRequest.id}`} className="text-cyan-400 underline mr-2">
                {selectedRequest.company}
              </Link>
              <span className="text-slate-400">(Customer ID: </span>
              <Link href={`/customers/${selectedRequest.id}`} className="text-cyan-400 underline">
                {selectedRequest.id}
              </Link>
              <span className="text-slate-400">)</span>
            </div>
            <div className="mb-4">
              <strong>Contact:</strong> {selectedRequest.contact}<br />
              <strong>Email:</strong> <a href={`mailto:${selectedRequest.email}?subject=Regarding Order ${selectedRequest.id}`} className="text-cyan-400 underline">{selectedRequest.email}</a><br />
              <strong>Status:</strong> {selectedRequest.status}<br />
              <strong>Priority:</strong> {selectedRequest.priority}<br />
              <strong>Estimated Value:</strong> ${selectedRequest.estimatedValue.toFixed(2)}<br />
              {selectedRequest.invoice_link && (
                <a href={selectedRequest.invoice_link} target="_blank" rel="noopener noreferrer" className="text-cyan-400 underline mr-4">
                  View Invoice
                </a>
              )}
              {selectedRequest.payment_link && (
                <a href={selectedRequest.payment_link} target="_blank" rel="noopener noreferrer" className="text-cyan-400 underline">
                  Pay Now
                </a>
              )}
            </div>
            <div className="mb-4">
              <h3 className="text-lg font-bold mb-2">Customer History</h3>
              {customerHistory.length > 0 ? (
                <table className="w-full text-left text-white bg-slate-700 rounded">
                  <thead>
                    <tr>
                      <th className="p-2">Date</th>
                      <th className="p-2">Action</th>
                      <th className="p-2">Details</th>
                    </tr>
                  </thead>
                  <tbody>
                    {customerHistory.map((entry, index) => (
                      <tr key={index} className="border-b border-slate-600">
                        <td className="p-2">{entry[6] || entry.date}</td>
                        <td className="p-2">{entry[10] || entry.action}</td>
                        <td className="p-2">{entry[12] || entry.details}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <p className="text-slate-400">No customer history found.</p>
              )}
            </div>
            <div className="mb-4">
              <h3 className="text-lg font-bold mb-2">Live Updates</h3>
              {liveUpdates.length > 0 ? (
                <ul className="list-disc pl-5 text-white">
                  {liveUpdates.map((update, index) => (
                    <li key={index}>{update.message || update}</li>
                  ))}
                </ul>
              ) : (
                <p className="text-slate-400">No live updates available.</p>
              )}
            </div>
            <div className="mt-6">
              <a
                href={`mailto:${selectedRequest.email}?subject=Regarding Order ${selectedRequest.id}`}
                className="inline-block bg-cyan-600 hover:bg-cyan-700 text-white font-bold py-2 px-4 rounded"
              >
                Start Email Thread
              </a>
            </div>
          </div>
        </div>
      ) : (
        <>
          {/* B2B Requests Table */}
          <Table className="mt-6">
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Company</TableHead>
                <TableHead>Contact</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Priority</TableHead>
                <TableHead>Estimated Value</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredRequests.map((request) => (
                <TableRow
                  key={request.id}
                  onClick={() => handleRowClick(request)}
                  className="cursor-pointer hover:bg-slate-700 text-white"
                >
                  <TableCell>
                    <Link href={`/customers/${request.id}`} className="text-cyan-400 underline">
                      {request.id}
                    </Link>
                  </TableCell>
                  <TableCell>
                    <Link href={`/customers/${request.id}`} className="text-cyan-400 underline">
                      {request.company}
                    </Link>
                  </TableCell>
                  <TableCell>{request.contact}</TableCell>
                  <TableCell>{request.email}</TableCell>
                  <TableCell>
                    <Badge className={getStatusColor(request.status)}>
                      {getStatusIcon(request.status)}
                      {request.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge className={getPriorityColor(request.priority)}>
                      {request.priority}
                    </Badge>
                  </TableCell>
                  <TableCell>${request.estimatedValue.toFixed(2)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </>
      )}
    </div>
  );
} 