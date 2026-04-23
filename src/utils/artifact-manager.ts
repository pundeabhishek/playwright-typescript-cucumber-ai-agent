// Utility for consistent artifact folder creation and safe file naming.
import fs from 'fs';
import path from 'path';
import { paths } from '@config/paths';

export class ArtifactManager {
  static ensureDirectory(directoryPath: string): void {
    fs.mkdirSync(directoryPath, { recursive: true });
  }

  static emptyDirectory(directoryPath: string): void {
    fs.rmSync(directoryPath, { recursive: true, force: true });
    fs.mkdirSync(directoryPath, { recursive: true });
  }

  static sanitizeName(value: string): string {
    return value
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');
  }

  static scenarioDirectory(source: string, scenarioName: string, uniqueSuffix?: string): string {
    const directoryName = uniqueSuffix
      ? `${ArtifactManager.sanitizeName(scenarioName)}-${ArtifactManager.sanitizeName(uniqueSuffix)}`
      : ArtifactManager.sanitizeName(scenarioName);
    const folder = path.join(source, directoryName);
    ArtifactManager.ensureDirectory(folder);
    return folder;
  }

  static cucumberScenarioDirectory(scenarioName: string, scenarioId?: string): string {
    return ArtifactManager.scenarioDirectory(paths.cucumberScreenshots, scenarioName, scenarioId);
  }
}
