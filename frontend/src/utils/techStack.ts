import { techStackMappings } from "../constants/interview";

/**
 * Normalizes a tech stack name to its canonical form
 * @param tech - The tech stack name to normalize
 * @returns The normalized tech stack name
 */
export function normalizeTechStack(tech: string): string {
  const normalized = tech.toLowerCase().trim();
  return techStackMappings[normalized] || tech;
}

/**
 * Normalizes an array of tech stack names
 * @param techStack - Array of tech stack names
 * @returns Array of normalized tech stack names
 */
export function normalizeTechStackArray(techStack: string[]): string[] {
  return techStack.map(normalizeTechStack);
}

/**
 * Gets the icon path for a tech stack
 * @param tech - The tech stack name
 * @returns The path to the icon
 */
export function getTechStackIcon(tech: string): string {
  const normalized = normalizeTechStack(tech);
  return `/icons/${normalized}.svg`;
}

/**
 * Checks if a tech stack is supported
 * @param tech - The tech stack name to check
 * @returns True if the tech stack is in the mappings
 */
export function isSupportedTechStack(tech: string): boolean {
  const normalized = tech.toLowerCase().trim();
  return normalized in techStackMappings;
}
