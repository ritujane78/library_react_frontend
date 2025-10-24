import { CardElement, useElements, useStripe } from '@stripe/react-stripe-js';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import PaymentInfoRequest from '../../models/PaymentInfoRequest';
import { SpinnerLoading } from '../Utils/SpinnerLoading';
import { useAuth0 } from '@auth0/auth0-react';

export const PaymentPage = () => {
    
    const {isAuthenticated, user, getAccessTokenSilently} = useAuth0();
    const [httpError, setHttpError] = useState(false);
    const [submitDisabled, setSubmitDisabled] = useState(false);
    const [fees, setFees] = useState(0);
    const [loadingFees, setLoadingFees] = useState(true);

    useEffect(() => {
        const fetchFees = async () => {
            if (isAuthenticated) {
                const url = `${process.env.REACT_APP_API}/payments/search/findByUserEmail?userEmail=${user?.email}`;
                const requestOptions = {
                    method: 'GET',
                    headers: { 'Content-Type': 'application/json' }
                };
                const paymentResponse = await fetch(url, requestOptions);
                if (!paymentResponse.ok) {
                    throw new Error('Something went wrong!')
                }
                const paymentResponseJson = await paymentResponse.json();
                setFees(paymentResponseJson.amount);
                setLoadingFees(false);
            }
        }
        fetchFees().catch((error: any) => {
            setLoadingFees(false);
            setHttpError(error.message);
        })
    }, [isAuthenticated]);

    const elements = useElements();
    const stripe = useStripe();

async function checkout() {
    if (!stripe || !elements || !elements.getElement(CardElement)) {
        return;
    }

    setSubmitDisabled(true);
    const accessToken = await getAccessTokenSilently();
    const email = user?.email ?? "";

    const paymentInfo = new PaymentInfoRequest(Math.round(fees * 100), 'USD', email);

    try {
        // 1. Create payment intent
        const stripeResponse = await fetch(
            'https://localhost:8443/api/payment/secure/payment-intent',
            {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(paymentInfo),
            }
        );

        if (!stripeResponse.ok) {
            throw new Error('Failed to create payment intent');
        }

        const { client_secret } = await stripeResponse.json();

        // 2. Confirm card payment
        const result = await stripe.confirmCardPayment(client_secret, {
            payment_method: {
                card: elements.getElement(CardElement)!,
                billing_details: { email },
            },
        });
        console.log('Stripe result:', result);

        if (result.error) {
            // Show specific Stripe error
            alert(result.error.message ?? 'Payment failed');
            setSubmitDisabled(false);
            return;
        }

        // 3. Complete payment on backend
        const completeResponse = await fetch(
            `https://localhost:8443/api/payment/secure/payment-complete?userEmail=${user?.email}`,
            {
                method: 'PUT',
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                    'Content-Type': 'application/json',
                },
            }
        );

        if (!completeResponse.ok) {
            throw new Error('Payment could not be completed on server');
        }

        // 4. Reset state
        setFees(0);
        setSubmitDisabled(false);
        setHttpError(false);
        alert('Payment successful!');
    } catch (err: any) {
        console.error(err);
        setHttpError(true);
        setSubmitDisabled(false);
        alert(err.message ?? 'Something went wrong during checkout');
    }
}


    if (loadingFees) {
        return (
            <SpinnerLoading/>
        )
    }

    if (httpError) {
        return (
            <div className='container m-5'>
                <p>{httpError}</p>
            </div>
        )
    }


    return(
        <div className='container'>
            {fees > 0 && <div className='card mt-3'>
                <h5 className='card-header'>Fees pending: <span className='text-danger'>${fees}</span></h5>
                <div className='card-body'>
                    <h5 className='card-title mb-3'>Credit Card</h5>
                    <CardElement id='card-element' />
                    <button disabled={submitDisabled} type='button' className='btn btn-md main-color text-white mt-3' 
                        onClick={checkout}>
                        Pay fees
                    </button>
                </div>
            </div>}

            {fees === 0 && 
                <div className='mt-3'>
                    <h5>You have no fees!</h5>
                    <Link type='button' className='btn main-color text-white' to='search'>
                        Explore top books
                    </Link>
                </div>
            }
            {submitDisabled && <SpinnerLoading/>}
        </div>
    );
}