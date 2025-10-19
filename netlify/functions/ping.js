import { neon } from "@netlify/neon";

export default async (req, context) => {
    if (req.method !== 'POST') {
        return new Response('Method Not Allowed', { status: 405 });
    }

    const { jobId, placeId, players } = await req.json();
    if (!jobId || !placeId || players === undefined) {
        return new Response('Bad Request', { status: 400 });
    }

    const sql = neon();

    await sql`
        INSERT INTO running_servers (job_id, place_id, players, last_ping) 
        VALUES (${jobId}, ${placeId}, ${players}, NOW())
        ON CONFLICT (job_id) 
        DO UPDATE SET 
            players = ${players},
            last_ping = NOW();
    `;

    await sql`
        INSERT INTO logged_games (job_id, place_id)
        VALUES (${jobId}, ${placeId})
        ON CONFLICT DO NOTHING;
    `;
    
    await sql`
        DELETE FROM running_servers 
        WHERE last_ping < NOW() - INTERVAL '90 seconds'
    `;

    return new Response("OK");
};

export const config = {
    path: "/api/ping",
};
