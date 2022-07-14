import type { NextPage } from 'next'
import Head from 'next/head'
import Image from 'next/image'
import { useRouter } from 'next/router'
import { MouseEventHandler, useState } from 'react'
import { getStripe } from '../utils/getStripe'
import { postRequest } from '../utils/postRequest'

const mItem = {
  name: 'Nike Airforce 1',
  image:
    'https://images.unsplash.com/photo-1600269452121-4f2416e55c28?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxzZWFyY2h8Nnx8bmlrZSUyMHNob2VzfGVufDB8fDB8fA%3D%3D&auto=format&fit=crop&w=500&q=60',
  price: 200,
  description:
    'Lorem ipsum dolor sit amet consectetur adipisicing elit. Distinctio, quia!',
  quantity: 1,
}

const Home: NextPage = () => {
  const [item, setItem] = useState(mItem)
  const [loading, setLoading] = useState(false)
  const { query } = useRouter()

  const decreaseQuantity: MouseEventHandler<HTMLButtonElement> = () => {
    setItem((item) => ({
      ...item,
      quantity: item.quantity > 1 ? item.quantity - 1 : item.quantity,
    }))
  }

  const increaseQuantity: MouseEventHandler<HTMLButtonElement> = () => {
    setItem((item) => ({ ...item, quantity: item.quantity + 1 }))
  }

  const checkout: MouseEventHandler<HTMLButtonElement> = async () => {
    setLoading(true)

    // Create a Checkout Session.
    const response = await postRequest('/api/checkout-session', { item })

    if (response.statusCode === 500) {
      console.error(response.message)
      return
    }

    // Redirect to Checkout.
    const stripe = await getStripe()
    const { error } = await stripe!.redirectToCheckout({
      // Make the id field from the Checkout Session creation API response
      // available to this file, so you can provide it as parameter here
      // instead of the {{CHECKOUT_SESSION_ID}} placeholder.
      sessionId: response.id,
    })
    // If `redirectToCheckout` fails due to a browser or network
    // error, display the localized error message to your customer
    // using `error.message`.
    console.warn(error.message)
    setLoading(false)
  }

  return (
    <div>
      <Head>
        <title>Stripe Checkout with Next.js &amp; Tailwind CSS</title>
        <meta
          name='description'
          content='Stripe Checkout with Next.js and Tailwind CSS'
        />
        <link rel='icon' href='/favicon.ico' />
      </Head>

      <main>
        <h1 className='text-3xl font-semibold text-center mt-10 text-gray-400'>
          Stripe Checkout with Next.js &amp; Tailwind CSS
        </h1>
        {query.status === 'cancelled' && <div className="bg-red-400 text-white rounded-lg shadow-lg shadow-green-200 p-3 max-w-sm mt-7 mx-auto flex items-center justify-center space-x-3">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
          </svg>
          <span>
            Cancelled by user
          </span>

        </div>}
        {query.status === 'success' &&
          <div className="bg-green-400 text-white rounded-lg shadow-lg shadow-green-200 p-3 max-w-sm mt-7 mx-auto flex items-center justify-center space-x-3">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            <span>
              Payment Successful. Please check your email for the receipt.
            </span>

          </div>
        }
        <div className='mt-8 bg-white shadow-xl rounded-lg ring-1 ring-gray-100 max-w-sm mx-auto relative'>
          <Image
            src={item.image}
            alt={item.name}
            height='80%'
            width='100%'
            layout='responsive'
            objectFit='cover'
            className='rounded-tl-lg rounded-tr-lg'
          />

          <div className='px-4 py-3'>
            <div className='flex items-center text-purple-600'>
              <svg
                xmlns='http://www.w3.org/2000/svg'
                className='h-4 w-4'
                viewBox='0 0 20 20'
                fill='currentColor'
              >
                <path d='M3 1a1 1 0 000 2h1.22l.305 1.222a.997.997 0 00.01.042l1.358 5.43-.893.892C3.74 11.846 4.632 14 6.414 14H15a1 1 0 000-2H6.414l1-1H14a1 1 0 00.894-.553l3-6A1 1 0 0017 3H6.28l-.31-1.243A1 1 0 005 1H3zM16 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM6.5 18a1.5 1.5 0 100-3 1.5 1.5 0 000 3z' />
              </svg>
              <span className='text-sm'>Shopping</span>
            </div>

            <h5 className='text-xl font-semibold'>{item.name}</h5>
            <p className='text-sm text-gray-400'>{item.description}</p>

            <div className='flex items-center justify-between mt-3'>
              <h6 className='text-3xl font-bold'>${item.price * item.quantity}</h6>
              <div className='flex items-center space-x-3'>
                <button
                  className='decrease__quantity p-1 rounded-full ring-1 ring-gray-200'
                  onClick={decreaseQuantity}
                >
                  <svg
                    xmlns='http://www.w3.org/2000/svg'
                    className='h-4 w-4 text-gray-500'
                    viewBox='0 0 20 20'
                    fill='currentColor'
                  >
                    <path
                      fillRule='evenodd'
                      d='M5 10a1 1 0 011-1h8a1 1 0 110 2H6a1 1 0 01-1-1z'
                      clipRule='evenodd'
                    />
                  </svg>
                </button>
                <span className='quantity'>{item.quantity}</span>
                <button
                  className='increase__quantity p-1 rounded-full ring-1 ring-gray-200'
                  onClick={increaseQuantity}
                >
                  <svg
                    xmlns='http://www.w3.org/2000/svg'
                    className='h-4 w-4 text-gray-500'
                    viewBox='0 0 20 20'
                    fill='currentColor'
                  >
                    <path
                      fillRule='evenodd'
                      d='M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z'
                      clipRule='evenodd'
                    />
                  </svg>
                </button>
              </div>
            </div>

            {loading ? (
              <button
                type='button'
                className='mt-6 rounded-md py-2 px-3 w-full text-white shadow-lg bg-blue-500 shadow-blue-200 uppercase text-sm hover:ring-1 hover:ring-blue-500'
              >
                Processing...
              </button>
            ) : (
              <button
                type='button'
                className='mt-6 rounded-md py-2 px-3 w-full text-white shadow-lg bg-blue-500 shadow-blue-200 uppercase text-sm hover:ring-1 hover:ring-blue-500'
                onClick={checkout}
              >
                Checkout
              </button>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}

export default Home
