/** Asked before a pull would replace a body that was edited in the CMS since the last pull. */
export async function confirmReplaceBody(title: string): Promise<boolean> {
  return window.confirm(
    `“${title}” was edited in the CMS since it was last pulled from Notion.\n\nReplace the CMS body with the Notion version? Your CMS edits to the body will be lost.`
  )
}
