import { NextRequest, NextResponse } from 'next/server'
import axios from 'axios'
import { v4 as uuidv4 } from 'uuid'
import prisma from '@/prisma/client'

export async function POST(req: NextRequest) {
  try {
    const {
      paymentMethod,
      amount,
      name,
      email,
      phoneNumber,
      donatorId, // Donator.userId
      shelterId, // Shelter.userId
    } = await req.json()

    if (paymentMethod !== 'Khalti') {
      return NextResponse.json({ message: 'Unsupported payment method' }, { status: 400 })
    }

    const donationId = uuidv4()

    const khaltiRes = await axios.post(
      'https://dev.khalti.com/api/v2/epayment/initiate/',
      {
        return_url: `${process.env.NEXTAUTH_URL}/api/payment/callback`,
        website_url: process.env.NEXTAUTH_URL,
        amount: amount * 100, // convert to paisa
        purchase_order_id: donationId,
        purchase_order_name: `Donation to Shelter ${shelterId}`,
        customer_info: {
          name,
          email,
          phone: phoneNumber,
        },
      },
      {
        headers: {
          Authorization: `Key ${process.env.KHALTI_SECRET_KEY}`,
        },
      }
    )

    // Create donation data object
    const donationData = {
      id: donationId,
      pidx: khaltiRes.data.pidx,
      transactionId: '',
      shelterId,
      amount,
      donatorName: name,
      payment_status: 'pending',
      paymentDetails: JSON.stringify({ initiated: true }),
    }

    // Only add donatorId if it exists and is not empty
    if (donatorId && donatorId.trim() !== '') {
      // @ts-ignore
      donationData.donatorId = donatorId
    }

    await prisma.donation.create({
      data: donationData,

    })

    return NextResponse.json({
      message: 'Donation initiated',
      donationId,
      payment_url: khaltiRes.data.payment_url,
    })
  } catch (error: any) {
    console.error('Khalti donation initiation failed:', error)

    return NextResponse.json({
      message: 'Donation initiation failed',
      error: error.message,
      details: error.response?.data,
    }, { status: 500 })
  }
}
