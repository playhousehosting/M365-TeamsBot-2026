/**
 * Microsoft Learn MCP Integration Service
 * Provides access to live Microsoft documentation for M365 administration
 */

export interface MicrosoftLearnResult {
    content: string;
    title: string;
    url: string;
    snippet: string;
}

export class MicrosoftLearnService {
    /**
     * Search Microsoft Learn documentation for M365 admin topics
     * @param query Search query focused on M365/Azure topics
     * @returns Promise of search results from Microsoft Learn
     */
    public static async searchDocs(query: string): Promise<MicrosoftLearnResult[]> {
        try {
            console.log(`[Microsoft Learn] Searching for: ${query}`);
            
            // This is a placeholder that shows how the MCP would be called
            // In actual runtime with MCP server active, this would call:
            // const results = await mcp_microsoft-doc_microsoft_docs_search({ query });
            
            // For now, return empty array - actual integration happens in app.ts
            return [];
        } catch (error) {
            console.error('[Microsoft Learn] Search error:', error);
            return [];
        }
    }

    /**
     * Fetch full content from a specific Microsoft Learn page
     * @param url The URL of the Microsoft Learn article
     * @returns Promise of full article content
     */
    public static async fetchDocPage(url: string): Promise<string> {
        try {
            console.log(`[Microsoft Learn] Fetching: ${url}`);
            
            // Placeholder for MCP integration
            // In actual runtime: await mcp_microsoft-doc_microsoft_docs_fetch({ url });
            
            return '';
        } catch (error) {
            console.error('[Microsoft Learn] Fetch error:', error);
            return '';
        }
    }

    /**
     * Search for M365-related code samples
     * @param query Query for code samples (SDK, method names, etc)
     * @param language Optional programming language filter
     * @returns Promise of code sample results
     */
    public static async searchCodeSamples(
        query: string, 
        language?: string
    ): Promise<MicrosoftLearnResult[]> {
        try {
            console.log(`[Microsoft Learn] Searching code samples for: ${query}${language ? ` (${language})` : ''}`);
            
            // Placeholder for MCP integration
            // In actual runtime: await mcp_microsoft-doc_microsoft_code_sample_search({ query, language });
            
            return [];
        } catch (error) {
            console.error('[Microsoft Learn] Code sample search error:', error);
            return [];
        }
    }

    /**
     * Build enhanced context by combining local knowledge with Microsoft Learn
     * @param localContext Context from local knowledge base
     * @param query Original user query
     * @returns Enhanced context with Microsoft Learn augmentation
     */
    public static async enhanceContext(
        localContext: string, 
        query: string
    ): Promise<{ enhanced: string; sources: string[] }> {
        const sources: string[] = [];
        let enhancedContent = localContext;

        // Only query Microsoft Learn for M365/Azure specific topics
        if (this.isM365Query(query)) {
            const learnResults = await this.searchDocs(query);
            
            if (learnResults.length > 0) {
                enhancedContent += '\n\n## Latest from Microsoft Learn\n\n';
                
                for (const result of learnResults.slice(0, 2)) {
                    enhancedContent += `### ${result.title}\n${result.snippet}\n\nSource: ${result.url}\n\n`;
                    sources.push(`Microsoft Learn: ${result.title}`);
                }
            }
        }

        return {
            enhanced: enhancedContent,
            sources
        };
    }

    /**
     * Check if query is M365/Azure related
     * @param query User query
     * @returns True if M365/Azure related
     */
    private static isM365Query(query: string): boolean {
        const m365Keywords = [
            'microsoft 365', 'm365', 'office 365', 'o365',
            'azure', 'azure ad', 'entra',
            'sharepoint', 'teams', 'exchange', 'onedrive',
            'intune', 'defender', 'compliance',
            'power platform', 'dynamics',
            'graph api', 'powershell'
        ];

        const queryLower = query.toLowerCase();
        return m365Keywords.some(keyword => queryLower.includes(keyword));
    }
}
