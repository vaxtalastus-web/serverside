import { neon } from "@netlify/neon";

export default async () => {
    const sql = neon();
    const games = await sql`
        SELECT place_id as "placeId", job_id as "jobId" 
        FROM logged_games 
        ORDER BY created_at DESC
    `;

    return new Response(JSON.stringify(games), {
        headers: { "Content-Type": "application/json" },
    });
};

export const config = {
    path: "/api/logged-games",
};
