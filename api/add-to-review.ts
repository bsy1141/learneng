import { google } from "googleapis";

type ReviewPayload = {
  word: string;
  meaning: string;
  example?: string;
  tags?: string[];
  level?: string;
  lastReviewed?: string;
  nextReview?: string;
};

const getGoogleAuth = () => {
  const credentialsStr = process.env.GOOGLE_SERVICE_ACCOUNT_JSON;

  if (!credentialsStr) {
    throw new Error(
      "GOOGLE_SERVICE_ACCOUNT_JSON 환경 변수가 설정되지 않았습니다.",
    );
  }

  const credentials = JSON.parse(credentialsStr);

  const auth = new google.auth.GoogleAuth({
    credentials,
    scopes: ["https://www.googleapis.com/auth/spreadsheets"],
  });

  return auth;
};

export default async function handler(req: any, res: any) {
  if (req.method !== "POST") {
    res.status(405).json({ error: "Method Not Allowed" });
    return;
  }

  try {
    const body = typeof req.body === "string" ? JSON.parse(req.body) : req.body;
    const payload = body as ReviewPayload;

    if (!payload.word || !payload.meaning) {
      res.status(400).json({ error: "word와 meaning은 필수입니다." });
      return;
    }

    const sheetId = process.env.VITE_SHEET_ID;
    const reviewSheetName = process.env.VITE_SHEET_REVIEW || "Review";

    if (!sheetId) {
      res.status(500).json({ error: "VITE_SHEET_ID가 설정되지 않았습니다." });
      return;
    }

    const auth = getGoogleAuth();
    const sheets = google.sheets({ version: "v4", auth });

    // 시트에 행 추가
    const values = [
      [
        payload.word,
        payload.meaning,
        payload.example || "",
        payload.tags?.join(",") || "",
        payload.level || "",
        payload.lastReviewed || "",
        payload.nextReview || "",
      ],
    ];

    await sheets.spreadsheets.values.append({
      spreadsheetId: sheetId,
      range: `${reviewSheetName}!A:G`,
      valueInputOption: "USER_ENTERED",
      requestBody: {
        values,
      },
    });

    res.status(200).json({ ok: true });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unexpected error";
    console.error("Error adding to review:", message);
    res.status(500).json({ error: message });
  }
}
