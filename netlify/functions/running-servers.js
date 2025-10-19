import { neon } from "@netlify/neon";

export default async (req, context) => {
    const sql = neon();
    const servers = await sql`
        SELECT job_id as "jobId", place_id as "placeId", players 
        FROM running_servers 
        ORDER BY last_ping DESC
    `;

    return new Response(JSON.stringify(servers), {
        headers: { "Content-Type": "application/json" },
    });
};

export const config = {
    path: "/api/running-servers",
};
