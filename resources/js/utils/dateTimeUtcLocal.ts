/**
 * Formata uma string UTC ISO para formato casual local (ex: 02/08/2025 15:00)
 * Exemplo: "2025-08-02T18:00:00Z" (UTC) => "02/08/2025 15:00" (local, se GMT-3)
 */
export function formatLocalDateTime(utc: string | null): string {
    if (!utc) return "";
    try {
        const date = utc.endsWith('Z') ? new Date(utc) : new Date(utc + 'Z');
        return date.toLocaleString('pt-BR', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            hour12: false
        });
    } catch {
        return "";
    }
}
/**
 * Converte string local (YYYY-MM-DD ou YYYY-MM-DDTHH:mm) para UTC ISO (YYYY-MM-DDTHH:mm:ss)
 * Exemplo: "2025-08-02T15:00" (local) => "2025-08-02T18:00:00" (UTC, se GMT-3)
 */
export function localToUtcIso(dateStr: string | null): string | null {
    if (!dateStr) return null;
    const date = new Date(dateStr);
    return date.toISOString().slice(0, 19); // 'YYYY-MM-DDTHH:mm:ss'
}

/**
 * Converte UTC ISO (YYYY-MM-DDTHH:mm:ss ou YYYY-MM-DDTHH:mm:ssZ) para string local (YYYY-MM-DDTHH:mm)
 * Exemplo: "2025-08-02T18:00:00Z" (UTC) => "2025-08-02T15:00" (local, se GMT-3)
 */
export function utcIsoToLocalInput(utc: string | null): string {
    if (!utc) return "";
    try {
        const date = utc.endsWith('Z') ? new Date(utc) : new Date(utc + 'Z');

        const pad = (n: number) => n.toString().padStart(2, '0');
        return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
    } catch {
        return "";
    }
}
