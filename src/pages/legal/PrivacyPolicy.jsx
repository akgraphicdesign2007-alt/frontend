import React from 'react';
import './LegalPage.css';

const PrivacyPolicy = () => {
    return (
        <main className="legal-page">
            <div className="legal-container">
                <header className="legal-header">
                    <h1>Privacy Policy</h1>
                    <p className="legal-last-updated">Last Updated: March 03, 2026</p>
                </header>

                <div className="legal-content">
                    <p>At AK Designs, we value your privacy and are committed to protecting your personal data. This Privacy Policy explains how we collect, use, and protect your information when you visit our website.</p>

                    <h2>1. Information We Collect</h2>
                    <p>We collect information that you provide directly to us, including:</p>
                    <ul>
                        <li>Personal identification information (Name, email address, phone number, etc.) when you fill out our contact form.</li>
                        <li>Payment information and billing address when you purchase services (processed securely via Razorpay).</li>
                        <li>Log data and cookies to improve your browsing experience.</li>
                    </ul>

                    <h2>2. How We Use Your Information</h2>
                    <p>We use the collected data for various purposes:</p>
                    <ul>
                        <li>To provide and maintain our Service.</li>
                        <li>To notify you about changes to our Service.</li>
                        <li>To process payments and prevent fraudulent transactions.</li>
                        <li>To provide customer support.</li>
                    </ul>

                    <div className="highlight-box">
                        <h3>Secure Payments via Razorpay</h3>
                        <p>All payment transactions are processed through Razorpay's secure payment gateway. AK Designs does not store your credit/debit card details on our servers. Your data is encrypted and handled according to PCI-DSS standards by Razorpay.</p>
                    </div>

                    <h2>3. Data Retention</h2>
                    <p>We will retain your personal information only for as long as is necessary for the purposes set out in this Privacy Policy. We will retain and use your information to the extent necessary to comply with our legal obligations.</p>

                    <h2>4. Your Rights</h2>
                    <p>You have the right to request access to the personal data we hold about you, to request that we correct any inaccuracies, or to request the deletion of your data under certain conditions.</p>

                    <h2>5. Contact Us</h2>
                    <p>If you have any questions about this Privacy Policy, please contact us at hello@akdesigns.space.</p>
                </div>
            </div>
        </main>
    );
};

export default PrivacyPolicy;
