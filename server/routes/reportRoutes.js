// Export a factory that accepts the express instance to avoid resolving
// `express` from this file's location (keeps the file isolated in `backend/`).
export default function createReportRoutes(expressInstance) {
  const router = expressInstance.Router();

  router.get("/generate-report", (req, res) => {
  try {
    const exampleData = {
      caseId: "CASE-2026-0001",
      animalType: "Dog",
      rescueLocation: "Maple St & 5th Ave, Springfield",
      rescueStatus: "Completed",
      ngoAssigned: "Helping Paws NGO",
      volunteerName: "Alex Mercer",
      date: new Date().toLocaleString(),
    };

    const html = `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width,initial-scale=1" />
    <title>ResQNet — Rescue Report Preview</title>
    <style>
      body { font-family: Arial, Helvetica, sans-serif; color: #000; margin: 24px; }
      .container { max-width: 800px; margin: 0 auto; }
      .title { text-align: left; font-size: 18px; font-weight: 700; margin-bottom: 4px; }
      .subtitle { text-align: left; font-size: 14px; margin-bottom: 18px; }
      .report-header { display:flex; justify-content:space-between; align-items:center; margin-bottom: 12px; }
      .report-title { font-size: 20px; font-weight: 700; }
      .meta { font-size: 12px; color: #333; }
      table { width: 100%; border-collapse: collapse; margin-top: 12px; }
      th, td { padding: 10px 12px; border: 1px solid #222; text-align: left; font-size: 14px; }
      th { background: #f3f3f3; font-weight: 700; }
      .section-label { font-weight: 700; padding-top: 18px; }
      .notes { margin-top: 18px; font-size: 13px; }
      @media print { body { margin: 12mm; } }
    </style>
  </head>
  <body>
    <div class="container">
      <div class="report-header">
        <div>
          <div class="title">ResQNet</div>
          <div class="subtitle">Rescue Report Preview</div>
        </div>
        <div class="meta">Generated: ${exampleData.date}</div>
      </div>

      <h2 class="report-title">Rescue Report</h2>

      <table aria-label="rescue-report">
        <thead>
          <tr>
            <th>Field</th>
            <th>Details</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Case ID</td>
            <td>${exampleData.caseId}</td>
          </tr>
          <tr>
            <td>Animal Type</td>
            <td>${exampleData.animalType}</td>
          </tr>
          <tr>
            <td>Rescue Location</td>
            <td>${exampleData.rescueLocation}</td>
          </tr>
          <tr>
            <td>Rescue Status</td>
            <td>${exampleData.rescueStatus}</td>
          </tr>
          <tr>
            <td>NGO Assigned</td>
            <td>${exampleData.ngoAssigned}</td>
          </tr>
          <tr>
            <td>Volunteer Name</td>
            <td>${exampleData.volunteerName}</td>
          </tr>
          <tr>
            <td>Date</td>
            <td>${exampleData.date}</td>
          </tr>
        </tbody>
      </table>

      <div class="notes">
        <div class="section-label">Notes</div>
        <p>This preview is for display and printing purposes only. It does not modify any data in the system.</p>
      </div>
    </div>
  </body>
</html>`;

      res.setHeader("Content-Type", "text/html; charset=utf-8");
      return res.status(200).send(html);
  } catch (err) {
    console.error("Error generating report preview:", err);
    const errorHtml = `<!doctype html><html><body><h2>Error generating report</h2><p>Please try again later.</p></body></html>`;
    res.setHeader("Content-Type", "text/html; charset=utf-8");
    return res.status(500).send(errorHtml);
  }
});

  return router;
}
