import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Plus, CheckCircle } from "lucide-react";
import { supabase } from "../../utils/supabaseClient";

export const DonationsTab = () => {
  const [donations, setDonations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [filterSource, setFilterSource] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");

  const [newDonation, setNewDonation] = useState({
    receipt_number: "",
    transaction_id: "",
    donor_name: "",
    donor_email: "",
    donor_phone: "",
    gross_amount: "",
    provider_fees: "",
    currency: "INR",
    source: "manual",
    provider: "",
    payment_method: "",
    status: "completed",
    notes: "",
  });

  const formatCurrency = (amount) => `₹${(amount || 0).toLocaleString()}`;

  const fetchDonations = async () => {
    setLoading(true);
    let query = supabase.from("donations").select("*").order("received_at", { ascending: false });
    
    if (filterSource !== "all") query = query.eq("source", filterSource);
    if (filterStatus !== "all") query = query.eq("status", filterStatus);

    const { data, error } = await query;
    if (error) console.error(error);
    else setDonations(data || []);
    setLoading(false);
  };

  useEffect(() => {
    fetchDonations();
  }, [filterSource, filterStatus]);

  // Real-time subscription
  useEffect(() => {
    const subscription = supabase
      .channel("donations-changes")
      .on("postgres_changes", { event: "*", schema: "public", table: "donations" }, () => {
        fetchDonations();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(subscription);
    };
  }, [filterSource, filterStatus]);

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
        received_at: new Date().toISOString(),
        notes: newDonation.notes,
      },
    ]);

    if (error) {
      console.error(error);
      alert("Error adding donation");
    } else {
      setShowAddModal(false);
      setNewDonation({
        receipt_number: "",
        transaction_id: "",
        donor_name: "",
        donor_email: "",
        donor_phone: "",
        gross_amount: "",
        provider_fees: "",
        currency: "INR",
        source: "manual",
        provider: "",
        payment_method: "",
        status: "completed",
        notes: "",
      });
      fetchDonations();
    }
    setLoading(false);
  };

  const handleMarkReconciled = async (id) => {
    await supabase.from("donations").update({ reconciled: true }).eq("id", id);
    fetchDonations();
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="text-sm text-gray-500">Total Donations</div>
            <div className="text-2xl font-bold">
              {formatCurrency(donations.reduce((sum, d) => sum + (d.net_amount || 0), 0))}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-sm text-gray-500">Total Count</div>
            <div className="text-2xl font-bold">{donations.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-sm text-gray-500">Completed</div>
            <div className="text-2xl font-bold text-green-600">
              {donations.filter((d) => d.status === "completed").length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-sm text-gray-500">Pending</div>
            <div className="text-2xl font-bold text-yellow-600">
              {donations.filter((d) => d.status === "pending").length}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Donations</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4 mb-4">
            <Select value={filterSource} onValueChange={setFilterSource}>
              <SelectTrigger className="w-48">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Sources</SelectItem>
                <SelectItem value="manual">Manual</SelectItem>
                <SelectItem value="online">Online</SelectItem>
                <SelectItem value="bank_transfer">Bank Transfer</SelectItem>
              </SelectContent>
            </Select>

            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="w-48">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
              </SelectContent>
            </Select>

            <Button onClick={() => setShowAddModal(true)} className="ml-auto">
              <Plus className="w-4 h-4 mr-1" /> Add Donation
            </Button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="border-b">
                <tr className="text-left">
                  <th className="p-4">Receipt #</th>
                  <th className="p-4">Donor</th>
                  <th className="p-4">Amount</th>
                  <th className="p-4">Source</th>
                  <th className="p-4">Status</th>
                  <th className="p-4">Date</th>
                  <th className="p-4">Action</th>
                </tr>
              </thead>
              <tbody>
                {donations.map((donation) => (
                  <tr key={donation.id} className="border-b hover:bg-gray-50">
                    <td className="p-4">{donation.receipt_number}</td>
                    <td className="p-4">{donation.donor_name || "Anonymous"}</td>
                    <td className="p-4 font-medium">{formatCurrency(donation.net_amount)}</td>
                    <td className="p-4">{donation.source}</td>
                    <td className="p-4">
                      <Badge className={donation.status === "completed" ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"}>
                        {donation.status}
                      </Badge>
                    </td>
                    <td className="p-4">{donation.received_at ? new Date(donation.received_at).toLocaleDateString() : ""}</td>
                    <td className="p-4">
                      {!donation.reconciled && (
                        <Button size="sm" variant="outline" onClick={() => handleMarkReconciled(donation.id)}>
                          <CheckCircle className="w-4 h-4" />
                        </Button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {donations.length === 0 && (
              <div className="text-center py-12 text-gray-500">No donations found.</div>
            )}
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
              <Input value={newDonation.donor_email} onChange={(e) => setNewDonation({ ...newDonation, donor_email: e.target.value })} />
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
              <Select value={newDonation.source} onValueChange={(value) => setNewDonation({ ...newDonation, source: value })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="manual">Manual</SelectItem>
                  <SelectItem value="online">Online</SelectItem>
                  <SelectItem value="bank_transfer">Bank Transfer</SelectItem>
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
              <Select value={newDonation.status} onValueChange={(value) => setNewDonation({ ...newDonation, status: value })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="col-span-2">
              <Label>Notes</Label>
              <Textarea value={newDonation.notes} onChange={(e) => setNewDonation({ ...newDonation, notes: e.target.value })} />
            </div>
          </div>
          <div className="flex justify-end gap-2 mt-4">
            <Button variant="outline" onClick={() => setShowAddModal(false)}>Cancel</Button>
            <Button onClick={handleAddDonation} disabled={loading}>Add Donation</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};
