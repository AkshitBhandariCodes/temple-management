import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Search, Filter, Plus, Eye, Download, RefreshCw, Check } from "lucide-react";
import { supabase } from "../../utils/supabaseClient";

export const DonationsTab = () => {
  const [donations, setDonations] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [sourceFilter, setSourceFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedDonation, setSelectedDonation] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [newDonation, setNewDonation] = useState({
    receipt_number: "",
    transaction_id: "",
    donor_name: "",
    donor_email: "",
    donor_phone: "",
    gross_amount: "",
    provider_fees: "",
    net_amount: "",
    currency: "INR",
    source: "manual",
    provider: "",
    payment_method: "",
    status: "completed",
    notes: "",
  });

  const fetchDonations = async () => {
    setLoading(true);
    const { data, error } = await supabase.from("donations").select("*").order("received_date", { ascending: false });
    if (error) setError(error.message);
    setDonations(data ?? []);
    setLoading(false);
  };

  useEffect(() => {
    fetchDonations();
    const subscription = supabase
      .channel("donations-changes")
      .on("postgres_changes", { event: "*", schema: "public", table: "donations" }, () => {
        fetchDonations();
      })
      .subscribe();
    return () => {
      supabase.removeChannel(subscription);
    };
  }, []);

  const handleAddDonation = async () => {
    setLoading(true);
    const netAmount = parseFloat(newDonation.gross_amount) - parseFloat(newDonation.provider_fees || 0);
    const { error } = await supabase.from("donations").insert([
      {
        receipt_number: newDonation.receipt_number,
        transaction_id: newDonation.transaction_id,
        donor_name: newDonation.donor_name,
        donor_email: newDonation.donor_email,
        donor_phone: newDonation.donor_phone,
        gross_amount: parseFloat(newDonation.gross_amount),
        provider_fees: parseFloat(newDonation.provider_fees || 0),
        net_amount: netAmount,
        currency: newDonation.currency,
        source: newDonation.source,
        provider: newDonation.provider,
        payment_method: newDonation.payment_method,
        status: newDonation.status,
        notes: newDonation.notes,
      },
    ]);
    if (error) setError(error.message);
    setShowAddModal(false);
    setNewDonation({
      receipt_number: "",
      transaction_id: "",
      donor_name: "",
      donor_email: "",
      donor_phone: "",
      gross_amount: "",
      provider_fees: "",
      net_amount: "",
      currency: "INR",
      source: "manual",
      provider: "",
      payment_method: "",
      status: "completed",
      notes: "",
    });
    setLoading(false);
  };

  const handleMarkReconciled = async (donationId) => {
    await supabase.from("donations").update({ reconciled: true }).eq("id", donationId);
  };

  const filteredDonations = donations.filter((donation) => {
    const matchesSearch =
      searchTerm === "" ||
      donation.donor_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      donation.donor_email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      donation.receipt_number?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSource = sourceFilter === "all" || donation.source === sourceFilter;
    const matchesStatus = statusFilter === "all" || donation.status === statusFilter;
    return matchesSearch && matchesSource && matchesStatus;
  });

  const totalDonations = filteredDonations.reduce((sum, d) => sum + (d.net_amount || 0), 0);
  const completedCount = filteredDonations.filter((d) => d.status === "completed").length;
  const pendingCount = filteredDonations.filter((d) => d.status === "pending").length;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Donations</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₹{totalDonations.toLocaleString()}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Count</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{filteredDonations.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Completed</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{completedCount}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Pending</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">{pendingCount}</div>
          </CardContent>
        </Card>
      </div>

      <div className="flex justify-between items-center gap-4">
        <div className="flex gap-2 flex-1">
          <div className="relative flex-1">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Search donations..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="pl-8" />
          </div>
          <Select value={sourceFilter} onValueChange={setSourceFilter}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Source" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Sources</SelectItem>
              <SelectItem value="web">Web</SelectItem>
              <SelectItem value="hundi">Hundi</SelectItem>
              <SelectItem value="manual">Manual</SelectItem>
            </SelectContent>
          </Select>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="failed">Failed</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <Button onClick={() => setShowAddModal(true)}>
          <Plus className="mr-1 h-4 w-4" /> Add Donation
        </Button>
      </div>

      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="border-b">
                <tr className="text-left">
                  <th className="p-4">Receipt & ID</th>
                  <th className="p-4">Donor Information</th>
                  <th className="p-4">Amount Details</th>
                  <th className="p-4">Source & Provider</th>
                  <th className="p-4">Status & Date</th>
                  <th className="p-4">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredDonations.map((donation) => (
                  <tr key={donation.id} className="border-b hover:bg-gray-50">
                    <td className="p-4">
                      <div className="font-medium">{donation.receipt_number}</div>
                      <div className="text-xs text-gray-500">{donation.transaction_id}</div>
                    </td>
                    <td className="p-4">
                      <div className="font-medium">{donation.donor_name}</div>
                      <div className="text-xs text-gray-500">{donation.donor_email}</div>
                      {donation.donor_phone && <div className="text-xs text-gray-500">{donation.donor_phone}</div>}
                    </td>
                    <td className="p-4">
                      <div>Gross: ₹{donation.gross_amount?.toLocaleString()}</div>
                      <div className="text-xs text-gray-500">Fees: ₹{donation.provider_fees?.toLocaleString()}</div>
                      <div className="font-medium">Net: ₹{donation.net_amount?.toLocaleString()}</div>
                    </td>
                    <td className="p-4">
                      <div>{donation.source}</div>
                      <div className="text-xs text-gray-500">{donation.provider}</div>
                      <div className="text-xs text-gray-500">{donation.payment_method}</div>
                    </td>
                    <td className="p-4">
                      <div>{donation.received_date ? new Date(donation.received_date).toLocaleDateString() : ""}</div>
                      <div className="mt-1">
                        {donation.status === "completed" ? (
                          <Badge variant="default">Completed</Badge>
                        ) : donation.status === "pending" ? (
                          <Badge variant="destructive">Pending</Badge>
                        ) : (
                          <Badge variant="destructive">Failed</Badge>
                        )}
                      </div>
                      {donation.reconciled ? (
                        <Badge variant="outline" className="mt-1">
                          <Check className="w-3 h-3 mr-1" /> Reconciled
                        </Badge>
                      ) : (
                        <Badge variant="secondary" className="mt-1">Pending</Badge>
                      )}
                    </td>
                    <td className="p-4">
                      <div className="flex gap-2">
                        <Button size="sm" variant="ghost" onClick={() => setSelectedDonation(donation)}>
                          <Eye className="w-4 h-4" />
                        </Button>
                        {!donation.reconciled && (
                          <Button size="sm" variant="outline" onClick={() => handleMarkReconciled(donation.id)}>
                            <Check className="w-4 h-4" />
                          </Button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {filteredDonations.length === 0 && <div className="text-center py-12 text-gray-500">No donations found.</div>}
          </div>
        </CardContent>
      </Card>

      <Dialog open={showAddModal} onOpenChange={setShowAddModal}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Add New Donation</DialogTitle>
          </DialogHeader>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Receipt Number</Label>
              <Input value={newDonation.receipt_number} onChange={(e) => setNewDonation({ ...newDonation, receipt_number: e.target.value })} />
            </div>
            <div>
              <Label>Transaction ID</Label>
              <Input value={newDonation.transaction_id} onChange={(e) => setNewDonation({ ...newDonation, transaction_id: e.target.value })} />
            </div>
            <div>
              <Label>Donor Name</Label>
              <Input value={newDonation.donor_name} onChange={(e) => setNewDonation({ ...newDonation, donor_name: e.target.value })} />
            </div>
            <div>
              <Label>Donor Email</Label>
              <Input type="email" value={newDonation.donor_email} onChange={(e) => setNewDonation({ ...newDonation, donor_email: e.target.value })} />
            </div>
            <div>
              <Label>Donor Phone</Label>
              <Input value={newDonation.donor_phone} onChange={(e) => setNewDonation({ ...newDonation, donor_phone: e.target.value })} />
            </div>
            <div>
              <Label>Gross Amount</Label>
              <Input type="number" value={newDonation.gross_amount} onChange={(e) => setNewDonation({ ...newDonation, gross_amount: e.target.value })} />
            </div>
            <div>
              <Label>Provider Fees</Label>
              <Input type="number" value={newDonation.provider_fees} onChange={(e) => setNewDonation({ ...newDonation, provider_fees: e.target.value })} />
            </div>
            <div>
              <Label>Source</Label>
              <Select value={newDonation.source} onValueChange={(v) => setNewDonation({ ...newDonation, source: v })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="web">Web</SelectItem>
                  <SelectItem value="hundi">Hundi</SelectItem>
                  <SelectItem value="manual">Manual</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Provider</Label>
              <Input value={newDonation.provider} onChange={(e) => setNewDonation({ ...newDonation, provider: e.target.value })} />
            </div>
            <div>
              <Label>Payment Method</Label>
              <Input value={newDonation.payment_method} onChange={(e) => setNewDonation({ ...newDonation, payment_method: e.target.value })} />
            </div>
            <div>
              <Label>Status</Label>
              <Select value={newDonation.status} onValueChange={(v) => setNewDonation({ ...newDonation, status: v })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="failed">Failed</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="col-span-2">
              <Label>Notes</Label>
              <Textarea value={newDonation.notes} onChange={(e) => setNewDonation({ ...newDonation, notes: e.target.value })} />
            </div>
          </div>
          <div className="flex justify-end gap-2 pt-4">
            <Button variant="outline" onClick={() => setShowAddModal(false)}>Cancel</Button>
            <Button onClick={handleAddDonation}>Add Donation</Button>
          </div>
          {error && <div className="text-red-600 pt-2">{error}</div>}
        </DialogContent>
      </Dialog>

      {selectedDonation && (
        <Dialog open={!!selectedDonation} onOpenChange={() => setSelectedDonation(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Donation Details</DialogTitle>
            </DialogHeader>
            <div className="space-y-2 text-sm">
              <div><strong>Receipt:</strong> {selectedDonation.receipt_number}</div>
              <div><strong>Donor:</strong> {selectedDonation.donor_name}</div>
              <div><strong>Email:</strong> {selectedDonation.donor_email}</div>
              <div><strong>Phone:</strong> {selectedDonation.donor_phone}</div>
              <div><strong>Amount:</strong> ₹{selectedDonation.net_amount?.toLocaleString()}</div>
              <div><strong>Status:</strong> {selectedDonation.status}</div>
              <div><strong>Source:</strong> {selectedDonation.source}</div>
              <div><strong>Notes:</strong> {selectedDonation.notes}</div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};
