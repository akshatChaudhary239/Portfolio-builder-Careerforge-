import { BULLET_LINE_RE } from './normalize';

/**
 * groupSectionBlocks partitions an array of strings (lines) into logical blocks.
 *
 * Rules:
 * - Empty lines act as separators.
 * - However, bullets belong to the preceding block. If we encounter a bullet after an empty line,
 *   it should attach to the previous block if one exists.
 * - Non-empty, non-bullet lines following an empty line start a NEW block.
 * - If splitCondition is provided, it can forcefully split a block even without an empty line
 *   (e.g., detecting a new date or company name).
 */
export function groupSectionBlocks(
  lines: string[],
  splitCondition?: (line: string, currentBlock: string[]) => boolean
): string[][] {
  const blocks: string[][] = [];
  let currentBlock: string[] = [];

  for (const line of lines) {
    if (!line.trim()) {
      if (currentBlock.length > 0) {
        blocks.push(currentBlock);
        currentBlock = [];
      }
      continue;
    }

    if (BULLET_LINE_RE.test(line)) {
      if (currentBlock.length === 0 && blocks.length > 0) {
        // Re-attach bullet to previous block
        currentBlock = blocks.pop()!;
      }
      currentBlock.push(line);
    } else {
      if (splitCondition && currentBlock.length > 0 && splitCondition(line, currentBlock)) {
        blocks.push(currentBlock);
        currentBlock = [line];
      } else {
        currentBlock.push(line);
      }
    }
  }

  if (currentBlock.length > 0) {
    blocks.push(currentBlock);
  }

  return blocks;
}
