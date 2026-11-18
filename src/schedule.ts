import { formatDate, minutesSinceMidnight, parseTimeToMinutes } from "./dateTime";

// Decides whether the automatic daily digest should run.
export class DigestSchedule {
  /**
   * @abstract Stores the time of day after which the digest may run.
   * @param digestTime Local time of day in "HH:mm" format.
   * @returns Nothing.
   * @throws Nothing.
   */
  constructor(private digestTime: string) {}

  /**
   * @abstract Checks whether the digest time has passed today and no digest has run yet today.
   * @param now The current date and time.
   * @param lastDigestDate Date (YYYY-MM-DD) of the last digest, or an empty string if none.
   * @returns True if the digest should run now, otherwise false.
   * @throws Nothing.
   */
  isDue(now: Date, lastDigestDate: string): boolean {
    const afterDigestTime = minutesSinceMidnight(now) >= parseTimeToMinutes(this.digestTime);
    const alreadyRanToday = lastDigestDate === formatDate(now);
    return afterDigestTime && !alreadyRanToday;
  }
}
