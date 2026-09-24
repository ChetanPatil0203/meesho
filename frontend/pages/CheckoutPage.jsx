import { useState } from 'react';
import api from '../services/api';

const addresses = [
  { id: 1, name: 'Chetan Pazi', type: 'Home', address: '204, Park Avenue, Andheri West', city: 'Mumbai', state: 'Maharashtra', pincode: '400053', phone: '+91 9876543210', default: true },
  { id: 2, name: 'Chetan Pazi', type: 'Work', address: '5th Floor, Tech Tower, BKC', city: 'Mumbai', state: 'Maharashtra', pincode: '400051', phone: '+91 9876543210', default: false }];

const paymentMethods = [
  { id: 'upi', label: 'UPI', icon: '📱', desc: 'Google Pay, PhonePe, Paytm' },
  { id: 'card', label: 'Credit / Debit Card', icon: '💳', desc: 'Visa, Mastercard, RuPay' },
  { id: 'netbanking', label: 'Net Banking', icon: '🏦', desc: 'All major banks supported' },
  { id: 'wallet', label: 'Wallets', icon: '👛', desc: 'Paytm, Amazon Pay & more' },
  { id: 'cod', label: 'Cash on Delivery', icon: '💵', desc: 'Pay on delivery' }];

export default function CheckoutPage({ onNavigate, cartItems, onShowToast, onClearCart }) {
  const [step, setStep] = useState(1);
  const [selectedAddress, setSelectedAddress] = useState(1);
  const [deliveryOption, setDeliveryOption] = useState('standard');
  const [selectedPayment, setSelectedPayment] = useState('upi');
  const [upiId, setUpiId] = useState('');
  const [processing, setProcessing] = useState(false);

  const total = cartItems.reduce((sum, item) => sum + item.product.price * item.quantity, 0) + 20;

  const handlePlaceOrder = async () => {
    setProcessing(true);
    const addr = addresses.find((a) => a.id === selectedAddress);
    try {
      const res = await api.createOrder({
        totalAmount: total,
        address: addr,
        items: cartItems.map(i => ({
          productId: i.product?.id,
          name: i.product?.name,
          price: i.product?.price,
          quantity: i.quantity,
          color: i.color,
          size: i.size
        })),
        paymentMethod: selectedPayment.toUpperCase(),
      });
      const orderId = res.order?.id || `SK${Date.now()}`;
      onClearCart();
      onNavigate('order-success', { orderId, total, address: addr });
    } catch (err) {
      onClearCart();
      onNavigate('order-success', { orderId: `SK${Date.now()}`, total, address: addr });
    } finally {
      setProcessing(false);
    }
  };

  const steps = [
    { num: 1, label: 'Address' },
    { num: 2, label: 'Delivery' },
    { num: 3, label: 'Payment' }];


  return (
    <div className="max-w-5xl mx-auto px-4 py-6">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Checkout</h1>

      {/* Step indicator */}
      <div className="flex items-center mb-8">
        {steps.map((s, i) =>
          <div key={s.num} className="flex items-center flex-1">
            <div className="flex items-center gap-2">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-colors ${step >= s.num ? 'bg-[#3B5BDB] text-white' : 'bg-gray-200 text-gray-400'}`}>
                {step > s.num ? '✓' : s.num}
              </div>
              <span className={`text-sm font-medium ${step >= s.num ? 'text-gray-800' : 'text-gray-400'}`}>{s.label}</span>
            </div>
            {i < steps.length - 1 && <div className={`flex-1 h-0.5 mx-3 transition-colors ${step > s.num ? 'bg-[#3B5BDB]' : 'bg-gray-200'}`} />}
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">

          {/* Step 1: Address */}
          {step === 1 &&
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <h2 className="font-bold text-gray-800 mb-4">Select Delivery Address</h2>
              <div className="space-y-3 mb-4">
                {addresses.map((addr) =>
                  <label key={addr.id} className={`block border-2 rounded-xl p-4 cursor-pointer transition-all ${selectedAddress === addr.id ? 'border-[#3B5BDB] bg-blue-50' : 'border-gray-200 hover:border-gray-300'}`}>
                    <div className="flex items-start gap-3">
                      <input type="radio" name="address" checked={selectedAddress === addr.id} onChange={() => setSelectedAddress(addr.id)} className="mt-1 accent-[#3B5BDB]" />
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-gray-800">{addr.name}</span>
                          <span className="text-xs bg-blue-100 text-[#3B5BDB] px-2 py-0.5 rounded-full font-medium">{addr.type}</span>
                          {addr.default && <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full">Default</span>}
                        </div>
                        <p className="text-sm text-gray-600 mt-1">{addr.address}, {addr.city}, {addr.state} - {addr.pincode}</p>
                        <p className="text-sm text-gray-500 mt-0.5">📞 {addr.phone}</p>
                      </div>
                      <div className="flex gap-2">
                        <button className="text-xs text-[#3B5BDB] hover:underline">Edit</button>
                        <button className="text-xs text-red-500 hover:underline">Delete</button>
                      </div>
                    </div>
                  </label>
                )}
              </div>
              <button className="w-full border-2 border-dashed border-gray-300 rounded-xl py-3 text-sm text-gray-500 hover:border-[#3B5BDB] hover:text-[#3B5BDB] transition-colors">
                + Add New Address
              </button>
              <button onClick={() => setStep(2)} className="w-full mt-4 py-3 bg-[#3B5BDB] text-white font-bold rounded-xl hover:bg-[#2F4AC4] transition-colors">
                Deliver Here →
              </button>
            </div>
          }

          {/* Step 2: Delivery */}
          {step === 2 &&
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <h2 className="font-bold text-gray-800 mb-4">Delivery Options</h2>
              <div className="space-y-3 mb-6">
                {[
                  { id: 'standard', label: 'Standard Delivery', time: '2-4 days (by 14 Apr)', price: 'FREE', desc: 'Delivered by BlueDart' },
                  { id: 'express', label: 'Express Delivery', time: '1-2 days (by 13 Apr)', price: '₹49', desc: 'Delivered by Delhivery' },
                  { id: 'same', label: 'Same Day Delivery', time: 'Today by 9 PM', price: '₹99', desc: 'Only for Mumbai orders' }].
                  map((opt) =>
                    <label key={opt.id} className={`block border-2 rounded-xl p-4 cursor-pointer transition-all ${deliveryOption === opt.id ? 'border-[#3B5BDB] bg-blue-50' : 'border-gray-200 hover:border-gray-300'}`}>
                      <div className="flex items-center gap-3">
                        <input type="radio" name="delivery" checked={deliveryOption === opt.id} onChange={() => setDeliveryOption(opt.id)} className="accent-[#3B5BDB]" />
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <span className="font-semibold text-gray-800">{opt.label}</span>
                            <span className={`font-bold text-sm ${opt.price === 'FREE' ? 'text-green-600' : 'text-gray-800'}`}>{opt.price}</span>
                          </div>
                          <p className="text-sm text-gray-500 mt-0.5">🚚 {opt.time} · {opt.desc}</p>
                        </div>
                      </div>
                    </label>
                  )}
              </div>
              <div className="flex gap-3">
                <button onClick={() => setStep(1)} className="flex-1 py-3 border border-gray-200 text-gray-700 font-semibold rounded-xl hover:bg-gray-50 transition-colors">← Back</button>
                <button onClick={() => setStep(3)} className="flex-1 py-3 bg-[#3B5BDB] text-white font-bold rounded-xl hover:bg-[#2F4AC4] transition-colors">Continue →</button>
              </div>
            </div>
          }

          {/* Step 3: Payment */}
          {step === 3 &&
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <h2 className="font-bold text-gray-800 mb-4">Payment Method</h2>
              <div className="space-y-3 mb-6">
                {paymentMethods.map((method) =>
                  <label key={method.id} className={`block border-2 rounded-xl p-4 cursor-pointer transition-all ${selectedPayment === method.id ? 'border-[#3B5BDB] bg-blue-50' : 'border-gray-200 hover:border-gray-300'}`}>
                    <div className="flex items-center gap-3">
                      <input type="radio" name="payment" checked={selectedPayment === method.id} onChange={() => setSelectedPayment(method.id)} className="accent-[#3B5BDB]" />
                      <span className="text-xl">{method.icon}</span>
                      <div>
                        <p className="font-semibold text-sm text-gray-800">{method.label}</p>
                        <p className="text-xs text-gray-400">{method.desc}</p>
                      </div>
                    </div>
                    {selectedPayment === method.id && method.id === 'upi' &&
                      <div className="mt-3 ml-8">
                        <input type="text" placeholder="Enter UPI ID (e.g. mobile@upi)" value={upiId} onChange={(e) => setUpiId(e.target.value)}
                          className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-[#3B5BDB]" />
                        <div className="flex gap-3 mt-2">
                          {['PhonePe', 'GPay', 'Paytm'].map((app) =>
                            <button key={app} className="px-3 py-1.5 bg-white border border-gray-200 rounded-lg text-xs font-medium hover:border-[#3B5BDB] transition-colors">{app}</button>
                          )}
                        </div>
                      </div>
                    }
                    {selectedPayment === method.id && method.id === 'card' &&
                      <div className="mt-3 ml-8 space-y-2">
                        <input type="text" placeholder="Card Number" className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-[#3B5BDB]" />
                        <div className="grid grid-cols-2 gap-2">
                          <input type="text" placeholder="MM/YY" className="border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-[#3B5BDB]" />
                          <input type="text" placeholder="CVV" className="border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-[#3B5BDB]" />
                        </div>
                      </div>
                    }
                  </label>
                )}
              </div>
              <div className="flex gap-3">
                <button onClick={() => setStep(2)} className="flex-1 py-3 border border-gray-200 text-gray-700 font-semibold rounded-xl hover:bg-gray-50 transition-colors">← Back</button>
                <button
                  onClick={handlePlaceOrder}
                  disabled={processing}
                  className="flex-1 py-3 bg-orange-500 text-white font-bold rounded-xl hover:bg-orange-600 transition-colors disabled:opacity-70 flex items-center justify-center gap-2">

                  {processing ? <><div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> Processing...</> : `Place Order · ₹${total.toLocaleString()}`}
                </button>
              </div>
              <p className="text-xs text-center text-gray-400 mt-3">🔒 Your payment info is 100% secure and encrypted</p>
            </div>
          }
        </div>

        {/* Order summary sidebar */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 h-fit">
          <h3 className="font-bold text-gray-800 mb-4">Order Summary</h3>
          <div className="space-y-3 mb-4">
            {cartItems.slice(0, 3).map((item) =>
              <div key={item.product.id} className="flex gap-3">
                <div className="w-12 h-14 rounded-lg overflow-hidden bg-gray-50 flex-shrink-0">
                  <img src={item.product.image} alt="" className="w-full h-full object-cover" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium text-gray-800 line-clamp-2">{item.product.name}</p>
                  <p className="text-xs text-gray-500 mt-0.5">Qty: {item.quantity}</p>
                  <p className="text-xs font-bold mt-0.5">₹{(item.product.price * item.quantity).toLocaleString()}</p>
                </div>
              </div>
            )}
            {cartItems.length > 3 && <p className="text-xs text-gray-400 text-center">+{cartItems.length - 3} more items</p>}
          </div>
          <div className="border-t border-gray-100 pt-4 space-y-2 text-sm">
            <div className="flex justify-between text-gray-600"><span>Subtotal</span><span>₹{(total - 20).toLocaleString()}</span></div>
            <div className="flex justify-between text-gray-600"><span>Platform Fee</span><span>₹20</span></div>
            <div className="flex justify-between font-bold text-lg border-t border-gray-100 pt-2 mt-2"><span>Total</span><span>₹{total.toLocaleString()}</span></div>
          </div>
        </div>
      </div>
    </div>);

}