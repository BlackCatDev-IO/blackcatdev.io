export default {
	async fetch(request, env) {
		return handleRequest(request, env);
	},
};

async function handleRequest(request, env) {
	if (request.method !== 'POST') {
		return new Response('Method Not Allowed', {
			status: 405,
			headers: { 'Content-Type': 'text/plain' },
		});
	}

	const formData = await request.formData();
	const name = formData.get('name');
	const email = formData.get('email');
	const message = formData.get('message');

	const sendEmailResponse = await sendEmail(name, email, message, env);

	if (!sendEmailResponse.ok) {
		return new Response('Failed to send message.', {
			status: 500,
			headers: { 'Content-Type': 'text/plain' },
		});
	}

	return new Response('Thank you for your message!', {
		status: 200,
		headers: { 'Content-Type': 'text/plain', 'Access-Control-Allow-Origin': '*' },
	});
}

async function sendEmail(name, email, message, env) {
	const apiKey = env.MAILJET_API_KEY;
	const secretKey = env.MAILJET_SECRET_KEY;
	const fromEmail = env.FROM_EMAIL;
	const toEmail = env.TO_EMAIL;

	const mailData = {
		Messages: [
			{
				From: {
					Email: fromEmail,
					Name: 'blackcatdev.io',
				},
				To: [
					{
						Email: toEmail,
						Name: name,
					},
				],
				Subject: 'New message from your blackcaatdev.io',
				TextPart: `Name: ${name}\nEmail: ${email}\n\n${message}`,
				HTMLPart: `<p>Name: ${name}</p><p>Email: ${email}</p><p>${message}</p>`,
			},
		],
	};

	const response = await fetch('https://api.mailjet.com/v3.1/send', {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
			Authorization: `Basic ${btoa(`${apiKey}:${secretKey}`)}`,
		},
		body: JSON.stringify(mailData),
	});

	return response;
}
