import { Octokit } from "@octokit/rest";

const octokit = new Octokit({ auth: process.env.GITHUB_TOKEN });
const owner = process.env.GITHUB_OWNER;
const repo = process.env.GITHUB_REPO;
const path = "data/students.json";

export default async function handler(req, res) {
    if (req.method === "GET") {
        try {
            const { data } = await octokit.repos.getContent({ owner, repo, path });
            const content = Buffer.from(data.content, "base64").toString();
            res.status(200).json(JSON.parse(content));
        } catch (error) {
            if (error.status === 404) {
                return res.status(200).json([]);
            }
            res.status(500).json({ error: error.message });
        }
    } else if (req.method === "POST" || req.method === "PUT" || req.method === "DELETE") {
        try {
            let currentContent = [];
            let sha = null;
            try {
                const { data } = await octokit.repos.getContent({ owner, repo, path });
                currentContent = JSON.parse(Buffer.from(data.content, "base64").toString());
                sha = data.sha;
            } catch (e) {
                // Path might not exist yet
            }

            let newContent = [...currentContent];
            const student = req.body;

            if (req.method === "POST") {
                newContent.unshift(student);
            } else if (req.method === "PUT") {
                newContent = newContent.map(s => s.id === student.id ? { ...s, ...student } : s);
            } else if (req.method === "DELETE") {
                const { id } = req.query;
                newContent = newContent.filter(s => s.id != id);
            }

            await octokit.repos.createOrUpdateFileContents({
                owner,
                repo,
                path,
                message: `Update students: ${req.method}`,
                content: Buffer.from(JSON.stringify(newContent, null, 2)).toString("base64"),
                sha
            });

            res.status(200).json({ success: true });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    } else {
        res.status(405).json({ error: "Method not allowed" });
    }
}
