export interface GradeCalculation {
  totalGrade: number;
  letterGrade: string;
  gradePoint: number;
  remarks: 'Passed' | 'Failed' | 'Incomplete';
}

/**
 * Calculates weighted or average grade and maps to Letter & 4.0 Grade Point Scale
 * Prelim (30%) + Midterm (30%) + Final (40%) or simple average
 */
export function calculateGradePoint(
  prelimGrade?: number,
  midtermGrade?: number,
  finalGrade?: number
): GradeCalculation {
  if (
    prelimGrade === undefined ||
    midtermGrade === undefined ||
    finalGrade === undefined
  ) {
    return {
      totalGrade: 0,
      letterGrade: 'INC',
      gradePoint: 0.0,
      remarks: 'Incomplete'
    };
  }

  // 30% prelim, 30% midterm, 40% final
  const total = Math.round((prelimGrade * 0.3 + midtermGrade * 0.3 + finalGrade * 0.4) * 10) / 10;

  let letter = 'F';
  let gp = 0.0;
  let remarks: 'Passed' | 'Failed' | 'Incomplete' = 'Failed';

  if (total >= 93) {
    letter = 'A';
    gp = 4.0;
    remarks = 'Passed';
  } else if (total >= 90) {
    letter = 'A-';
    gp = 3.7;
    remarks = 'Passed';
  } else if (total >= 87) {
    letter = 'B+';
    gp = 3.3;
    remarks = 'Passed';
  } else if (total >= 83) {
    letter = 'B';
    gp = 3.0;
    remarks = 'Passed';
  } else if (total >= 80) {
    letter = 'B-';
    gp = 2.7;
    remarks = 'Passed';
  } else if (total >= 77) {
    letter = 'C+';
    gp = 2.3;
    remarks = 'Passed';
  } else if (total >= 75) {
    letter = 'C';
    gp = 2.0;
    remarks = 'Passed';
  } else if (total >= 70) {
    letter = 'D';
    gp = 1.0;
    remarks = 'Passed';
  } else {
    letter = 'F';
    gp = 0.0;
    remarks = 'Failed';
  }

  return {
    totalGrade: total,
    letterGrade: letter,
    gradePoint: gp,
    remarks
  };
}
