import { NextApiRequest, NextApiResponse } from 'next'
import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
    apiVersion: '2020-08-27',
})

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'POST') {
        const { item } = req.body
        try {
            // Create Checkout Sessions from body params.
            const params: Stripe.Checkout.SessionCreateParams = {
                payment_method_types: ['card'],
                mode: 'payment',
                metadata: {
                    images: item.image,
                },
                line_items: [
                    {
                        price_data: {
                            currency: 'usd',
                            product_data: {
                                images: [item.image],
                                name: item.name,
                            },
                            unit_amount: item.price * 100, // to convert into cents
                        },
                        description: item.description,
                        quantity: item.quantity,
                    },
                ],
                success_url: `${req.headers.origin}?status=success&session_id={CHECKOUT_SESSION_ID}`,
                cancel_url: `${req.headers.origin}?status=cancelled`,
            }
            const checkoutSession: Stripe.Checkout.Session =
                await stripe.checkout.sessions.create(params)

            res.status(200).json(checkoutSession)
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Internal server error'
            res.status(500).json({ statusCode: 500, message: errorMessage })
        }
    } else {
        res.setHeader('Allow', 'POST')
        res.status(405).end('Method Not Allowed')
    }
}
