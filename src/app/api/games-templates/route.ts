import { NextResponse } from 'next/server'
import { promises as fs } from 'fs'
import path from 'path'

export async function GET() {
    try {
        const templatesDir = path.join(process.cwd(), 'public', 'templates')
        const files = await fs.readdir(templatesDir)

        const templates = await Promise.all(
            files
                .filter((file) => file.endsWith('.json'))
                .map(async (file) => {
                    const filePath = path.join(templatesDir, file)
                    const content = await fs.readFile(filePath, 'utf8')
                    const parsed = JSON.parse(content)

                    return {
                        id: file.replace(/\.json$/i, ''),
                        name: parsed?.name || file.replace(/\.json$/i, ''),
                        description: parsed?.description || '',
                        fields: parsed?.fields ?? {},
                        sourceFile: file,
                    }
                }),
        )

        return NextResponse.json({ templates })
    } catch (error: unknown) {
        const message = error instanceof Error ? error.message : 'Unknown error'
        return NextResponse.json({ error: message }, { status: 500 })
    }
}
