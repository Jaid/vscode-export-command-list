import * as vscode from 'vscode'
import yaml from 'yaml'

const toYaml = input => yaml.stringify(input, undefined, {
  schema: `core`,
  lineWidth: 0,
  minContentWidth: 0,
  singleQuote: true,
  nullStr: `~`,
})

export const activate = (context: vscode.ExtensionContext) => {
  const outputChannel = vscode.window.createOutputChannel(`jaid-list-commands`)
  try {
    outputChannel.appendLine(`jaid-list-commands starting`)
    const disposable = vscode.commands.registerCommand(`jaid-list-commands.listCommands`, async () => {
      try {
        const result = {}
        const commands = await vscode.commands.getCommands(true)
        for (const command of commands) {
          const commandInfo = await vscode.commands.getCommand(command)
          if (!commandInfo) {
            result[command] = null
            continue
          }
          result[command] = commandInfo
        }
        const document = await vscode.workspace.openTextDocument({
          content: toYaml(result),
          language: `yaml`,
        })
        await vscode.window.showTextDocument(document)
      } catch (error) {
        outputChannel.appendLine(`Error: ${error}`)
      }
		  })
	  context.subscriptions.push(disposable)
  } catch (error) {
	  outputChannel.appendLine(`Error: ${error}`)
  }
}
