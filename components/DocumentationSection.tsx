import { useTranslations } from "next-intl";
import { Card } from "./ui/card";
import { usePathname } from "next/navigation";

interface DocumentationSectionProps {
  title?: string;
  endpoints?: string[];
  parameters?: Array<{
    name: string;
    translationKey: string;
    example: string;
    endpoint: number;
    type: string;
  }>;
  exampleRequest?: string;
  exampleResponse?: string;
  className?: string;
}

export function DocumentationSection({
  title = "API Documentation",
  endpoints = ["GET /api/municipalities", "GET /api/municipalities/near"],
  parameters = [
    {
      name: "name",
      type: "string",
      translationKey: "name",
      example: "?name=ariana",
      endpoint: 0,
    },
    {
      name: "delegation",
      type: "string",
      translationKey: "delegation",
      example: "?delegation=ville",
      endpoint: 0,
    },
    {
      name: "postalCode",
      type: "string",
      translationKey: "postalCode",
      example: "?postalCode=2058",
      endpoint: 0,
    },
    {
      name: "lat, lng, radius",
      type: "[number, number, number]",
      translationKey: "location",
      example: "?lat=36.8065&lng=10.1815&radius=5000",
      endpoint: 1,
    },
  ],
  exampleResponse,
  className,
}: DocumentationSectionProps) {
  const tDoc = useTranslations("documentation");
  const pathname = usePathname();

  const isRTL = pathname.startsWith("/ar");

  return (
    <div
      className={className}
      style={{
        padding: "0 8px",
        direction: isRTL ? "rtl" : "ltr",
      }}
    >
      <h2
        style={{
          fontSize: 28,
          fontWeight: 700,
          marginBottom: 24,
          textAlign: "center",
        }}
      >
        {tDoc("title")}
      </h2>

      <Card style={{ padding: 24, marginBottom: 24 }}>
        <h3
          style={{
            fontSize: 20,
            fontWeight: 600,
            marginBottom: 16,
            textAlign: isRTL ? "right" : "left",
          }}
        >
          {tDoc("endpoints.title")}
        </h3>
        {endpoints.map((endpoint: string) => (
          <code
            key={endpoint}
            style={{
              background: "#f4f4f4",
              padding: 12,
              borderRadius: 8,
              display: "block",
              fontSize: 16,
              fontWeight: 500,
              fontFamily: "monospace",
              textAlign: isRTL ? "right" : "left",
              direction: "ltr",
            }}
          >
            {endpoint}
          </code>
        ))}
        <p
          style={{
            marginTop: 12,
            color: "#666",
            fontSize: 14,
            textAlign: isRTL ? "right" : "left",
          }}
        >
          {tDoc("endpoints.baseUrl")}{" "}
          <code
            style={{
              background: "#f0f0f0",
              padding: "2px 6px",
              borderRadius: 4,
              direction: "ltr",
              display: "inline-block",
            }}
          >
            https://tn-municipality-api.vercel.app
          </code>
        </p>
      </Card>

      <Card style={{ padding: 24, marginBottom: 24 }}>
        <h3
          style={{
            fontSize: 20,
            fontWeight: 600,
            marginBottom: 16,
            textAlign: isRTL ? "right" : "left",
          }}
        >
          {tDoc("parameters.title")}
        </h3>
        <p
          style={{
            color: "#666",
            marginBottom: 16,
            fontSize: 14,
            textAlign: isRTL ? "right" : "left",
          }}
        >
          {tDoc("parameters.description")}
        </p>
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {parameters.map((param, index) => (
            <div
              key={index}
              style={{
                border: "1px solid #e9ecef",
                borderRadius: 8,
                padding: 16,
                background: "#fafafa",
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  marginBottom: 8,
                  flexDirection: isRTL ? "row-reverse" : "row",
                  justifyContent: isRTL ? "flex-end" : "flex-start",
                }}
              >
                <code
                  style={{
                    background: "#0070f3",
                    color: "white",
                    padding: "4px 8px",
                    borderRadius: 4,
                    fontSize: 14,
                    fontWeight: 600,
                    direction: "ltr",
                  }}
                >
                  {param.name}
                </code>
                <span
                  style={{
                    fontSize: 12,
                    color: "#666",
                    direction: "ltr",
                  }}
                >
                  {param.type}
                </span>
              </div>
              <p
                style={{
                  marginBottom: 8,
                  fontSize: 14,
                  lineHeight: 1.5,
                  textAlign: isRTL ? "right" : "left",
                }}
              >
                {tDoc(`parameters.${param.translationKey}.description`)}
              </p>
              <div
                style={{
                  fontSize: 13,
                  color: "#666",
                  textAlign: isRTL ? "right" : "left",
                }}
              >
                <strong>{tDoc("examples.exampleLabel")}:</strong>{" "}
                <code
                  style={{
                    background: "#f0f0f0",
                    padding: "2px 6px",
                    borderRadius: 4,
                    direction: "ltr",
                    display: "inline-block",
                  }}
                >
                  {endpoints[param.endpoint]}
                  {param.example}
                </code>
              </div>
            </div>
          ))}
        </div>
      </Card>

      <Card style={{ padding: 24, marginBottom: 24 }}>
        <h3
          style={{
            fontSize: 20,
            fontWeight: 600,
            marginBottom: 16,
            textAlign: isRTL ? "right" : "left",
          }}
        >
          {tDoc("examples.title")}
        </h3>
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <div>
            <h4
              style={{
                fontSize: 16,
                fontWeight: 600,
                marginBottom: 8,
                textAlign: isRTL ? "right" : "left",
              }}
            >
              {tDoc("examples.getAllMunicipalities")}
            </h4>
            <pre
              style={{
                background: "#222",
                color: "#fff",
                padding: 12,
                borderRadius: 8,
                fontSize: 14,
                overflow: "auto",
                direction: "ltr",
                textAlign: "left",
              }}
            >
              {`fetch('/api/municipalities')
  .then(response => response.json())
  .then(data => console.log(data));`}
            </pre>
          </div>

          <div>
            <h4
              style={{
                fontSize: 16,
                fontWeight: 600,
                marginBottom: 8,
                textAlign: isRTL ? "right" : "left",
              }}
            >
              {tDoc("examples.filterByGovernorate")}
            </h4>
            <pre
              style={{
                background: "#222",
                color: "#fff",
                padding: 12,
                borderRadius: 8,
                fontSize: 14,
                overflow: "auto",
                direction: "ltr",
                textAlign: "left",
              }}
            >
              {`fetch('/api/municipalities?name=ariana')
  .then(response => response.json())
  .then(data => console.log(data));`}
            </pre>
          </div>

          <div>
            <h4
              style={{
                fontSize: 16,
                fontWeight: 600,
                marginBottom: 8,
                textAlign: isRTL ? "right" : "left",
              }}
            >
              {tDoc("examples.filterByDelegation")}
            </h4>
            <pre
              style={{
                background: "#222",
                color: "#fff",
                padding: 12,
                borderRadius: 8,
                fontSize: 14,
                overflow: "auto",
                direction: "ltr",
                textAlign: "left",
              }}
            >
              {`fetch('/api/municipalities?delegation=ville')
  .then(response => response.json())
  .then(data => console.log(data));`}
            </pre>
          </div>

          <div>
            <h4
              style={{
                fontSize: 16,
                fontWeight: 600,
                marginBottom: 8,
                textAlign: isRTL ? "right" : "left",
              }}
            >
              {tDoc("examples.filterByPostalCode")}
            </h4>
            <pre
              style={{
                background: "#222",
                color: "#fff",
                padding: 12,
                borderRadius: 8,
                fontSize: 14,
                overflow: "auto",
                direction: "ltr",
                textAlign: "left",
              }}
            >
              {`fetch('/api/municipalities?postalCode=2058')
  .then(response => response.json())
  .then(data => console.log(data));`}
            </pre>
          </div>

          <div>
            <h4
              style={{
                fontSize: 16,
                fontWeight: 600,
                marginBottom: 8,
                textAlign: isRTL ? "right" : "left",
              }}
            >
              {tDoc("examples.combineFilters")}
            </h4>
            <pre
              style={{
                background: "#222",
                color: "#fff",
                padding: 12,
                borderRadius: 8,
                fontSize: 14,
                overflow: "auto",
                direction: "ltr",
                textAlign: "left",
              }}
            >
              {`fetch('/api/municipalities?name=ariana&delegation=ville')
  .then(response => response.json())
  .then(data => console.log(data));`}
            </pre>
          </div>
        </div>
      </Card>

      {exampleResponse && (
        <Card style={{ padding: 24, marginBottom: 24 }}>
          <h3
            style={{
              fontSize: 20,
              fontWeight: 600,
              marginBottom: 16,
              textAlign: isRTL ? "right" : "left",
            }}
          >
            {tDoc("response.title")}
          </h3>
          <pre
            style={{
              background: "#f8f9fa",
              padding: 16,
              borderRadius: 8,
              maxHeight: 300,
              overflow: "auto",
              fontSize: 14,
              border: "1px solid #e9ecef",
              direction: "ltr",
              textAlign: "left",
            }}
          >
            {exampleResponse}
          </pre>
        </Card>
      )}
    </div>
  );
}
