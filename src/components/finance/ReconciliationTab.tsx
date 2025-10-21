import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CheckCircle, XCircle, AlertTriangle, RefreshCw, Link, Eye, Plus } from "lucide-react";
import { supabase } from "../../utils/supabaseClient";

export const ReconciliationTab = () => {
  const [reconciliationItems, setReconciliationItems] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null);
  const [showMatchModal, setShowMatchModal] = useState(false);
  const [showExceptionModal, setShowExceptionModal] = useState(false);
  const [exceptionReason, setExceptionReason] = useState("");
  const [loading, setLoading] = useState(false);

  const fetchReconciliationData = async () => {
    setLoading(true);
    const { data, error } = await supabase.from("reconciliation").select("*").order("date", { ascending: false });
    if (error) console.error(error);
    setReconciliationItems(data || []);
    setLoading(false);
  };

  useEffect(() => {
    fetchReconciliationData();
    const subscription = supabase
      .channel("reconciliation-changes")
      .on("postgres_changes", { event: "*", schema: "public", table: "reconciliation" }, fetchReconciliationData)
      .subscribe();
    return () => {
      supabase.removeChannel(subscription);
    };
  }, []);

  const handleMarkMatched = async (itemId, matchedWith) => {
    await supabase.from("reconciliation").update({ status: "matched", matched_with: matchedWith }).eq("id", itemId);
  };

  const handleMarkException = async (itemId, reason) => {
    await supabase.from("reconciliation").update({ status: "exception", exception_reason: reason }).eq("id", itemId);
    setShowExceptionModal(false);
    setExceptionReason("");
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "matched":
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case "exception":
        return <AlertTriangle className="w-5 h-5 text-yellow-500" />;
      case "unmatched":
      default:
        return <XCircle className="w-5 h-5 text-red-500" />;
    }
  };

  const unmatchedCount = reconciliationItems.filter((i) => i.status === "unmatched").length;
  const exceptionCount = reconciliationItems.filter((i) => i.status === "exception").length;
  const matchedCount = reconciliationItems.filter((i) => i.status === "matched").length;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="text-sm text-gray-500">Unmatched</div>
            <div className="text-2xl font-bold text-red-600">{unmatchedCount}</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-sm text-gray-500">Exceptions</div>
            <div className="text-2xl font-bold text-yellow-600">{exceptionCount}</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-sm text-gray-500">Matched</div>
            <div className="text-2xl font-bold text-green-600">{matchedCount}</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-sm text-gray-500">Total Items</div>
            <div className="text-2xl font-bold">{reconciliationItems.length}</div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Reconciliation Items</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="border-b">
                <tr className="text-left">
                  <th className="p-4">Status</th>
                  <th className="p-4">Transaction Details</th>
                  <th className="p-4">Provider Reference</th>
                  <th className="p-4">Amount</th>
                  <th className="p-4">Date</th>
                  <th className="p-4">Match Info</th>
                  <th className="p-4">Actions</th>
                </tr>
              </thead>
              <tbody>
                {reconciliationItems.map((item) => (
                  <tr key={item.id} className="border-b hover:bg-gray-50">
                    <td className="p-4">{getStatusIcon(item.status)}</td>
                    <td className="p-4">
                      <div className="font-medium">{item.transaction_id}</div>
                      <div className="text-xs text-gray-500">Internal Transaction</div>
                    </td>
                    <td className="p-4">
                      <div className="font-medium">{item.provider_reference || "N/A"}</div>
                      <div className="text-xs text-gray-500">Provider Reference</div>
                    </td>
                    <td className="p-4">
                      <div className="font-medium">₹{item.amount?.toLocaleString()}</div>
                    </td>
                    <td className="p-4">
                      <div>{item.date ? new Date(item.date).toLocaleDateString() : ""}</div>
                      <div className="text-xs text-gray-500">
                        {item.date ? new Date(item.date).toLocaleTimeString() : ""}
                      </div>
                    </td>
                    <td className="p-4">
                      {item.status === "matched" && item.matched_with && (
                        <Badge variant="default">✓ Matched with {item.matched_with}</Badge>
                      )}
                      {item.status === "exception" && (
                        <Badge variant="destructive">⚠ Exception: {item.exception_reason}</Badge>
                      )}
                      {item.status === "unmatched" && <Badge variant="destructive">Awaiting match</Badge>}
                    </td>
                    <td className="p-4">
                      {item.status === "unmatched" && (
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => {
                              setSelectedItem(item);
                              setShowMatchModal(true);
                            }}
                          >
                            <Link className="w-4 h-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => {
                              setSelectedItem(item);
                              setShowExceptionModal(true);
                            }}
                          >
                            <AlertTriangle className="w-4 h-4" />
                          </Button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {reconciliationItems.length === 0 && (
              <div className="text-center py-12 text-gray-500">No reconciliation items found.</div>
            )}
          </div>
        </CardContent>
      </Card>

      <Dialog open={showMatchModal} onOpenChange={setShowMatchModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Mark as Matched</DialogTitle>
          </DialogHeader>
          <div className="space-y-3">
            <Label>Match With</Label>
            <Input placeholder="Enter matched transaction ID" id="matchInput" />
            <div className="flex justify-end gap-2 pt-4">
              <Button variant="outline" onClick={() => setShowMatchModal(false)}>Cancel</Button>
              <Button
                onClick={() => {
                  const matchedWith = document.getElementById("matchInput").value;
                  if (selectedItem && matchedWith) {
                    handleMarkMatched(selectedItem.id, matchedWith);
                    setShowMatchModal(false);
                  }
                }}
              >
                Confirm Match
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={showExceptionModal} onOpenChange={setShowExceptionModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Mark as Exception</DialogTitle>
          </DialogHeader>
          <div className="space-y-3">
            <Label>Exception Reason</Label>
            <Textarea value={exceptionReason} onChange={(e) => setExceptionReason(e.target.value)} placeholder="Enter reason for exception" />
            <div className="flex justify-end gap-2 pt-4">
              <Button variant="outline" onClick={() => setShowExceptionModal(false)}>Cancel</Button>
              <Button
                onClick={() => {
                  if (selectedItem && exceptionReason) {
                    handleMarkException(selectedItem.id, exceptionReason);
                  }
                }}
              >
                Mark Exception
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};
