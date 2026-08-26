type JsonLdObject = Record<string, unknown>;

type JsonLdProps = {
  data: JsonLdObject | Array<JsonLdObject | null | undefined> | null | undefined;
};

function normalizeJsonLd(data: JsonLdProps["data"]): JsonLdObject | null {
  if (!data) return null;
  if (Array.isArray(data)) {
    const graph = data.filter((item): item is JsonLdObject => Boolean(item));
    if (!graph.length) return null;

    return {
      "@context": "https://schema.org",
      "@graph": graph.map((item) => {
        // Top-level @context belongs on the wrapper when using @graph
        const { ["@context"]: _context, ...rest } = item;
        return rest;
      }),
    };
  }

  if (!data || typeof data !== "object") return null;
  return data;
}

export function JsonLd({ data }: JsonLdProps) {
  const payload = normalizeJsonLd(data);
  if (!payload) return null;

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(payload) }}
    />
  );
}
