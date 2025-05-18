import { NextRequest, NextResponse } from "next/server";
import axios from "axios";
import prisma from "@/prisma/client";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const pidx = searchParams.get("pidx");
  const transactionId = searchParams.get("transaction_id");
  const amount = searchParams.get("amount");
  const orderId = searchParams.get("purchase_order_id");

  if (!pidx) {
    console.log("Payment canceled or pidx missing from callback");
    return NextResponse.redirect("http://localhost:3000/donation-failure?status=canceled");
  }

  try {
    // Verify payment with Khalti API
    const verificationResponse = await axios.post(
      "https://dev.khalti.com/api/v2/epayment/lookup/",
      { pidx },
      {
        headers: {
          Authorization: `Key ${process.env.KHALTI_SECRET_KEY}`,
        },
      }
    );
    // Fetch the payment record from the database
    const payment = await prisma.donation.findFirst({
      where: { pidx: pidx || undefined },
    });

    if (!payment) {
      console.error("Payment record not found for PIDX:", pidx);
      return NextResponse.redirect("http://localhost:3000/payment-failure");
    }

    // Map Khalti's status to the schema's allowed values
    const khaltiStatus = verificationResponse.data.status;
    let mappedStatus;

    switch (khaltiStatus) {
      case "Completed":
        mappedStatus = "paid";
        break;
      case "Pending":
        mappedStatus = "pending";
        break;
      case "Failed":
        mappedStatus = "failed";
        break;
      default:
        mappedStatus = "failed"; // Default to "failed" for unknown statuses
    }

    // Prepare the data for the database update
    const paymentData = {
      transactionId: transactionId || undefined, // Use null if transactionId is missing
      payment_status: mappedStatus, // Use the mapped status
      paymentDetails: JSON.stringify(verificationResponse.data), // Store Khalti response
      updatedAt: new Date(), // Current date as the payment date
    };

    // Update payment record in the database
    try {
      await prisma.donation.update({
        where: { id: payment.id },
        data: paymentData,
      });

      console.log("Payment record updated successfully.");
    } catch (error) {
      console.error("Error updating payment record:", error);
      throw error;
    }

    // Log the payment details
    console.log("Payment Details:", {
      pidx,
      transactionId,
      amount,
      orderId,

      status: mappedStatus, // Use the mapped status
      verificationResponse: verificationResponse.data,
    });

    // Redirect the user based on payment status
    if (mappedStatus === "paid") {
      // Get the shelter info including the shelter name from User table
      const shelterInfo = await prisma.shelter.findUnique({
        where: { userId: payment.shelterId },
        include: {
          user: {
            select: {
              name: true
            }
          }
        }
      });

      const shelterName = shelterInfo?.user?.name || "Unknown Shelter";
      const encodedShelterName = encodeURIComponent(shelterName);

      return NextResponse.redirect(
        `http://localhost:3000/donation-success?amount=${payment.amount}&shelterName=${encodedShelterName}`
      );
    } else {
      // Get the shelter info including the shelter name
      const shelterInfo = await prisma.shelter.findUnique({
        where: { userId: payment.shelterId },
        include: {
          user: {
            select: {
              name: true
            }
          }
        }
      });

      const shelterName = shelterInfo?.user?.name || "Unknown Shelter";
      const encodedShelterName = encodeURIComponent(shelterName);

      return NextResponse.redirect(
        `http://localhost:3000/donation-failure?amount=${payment.amount}&shelterName=${encodedShelterName}&status=${mappedStatus}`
      );
    }
  } catch (error) {
    console.error("Error handling payment callback:", error
    );
    return NextResponse.redirect("http://localhost:3000/donation-failure");
  }
}