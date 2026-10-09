import { useState, useEffect, useCallback } from 'react';
import API from '../services/api';

export const useReservations = () => {
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);
  const [activeTab, setActiveTab] = useState('cart');
  const [showCheckoutModal, setShowCheckoutModal] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState('Barzahlung');
  const [isProcessing, setIsProcessing] = useState(false);
  const [latestReceipt, setLatestReceipt] = useState(null);

  const [appliedDiscount, setAppliedDiscount] = useState(0);
  const [isCouponApplied, setIsCouponApplied] = useState(false);
  const [selectedDonation, setSelectedDonation] = useState(0);

  let user = null;
  try {
    const storedUser = localStorage.getItem('user');
    user = storedUser ? JSON.parse(storedUser) : null;
  } catch (parseErr) {
    console.error('Error parsing stored user:', parseErr);
  }

  const userId = user?.id;

  const fetchReservations = useCallback(async () => {
    if (!userId) {
      setLoading(false);
      return;
    }

    try {
      const res = await API.get(`/reservations/user/${userId}`);
      const data = res.data || [];
      setReservations(data);
    } catch (err) {
      console.error('Fehler beim Laden der Reservierungen:', err);
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    fetchReservations();

    // تحديث دوري كل 3 ثوانٍ لمتابعة حالة الوجبة حياً عند الزبون
    const interval = setInterval(() => {
      fetchReservations();
    }, 3000);

    const handleCartUpdate = () => {
      fetchReservations();
    };

    window.addEventListener('updateCart', handleCartUpdate);
    return () => {
      clearInterval(interval);
      window.removeEventListener('updateCart', handleCartUpdate);
    };
  }, [fetchReservations]);

  const cartItems = reservations.filter((item) => item.status === 'pending' || !item.status);
  
  // معالجة طلبات الزبون التأكيدية: وسْم الوجبات المنتهية والمحذوفة تلقائياً
  const confirmedOrders = reservations
    .filter((item) => item.status === 'confirmed')
    .map((ord) => {
      const now = new Date();
      const expDate = ord.expiration_date ? new Date(ord.expiration_date) : null;
      const isExpired = ord.is_expired === true || !ord.expiration_date || (expDate && expDate <= now);

      return {
        ...ord,
        is_expired: isExpired
      };
    });

  const groupedCartItems = Object.values(
    cartItems.reduce((acc, item) => {
      const fId = item.food_id;
      const totalAvailable = parseInt(
        item.available_quantity ?? item.total_quantity ?? item.quantity ?? 999,
        10
      );

      if (!acc[fId]) {
        acc[fId] = {
          ...item,
          cartQuantity: 1,
          maxAvailable: totalAvailable,
          reservationIds: [item.reservation_id || item.id]
        };
      } else {
        acc[fId].cartQuantity += 1;
        acc[fId].reservationIds.push(item.reservation_id || item.id);
      }
      return acc;
    }, {})
  );

  const handleIncrease = async (item) => {
    if (isUpdating) return;
    if (item.maxAvailable !== undefined && item.cartQuantity >= item.maxAvailable) {
      alert('Alle verfügbaren Portionen befinden sich bereits in Ihrem Warenkorb.');
      return;
    }

    setIsUpdating(true);
    try {
      await API.post('/reservations/add', {
        food_id: item.food_id,
        receiver_id: user.id
      });
      await fetchReservations();
      window.dispatchEvent(new Event('updateCart'));
    } catch (err) {
      alert(err.response?.data?.message || 'Leider sind keine weiteren Portionen verfügbar.');
    } finally {
      setIsUpdating(false);
    }
  };

  const handleDecrease = async (item) => {
    if (isUpdating || !item.reservationIds || item.reservationIds.length === 0) return;
    setIsUpdating(true);
    const resIdToDelete = item.reservationIds[item.reservationIds.length - 1];

    try {
      await API.delete(`/reservations/${resIdToDelete}`);
      await fetchReservations();
      window.dispatchEvent(new Event('updateCart'));
    } catch (err) {
      console.error(err);
      alert('Fehler beim Verringern der Menge.');
    } finally {
      setIsUpdating(false);
    }
  };

  const handleDeleteAllOfItem = async (item) => {
    if (isUpdating) return;
    if (window.confirm('Möchten Sie diese Position komplett entfernen?')) {
      setIsUpdating(true);
      try {
        for (const resId of item.reservationIds) {
          await API.delete(`/reservations/${resId}`);
        }
        await fetchReservations();
        window.dispatchEvent(new Event('updateCart'));
      } catch (err) {
        console.error(err);
        alert('Fehler beim Entfernen.');
      } finally {
        setIsUpdating(false);
      }
    }
  };

  const originalTotalPrice = cartItems.reduce((sum, item) => sum + parseFloat(item.price || 0), 0);
  const subTotal = originalTotalPrice + selectedDonation;
  const finalTotalPrice = Math.max(0, subTotal - appliedDiscount);

  const handleApplyWelcomeCoupon = () => {
    setAppliedDiscount(5.0);
    setIsCouponApplied(true);
  };

  const handleCheckout = async () => {
    setIsProcessing(true);
    const firstItem = cartItems[0];
    const receiptData = {
      id: firstItem ? (firstItem.reservation_id || firstItem.id) : '123',
      foodTitle: firstItem ? (firstItem.title || 'Lebensmittel-Paket') : 'Lebensmittel-Paket',
      quantity: cartItems.length,
      totalPrice: finalTotalPrice,
      totalDonation: selectedDonation,
      paymentMethod: selectedPayment
    };

    try {
      await Promise.all(
        cartItems.map((item) =>
          API.put(`/reservations/checkout/${item.reservation_id || item.id}`, {
            payment_method: selectedPayment,
            payment_status: selectedPayment === 'Barzahlung' ? 'Pending' : 'Paid',
            status: 'confirmed',
            donation_amount: selectedDonation
          }).catch((err) => console.log('Checkout single note:', err))
        )
      );

      if (isCouponApplied && user?.id) {
        try {
          await API.put(`/auth/profile/${user.id}`, {
            name: user.name,
            email: user.email,
            is_coupon_used: true
          });
          const updatedUser = { ...user, is_coupon_used: true };
          localStorage.setItem('user', JSON.stringify(updatedUser));
        } catch (couponErr) {
          console.error('Coupon Error:', couponErr);
        }
      }
    } catch (err) {
      console.error('Checkout error:', err);
    } finally {
      setLatestReceipt(receiptData);
      setShowCheckoutModal(false);
      setIsProcessing(false);
      setAppliedDiscount(0);
      setIsCouponApplied(false);
      setSelectedDonation(0);
      setActiveTab('orders');
      await fetchReservations();
      window.dispatchEvent(new Event('updateCart'));
    }
  };

  const hasWelcomeCoupon = user && user.welcome_coupon && !user.is_coupon_used;

  return {
    reservations,
    loading,
    isUpdating,
    activeTab,
    setActiveTab,
    showCheckoutModal,
    setShowCheckoutModal,
    selectedPayment,
    setSelectedPayment,
    isProcessing,
    latestReceipt,
    setLatestReceipt,
    appliedDiscount,
    isCouponApplied,
    selectedDonation,
    setSelectedDonation,
    user,
    cartItems,
    confirmedOrders,
    groupedCartItems,
    originalTotalPrice,
    finalTotalPrice,
    hasWelcomeCoupon,
    handleIncrease,
    handleDecrease,
    handleDeleteAllOfItem,
    handleApplyWelcomeCoupon,
    handleCheckout
  };
};