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

export function B2BRequestsSection() {
  const [searchTerm, setSearchTerm] = useState("");
  const [b2bRequests, setB2bRequests] = useState<B2BRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedRequest, setSelectedRequest] = useState<B2BRequest | null>(null);
  const { toast } = useToast();

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

  useEffect(() => {
    fetchB2BRequests();
  }, []);

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

      {/* B2B Requests Table */}
      <Card className="bg-slate-800/50 border-slate-700/50 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-white">Recent B2B Requests</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4" />
              <Input
                placeholder="Search requests, companies, contacts..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-slate-900/50 border-slate-600 text-white placeholder-slate-400"
              />
            </div>
          </div>

          <Table>
            <TableHeader>
              <TableRow className="border-slate-700">
                <TableHead className="text-slate-300">Request ID</TableHead>
                <TableHead className="text-slate-300">Company</TableHead>
                <TableHead className="text-slate-300">Contact</TableHead>
                <TableHead className="text-slate-300">Email</TableHead>
                <TableHead className="text-slate-300">Type</TableHead>
                <TableHead className="text-slate-300">Value</TableHead>
                <TableHead className="text-slate-300">Priority</TableHead>
                <TableHead className="text-slate-300">Status</TableHead>
                <TableHead className="text-slate-300">Date</TableHead>
                <TableHead className="text-slate-300">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredRequests.map((request) => (
                <TableRow key={request.id} className="border-slate-700 hover:bg-slate-800/30">
                  <TableCell className="text-slate-300 font-mono text-sm">{request.id}</TableCell>
                  <TableCell className="text-white font-medium">{request.company}</TableCell>
                  <TableCell className="text-slate-300">{request.contact}</TableCell>
                  <TableCell className="text-slate-300">{request.email}</TableCell>
                  <TableCell className="text-slate-300">{request.requestType}</TableCell>
                  <TableCell className="text-slate-300">${request.estimatedValue.toFixed(2)}</TableCell>
                  <TableCell>
                    <Badge className={getPriorityColor(request.priority)}>
                      {request.priority}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge className={getStatusColor(request.status)}>
                      {getStatusIcon(request.status)}
                      <span className="ml-1">{request.status}</span>
                    </Badge>
                  </TableCell>
                  <TableCell className="text-slate-300">{new Date(request.date).toLocaleDateString()}</TableCell>
                  <TableCell>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setSelectedRequest(selectedRequest?.id === request.id ? null : request)}
                      className="text-cyan-400 hover:text-cyan-300 hover:bg-cyan-500/10"
                    >
                      View Details
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          {/* Request Details */}
          {selectedRequest && (
            <Card className="mt-6 bg-slate-900/50 border-slate-600">
              <CardHeader>
                <CardTitle className="text-white">Request Details - {selectedRequest.id}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-slate-400 text-sm">Phone</p>
                      <p className="text-white">{selectedRequest.phone}</p>
                    </div>
                    <div>
                      <p className="text-slate-400 text-sm">Request Date</p>
                      <p className="text-white">{new Date(selectedRequest.date).toLocaleString()}</p>
                    </div>
                  </div>
                  <div>
                    <p className="text-slate-400 text-sm mb-2">Description</p>
                    <Textarea
                      value={selectedRequest.description}
                      className="bg-slate-800/50 border-slate-600 text-white"
                      placeholder="No description provided"
                      readOnly
                    />
                  </div>
                  <div className="flex space-x-4">
                    <Button variant="outline" className="border-slate-600 text-slate-300 hover:bg-slate-800">
                      Contact Customer
                    </Button>
                    <Button variant="outline" className="border-slate-600 text-slate-300 hover:bg-slate-800">
                      Update Status
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </CardContent>
      </Card>
    </div>
  );
} 