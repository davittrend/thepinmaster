export interface PinData {
  title: string;
  description: string;
  link: string;
  imageUrl: string;
}

export function parseCSV(csvContent: string): PinData[] {
  const lines = csvContent.split('\n');
  const headers = lines[0].split(',');
  
  return lines.slice(1).map(line => {
    const values = line.split(',');
    return {
      title: values[0],
      description: values[1],
      link: values[2],
      imageUrl: values[3],
    };
  });
}

