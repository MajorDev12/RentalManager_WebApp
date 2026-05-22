export const validateBulkReadings = (sheetData) => {
  if (!Array.isArray(sheetData) || sheetData.length === 0) {
    return "No readings available to submit.";
  }

  const issues = [];

  sheetData.forEach((row, index) => {
    const rowNumber = index + 1;

    const current = row.currentReading;
    const previous = Number(row.previousReading || 0);

    // empty
    if (current === "" || current === null || current === undefined) {
      issues.push(`Row ${rowNumber}: missing current reading`);
      return;
    }

    const currentNum = Number(current);

    // not a number
    if (Number.isNaN(currentNum)) {
      issues.push(`Row ${rowNumber}: invalid number`);
      return;
    }

    // negative
    if (currentNum < 0) {
      issues.push(`Row ${rowNumber}: cannot be negative`);
      return;
    }

    // less than previous
    if (currentNum < previous) {
      issues.push(
        `Row ${rowNumber}: cannot be less than previous (${previous})`,
      );
      return;
    }

    // unchanged (optional rule — remove if you don’t want this)
    if (currentNum === previous) {
      issues.push(`Row ${rowNumber}: no change in reading`);
      return;
    }
  });

  return issues.length > 0 ? issues.join(" | ") : "";
};
