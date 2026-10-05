const ALLOWED_ORIGIN = 'https://blackcatdev.io';

const MAX_NAME_LENGTH = 100;
const MAX_EMAIL_LENGTH = 254;
const MAX_MESSAGE_LENGTH = 5000;
const MAX_LINKS = 2;
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const LINK_PATTERN = /https?:\/\/|www\./gi;

export default {
	async fetch(request, env) {
		return handleRequest(request, env);
	},
};

async function handleRequest(request, env) {
	const log = (outcome, details = {}) => logRequest(request, outcome, details);

	if (request.method !== 'POST') {
		log('method_not_allowed');
		return textResponse('Method Not Allowed', 405);
	}

	if (request.headers.get('Origin') !== ALLOWED_ORIGIN) {
		log('forbidden_origin');
		return textResponse('Forbidden', 403);
	}

	let formData;
	try {
		formData = await request.formData();
	} catch {
		log('bad_body', { contentType: request.headers.get('Content-Type') });
		return textResponse('Bad Request', 400);
	}

	// Honeypot: hidden from people, filled in by bots. Pretend it worked so they don't adapt.
	if (formData.get('website')) {
		log('honeypot', { email: formData.get('email') });
		return textResponse('Thank you for your message!', 200);
	}

	const name = (formData.get('name') ?? '').toString().trim();
	const email = (formData.get('email') ?? '').toString().trim();
	const message = (formData.get('message') ?? '').toString().trim();
	const submission = {
		email,
		hasHoneypotField: formData.has('website'),
		messageLength: message.length,
		linkCount: (message.match(LINK_PATTERN) ?? []).length,
	};

	const validationError = validate(name, email, message);
	if (validationError) {
		log('invalid', { ...submission, reason: validationError });
		return textResponse(validationError, 400);
	}

	const sendEmailResponse = await sendEmail(name, email, message, env);

	if (!sendEmailResponse.ok) {
		log('send_failed', { ...submission, mailjetStatus: sendEmailResponse.status });
		return textResponse('Failed to send message.', 500);
	}

	log('sent', submission);
	return textResponse('Thank you for your message!', 200);
}

// One structured line per request, so Workers Logs can tell real form submissions
// (browser user agent, blackcatdev.io referer) apart from scripts hitting the endpoint directly.
function logRequest(request, outcome, details) {
	console.log(
		JSON.stringify({
			outcome,
			method: request.method,
			origin: request.headers.get('Origin'),
			referer: request.headers.get('Referer'),
			userAgent: request.headers.get('User-Agent'),
			ip: request.headers.get('CF-Connecting-IP'),
			country: request.cf?.country,
			asn: request.cf?.asn,
			asOrganization: request.cf?.asOrganization,
			...details,
		}),
	);
}

function validate(name, email, message) {
	if (!name || !email || !message) {
		return 'Please fill out all fields.';
	}
	if (name.length > MAX_NAME_LENGTH || email.length > MAX_EMAIL_LENGTH || message.length > MAX_MESSAGE_LENGTH) {
		return 'Your message is too long.';
	}
	if (!EMAIL_PATTERN.test(email)) {
		return 'Please enter a valid email address.';
	}
	if ((message.match(LINK_PATTERN) ?? []).length > MAX_LINKS) {
		return 'Please include fewer links in your message.';
	}
	return null;
}

function escapeHtml(value) {
	return value
		.replaceAll('&', '&amp;')
		.replaceAll('<', '&lt;')
		.replaceAll('>', '&gt;')
		.replaceAll('"', '&quot;')
		.replaceAll("'", '&#39;');
}

function textResponse(body, status) {
	return new Response(body, {
		status,
		headers: { 'Content-Type': 'text/plain', 'Access-Control-Allow-Origin': ALLOWED_ORIGIN },
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
						Name: 'blackcatdev.io',
					},
				],
				Subject: 'New message from blackcatdev.io',
				TextPart: `Name: ${name}\nEmail: ${email}\n\n${message}`,
				HTMLPart: `<p>Name: ${escapeHtml(name)}</p><p>Email: ${escapeHtml(email)}</p><p>${escapeHtml(message).replaceAll('\n', '<br>')}</p>`,
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
