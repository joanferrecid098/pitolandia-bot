const { SlashCommandBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder().setName('reload').setDescription("Reload the bot's commands."),
  run: async ({ interaction, handler }) => {
    await interaction.deferReply();

    await handler.reloadCommands();

    interaction.followUp('Reloaded!');
  },
  options: {
    devOnly: true
  },
}