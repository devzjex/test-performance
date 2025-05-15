import fs from 'fs';
import path from 'path';

export async function checkAndUpdateLastSentDate(fileName) {
  try {
    const filePath = path.join(process.cwd(), `src/utils/data/bing/${fileName}`);
    const oneWeekInMillis = 7 * 24 * 60 * 60 * 1000; // 1 week
    let lastSentDate = null;
    const currentDate = new Date();

    if (fs.existsSync(filePath)) {
      const fileData = fs.readFileSync(filePath, 'utf-8');
      const data = JSON.parse(fileData);
      lastSentDate = data.lastSentDate ? new Date(data.lastSentDate) : null;
    } else {
      const newData = { lastSentDate: currentDate.toISOString() };
      fs.writeFileSync(filePath, JSON.stringify(newData, null, 2), 'utf-8');
      lastSentDate = currentDate;
    }

    if (!lastSentDate || currentDate - lastSentDate > oneWeekInMillis) {
      const newData = { lastSentDate: currentDate.toISOString() };
      fs.writeFileSync(filePath, JSON.stringify(newData, null, 2), 'utf-8');
      return true;
    }

    return false;
  } catch (error) {
    console.error('Error checking or updating lastSentDate:', error);
    return false;
  }
}
