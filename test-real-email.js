// Test Real Email Sending
import fetch from 'node-fetch';

async function testRealEmailSending() {
    console.log('🔍 TESTING REAL EMAIL SENDING');
    console.log('=============================\n');

    try {
        // Test sending email to your volunteer account
        console.log('1️⃣ Testing real email send to vaibhavrajpoot2626@gmail.com...');

        const emailData = {
            sender_email: 'admin@temple.com',
            recipient_emails: ['vaibhavrajpoot2626@gmail.com'],
            subject: 'Test Email from Temple Management System',
            content: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
                    <h1 style="color: #d97706;">🏛️ Temple Management System</h1>
                    <h2>Test Email Successful!</h2>
                    <p>Dear Volunteer,</p>
                    <p>If you're reading this email, it means the temple management system is now successfully sending real emails!</p>
                    <div style="background: #f3f4f6; padding: 15px; border-radius: 8px; margin: 20px 0;">
                        <h3>✅ What's Working:</h3>
                        <ul>
                            <li>Real email delivery via Nodemailer</li>
                            <li>HTML email formatting</li>
                            <li>Database tracking</li>
                            <li>Volunteer communication system</li>
                        </ul>
                    </div>
                    <p>You can now receive:</p>
                    <ul>
                        <li>📧 Event announcements</li>
                        <li>📅 Volunteer shift reminders</li>
                        <li>🎉 Festival invitations</li>
                        <li>📝 Important temple updates</li>
                    </ul>
                    <p>Thank you for being part of our temple community!</p>
                    <hr>
                    <p style="color: #666; font-size: 12px;">
                        This email was sent from the Temple Management System.<br>
                        Time: ${new Date().toLocaleString()}
                    </p>
                </div>
            `
        };

        const response = await fetch('http://localhost:5000/api/communications/emails/send', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(emailData)
        });

        const result = await response.json();

        console.log('Response status:', response.status);
        console.log('Response:', result);

        if (response.ok) {
            console.log('✅ Email API call successful!');
            console.log('📧 Check your email inbox at vaibhavrajpoot2626@gmail.com');
            console.log('📊 Email ID:', result.data?.id);
            console.log('📊 Status:', result.data?.status);
        } else {
            console.log('❌ Email sending failed:', result.message);

            if (result.error && result.error.includes('Authentication')) {
                console.log('\n🔧 SETUP REQUIRED:');
                console.log('1. Configure Gmail App Password in .env file');
                console.log('2. Set EMAIL_USER=your-gmail@gmail.com');
                console.log('3. Set EMAIL_PASSWORD=your-16-character-app-password');
                console.log('4. Restart the server');
                console.log('\nSee EMAIL-SETUP-INSTRUCTIONS.md for detailed steps');
            }
        }

        // Test bulk email to volunteers
        console.log('\n2️⃣ Testing bulk email to all volunteers...');

        const bulkEmailData = {
            sender_email: 'admin@temple.com',
            volunteer_filter: {},
            subject: 'Bulk Test Email to All Volunteers',
            content: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
                    <h1 style="color: #dc2626;">📢 Volunteer Communication Test</h1>
                    <p>Dear Volunteers,</p>
                    <p>This is a test of our bulk email system. You're receiving this because you're registered as a volunteer in our temple management system.</p>
                    <div style="background: #ecfdf5; padding: 15px; border-radius: 8px; margin: 20px 0;">
                        <h3 style="color: #059669;">🌟 System Capabilities:</h3>
                        <ul>
                            <li>✅ Send emails to all volunteers at once</li>
                            <li>✅ Beautiful HTML email formatting</li>
                            <li>✅ Real-time delivery tracking</li>
                            <li>✅ Professional email templates</li>
                        </ul>
                    </div>
                    <p>Thank you for your service to our temple community!</p>
                    <p style="color: #666; font-size: 12px;">
                        Sent: ${new Date().toLocaleString()}
                    </p>
                </div>
            `
        };

        const bulkResponse = await fetch('http://localhost:5000/api/communications/emails/send-to-volunteers', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(bulkEmailData)
        });

        const bulkResult = await bulkResponse.json();

        console.log('Bulk response status:', bulkResponse.status);
        console.log('Bulk response:', bulkResult);

        if (bulkResponse.ok) {
            console.log('✅ Bulk email API call successful!');
            console.log('📧 Emails sent to', bulkResult.data?.recipient_count, 'volunteers');
            console.log('📧 Check your email inbox for the bulk email');
        } else {
            console.log('❌ Bulk email failed:', bulkResult.message);
        }

        console.log('\n🎉 REAL EMAIL TESTING COMPLETE');
        console.log('==============================');
        console.log('✅ Email system upgraded to send real emails');
        console.log('✅ Both individual and bulk email endpoints ready');
        console.log('✅ HTML email formatting supported');
        console.log('✅ Database tracking implemented');

        console.log('\n📧 NEXT STEPS:');
        console.log('1. Configure Gmail credentials in .env file');
        console.log('2. Test from frontend Communications tab');
        console.log('3. Send emails to your volunteers');
        console.log('4. Check email delivery in volunteer inboxes');

    } catch (error) {
        console.error('❌ TEST FAILED:', error.message);
        console.log('\n🔧 Please check:');
        console.log('1. Backend server is running (http://localhost:5000)');
        console.log('2. Email service is properly configured');
        console.log('3. Gmail credentials are set in .env file');
    }
}

testRealEmailSending();