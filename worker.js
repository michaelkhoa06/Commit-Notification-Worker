addEventListener('fetch', event => {
    event.respondWith(handleRequest(event.request));
});

async function handleRequest(request) {
    if (request.method !== 'POST') {
        return new Response('Only POST allowed', { status: 405 });
    }

    let payload;
    try {
        payload = await request.json();
    } catch (err) {
        return new Response('Invalid JSON', { status: 400 });
    }

    if (!payload.commits || !payload.repository) {
        return new Response('Not a push event', { status: 400 });
    }

    const commits = payload.commits.map(commit => {
        return `• **${commit.author.name}**: ${commit.message}\n<${commit.url}>`;
    }).join('\n\n');

    const message = {
        content: `🛠️ New push to **${payload.repository.name}** by **${payload.pusher.name}**:\n\n${commits}`
    };

    const discordWebhook = // Add Discord Webhook here
    const discordRes = await fetch(discordWebhook, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(message),
    });

    if (!discordRes.ok) {
        return new Response(`Discord error: ${discordRes.status}`, { status: 500 });
    }

    return new Response('OK', { status: 200 });
}

