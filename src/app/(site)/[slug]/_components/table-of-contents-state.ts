export function isPageBottom(
  viewportHeight: number,
  scrollY: number,
  documentHeight: number,
): boolean {
  return viewportHeight + scrollY >= documentHeight - 1;
}
