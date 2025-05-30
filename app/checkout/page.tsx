// app/pay/page.tsx
"use client";

import React from 'react';
import { useEffect, useState } from 'react';
import { IProduct } from '../models/Product';

export default function PreviewPage() {
  const [productData, setProduct] = useState<IProduct | null>(null);// State to hold product details
  const [loading, setLoading] = useState(true); 
  const priceId = "price_1QHo1xA4oacG8dLnQ9As52z5"; // Replace with your actual price ID
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await fetch(`/api/products/${priceId}`); // Use priceId directly
        if (!res.ok) {
          throw new Error('Failed to fetch product');
        }
        const productData = await res.json();
        console.log('Fetched product:', productData);
        setProduct(productData); // Set the fetched product details in state
      } catch (error) {
        console.error('Error fetching product:', error);
      } finally {
        setLoading(false); // Set loading to false after fetch
      }
    };

    fetchProduct();
  }, [priceId]);

  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent the default form submission

    const res = await fetch('/api/payments/create-checkout-session', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ priceId }), // Send the priceId in the request body
    });

    if (!res.ok) {
        const errorData = await res.json();
        console.error('Error fetching session:', errorData);
        throw new Error(errorData.error || 'Failed to create checkout session');
    }


    const data = await res.json();
    if (data.url) {
        window.location.href = data.url; 
    } 
  };

  return (
    <form onSubmit={handleSubmit} className='w-1/3 mx-auto'>
      <section className='p-8 border-2 border-gray-200 rounded-lg flex flex-col' >
      {loading ? (
          <p>Loading product...</p>
        ) : productData ? (
          <>
            <h1 className='text-2xl py-4 font-bold text-gray-800'>{productData.nickname}</h1> 
            <p className='text-lg py-4'>{productData.description}</p> 
            <p className='text-lg py-4'>Price: $ {productData.unit_amount / 100} {productData.currency.toUpperCase()}</p> 
          </>
        ) : (
          <p>Product not found.</p>
        )}
        <button className="flex items-center bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded" type="submit" role="link">
          Checkout
        </button>
      </section>
     {/* To Do add other options */}
    </form>
  );
}
