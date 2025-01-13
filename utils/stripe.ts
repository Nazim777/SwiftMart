import Stripe from 'stripe'

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!,{
    apiVersion:'2024-12-18.acacia'
})

// export const stripe = new Stripe('sk_test_51MC186GqIjWtFU4Z2WUWFfTlwZs91qatpR6wBu1BhwX1R0ukFxJwt70UYWT3z50Dga83ekCQdtljeTBDvmwjyssI00SuxcF2KX',{apiVersion:'2024-12-18.acacia'
// })