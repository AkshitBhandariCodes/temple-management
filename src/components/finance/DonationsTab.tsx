import React, { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Plus } from "lucide-react";
import { supabase } from "../../utils/supabaseClient";

export const DonationsTab = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [sourceFilter, setSourceFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [showAddModal, setShowAddModal] = useState(false);
  const [donations, setDonations] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [newDonation, setNewDonation] = useState<any>({
    receipt_number: "",
    transaction_id: "",
    gross_amount: "",
    net_amount: "",
    provider_fees: "",
    source: "web_gateway",
    provider: "stripe",
    payment_method: "card",
    donor_name: "",
    donor_email: "",
    donor_phone: "",
    community_id: "",
    notes: "",
  });

  const fetchDonations = async () => {
    setLoading(true);
    setError("");
    let query = supabase.from("donations").select("*").order("received_at", { ascending: false });
    if (sourceFilter !== "all") query = query.eq("source", sourceFilter);
    if (statusFilter !== "all") query = query.eq("status", statusFilter);
    const { data, error } = await query;
    if (error) setError(error.message);
    setDonations(data ?? []);
    setLoading(false);
  };

  useEffect(() => {
    fetchDonations();

    // Real-time subscription
    const subscription = supabase
      .channel('donations-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'donations' }, () => {
        fetchDonations();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(subscription);
    };
  }, [sourceFilter, statusFilter]);

  const filteredDonations = donations.filter((donation) => {
    const q = searchTerm.toLowerCase();
    return (
      (donation.donor_name || "").toLowerCase().includes(q) ||
      (donation.receipt_number || "").toLowerCase().includes(q) ||
      (donation.transaction_id || "").toLowerCase().includes(q)
    );
  });

  const handleCreateDonation = async () => {
    setLoading(true);
    setError("");
    const { data, error } = await supabase.from("donations").insert([{
      receipt_number: newDonation.receipt_number,
      transaction_id: newDonation.transaction_id,
      gross_amount: parseFloat(newDonation.gross_amount),
      net_amount: parseFloat(newDonation.net_amount),
      provider_fees: parseFloat(newDonation.provider_fees) || 0,
      source: newDonation.source,
      provider: newDonation.provider,
      payment_method: newDonation.payment_method,
      donor_name: newDonation.donor_name,
      donor_email: newDonation.donor_email,
      donor_phone: newDonation.donor_phone,
      community_id: newDonation.community_id,
      notes: newDonation.notes,
    }]);
    if (error) {
      setError(error.message);
    } else if (data && data[0]?.id) {
      await supabase.from("timeline").insert([{
        event_type: "donation_inserted",
        entity: "donations",
        entity_id: data[0].id,
        details: newDonation,
        created_at: new Date().toISOString(),
      }]);
    }
    setShowAddModal(false);
    setNewDonation({
      receipt_number: "",
      transaction_id: "",
      gross_amount: "",
      net_amount: "",
      provider_fees: "",
      source: "web_gateway",
      provider: "stripe",
      payment_method: "card",
      donor_name: "",
      donor_email: "",
      donor_phone: "",
      community_id: "",
      notes: "",
    });
    setLoading(false);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR" }).format(amount);
  };

  const getStatusBadge = (status: string) => {
    return { completed: "default", pending: "secondary", failed: "destructive", refunded: "outline" }[status] || "default";
  };

  return (
    <div className="p-6 space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <p className="text-sm text-muted-foreground mb-2">Total Donations</p>
            <p className="text-2xl font-semibold">{formatCurrency(donations.reduce((sum, d) => sum + (d.net_amount || 0), 0))}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-sm text-muted-foreground mb-2">Total Count</p>
            <p className="text-2xl font-semibold">{donations.length}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-sm text-muted-foreground mb-2">Completed</p>
            <p className="text-2xl font-semibold">{donations.filter((d) => d.status === "completed").length}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-sm text-muted-foreground mb-2">Pending</p>
            <p className="text-2xl font-semibold">{donations.filter((d) => d.status === "pending").length}</p>
          </CardContent>
        </Card>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <Input value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-[200px]" placeholder="Search donations..." />
          <Select value={sourceFilter} onValueChange={(v) => setSourceFilter(v)}>
            <SelectTrigger className="w-max"><SelectValue>Source</SelectValue></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Sources</SelectItem>
              <SelectItem value="web_gateway">Web Gateway</SelectItem>
              <SelectItem value="hundi">Hundi</SelectItem>
              <SelectItem value="in_temple">In-Temple</SelectItem>
            </SelectContent>
          </Select>
          <Select value={statusFilter} onValueChange={(v) => setStatusFilter(v)}>
            <SelectTrigger className="w-max"><SelectValue>Status</SelectValue></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="failed">Failed</SelectItem>
              <SelectItem value="refunded">Refunded</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <Dialog open={showAddModal} onOpenChange={setShowAddModal}>
          <DialogTrigger asChild>
            <Button size="sm"><Plus className="mr-1 h-4 w-4" /> Add Donation</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader><DialogTitle>Add New Donation</DialogTitle></DialogHeader>
            <div className="space-y-2">
              <Label>Receipt Number</Label>
              <Input value={newDonation.receipt_number} onChange={(e) => setNewDonation({ ...newDonation, receipt_number: e.target.value })} />
              <Label>Gross Amount</Label>
              <Input type="number" value={newDonation.gross_amount} onChange={(e) => setNewDonation({ ...newDonation, gross_amount: e.target.value })} />
              <Label>Net Amount</Label>
              <Input type="number" value={newDonation.net_amount} onChange={(e) => setNewDonation({ ...newDonation, net_amount: e.target.value })} />
              <Label>Provider Fees</Label>
              <Input type="number" value={newDonation.provider_fees} onChange={(e) => setNewDonation({ ...newDonation, provider_fees: e.target.value })} />
              <Label>Source</Label>
              <Select value={newDonation.source} onValueChange={(v) => setNewDonation({ ...newDonation, source: v })}>
                <SelectTrigger className="w-full"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="web_gateway">Web Gateway</SelectItem>
                  <SelectItem value="hundi">Hundi</SelectItem>
                  <SelectItem value="in_temple">In-Temple</SelectItem>
                </SelectContent>
              </Select>
              <Label>Donor Name</Label>
              <Input value={newDonation.donor_name} onChange={(e) => setNewDonation({ ...newDonation, donor_name: e.target.value })} />
              <Label>Notes</Label>
              <Textarea value={newDonation.notes} onChange={(e) => setNewDonation({ ...newDonation, notes: e.target.value })} />
            </div>
            <div className="flex gap-2 justify-end">
              <Button variant="secondary" onClick={() => setShowAddModal(false)}>Cancel</Button>
              <Button onClick={handleCreateDonation}>Add Donation</Button>
            </div>
            {error && <p className="text-destructive mt-2">{error}</p>}
          </DialogContent>
        </Dialog>
      </div>

      <div className="overflow-x-auto mt-4">
        <table className="w-full border rounded-lg">
          <thead>
            <tr><th>Receipt #</th><th>Donor</th><th>Amount</th><th>Source</th><th>Status</th><th>Date</th></tr>
          </thead>
          <tbody>
            {filteredDonations.map((donation: any) => (
              <tr key={donation.id} className="border-t">
                <td>{donation.receipt_number}</td>
                <td>{donation.donor_name || "Anonymous"}</td>
                <td>{formatCurrency(donation.net_amount)}</td>
                <td>{donation.source}</td>
                <td><Badge variant={getStatusBadge(donation.status)}>{donation.status}</Badge></td>
                <td>{donation.received_at ? new Date(donation.received_at).toLocaleDateString() : ""}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
