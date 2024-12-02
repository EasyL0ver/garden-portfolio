const { app } = require('@azure/functions');
const { EmailClient } = require("@azure/communication-email");

const connectionString = "endpoint=https://mama-contact-form.europe.communication.azure.com/;accesskey=MgAF44qr7HELsACEhts4ZNOe6jw32ZrxU3CaUPE2UGGSdLwPDeFGJQQJ99ALACULyCpwldSZAAAAAZCSBRZS";
const client = new EmailClient(connectionString);

async function receiveEmail() {
    const emailMessage = {
        senderAddress: "DoNotReply@2c6dfb8e-c6b3-4c58-aec2-9ae84c7e1a1e.azurecomm.net",
        content: {
            subject: "Test Email",
            plainText: "Hello world via email.",
            html: `
			<html>
				<body>
					<h1>Hello world via email.</h1>
				</body>
			</html>`,
        },
        recipients: {
            to: [{ address: "pakudlacik@gmail.com" }],
        },
        
    };

    const poller = await client.beginSend(emailMessage);
    const result = await poller.pollUntilDone();
}


app.http('ReceiveContact', {
    methods: ['GET', 'POST'],
    authLevel: 'anonymous',
    handler: async (request, context) => {
        context.log(`Http function processed request for url "${request.url}"`);

        const name = request.query.get('name') || await request.text() || 'world';

        await receiveEmail()

        return { body: `Hello, ${name}!` };
    }
});
