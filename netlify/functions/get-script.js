import { neon } from "@netlify/neon";

export default async (req) => {
    const { searchParams } = new URL(req.url);
    const jobId = searchParams.get("jobId");

    if (!jobId) {
        return new Response('Bad Request', { status: 400 });
    }

    const sql = neon();

    const result = await sql`
        SELECT id, script 
        FROM queued_scripts 
        WHERE job_id = ${jobId} 
        ORDER BY created_at 
        LIMIT 1
    `;

    if (result.length === 0) {
        return new Response(JSON.stringify({ script: null }), {
            headers: { "Content-Type": "application/json" },
        });
    }

    const { id, script } = result[0];

    await sql`
        DELETE FROM queued_scripts 
        WHERE id = ${id}
    `;

    return new Response(JSON.stringify({ script }), {
        headers: { "Content-Type": "application/json" },
    });
};

export const config = {
    path: "/api/get-script",
};
