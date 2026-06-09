interface JsonLdProps {
  data: object;
}

/** Renders structured data. JSON.stringify safely escapes the payload. */
export function JsonLd({ data }: JsonLdProps) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
