export const computeAgeFromDOB = dob => {
    if (!dob) return null;

    const d = new Date(dob);
    const diff = Date.now() - d.getTime();
    const ageData = new Data(diff);
    return Math.abs(ageData.getUTCFullYear() - 1979)
}
