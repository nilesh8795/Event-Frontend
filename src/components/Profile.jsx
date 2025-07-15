import React, { useState } from 'react'
import axios from 'axios'

function Profile() {
  const token = localStorage.getItem('playerToken')
  const [wallet, setWallet] = useState(null)

  const handleAddMoney = async () => {
    try {
      const amount = 100 // ₹100

      // Step 1: Create Razorpay order
      const { data } = await axios.post(        
        'http://localhost:5000/api/wallet/add-money',
        { amount },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )

      // Step 2: Initialize Razorpay Checkout
      const options = {
        key: data.key,
        amount: data.amount,
        currency: data.currency,
        name: 'Arena Clash',
        description: 'Wallet Top-up',
        order_id: data.orderId,
        handler: async function (response) {
          try {
            // Step 3: Verify payment
            const verifyRes = await axios.post(
              'http://localhost:5000/api/wallet/verify-payment',
              {
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                amount: amount, // ✅ pass amount too
              },
              {
                headers: {
                  Authorization: `Bearer ${token}`,
                },
              }
            )

            // ✅ Update wallet state
            setWallet(verifyRes.data.wallet)
            alert('✅ ₹100 added to wallet!')
          } catch (error) {
            console.error('Verification failed:', error)
            alert('❌ Payment verification failed.')
          }
        },
        prefill: {
          name: 'Test User',
          email: 'test@example.com',
        },
        theme: {
          color: '#10b981',
        },
      }

      const rzp = new window.Razorpay(options)
      rzp.open()
    } catch (err) {
      console.error('Add Money Error:', err)
      alert('❌ Failed to add money.')
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white shadow-lg rounded-2xl p-8 w-full max-w-md text-center">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Profile</h2>
        {wallet && (
          <p className="text-green-600 font-semibold mb-4">
            💰 Wallet Balance: ₹{wallet.balance}
          </p>
        )}
        <p className="text-gray-600 mb-6">Click below to add ₹100 to your wallet</p>
        <button
          onClick={handleAddMoney}
          className="bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-6 rounded-xl transition duration-300"
        >
          Add ₹100
        </button>
      </div>
    </div>
  )
}

export default Profile
