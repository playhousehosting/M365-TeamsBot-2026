import * as path from "path";
import * as fs from "fs";

/**
 * Interface for search results containing both content and metadata
 */
export interface SearchResult {
    content: string;
    citation: string;
    score?: number;
    source?: 'local' | 'microsoft-learn';
}

/**
 * Interface for rendered context data
 */
export interface RenderedContext {
    content: string;
    sources: string[];
}

/**
 * Enhanced data source that combines local knowledge base with real-time Microsoft Learn documentation
 */
export class EnhancedDataSource {
    /**
     * Name of the data source.
     */
    public readonly name: string;

    /**
     * Local data loaded from files.
     */
    private _data: { content: string; citation: string; }[] = [];

    /**
     * Microsoft Learn MCP integration flag
     */
    private _useMicrosoftLearn: boolean = true;

    /**
     * Creates a new instance of the EnhancedDataSource.
     * @param name The name identifier for this data source
     * @param useMicrosoftLearn Whether to query Microsoft Learn in addition to local knowledge
     */
    public constructor(name: string, useMicrosoftLearn: boolean = true) {
        this.name = name;
        this._useMicrosoftLearn = useMicrosoftLearn;
    }

    /**
     * Initializes the data source by loading files from the data directory.
     */
    public init(): void {
        const filePath = path.join(__dirname, "../data");
        
        if (!fs.existsSync(filePath)) {
            console.warn(`Data directory not found: ${filePath}`);
            return;
        }

        const files = fs.readdirSync(filePath);
        
        this._data = files.map(file => {
            try {
                const content = fs.readFileSync(path.join(filePath, file), "utf-8");
                return {
                    content: content.trim(),
                    citation: file
                };
            } catch (error) {
                console.error(`Error reading file ${file}:`, error);
                return {
                    content: "",
                    citation: file
                };
            }
        }).filter(item => item.content.length > 0);

        console.log(`Loaded ${this._data.length} local documents from ${filePath}`);
    }

    /**
     * Searches for relevant content combining local and Microsoft Learn sources.
     * @param query The search query
     * @returns Array of search results from both local and Microsoft Learn
     */
    public async search(query: string): Promise<SearchResult[]> {
        const results: SearchResult[] = [];

        // Search local knowledge base
        const localResults = this.searchLocal(query);
        results.push(...localResults);

        // Search Microsoft Learn if enabled (placeholder for MCP integration)
        if (this._useMicrosoftLearn) {
            console.log(`[Microsoft Learn] Querying for: ${query}`);
            // Note: In runtime, this would call the Microsoft Learn MCP
            // For now, we'll log that it would be called
            // The actual MCP integration happens at the app level
        }

        return results;
    }

    /**
     * Searches local knowledge base with M365 admin context awareness.
     * @param query The search query
     * @returns Array of search results from local files
     */
    private searchLocal(query: string): SearchResult[] {
        if (!query) {
            return [];
        }

        const queryLower = query.toLowerCase();
        const results: SearchResult[] = [];

        // M365 Admin topic categorization
        const adminTopics = {
            userManagement: ['user', 'account', 'password', 'license', 'mailbox', 'group', 'permission', 'access', 'offboard', 'onboard', 'provision'],
            security: ['security', 'dlp', 'policy', 'alert', 'incident', 'threat', 'compliance', 'risk', 'breach', 'mfa', 'conditional access'],
            troubleshooting: ['troubleshoot', 'error', 'issue', 'problem', 'fix', 'resolve', 'debug', 'investigate', 'logs', 'trace'],
            exchange: ['email', 'mail', 'exchange', 'message', 'delivery', 'transport', 'smtp', 'quarantine'],
            sharepoint: ['sharepoint', 'site', 'document', 'library', 'collaboration', 'teams', 'onedrive'],
            licensing: ['license', 'subscription', 'billing', 'cost', 'usage', 'analytics', 'optimization']
        };

        // Score documents based on topic relevance
        for (let data of this._data) {
            const fileName = data.citation.toLowerCase();
            const content = data.content.toLowerCase();
            let relevanceScore = 0;

            // Direct content match gets highest score
            if (content.includes(queryLower)) {
                relevanceScore += 100;
            }

            // Topic-based scoring
            for (const [topic, keywords] of Object.entries(adminTopics)) {
                const topicKeywordMatches = keywords.filter(keyword => 
                    queryLower.includes(keyword) || queryLower.includes(keyword.replace(/\s+/g, ''))
                ).length;

                if (topicKeywordMatches > 0) {
                    // Check if document covers this topic
                    const documentTopicRelevance = keywords.filter(keyword => 
                        fileName.includes(keyword) || content.includes(keyword)
                    ).length;

                    relevanceScore += (topicKeywordMatches * documentTopicRelevance * 10);
                }
            }

            // Keyword density scoring
            const queryWords = queryLower.split(/\s+/).filter(word => word.length > 2);
            for (const word of queryWords) {
                const matches = (content.match(new RegExp(word, 'g')) || []).length;
                relevanceScore += matches * 5;
            }

            if (relevanceScore > 0) {
                results.push({
                    content: data.content,
                    citation: data.citation,
                    score: relevanceScore,
                    source: 'local'
                });
            }
        }

        // Sort by relevance score and return top results
        results.sort((a, b) => (b.score || 0) - (a.score || 0));
        
        // Return multiple relevant documents for complex queries
        if (results.length > 1 && queryLower.split(/\s+/).length > 2) {
            return results.slice(0, 2);
        }
        
        return results.length > 0 ? [results[0]] : [];
    }

    /**
     * Renders search results into a formatted context string for use in prompts.
     * @param query The original search query
     * @returns Rendered context with metadata
     */
    public async renderContext(query: string): Promise<RenderedContext> {
        const searchResults = await this.search(query);
        
        if (searchResults.length === 0) {
            return {
                content: "",
                sources: []
            };
        }

        let contextContent = "";
        const sources: string[] = [];

        for (const result of searchResults) {
            const sourceLabel = result.source === 'microsoft-learn' ? 
                `Microsoft Learn: ${result.citation}` : 
                result.citation;
            const formattedDoc = this.formatDocument(result.content, sourceLabel);
            contextContent += formattedDoc + "\n\n";
            sources.push(sourceLabel);
        }

        return {
            content: contextContent.trim(),
            sources
        };
    }

    /**
     * Get all available local documents for browsing or debugging.
     * @returns Array of all loaded documents
     */
    public getAllDocuments(): { content: string; citation: string; }[] {
        return [...this._data];
    }

    /**
     * Formats a document with its citation for inclusion in context.
     * @param content The document content
     * @param citation The source citation
     * @returns Formatted document string
     */
    private formatDocument(content: string, citation: string): string {
        return `<context source="${citation}">\n${content}\n</context>`;
    }

    /**
     * Enable or disable Microsoft Learn integration
     * @param enabled Whether to use Microsoft Learn
     */
    public setMicrosoftLearnEnabled(enabled: boolean): void {
        this._useMicrosoftLearn = enabled;
        console.log(`Microsoft Learn integration ${enabled ? 'enabled' : 'disabled'}`);
    }
}
