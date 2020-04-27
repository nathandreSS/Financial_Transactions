import csvParse from 'csv-parse';
import fs from 'fs';
import path from 'path';

import uploadConfig from '../config/upload';

class LoadCSVService {
  private fileDir = uploadConfig.directory;

  public async execute(fileName: string): Promise<string[]> {
    const readCSVStream = fs.createReadStream(
      path.resolve(this.fileDir, fileName),
    );

    const parseStream = csvParse({
      from_line: 2,
      rtrim: true,
      ltrim: true,
    });

    const parseCSV = readCSVStream.pipe(parseStream);

    const lines: string[] = [];

    parseCSV.on('data', line => {
      lines.push(line);
    });

    await new Promise(resolve => {
      parseCSV.on('end', resolve);
    });
    fs.unlink(path.resolve(this.fileDir, fileName), () => 0);
    return lines;
  }
}

export default LoadCSVService;
