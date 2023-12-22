const { SlashCommandBuilder } = require("discord.js");
const UserProfile = require('../../schemas/UserProfile.js');

module.exports = {
  data: new SlashCommandBuilder().setName('balance').setDescription('Check your current balance.'),
  run: async ({ interaction }) => {
    try {
      await interaction.deferReply({
        ephemeral: true,
      });
      
      let userProfile = await UserProfile.findOne({
        userId: interaction.member.id,
      });

      if (!userProfile) {
        userProfile = new UserProfile({
          userId: interaction.member.id,
          balance: 0
        });

        await userProfile.save();
      }

      interaction.editReply(
        `**Current balance: ${userProfile.balance} $PTC**`
      );
    } catch (error) {
      console.log(`Error handling /balance: ${error}`);
    }
  },
}