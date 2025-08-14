"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2, DollarSign } from "lucide-react";

export default function QuizAccessPage() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handlePayment = async () => {
    setLoading(true);

    // Backend pe subscription activate
    const res = await fetch("/api/activate-subscription", { method: "POST" });
    if (res.ok) {
      router.push("/quiz");
    } else {
      alert("Payment failed. Try again.");
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 to-gray-800 text-white p-6">
      <Card className="w-full max-w-md bg-gray-900 border-gray-700 shadow-2xl rounded-2xl">
        <CardHeader>
          <CardTitle className="text-3xl font-bold flex items-center gap-2">
            <DollarSign className="text-yellow-400" /> Unlock Premium Quiz
          </CardTitle>
          <CardDescription className="text-gray-300">
            Access exclusive quizzes for just $10 one-time payment.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <Button
            onClick={handlePayment}
            className="bg-yellow-500 hover:bg-yellow-600 text-black font-semibold text-lg py-6 rounded-xl"
            disabled={loading}
          >
            {loading ? (
              <>
                <Loader2 className="animate-spin mr-2" /> Processing...
              </>
            ) : (
              <>Pay $10 & Unlock</>
            )}
          </Button>
          <p className="text-sm text-gray-400 text-center">
            Pay and get access...
          </p>
        </CardContent>
      </Card>
    </div>
  );
}