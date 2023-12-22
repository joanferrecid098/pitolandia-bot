const { SlashCommandBuilder } = require("discord.js");
const { ApplicationCommandOptionType } = require('discord.js');
const UserProfile = require('../../schemas/UserProfile');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('balance')
    .setDescription('Check your current balance.')
    .addUserOption((option) =>
      option
        .setName('target-user')
        .setDescription('The user whose balance you want to see.')
    ),
    
  run: async ({ interaction }) => {
    if (!interaction.inGuild()) {
      interaction.reply({
        content: 'This command can only be executed inside a server.',
        ephemeral: true,
      });
      return;
    }

    const targetUserId = interaction.options.getUser('target-user')?.id || interaction.user.id;

    await interaction.deferReply();

    try {
      let userProfile = await UserProfile.findOne({ userId: targetUserId });

      if (!userProfile) {
        userProfile = new UserProfile({ userId: targetUserId });
      }

      interaction.editReply(
        targetUserId === interaction.user.id ? `**Your balance is ${userProfile.balance} $PTC**` : `<@${targetUserId}>\nBalance: **${userProfile.balance} $PTC**`
      );
    } catch (error) {
      console.log(`Error handling /balance: ${error}`);
    }
  },
}