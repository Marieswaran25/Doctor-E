interface Process {
    env: {
        NEXT_PUBLIC_CONVO_AGENT_ID: string;
        NEXT_PUBLIC_CONVO_API_KEY: string;
        NEXT_PUBLIC_HEYGEN_URL: string;
        NEXT_PUBLIC_HEYGEN_API_KEY: string;
        NEXT_PUBLIC_HEYGEN_KNOWLEDGE_ID: string;
        NEXT_PUBLIC_HEYGEN_AVATAR_ID: string;
    };
}
declare const process: Process;
