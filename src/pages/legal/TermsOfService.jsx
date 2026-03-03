import React from 'react';
import './LegalPage.css';

const TermsOfService = () => {
    return (
        <main className="legal-page">
            <div className="legal-container">
                <header className="legal-header">
                    <h1>Terms of Service</h1>
                    <p className="legal-last-updated">Last Updated: March 03, 2026</p>
                </header>

                <div className="legal-content">
                    <p>By accessing this website, we assume you accept these terms and conditions in full. Do not continue to use AK Designs's website if you do not accept all of the terms and conditions stated on this page.</p>

                    <h2>1. Services Provided</h2>
                    <p>AK Designs provides premium brand design, visual identity, UI/UX design, and creative consulting services. The specific scope of work for any project will be defined in a separate proposal or agreement.</p>

                    <h2>2. Payment Terms</h2>
                    <p>Payments for our services are processed through the **Razorpay** payment gateway. By initiating a payment, you agree to comply with Razorpay's Terms of Service and Privacy Policy.</p>

                    <div className="highlight-box">
                        <h3>Razorpay Payment Policy</h3>
                        <ul>
                            <li><strong>Currency:</strong> All transactions are processed in INR (Indian Rupee) unless otherwise specified.</li>
                            <li><strong>Methods:</strong> We accept payments via Credit/Debit Cards, Net Banking, UPI, and Wallets through Razorpay.</li>
                            <li><strong>Security:</strong> All transactions are secured with industry-standard encryption.</li>
                        </ul>
                    </div>

                    <h2>3. Cancellation & Refund Policy</h2>
                    <p>Our refund policy is as follows:</p>
                    <ul>
                        <li><strong>Standard Projects:</strong> Cancellation requests must be submitted within 24 hours of payment for a full refund.</li>
                        <li><strong>In-Progress Work:</strong> Once creative work has commenced, refunds will be calculated based on the percentage of completion.</li>
                        <li><strong>Completed Work:</strong> No refunds will be issued for completed and delivered design assets.</li>
                        <li><strong>Refund Processing:</strong> Approved refunds will be processed via Razorpay and credited back to the original payment source within 5-7 working days.</li>
                    </ul>

                    <h2>4. Shipping & Delivery</h2>
                    <p>As AK Designs provides digital creative services, no physical goods are shipped. All deliverables (design files, brand guides, etc.) will be delivered electronically via email or secure cloud storage links. Delivery timelines will be as specified in the project agreement.</p>

                    <h2>5. Intellectual Property</h2>
                    <p>Unless otherwise stated, AK Designs owns the intellectual property rights for all material on the website. All intellectual property rights are reserved. You may view and/or print pages from the website for your own personal use subject to restrictions set in these terms and conditions.</p>

                    <h2>6. Limitation of Liability</h2>
                    <p>In no event shall AK Designs be liable for any indirect, consequential, or special liability arising out of or in any way related to your use of this website or our services.</p>
                </div>
            </div>
        </main>
    );
};

export default TermsOfService;
