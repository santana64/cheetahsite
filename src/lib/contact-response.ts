/** HTTP success alone does not establish delivery: require the provider's acknowledgement. */
export function contactAcknowledgement(ok: boolean, status: number, body: unknown): { accepted: boolean; message: string } {
  const record = body && typeof body === 'object' ? body as Record<string, unknown> : {};
  const accepted = ok && record.success === true;
  return {
    accepted,
    message: typeof record.message === 'string' && record.message.trim()
      ? record.message.slice(0, 160)
      : ok ? 'Le prestataire n’a pas confirmé la réception de votre demande.' : `Code ${status}`,
  };
}
