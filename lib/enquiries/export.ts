import {
  ENQUIRY_STATUS_LABELS,
  type StoredEnquiry,
} from "@/lib/enquiries/types";

export type EnquiryExportFormat = "csv" | "excel";
export type EnquiryExportScope = "filtered" | "all";

const COLUMNS = [
  { key: "reference", label: "Reference" },
  { key: "status", label: "Status" },
  { key: "archived", label: "Archived" },
  { key: "fullName", label: "Name" },
  { key: "phone", label: "Phone" },
  { key: "email", label: "Email" },
  { key: "travelDate", label: "Travel date" },
  { key: "returnDate", label: "Return date" },
  { key: "pickupLocation", label: "Pickup" },
  { key: "destination", label: "Destination" },
  { key: "passengers", label: "Passengers" },
  { key: "preferredVehicle", label: "Vehicle" },
  { key: "tripType", label: "Trip type" },
  { key: "message", label: "Customer message" },
  { key: "sourcePage", label: "Source page" },
  { key: "submittedAt", label: "Submitted" },
  { key: "notes", label: "Internal notes" },
  { key: "createdAt", label: "Created" },
  { key: "updatedAt", label: "Updated" },
] as const;

function cellValue(enquiry: StoredEnquiry, key: (typeof COLUMNS)[number]["key"]) {
  switch (key) {
    case "status":
      return ENQUIRY_STATUS_LABELS[enquiry.status];
    case "archived":
      return enquiry.archived ? "Yes" : "No";
    case "passengers":
      return enquiry.passengers == null ? "" : String(enquiry.passengers);
    default: {
      const value = enquiry[key];
      return value == null ? "" : String(value);
    }
  }
}

function csvEscape(value: string) {
  if (/[",\n\r]/.test(value)) {
    return `"${value.replace(/"/g, '""')}"`;
  }
  return value;
}

function csvCell(enquiry: StoredEnquiry, key: (typeof COLUMNS)[number]["key"]) {
  const value = cellValue(enquiry, key);
  // Keep phone numbers as text so Excel does not convert them to scientific notation.
  if (key === "phone" && value) {
    return `"=""${value.replace(/"/g, '""')}"""`;
  }
  return csvEscape(value);
}

function xmlEscape(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

export function enquiriesToCsv(enquiries: StoredEnquiry[]) {
  const header = COLUMNS.map((column) => csvEscape(column.label)).join(",");
  const rows = enquiries.map((enquiry) =>
    COLUMNS.map((column) => csvCell(enquiry, column.key)).join(","),
  );
  return `\uFEFF${[header, ...rows].join("\r\n")}`;
}

export function enquiriesToExcelXml(enquiries: StoredEnquiry[]) {
  const headerCells = COLUMNS.map(
    (column) =>
      `<Cell ss:StyleID="header"><Data ss:Type="String">${xmlEscape(column.label)}</Data></Cell>`,
  ).join("");

  const body = enquiries
    .map((enquiry) => {
      const cells = COLUMNS.map(
        (column) =>
          `<Cell><Data ss:Type="String">${xmlEscape(cellValue(enquiry, column.key))}</Data></Cell>`,
      ).join("");
      return `<Row>${cells}</Row>`;
    })
    .join("");

  return `<?xml version="1.0"?>
<?mso-application progid="Excel.Sheet"?>
<Workbook xmlns="urn:schemas-microsoft-com:office:spreadsheet"
 xmlns:ss="urn:schemas-microsoft-com:office:spreadsheet">
<Styles>
<Style ss:ID="header"><Font ss:Bold="1"/></Style>
</Styles>
<Worksheet ss:Name="Enquiries">
<Table>
<Row>${headerCells}</Row>
${body}
</Table>
</Worksheet>
</Workbook>`;
}

function stamp() {
  const now = new Date();
  const yyyy = now.getFullYear();
  const mm = String(now.getMonth() + 1).padStart(2, "0");
  const dd = String(now.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
}

export function enquiryExportFilename(scope: EnquiryExportScope, format: EnquiryExportFormat) {
  const extension = format === "excel" ? "xls" : "csv";
  return `enquiries-${scope}-${stamp()}.${extension}`;
}

export function downloadEnquiryExport(
  enquiries: StoredEnquiry[],
  format: EnquiryExportFormat,
  scope: EnquiryExportScope,
) {
  const content =
    format === "excel" ? enquiriesToExcelXml(enquiries) : enquiriesToCsv(enquiries);
  const mime =
    format === "excel"
      ? "application/vnd.ms-excel;charset=utf-8"
      : "text/csv;charset=utf-8";
  const blob = new Blob([content], { type: mime });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = enquiryExportFilename(scope, format);
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}
