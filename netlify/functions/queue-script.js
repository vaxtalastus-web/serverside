import { neon } from "@netlify/neon";

export default async (req) => {
    if (req.method !== 'POST') {
        return new Response('Method Not Allowed', { status: 405 });
    }

    const { username, script } = await req.json();
    if (!username || !script) {
        return new Response('Bad Request', { status: 400 });
    }

    const sql = neon();
    
    const usersServers = await sql`
        SELECT job_id 
        FROM running_servers 
        WHERE players > 0 AND job_id IN (
            SELECT job_id 
            FROM logged_games
        )
    `;

    for (const server of usersServers) {
        await sql`
            INSERT INTO queued_scripts (username, script, job_id) 
            VALUES (${username}, ${script}, ${server.job_id})
        `;
    }

    return new Response(JSON.stringify({ message: "Script queued" }), {
        headers: { "Content-Type": "application/json" },
    });
};

export const config = {
    path: "/api/queue-script",
};
