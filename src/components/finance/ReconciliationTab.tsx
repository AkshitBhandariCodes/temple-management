import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { AlertCircle, CheckCircle, Clock, AlertTriangle, XCircle, Copy, Filter } from "lucide-react";
import { supabase } from "../../utils/supabaseClient";

export const ReconciliationTab = () => {
  const [reconciliationData, setReconciliationData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filterStatus, setFilterStatus] = useState("all");
  const [showExceptionModal, setShowExceptionModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [exceptionType, setExceptionType] = useState("");
  const [exceptionDetails, setExceptionDetails] = useState("");

  const exceptionTypes = [
    { value: "missing-provider", label: "Missing Provider Data", icon: AlertTriangle, color: "orange" },
    { value: "amount-mismatch", label: "Amount Mismatches", icon: XCircle, color: "red" },
    { value: "duplicate", label: "Duplicate Entries", icon: Copy, color: "blue" },
    { value: "failed-transaction", label: "Failed Transactions", icon: AlertCircle, color: "purple" },
  ];

  const fetchData = async () => {
    setLoading(true);
    
    const { data: donations } = await supabase.from("donations").select("*");
    const { data: expenses } = await supabase.from("expenses").select("*");

    const items = [
      ...(donations || []).map((d) => ({
        id: d.id,
        type: "donation",
        transactionId: d.receipt_number || d.transaction_id || d.id.substring(0, 8),
        providerReference: d.transaction_id || "-",
        amount: d.net_amount || 0,
        date: d.received_at || d.created_at,
        status: d.reconciled ? "matched" : "unmatched",
        matchedWith: d.reconciled ? "Bank Record" : null,
        exceptionType: d.notes?.includes("EXCEPTION:") ? d.notes.split(":")[1].split("-")[0].trim() : null,
        exceptionDetails: d.notes?.includes("EXCEPTION:") ? d.notes.split("-")[1]?.trim() : null,
        source: d.source,
        provider: d.provider,
        donorName: d.donor_name,
      })),
      ...(expenses || []).map((e) => ({
        id: e.id,
        type: "expense",
        transactionId: e.receipt_number || e.id.substring(0, 8),
        providerReference: e.receipt_number || "-",
        amount: e.amount || 0,
        date: e.expense_date || e.created_at,
        status: e.status === "paid" ? "matched" : "unmatched",
        matchedWith: e.status === "paid" ? "Payment Verified" : null,
        exceptionType: e.notes?.includes("EXCEPTION:") ? e.notes.split(":")[1].split("-")[0].trim() : null,
        exceptionDetails: e.notes?.includes("EXCEPTION:") ? e.notes.split("-")[1]?.trim() : null,
        category: e.category,
        vendor: e.vendor_name,
      })),
    ];

    setReconciliationData(items);
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    const donationsSub = supabase
      .channel("donations-recon")
      .on("postgres_changes", { event: "*", schema: "public", table: "donations" }, fetchData)
      .subscribe();

    const expensesSub = supabase
      .channel("expenses-recon")
      .on("postgres_changes", { event: "*", schema: "public", table: "expenses" }, fetchData)
      .subscribe();

    return () => {
      supabase.removeChannel(donationsSub);
      supabase.removeChannel(expensesSub);
    };
  }, []);

  const handleMarkMatched = async (item) => {
    const table = item.type === "donation" ? "donations" : "expenses";
    const updateData = item.type === "donation" 
      ? { reconciled: true }
      : { status: "paid" };

    await supabase.from(table).update(updateData).eq("id", item.id);
    fetchData();
  };

  const handleMarkException = async () => {
    if (!exceptionType || !exceptionDetails) {
      alert("Please select exception type and provide details");
      return;
    }

    const selectedExceptionType = exceptionTypes.find(t => t.value === exceptionType);
    const table = selectedItem.type === "donation" ? "donations" : "expenses";
    
    await supabase.from(table).update({ 
      notes: `EXCEPTION: ${selectedExceptionType.label} - ${exceptionDetails}` 
    }).eq("id", selectedItem.id);
    
    setShowExceptionModal(false);
    setExceptionType("");
    setExceptionDetails("");
    setSelectedItem(null);
    fetchData();
  };

  const getStatusIcon = (status) => {
    if (status === "matched") return <CheckCircle className="w-4 h-4 text-green-600" />;
    if (status === "exception") return <AlertCircle className="w-4 h-4 text-red-600" />;
    return <Clock className="w-4 h-4 text-yellow-600" />;
  };

  const filteredData = filterStatus === "all" 
    ? reconciliationData 
    : reconciliationData.filter((item) => item.status === filterStatus);

  const exceptionStats = {
    missingProvider: reconciliationData.filter(i => i.providerReference === "-").length,
    amountMismatch: reconciliationData.filter(i => i.exceptionType === "Amount Mismatches").length,
    duplicate: reconciliationData.filter(i => i.exceptionType === "Duplicate Entries").length,
    failed: reconciliationData.filter(i => i.exceptionType === "Failed Transactions").length,
  };

  const stats = {
    total: reconciliationData.length,
    matched: reconciliationData.filter((i) => i.status === "matched").length,
    unmatched: reconciliationData.filter((i) => i.status === "unmatched").length,
  };

  return (
    <div className="space-y-6">
      {/* Exception Management Section */}
      <div>
        <h3 className="text-lg font-semibold mb-4">Exception Management</h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3 mb-2">
                <AlertTriangle className="w-5 h-5 text-orange-500" />
                <h4 className="font-medium">Missing Provider Data</h4>
              </div>
              <div className="text-3xl font-bold text-orange-500">{exceptionStats.missingProvider}</div>
              <p className="text-sm text-gray-600 mt-1">Transactions without provider reference</p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3 mb-2">
                <XCircle className="w-5 h-5 text-red-500" />
                <h4 className="font-medium">Amount Mismatches</h4>
              </div>
              <div className="text-3xl font-bold text-red-500">{exceptionStats.amountMismatch}</div>
              <p className="text-sm text-gray-600 mt-1">Provider amount differs from internal</p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3 mb-2">
                <Copy className="w-5 h-5 text-blue-500" />
                <h4 className="font-medium">Duplicate Entries</h4>
              </div>
              <div className="text-3xl font-bold text-blue-500">{exceptionStats.duplicate}</div>
              <p className="text-sm text-gray-600 mt-1">Potential duplicate transactions</p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3 mb-2">
                <AlertCircle className="w-5 h-5 text-purple-500" />
                <h4 className="font-medium">Failed Transactions</h4>
              </div>
              <div className="text-3xl font-bold text-purple-500">{exceptionStats.failed}</div>
              <p className="text-sm text-gray-600 mt-1">Failed payment transactions</p>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="text-sm text-gray-500">Total Transactions</div>
            <div className="text-2xl font-bold">{stats.total}</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-sm text-gray-500">Matched</div>
            <div className="text-2xl font-bold text-green-600">{stats.matched}</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-sm text-gray-500">Unmatched</div>
            <div className="text-2xl font-bold text-yellow-600">{stats.unmatched}</div>
          </CardContent>
        </Card>
      </div>

      {/* Main Table */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>Reconciliation</CardTitle>
            <div className="flex gap-2">
              <Button variant={filterStatus === "all" ? "default" : "outline"} size="sm" onClick={() => setFilterStatus("all")}>
                All
              </Button>
              <Button variant={filterStatus === "matched" ? "default" : "outline"} size="sm" onClick={() => setFilterStatus("matched")}>
                Matched
              </Button>
              <Button variant={filterStatus === "unmatched" ? "default" : "outline"} size="sm" onClick={() => setFilterStatus("unmatched")}>
                Unmatched
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="border-b">
                <tr className="text-left">
                  <th className="p-4">Status</th>
                  <th className="p-4">Type</th>
                  <th className="p-4">Transaction Details</th>
                  <th className="p-4">Provider Reference</th>
                  <th className="p-4">Amount</th>
                  <th className="p-4">Date</th>
                  <th className="p-4">Match Info</th>
                  <th className="p-4">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredData.map((item) => (
                  <tr key={item.id} className="border-b hover:bg-gray-50">
                    <td className="p-4">{getStatusIcon(item.status)}</td>
                    <td className="p-4">
                      <Badge className={item.type === "donation" ? "bg-green-100 text-green-800" : "bg-blue-100 text-blue-800"}>
                        {item.type}
                      </Badge>
                    </td>
                    <td className="p-4">
                      <div className="font-medium">{item.transactionId}</div>
                      <div className="text-xs text-gray-500">
                        {item.type === "donation" ? item.donorName || "Anonymous" : item.vendor || "N/A"}
                      </div>
                    </td>
                    <td className="p-4">{item.providerReference}</td>
                    <td className="p-4 font-medium">₹{item.amount.toLocaleString()}</td>
                    <td className="p-4">{item.date ? new Date(item.date).toLocaleDateString() : "-"}</td>
                    <td className="p-4">
                      {item.status === "matched" && item.matchedWith && (
                        <div className="flex items-center gap-1 text-green-600 text-xs">
                          <CheckCircle className="w-3 h-3" />
                          Matched with {item.matchedWith}
                        </div>
                      )}
                      {item.exceptionType && (
                        <div className="flex items-center gap-1 text-red-600 text-xs">
                          <AlertCircle className="w-3 h-3" />
                          {item.exceptionType}
                        </div>
                      )}
                      {item.status === "unmatched" && !item.exceptionType && (
                        <div className="text-yellow-600 text-xs">Awaiting match</div>
                      )}
                    </td>
                    <td className="p-4">
                      {item.status === "unmatched" && (
                        <div className="flex gap-2">
                          <Button size="sm" variant="outline" onClick={() => handleMarkMatched(item)}>
                            <CheckCircle className="w-3 h-3 mr-1" /> Match
                          </Button>
                          <Button size="sm" variant="outline" onClick={() => {
                            setSelectedItem(item);
                            setShowExceptionModal(true);
                          }}>
                            <AlertTriangle className="w-3 h-3 mr-1" /> Exception
                          </Button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {filteredData.length === 0 && (
              <div className="text-center py-12 text-gray-500">No transactions found</div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Exception Modal */}
      <Dialog open={showExceptionModal} onOpenChange={setShowExceptionModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Mark as Exception</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Exception Type</Label>
              <Select value={exceptionType} onValueChange={setExceptionType}>
                <SelectTrigger>
                  <SelectValue placeholder="Select exception type" />
                </SelectTrigger>
                <SelectContent>
                  {exceptionTypes.map((type) => {
                    const Icon = type.icon;
                    return (
                      <SelectItem key={type.value} value={type.value}>
                        <div className="flex items-center gap-2">
                          <Icon className={`w-4 h-4 text-${type.color}-500`} />
                          {type.label}
                        </div>
                      </SelectItem>
                    );
                  })}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Detailed Reason</Label>
              <Textarea
                value={exceptionDetails}
                onChange={(e) => setExceptionDetails(e.target.value)}
                placeholder="Provide detailed explanation for this exception..."
                rows={4}
              />
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setShowExceptionModal(false)}>
                Cancel
              </Button>
              <Button onClick={handleMarkException} disabled={!exceptionType || !exceptionDetails}>
                Mark Exception
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};
